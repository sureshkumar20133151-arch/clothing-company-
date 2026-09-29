import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service";
import { ApiResponse } from "../../utils/apiResponse";

export class ReviewController {
  static async listByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReviewService.listByProduct(req.params.productId);
      return ApiResponse.success(res, result, "Reviews fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, rating, title, comment } = req.body;
      if (!productId || !rating || !comment) {
        return ApiResponse.error(res, "Product ID, rating (1-5), and comment are required", 400);
      }

      const review = await ReviewService.createReview(req.user!.id, {
        productId,
        rating: Number(rating),
        title,
        comment,
      });

      return ApiResponse.created(res, review, "Review submitted successfully");
    } catch (error) {
      next(error);
    }
  }
}
