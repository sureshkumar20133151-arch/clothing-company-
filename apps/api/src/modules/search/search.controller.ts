import { Request, Response, NextFunction } from "express";
import { SearchService } from "./search.service";
import { ApiResponse } from "../../utils/apiResponse";

export class SearchController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SearchService.searchProducts(req.query as any);
      return ApiResponse.success(
        res,
        result.products,
        "Search results fetched successfully",
        200,
        result.meta
      );
    } catch (error) {
      next(error);
    }
  }

  static async suggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const q = typeof req.query.q === "string" ? req.query.q : "";
      const suggestions = await SearchService.getSuggestions(q);
      return ApiResponse.success(res, suggestions, "Search suggestions fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}
