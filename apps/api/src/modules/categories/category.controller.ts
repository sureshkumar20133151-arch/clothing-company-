import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { ApiResponse } from "../../utils/apiResponse";

export class CategoryController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const gender = req.query.gender as string | undefined;
      const categories = await CategoryService.listCategories(gender);
      return ApiResponse.success(res, categories, "Categories fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getBySlug(req.params.slug);
      return ApiResponse.success(res, category, "Category fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return ApiResponse.created(res, category, "Category created successfully");
    } catch (error) {
      next(error);
    }
  }
}
