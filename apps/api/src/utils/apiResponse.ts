import { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Operation successful",
    statusCode = 200,
    meta?: PaginationMeta
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    });
  }

  static created<T>(res: Response, data: T, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message = "Internal server error",
    statusCode = 500,
    error?: any
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(error ? { error } : {}),
    });
  }
}
