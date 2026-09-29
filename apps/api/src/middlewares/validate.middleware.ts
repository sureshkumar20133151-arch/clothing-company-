import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { ApiResponse } from "../utils/apiResponse";

type RequestLocation = "body" | "query" | "params";

export function validate(schema: ZodTypeAny, location: RequestLocation = "body") {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[location]);
      req[location] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return ApiResponse.error(res, "Validation failed", 400, formattedErrors);
      }
      return ApiResponse.error(res, "Invalid request data", 400);
    }
  };
}
