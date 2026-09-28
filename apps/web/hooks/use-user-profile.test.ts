import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/api-client";
import { useUserProfile } from "./use-user-profile";
import { userQueryKeys } from "./query-keys";
import type { UserProfile, UserProfileResponse } from "./types";

describe("useUserProfile", () => {
  let queryClient: QueryClient;
  const originalAdapter = apiClient.defaults.adapter;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
  });

  it("fetches active user profile from /api/v1/users/profile", async () => {
    let capturedUrl = "";

    const mockProfile: UserProfile = {
      id: "usr_999",
      name: "Carol Danvers",
      username: "captain",
      email: "carol@marvel.com",
      image: "https://example.com/avatar.jpg",
      emailVerified: true,
      role: "ADMIN",
      plan: "PREMIUM",
      onboardingCompleted: true,
      socialLinks: {
        x: "https://x.com/captain",
      },
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    };

    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      capturedUrl = config.url ?? "";
      const mockResponse: UserProfileResponse = {
        success: true,
        user: mockProfile,
      };
      return {
        data: mockResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    let profileHook!: ReturnType<typeof useUserProfile<UserProfile>>;
    function TestComponent() {
      profileHook = useUserProfile<UserProfile>();
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    const result = await profileHook.refetch();

    expect(capturedUrl).toBe("/api/v1/users/profile");
    expect(result.data).toEqual(mockProfile);
    expect(result.data?.username).toBe("captain");
    expect(result.data?.role).toBe("ADMIN");
  });

  it("handles errors when profile fetch fails", async () => {
    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      const errResponse: AxiosResponse = {
        data: {
          success: false,
          message: "Unauthorized",
        },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
      };
      throw new (await import("axios")).AxiosError(
        "Request failed with status code 401",
        "401",
        config,
        {},
        errResponse
      );
    };

    let profileHook!: ReturnType<typeof useUserProfile<UserProfile>>;
    function TestComponent() {
      profileHook = useUserProfile<UserProfile>();
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    await profileHook.refetch();
    const queryState = queryClient.getQueryState(userQueryKeys.profile());

    expect(queryState?.status).toBe("error");
    expect(queryState?.error).not.toBeNull();
    expect((queryState?.error as unknown as { status: number }).status).toBe(401);
  });
});
