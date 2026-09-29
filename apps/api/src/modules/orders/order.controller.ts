import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";
import { ApiResponse } from "../../utils/apiResponse";

export class OrderController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder(req.user!.id, req.body);
      return ApiResponse.created(res, order, "Order placed successfully");
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.listOrders(req.user!.id, req.user!.role, req.query as any);
      return ApiResponse.success(res, result.orders, "Orders fetched successfully", 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(req.params.id, req.user!.id, req.user!.role);
      return ApiResponse.success(res, order, "Order details fetched");
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.updateOrderStatus(req.params.id, req.body);
      return ApiResponse.success(res, order, "Order status updated successfully");
    } catch (error) {
      next(error);
    }
  }
}
