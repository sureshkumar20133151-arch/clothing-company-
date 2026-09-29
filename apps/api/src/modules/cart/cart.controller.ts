import { Request, Response, NextFunction } from "express";
import { CartService } from "./cart.service";
import { ApiResponse } from "../../utils/apiResponse";

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getOrCreateCart(req.user!.id);
      return ApiResponse.success(res, cart, "Cart fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.addItem(req.user!.id, req.body);
      return ApiResponse.success(res, cart, "Item added to cart");
    } catch (error) {
      next(error);
    }
  }

  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.updateItem(req.user!.id, req.params.itemId, req.body);
      return ApiResponse.success(res, cart, "Cart item updated");
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.removeItem(req.user!.id, req.params.itemId);
      return ApiResponse.success(res, cart, "Item removed from cart");
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.clearCart(req.user!.id);
      return ApiResponse.success(res, cart, "Cart cleared");
    } catch (error) {
      next(error);
    }
  }
}
