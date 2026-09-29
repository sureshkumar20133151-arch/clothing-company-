import * as bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
  UserRole,
} from "@indigo/shared";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";

export class AuthService {
  static async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      throw { statusCode: 409, message: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        password: hashedPassword,
        name: input.name,
        phone: input.phone || null,
        role: "customer",
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        tokenVersion: true,
      },
    });

    // Create user cart automatically
    await prisma.cart.create({
      data: { userId: user.id },
    });

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      tokenVersion: user.tokenVersion,
    });

    // Save refresh token to database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw { statusCode: 401, message: "Invalid email or password." };
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw { statusCode: 401, message: "Invalid email or password." };
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      tokenVersion: user.tokenVersion,
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  static async refreshTokens(currentRefreshToken: string) {
    const payload = verifyRefreshToken(currentRefreshToken);
    if (!payload) {
      throw { statusCode: 401, message: "Invalid or expired refresh token." };
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: currentRefreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.revokedAt || new Date() > tokenRecord.expiresAt) {
      throw { statusCode: 401, message: "Refresh token revoked or expired." };
    }

    const user = tokenRecord.user;
    if (user.tokenVersion !== payload.tokenVersion) {
      throw { statusCode: 401, message: "Session invalidated. Please log in again." };
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    // Generate new pair
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const newRefreshToken = signRefreshToken({
      userId: user.id,
      tokenVersion: user.tokenVersion,
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      tokens: { accessToken, refreshToken: newRefreshToken },
    };
  }

  static async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { revokedAt: new Date() },
      });
    }
    return true;
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: "desc" },
        },
      },
    });

    if (!user) {
      throw { statusCode: 404, message: "User not found." };
    }

    return user;
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.phone !== undefined ? { phone: input.phone } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    return updated;
  }

  static async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { statusCode: 404, message: "User not found." };
    }

    const isMatch = await bcrypt.compare(input.currentPassword, user.password);
    if (!isMatch) {
      throw { statusCode: 400, message: "Current password is incorrect." };
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);

    // Invalidate existing sessions by bumping tokenVersion
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });

    // Revoke all existing refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    return true;
  }
}
