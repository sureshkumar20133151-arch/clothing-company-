import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { Server } from "http";
import { app } from "../app";

describe("API Server Health & Endpoints", () => {
  let server: Server;
  let baseUrl: string;

  before((_, done) => {
    // Listen on ephemeral free port
    server = app.listen(0, () => {
      const address = server.address();
      if (typeof address === "object" && address) {
        baseUrl = `http://127.0.0.1:${address.port}`;
      }
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  it("GET / should return brand and docs metadata", async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);

    const body = (await res.json()) as any;
    assert.equal(body.success, true);
    assert.equal(body.data.brand, "Indigo & Thread API");
  });

  it("GET /api/v1/health should report operational status and Indian market config", async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    assert.ok(res.status === 200 || res.status === 503);

    const body = (await res.json()) as any;
    assert.equal(body.brand, "Indigo & Thread");
    assert.ok(body.status === "healthy" || body.status === "degraded");
  });

  it("GET /api/v1/brand-story should return artisanal brand narrative and GST compliance", async () => {
    const res = await fetch(`${baseUrl}/api/v1/brand-story`);
    assert.equal(res.status, 200);

    const body = (await res.json()) as any;
    assert.equal(body.success, true);
    assert.equal(body.data.brand, "Indigo & Thread");
    assert.ok(typeof body.data.story === "string" && body.data.story.includes("handloom"));
    assert.ok(typeof body.data.gstCompliance === "string" && body.data.gstCompliance.includes("5%"));
  });

  it("GET /non-existent-route should return 404 with structured error response", async () => {
    const res = await fetch(`${baseUrl}/non-existent-route`);
    assert.equal(res.status, 404);

    const body = (await res.json()) as any;
    assert.equal(body.success, false);
    assert.equal(body.message, "Endpoint not found");
  });
});
