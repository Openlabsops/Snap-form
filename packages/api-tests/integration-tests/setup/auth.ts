import axios, { AxiosInstance } from "axios";
import crypto from "crypto";

/**
 * Interface for specifying user properties for the authenticated client.
 */
export interface TestUserOptions {
  email?: string;
  name?: string;
  username?: string;
  role?: "USER" | "ADMIN" | "SUPER_ADMIN";
  plan?: "FREE" | "PREMIUM" | "BUSINESS";
}

function getTestBaseUrl(): string {
  const baseUrl = (globalThis as any).TEST_BASE_URL;
  if (!baseUrl) {
    throw new Error("TEST_BASE_URL is not initialized. Ensure bootstrap preload is active.");
  }
  return baseUrl;
}

/**
 * Creates an authenticated Axios instance for a test user.
 * It uses the application's actual register and login endpoints to obtain
 * valid session cookies from better-auth, then updates user fields in the DB if needed.
 */
export async function createAuthenticatedClient(options?: TestUserOptions): Promise<{
  client: AxiosInstance;
  user: any;
  cookie: string;
}> {
  const email = options?.email ?? `test-${crypto.randomUUID()}@example.com`;
  const name = options?.name ?? "Test User";
  const password = "TestPassword123!"; // standard password for test accounts

  const baseUrl = getTestBaseUrl();

  // Create a clean client for executing the auth flow
  const authClient = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    validateStatus: () => true,
  });

  // 1. Register the user
  const registerRes = await authClient.post("/api/v1/auth/manual/register", {
    email,
    password,
    name,
  });

  if (registerRes.status !== 200 && registerRes.status !== 201) {
    throw new Error(`Failed to register test user: ${JSON.stringify(registerRes.data)}`);
  }

  // 2. Log in the user to obtain session cookies
  const loginRes = await authClient.post("/api/v1/auth/manual/login", {
    email,
    password,
  });

  if (loginRes.status !== 200) {
    throw new Error(`Failed to login test user: ${JSON.stringify(loginRes.data)}`);
  }

  // 3. Extract session cookies
  const setCookieHeaders = loginRes.headers["set-cookie"];
  if (!setCookieHeaders || setCookieHeaders.length === 0) {
    throw new Error("No Set-Cookie header returned from login");
  }
  const cookiesArray = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  const cookie = cookiesArray
    .map(c => c.split(";")[0])
    .join("; ");

  const user = loginRes.data.user;

  // 4. Update role/plan/username in database if custom options were provided
  if (options?.role || options?.plan || options?.username) {
    const { prisma } = await import("@repo/db");
    const data: any = {};
    if (options.role) data.role = options.role;
    if (options.plan) data.plan = options.plan;
    if (options.username) data.username = options.username;
    
    await prisma.user.update({
      where: { id: user.id },
      data,
    });
  }

  // 5. Create Axios instance with authenticated Cookie header
  const client = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      "Cookie": cookie,
    },
    validateStatus: () => true,
  });

  return {
    client,
    user,
    cookie,
  };
}

/**
 * Creates an unauthenticated Axios instance.
 */
export function createAnonymousClient(): AxiosInstance {
  const baseUrl = getTestBaseUrl();
  return axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    validateStatus: () => true,
  });
}
