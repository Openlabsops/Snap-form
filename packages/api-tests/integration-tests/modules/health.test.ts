/// <reference types="bun-types" />
import { describe, it, expect } from "bun:test";
import { createAnonymousClient } from "../setup/auth";

describe("Health Check API", () => {
  it("should return 200 OK and health details", async () => {
    const client = createAnonymousClient();
    const response = await client.get("/health");

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("status", "ok");
    expect(response.data).toHaveProperty("message", "API is healthy");
    expect(response.data).toHaveProperty("serverTime");
    expect(response.data).toHaveProperty("startedAt");
    expect(response.data.uptime).toHaveProperty("seconds");
    expect(response.data.uptime).toHaveProperty("humanReadable");
  });
});
