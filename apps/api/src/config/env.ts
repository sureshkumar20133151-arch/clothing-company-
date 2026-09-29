import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

// Load from current working directory or apps/api directory or parent monorepo root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "apps/api/.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url("Valid DATABASE_URL is required"),
  
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 chars"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 chars"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  COOKIE_SECRET: z.string().default("indigo_thread_cookie_secret"),

  WEB_APP_URL: z.string().default("http://localhost:3000"),
  ADMIN_APP_URL: z.string().default("http://localhost:3001"),

  RAZORPAY_KEY_ID: z.string().optional().default("rzp_test_placeholder_key_id"),
  RAZORPAY_KEY_SECRET: z.string().optional().default("rzp_test_placeholder_secret"),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default("rzp_webhook_secret_dev"),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("orders@indigothread.in"),

  STORE_NAME: z.string().default("Indigo & Thread"),
  STORE_STATE: z.string().default("Tamil Nadu"),
  STORE_STATE_CODE: z.string().default("33"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsedEnv.error.format(), null, 2));
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
