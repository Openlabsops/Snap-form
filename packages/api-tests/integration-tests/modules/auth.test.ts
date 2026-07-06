/// <reference types="bun-types" />
import { describe, it, expect, beforeAll, afterAll, spyOn } from "bun:test";
import { createAnonymousClient } from "../setup/auth";
import { cleanDb } from "../setup/db";
import { prisma } from "@repo/db";

describe("OAuth Flow Integration", () => {
  let fetchSpy: any;
  let originalFetch: typeof globalThis.fetch;

  beforeAll(async () => {
    await cleanDb();

    originalFetch = globalThis.fetch;

    // Mock fetch for GitHub OAuth API calls
    fetchSpy = spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : (input as any).url || input.toString();

      if (url.includes("github.com/login/oauth/access_token")) {
        return new Response(JSON.stringify({
          access_token: "mock-github-access-token",
          token_type: "bearer",
          scope: "read:user,user:email",
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.includes("api.github.com/user/emails")) {
        return new Response(JSON.stringify([
          {
            email: "test-oauth-user@example.com",
            primary: true,
            verified: true,
            visibility: "public",
          }
        ]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.includes("api.github.com/user")) {
        return new Response(JSON.stringify({
          id: 99887766,
          login: "test-oauth-user",
          name: "Test OAuth User",
          email: "test-oauth-user@example.com",
          avatar_url: "https://avatars.githubusercontent.com/u/99887766",
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return originalFetch(input, init);
    }) as any;
  });

  afterAll(async () => {
    fetchSpy.mockRestore();
  });

  it("should successfully execute social auth initiation, callback, and redirection", async () => {
    const client = createAnonymousClient();

    // 1. Test Case: Direct POST call to the OAuth initiation route returns the proper redirect URL.
    const initRes = await client.post("/api/auth/sign-in/social", {
      provider: "github",
      callbackURL: "http://localhost:3001/dashboard"
    }, {
      headers: {
        "Host": "localhost:3000",
        "X-Forwarded-Host": "localhost:3000",
        "X-Forwarded-Proto": "http",
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });

    expect(initRes.status).toBe(200);
    expect(initRes.data).toHaveProperty("url");
    expect(initRes.data).toHaveProperty("redirect", true);

    const redirectUrl = new URL(initRes.data.url);
    const state = redirectUrl.searchParams.get("state");
    expect(state).not.toBeNull();

    // Extract better-auth.state cookie
    const setCookie = initRes.headers["set-cookie"];
    if (!setCookie) {
      throw new Error("set-cookie header is undefined");
    }
    const stateCookie = setCookie.find((c: string) => c.startsWith("better-auth.state="));
    if (!stateCookie) {
      throw new Error("better-auth.state cookie not found");
    }
    const stateCookieValue = stateCookie.split(";")[0];

    // 2. Test Case: Simulating a successful Better-Auth callback successfully establishes a session token.
    const callbackRes = await client.get(`/api/auth/callback/github?code=mock-code&state=${state}`, {
      headers: {
        "Host": "localhost:3000",
        "X-Forwarded-Host": "localhost:3000",
        "X-Forwarded-Proto": "http",
        "Cookie": stateCookieValue,
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });

    // better-auth redirects after callback
    expect(callbackRes.status).toBe(302);
    
    // Check if session token cookie is established
    const callbackCookies = callbackRes.headers["set-cookie"];
    if (!callbackCookies) {
      throw new Error("set-cookie header on callback is undefined");
    }
    const sessionCookie = callbackCookies.find((c: string) => c.startsWith("better-auth.session_token="));
    if (!sessionCookie) {
      throw new Error("better-auth.session_token cookie not found");
    }
    const sessionCookieValue = sessionCookie.split(";")[0];

    // Verify user is created in database
    const dbUser = await prisma.user.findFirst({
      where: { email: "test-oauth-user@example.com" }
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.name).toBe("Test OAuth User");

    // 3. Test callback redirect flow to onboarding vs dashboard
    const customCallbackRes = await client.get("/api/v1/auth/oauth/callback", {
      headers: {
        "Cookie": sessionCookieValue,
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });

    expect(customCallbackRes.status).toBe(302);
    // Since it's a new user (no username set yet), it should redirect to onboarding
    expect(customCallbackRes.headers["location"]).toBe("http://localhost:3001/onboarding");

    // Set a username for the user in the database
    await prisma.user.update({
      where: { id: dbUser!.id },
      data: { username: "testoauthuser" }
    });

    // Requesting custom callback again with a username
    const customCallbackWithUsernameRes = await client.get("/api/v1/auth/oauth/callback", {
      headers: {
        "Cookie": sessionCookieValue,
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });

    expect(customCallbackWithUsernameRes.status).toBe(302);
    expect(customCallbackWithUsernameRes.headers["location"]).toBe("http://localhost:3001/dashboard");
  });
});
