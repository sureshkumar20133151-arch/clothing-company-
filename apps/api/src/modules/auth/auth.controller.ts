import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../utils/apiResponse";
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE_NAME } from "../../utils/jwt";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      return ApiResponse.created(res, { user: result.user }, "Registration successful");
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      return ApiResponse.success(res, { user: result.user }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;
      if (!token) {
        return ApiResponse.error(res, "Refresh token required", 401);
      }

      const result = await AuthService.refreshTokens(token);
      setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      return ApiResponse.success(res, { user: result.user }, "Token refreshed successfully");
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
      if (req.user?.id) {
        await AuthService.logout(req.user.id, refreshToken);
      }
      clearAuthCookies(res);
      return ApiResponse.success(res, null, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.id);
      return ApiResponse.success(res, { user }, "User profile fetched");
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.updateProfile(req.user!.id, req.body);
      return ApiResponse.success(res, { user }, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.changePassword(req.user!.id, req.body);
      clearAuthCookies(res);
      return ApiResponse.success(
        res,
        null,
        "Password changed successfully. Please log in again with your new password."
      );
    } catch (error) {
      next(error);
    }
  }
}
