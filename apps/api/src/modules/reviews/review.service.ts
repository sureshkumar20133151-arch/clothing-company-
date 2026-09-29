import { prisma } from "../../config/prisma";

export class ReviewService {
  static async listByProduct(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const averageRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0;

    return {
      reviews,
      averageRating,
      totalReviews: reviews.length,
    };
  }

  static async createReview(
    userId: string,
    data: {
      productId: string;
      rating: number;
      title?: string;
      comment: string;
    }
  ) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }

    // Check if user has purchased this product
    const verifiedPurchase = await prisma.orderItem.findFirst({
      where: {
        order: { userId, status: "DELIVERED" },
        variant: { productId: data.productId },
      },
    });

    return prisma.review.upsert({
      where: {
        productId_userId: {
          productId: data.productId,
          userId,
        },
      },
      create: {
        productId: data.productId,
        userId,
        rating: Math.min(5, Math.max(1, data.rating)),
        title: data.title || null,
        comment: data.comment,
        isVerifiedPurchase: !!verifiedPurchase,
      },
      update: {
        rating: Math.min(5, Math.max(1, data.rating)),
        title: data.title || null,
        comment: data.comment,
        isVerifiedPurchase: !!verifiedPurchase,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }
}
