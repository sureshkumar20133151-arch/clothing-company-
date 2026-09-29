import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { env } from "../config/env";
import { ApiResponse } from "../utils/apiResponse";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Prisma unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[]) || ["field"];
      return ApiResponse.error(
        res,
        `A record with this ${target.join(", ")} already exists.`,
        409
      );
    }
    if (err.code === "P2025") {
      return ApiResponse.error(res, "Record not found.", 404);
    }
  }

  // Generic Api custom errors or unhandled exceptions
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = err.message || "An unexpected error occurred.";

  const errorDetails = env.NODE_ENV === "development" ? { stack: err.stack, details: err } : undefined;

  return ApiResponse.error(res, message, statusCode, errorDetails);
}
