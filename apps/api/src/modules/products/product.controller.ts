import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { ApiResponse } from "../../utils/apiResponse";

export class ProductController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.listProducts(req.query as any);
      return ApiResponse.success(
        res,
        result.products,
        "Products fetched successfully",
        200,
        result.meta
      );
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);
      return ApiResponse.success(res, product, "Product fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return ApiResponse.success(res, product, "Product fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      return ApiResponse.created(res, product, "Product created successfully");
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      return ApiResponse.success(res, product, "Product updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(req.params.id);
      return ApiResponse.success(res, null, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
