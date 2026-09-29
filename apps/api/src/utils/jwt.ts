import jwt from "jsonwebtoken";
import { Response } from "express";
import { env } from "../config/env";
import { JWTPayload, UserRole } from "@indigo/shared";

const ACCESS_COOKIE_NAME = "indigo_access_token";
const REFRESH_COOKIE_NAME = "indigo_refresh_token";

export function signAccessToken(payload: { userId: string; email: string; role: UserRole }): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: { userId: string; tokenVersion: number }): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string; tokenVersion: number } | null {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; tokenVersion: number };
  } catch {
    return null;
  }
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const isProduction = env.NODE_ENV === "production";

  // Access Token Cookie (15 minutes)
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 mins
    path: "/",
  });

  // Refresh Token Cookie (7 days)
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

export function clearAuthCookies(res: Response) {
  const isProduction = env.NODE_ENV === "production";

  res.clearCookie(ACCESS_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
}

export { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME };
