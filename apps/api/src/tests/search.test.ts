import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SearchService } from "../modules/search/search.service";

describe("Full-Text Search & Live Suggestions Engine", () => {
  it("should return empty suggestions when query is empty or whitespace", async () => {
    const empty1 = await SearchService.getSuggestions("");
    const empty2 = await SearchService.getSuggestions("   ");
    assert.deepEqual(empty1, []);
    assert.deepEqual(empty2, []);
  });

  it("should handle malicious SQL injection characters safely without error", async () => {
    const maliciousQueries = [
      "'; DROP TABLE \"Product\"; --",
      "' OR 1=1 --",
      "'; SELECT * FROM \"User\"; --",
      "<script>alert('xss')</script>",
      "\\x00' OR '1'='1",
      "\" AND \"\"=\"",
    ];

    for (const q of maliciousQueries) {
      // Must not throw SQL injection or syntax error
      const result = await SearchService.searchProducts({ q, limit: 5 });
      assert.ok(result);
      assert.ok(Array.isArray(result.products));
      assert.equal(typeof result.meta.total, "number");
    }
  });

  it("should support combining text search with category, gender, and price range filters", async () => {
    const searchOptions = {
      q: "cotton",
      category: "mens-handloom-shirts",
      gender: "MEN",
      minPrice: 1000,
      maxPrice: 3000,
      page: 1,
      limit: 10,
    };

    const result = await SearchService.searchProducts(searchOptions);
    assert.ok(result);
    assert.ok(Array.isArray(result.products));
    assert.equal(result.query, "cotton");
    assert.equal(result.meta.page, 1);
    assert.equal(result.meta.limit, 10);
  });

  it("should handle no-results gracefully and report zero matches", async () => {
    const result = await SearchService.searchProducts({
      q: "nonexistentcraftitemxyz9999",
      page: 1,
      limit: 10,
    });

    assert.ok(result);
    assert.equal(result.products.length, 0);
    assert.equal(result.meta.total, 0);
    assert.equal(result.meta.totalPages, 0);
  });
});
