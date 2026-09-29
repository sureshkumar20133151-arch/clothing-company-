import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as bcrypt from "bcryptjs";
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { ROLES, UserRole } from "@indigo/shared";

describe("Authentication & Token Cryptography", () => {
  it("should securely hash passwords and verify correct passwords with bcrypt", async () => {
    const rawPassword = "HandloomSecure#2026";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    assert.notEqual(hashedPassword, rawPassword);
    assert.ok(hashedPassword.startsWith("$2a$") || hashedPassword.startsWith("$2b$"));

    const isMatch = await bcrypt.compare(rawPassword, hashedPassword);
    assert.equal(isMatch, true);

    const isWrongMatch = await bcrypt.compare("WrongPassword123", hashedPassword);
    assert.equal(isWrongMatch, false);
  });

  it("should sign and verify valid JWT Access Tokens containing user role & id", () => {
    const payload = {
      userId: "usr_artisanal_001",
      email: "weaver@indigothread.in",
      role: ROLES.ADMIN as UserRole,
    };

    const token = signAccessToken(payload);
    assert.ok(typeof token === "string" && token.length > 20);

    const decoded = verifyAccessToken(token);
    assert.ok(decoded);
    assert.equal(decoded.userId, payload.userId);
    assert.equal(decoded.email, payload.email);
    assert.equal(decoded.role, ROLES.ADMIN);
  });

  it("should reject tampered or corrupted JWT tokens", () => {
    const validToken = signAccessToken({
      userId: "usr_tamper_001",
      email: "tamper@test.com",
      role: ROLES.CUSTOMER as UserRole,
    });

    const tamperedToken = validToken.slice(0, -6) + "xxxxxx";
    const decoded = verifyAccessToken(tamperedToken);
    assert.equal(decoded, null);
  });

  it("should sign and verify Refresh Tokens with tokenVersion for revocation", () => {
    const refreshPayload = {
      userId: "usr_refresh_001",
      tokenVersion: 2,
    };

    const refreshToken = signRefreshToken(refreshPayload);
    assert.ok(typeof refreshToken === "string");

    const decoded = verifyRefreshToken(refreshToken);
    assert.ok(decoded);
    assert.equal(decoded.userId, refreshPayload.userId);
    assert.equal(decoded.tokenVersion, 2);
  });
});
