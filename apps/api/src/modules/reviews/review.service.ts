import { prisma } from "../../config/prisma";
import { ReviewStatus } from "@prisma/client";
import { RedisService } from "../../services/redis.service";

export interface ReviewFilterOptions {
  page?: number;
  limit?: number;
  rating?: number;
  sort?: "newest" | "highest_rated" | "lowest_rated" | "most_helpful";
}

export class ReviewService {
  /**
   * Recalculates product rating statistics inside a Prisma transaction
   */
  static async recalculateProductRating(tx: any, productId: string) {
    const approvedReviews = await tx.review.findMany({
      where: { productId, status: "APPROVED" },
      select: { rating: true },
    });

    const reviewCount = approvedReviews.length;
    const averageRating =
      reviewCount > 0
        ? Number((approvedReviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    await tx.product.update({
      where: { id: productId },
      data: {
        averageRating,
        reviewCount,
      },
    });

    return { averageRating, reviewCount };
  }

  /**
   * Public list of approved reviews for a product with breakdown and sorting
   */
  static async listByProduct(productId: string, options: ReviewFilterOptions = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(options.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      productId,
      status: "APPROVED" as ReviewStatus,
    };

    if (options.rating && options.rating >= 1 && options.rating <= 5) {
      where.rating = Number(options.rating);
    }

    let orderBy: any = { createdAt: "desc" };
    if (options.sort === "highest_rated") {
      orderBy = { rating: "desc" };
    } else if (options.sort === "lowest_rated") {
      orderBy = { rating: "asc" };
    } else if (options.sort === "most_helpful") {
      orderBy = [{ helpfulCount: "desc" }, { createdAt: "desc" }];
    }

    // Fetch paginated reviews, total count, and all ratings for the breakdown chart
    const [reviews, totalMatching, allRatings] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { id: true, name: true } },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.findMany({
        where: { productId, status: "APPROVED" as ReviewStatus },
        select: { rating: true },
      }),
    ]);

    // Calculate 5-star distribution chart
    const starBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allRatings.forEach((r) => {
      if (starBreakdown[r.rating] !== undefined) {
        starBreakdown[r.rating]++;
      }
    });

    const totalApproved = allRatings.length;
    const averageRating =
      totalApproved > 0
        ? Number((allRatings.reduce((acc, r) => acc + r.rating, 0) / totalApproved).toFixed(1))
        : 5.0;

    return {
      reviews,
      averageRating,
      totalReviews: totalApproved,
      starBreakdown,
      meta: {
        page,
        limit,
        total: totalMatching,
        totalPages: Math.ceil(totalMatching / limit),
      },
    };
  }

  /**
   * Submit a review with verified-purchase detection and moderation gating
   */
  static async createReview(
    userId: string,
    data: {
      productId: string;
      rating: number;
      title?: string;
      comment: string;
      photos?: string[];
    }
  ) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }

    // Enforce 1 review per user per product
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: data.productId,
          userId,
        },
      },
    });

    if (existing) {
      throw { statusCode: 409, message: "You have already reviewed this handloom piece" };
    }

    // Verified purchase check: user has completed/confirmed order containing variant of this product
    const orderWithProduct = await prisma.orderItem.findFirst({
      where: {
        order: {
          userId,
          status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        },
        variant: { productId: data.productId },
      },
    });
    const isVerifiedPurchase = !!orderWithProduct;

    // Moderation setting check
    const modSetting = await prisma.setting.findUnique({
      where: { key: "require_review_moderation" },
    });
    const requiresModeration = modSetting?.value === "true";
    const status: ReviewStatus = requiresModeration ? "PENDING" : "APPROVED";

    const rating = Math.min(5, Math.max(1, Number(data.rating) || 5));

    // Create review and update denormalized product rating in a transaction
    const review = await prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: {
          productId: data.productId,
          userId,
          rating,
          title: data.title?.trim() || null,
          comment: data.comment.trim(),
          photos: data.photos || [],
          isVerifiedPurchase,
          status,
        },
        include: {
          user: { select: { id: true, name: true } },
        },
      });

      if (status === "APPROVED") {
        await this.recalculateProductRating(tx, data.productId);
      }

      return createdReview;
    });

    await RedisService.invalidatePattern("products:*");
    return review;
  }

  /**
   * Vote a review as helpful (prevents double-voting via unique constraint)
   */
  static async voteHelpful(reviewId: string, userId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw { statusCode: 404, message: "Review not found" };
    }

    // Check if already voted
    const existingVote = await prisma.reviewHelpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existingVote) {
      throw { statusCode: 400, message: "You have already marked this review as helpful" };
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.reviewHelpfulVote.create({
        data: {
          reviewId,
          userId,
        },
      });

      return tx.review.update({
        where: { id: reviewId },
        data: {
          helpfulCount: { increment: 1 },
        },
      });
    });

    return updated;
  }

  // ==========================================================================
  // ADMIN MODERATION OPERATIONS
  // ==========================================================================
  static async adminListReviews(filters: {
    status?: ReviewStatus;
    productId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.productId) where.productId = filters.productId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async adminUpdateStatus(reviewId: string, status: ReviewStatus) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw { statusCode: 404, message: "Review not found" };
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.review.update({
        where: { id: reviewId },
        data: { status },
      });

      await this.recalculateProductRating(tx, review.productId);
      return res;
    });

    await RedisService.invalidatePattern("products:*");
    return updated;
  }

  static async adminDeleteReview(reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw { statusCode: 404, message: "Review not found" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: reviewId } });
      await this.recalculateProductRating(tx, review.productId);
    });

    await RedisService.invalidatePattern("products:*");
    return true;
  }

  static async adminReplyToReview(reviewId: string, adminReply: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw { statusCode: 404, message: "Review not found" };
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { adminReply: adminReply.trim() },
    });

    await RedisService.invalidatePattern("products:*");
    return updated;
  }
}
