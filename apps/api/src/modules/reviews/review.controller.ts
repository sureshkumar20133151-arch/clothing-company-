import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service";
import { ApiResponse } from "../../utils/apiResponse";

export class ReviewController {
  static async listByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id || req.params.productId;
      const result = await ReviewService.listByProduct(productId, req.query as any);
      return ApiResponse.success(res, result, "Reviews fetched successfully", 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id || req.body.productId;
      const { rating, title, comment, photos } = req.body;

      if (!productId || !rating || !comment) {
        return ApiResponse.error(res, "Product ID, rating (1-5), and comment are required", 400);
      }

      const review = await ReviewService.createReview(req.user!.id, {
        productId,
        rating: Number(rating),
        title,
        comment,
        photos: Array.isArray(photos) ? photos : [],
      });

      return ApiResponse.created(res, review, "Review submitted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async voteHelpful(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id;
      const updated = await ReviewService.voteHelpful(reviewId, req.user!.id);
      return ApiResponse.success(res, updated, "Marked review as helpful");
    } catch (error) {
      next(error);
    }
  }

  // ==========================================================================
  // ADMIN MODERATION CONTROLLER
  // ==========================================================================
  static async adminList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReviewService.adminListReviews(req.query as any);
      return ApiResponse.success(res, result.reviews, "Reviews fetched for moderation", 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async adminUpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
        return ApiResponse.error(res, "Valid status (APPROVED, REJECTED, PENDING) required", 400);
      }

      const updated = await ReviewService.adminUpdateStatus(req.params.id, status);
      return ApiResponse.success(res, updated, `Review status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }

  static async adminDelete(req: Request, res: Response, next: NextFunction) {
    try {
      await ReviewService.adminDeleteReview(req.params.id);
      return ApiResponse.success(res, null, "Review deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async adminReply(req: Request, res: Response, next: NextFunction) {
    try {
      const { reply } = req.body;
      if (!reply || !reply.trim()) {
        return ApiResponse.error(res, "Store reply content is required", 400);
      }

      const updated = await ReviewService.adminReplyToReview(req.params.id, reply);
      return ApiResponse.success(res, updated, "Reply published successfully");
    } catch (error) {
      next(error);
    }
  }
}
