import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { RedisService } from "../services/redis.service";

describe("Redis In-Memory Distributed Cache & Storage", () => {
  beforeEach(() => {
    RedisService.clearMemoryStore();
  });

  it("should handle cache miss and subsequent cache hit", async () => {
    const key = "test:product:nilgiri-shirt";
    const productData = { id: "p1", name: "Nilgiri Indigo Shirt", price: 1890 };

    // Initial cache miss
    const missed = await RedisService.get(key);
    assert.equal(missed, null);

    // Set cache
    await RedisService.set(key, productData, 60);

    // Cache hit
    const hit = await RedisService.get<typeof productData>(key);
    assert.ok(hit);
    assert.equal(hit.name, "Nilgiri Indigo Shirt");
    assert.equal(hit.price, 1890);
  });

  it("should invalidate all keys matching a wildcard pattern on admin update", async () => {
    await RedisService.set("products:list:all", [{ id: "p1" }], 300);
    await RedisService.set("products:list:men", [{ id: "p1" }], 300);
    await RedisService.set("products:slug:nilgiri", { id: "p1" }, 300);
    await RedisService.set("categories:all", [{ id: "c1" }], 300);

    // Invalidate products:*
    const count = await RedisService.invalidatePattern("products:*");
    assert.ok(count >= 3);

    // Product keys should be evicted
    assert.equal(await RedisService.get("products:list:all"), null);
    assert.equal(await RedisService.get("products:list:men"), null);
    assert.equal(await RedisService.get("products:slug:nilgiri"), null);

    // Categories key should remain untouched
    const categories = await RedisService.get("categories:all");
    assert.ok(categories);
  });

  it("should store and retrieve guest cart with 7-day persistence", async () => {
    const sessionId = "sess_guest_tn_987";
    const cart = {
      items: [{ variantId: "v1", quantity: 2, price: 1890 }],
      totalQuantity: 2,
      subtotal: 3780,
    };

    await RedisService.setGuestCart(sessionId, cart);

    const retrieved = await RedisService.getGuestCart(sessionId);
    assert.ok(retrieved);
    assert.equal(retrieved.totalQuantity, 2);
    assert.equal(retrieved.subtotal, 3780);

    await RedisService.deleteGuestCart(sessionId);
    assert.equal(await RedisService.getGuestCart(sessionId), null);
  });

  it("should handle OTP verification and prevent replay attacks", async () => {
    const phone = "+919876543210";
    const otp = "543210";

    await RedisService.setOtp(phone, otp);

    // Wrong OTP fails
    const wrongAttempt = await RedisService.verifyOtp(phone, "000000");
    assert.equal(wrongAttempt, false);

    // Correct OTP succeeds
    const correctAttempt = await RedisService.verifyOtp(phone, otp);
    assert.equal(correctAttempt, true);

    // Replay attempt fails because OTP is immediately deleted upon verification
    const replayAttempt = await RedisService.verifyOtp(phone, otp);
    assert.equal(replayAttempt, false);
  });
});
