import { describe, it } from "node:test";
import assert from "node:assert/strict";

interface MockReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  helpfulCount: number;
}

interface MockOrder {
  id: string;
  userId: string;
  status: string;
  items: Array<{ productId: string }>;
}

describe("Customer Reviews, Verified Purchases & Rating Aggregations", () => {
  it("should enforce exactly one review per user per product", () => {
    const reviewsStore: MockReview[] = [
      { id: "r1", productId: "p1", userId: "u1", rating: 5, status: "APPROVED", helpfulCount: 0 },
    ];

    const canSubmit = (productId: string, userId: string) => {
      return !reviewsStore.some((r) => r.productId === productId && r.userId === userId);
    };

    assert.equal(canSubmit("p1", "u1"), false, "Existing reviewer cannot review same product again");
    assert.equal(canSubmit("p1", "u2"), true, "New user can review product");
    assert.equal(canSubmit("p2", "u1"), true, "Existing reviewer can review different product");
  });

  it("should detect verified purchase only if user has a completed/confirmed order containing that product", () => {
    const orders: MockOrder[] = [
      { id: "o1", userId: "u1", status: "DELIVERED", items: [{ productId: "p1" }] },
      { id: "o2", userId: "u2", status: "PENDING", items: [{ productId: "p1" }] },
      { id: "o3", userId: "u3", status: "CANCELLED", items: [{ productId: "p1" }] },
    ];

    const isVerifiedPurchase = (userId: string, productId: string) => {
      const validStatuses = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
      return orders.some(
        (o) => o.userId === userId && validStatuses.includes(o.status) && o.items.some((i) => i.productId === productId)
      );
    };

    assert.equal(isVerifiedPurchase("u1", "p1"), true, "DELIVERED order qualifies as verified purchase");
    assert.equal(isVerifiedPurchase("u2", "p1"), false, "PENDING order does not qualify");
    assert.equal(isVerifiedPurchase("u3", "p1"), false, "CANCELLED order does not qualify");
    assert.equal(isVerifiedPurchase("u4", "p1"), false, "Non-purchaser does not qualify");
  });

  it("should accurately compute average rating and review counts only for APPROVED reviews", () => {
    const reviews: MockReview[] = [
      { id: "r1", productId: "p1", userId: "u1", rating: 5, status: "APPROVED", helpfulCount: 2 },
      { id: "r2", productId: "p1", userId: "u2", rating: 4, status: "APPROVED", helpfulCount: 0 },
      { id: "r3", productId: "p1", userId: "u3", rating: 1, status: "PENDING", helpfulCount: 0 }, // must be excluded
      { id: "r4", productId: "p1", userId: "u4", rating: 2, status: "REJECTED", helpfulCount: 0 }, // must be excluded
    ];

    const computeAggregates = (items: MockReview[]) => {
      const approved = items.filter((r) => r.status === "APPROVED");
      const reviewCount = approved.length;
      const averageRating =
        reviewCount > 0
          ? Number((approved.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
          : 0;
      return { reviewCount, averageRating };
    };

    const aggregates = computeAggregates(reviews);
    assert.equal(aggregates.reviewCount, 2);
    // (5 + 4) / 2 = 4.5
    assert.equal(aggregates.averageRating, 4.5);
  });

  it("should prevent double-voting on helpful reviews", () => {
    const helpfulVotesSet = new Set<string>();

    const voteHelpful = (reviewId: string, userId: string): boolean => {
      const voteKey = `${reviewId}:${userId}`;
      if (helpfulVotesSet.has(voteKey)) {
        return false; // Already voted
      }
      helpfulVotesSet.add(voteKey);
      return true;
    };

    assert.equal(voteHelpful("r1", "user_101"), true, "First vote succeeds");
    assert.equal(voteHelpful("r1", "user_101"), false, "Duplicate vote is rejected");
    assert.equal(voteHelpful("r1", "user_102"), true, "Different user vote succeeds");
  });
});
