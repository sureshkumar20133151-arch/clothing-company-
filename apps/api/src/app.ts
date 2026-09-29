import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env";
import { authenticate } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import apiRouter from "./routes";
import { ApiResponse } from "./utils/apiResponse";

export const app: Application = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration for Next.js web client and admin portal
const allowedOrigins = [
  env.WEB_APP_URL,
  env.ADMIN_APP_URL,
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev convenience fallback
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body parsers & cookies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(env.COOKIE_SECRET));

// HTTP Request logging
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
}

// Authentication identification middleware (parses JWT from httpOnly cookies)
app.use(authenticate);

// API Routes
app.use("/api/v1", apiRouter);

// Root route
app.get("/", (_req: Request, res: Response) => {
  return ApiResponse.success(res, {
    brand: "Indigo & Thread API",
    version: "1.0.0",
    docs: "/api/v1/health",
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  return ApiResponse.error(res, "Endpoint not found", 404);
});

// Global error handler
app.use(errorHandler);
