import { Request, Response, NextFunction } from "express";
import { UserRole } from "@indigo/shared";
import { verifyAccessToken, ACCESS_COOKIE_NAME } from "../utils/jwt";
import { ApiResponse } from "../utils/apiResponse";
import { prisma } from "../config/prisma";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  let token = req.cookies?.[ACCESS_COOKIE_NAME];

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next();
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return next();
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, tokenVersion: true },
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
      };
    }
  } catch (error) {
    // Database connection or unexpected error during token check
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return ApiResponse.error(res, "Authentication required. Please log in.", 401);
  }
  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.error(res, "Authentication required. Please log in.", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Access denied. Requires one of roles: [${allowedRoles.join(", ")}]`,
        403
      );
    }

    next();
  };
}
