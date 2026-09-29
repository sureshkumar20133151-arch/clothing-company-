import { Request, Response, NextFunction } from "express";
import { InventoryService } from "./inventory.service";
import { ApiResponse } from "../../utils/apiResponse";

export class InventoryController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
      const result = await InventoryService.listInventory(threshold);
      return ApiResponse.success(res, result, "Inventory fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { stock } = req.body;
      if (typeof stock !== "number") {
        return ApiResponse.error(res, "Numeric stock value required", 400);
      }
      const updated = await InventoryService.updateStock(req.params.variantId, stock);
      return ApiResponse.success(res, updated, "Stock updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { delta } = req.body;
      if (typeof delta !== "number") {
        return ApiResponse.error(res, "Numeric delta value required", 400);
      }
      const updated = await InventoryService.adjustStock(req.params.variantId, delta);
      return ApiResponse.success(res, updated, "Stock adjusted successfully");
    } catch (error) {
      next(error);
    }
  }
}
