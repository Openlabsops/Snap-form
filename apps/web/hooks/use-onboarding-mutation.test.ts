import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/api-client";
import { useOnboardingMutation } from "./use-onboarding-mutation";
import { userQueryKeys } from "./query-keys";
import type { OnboardingPayload, OnboardingResponse } from "./types";

describe("useOnboardingMutation", () => {
  let queryClient: QueryClient;
  const originalAdapter = apiClient.defaults.adapter;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
  });

  it("submits full name, username, and social links to /api/v1/users/onboarding", async () => {
    let capturedUrl = "";
    let capturedBody: unknown = null;

    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      capturedUrl = config.url ?? "";
      capturedBody = typeof config.data === "string" ? JSON.parse(config.data) : config.data;

      const mockResponse: OnboardingResponse = {
        success: true,
        user: {
          id: "usr_123",
          name: "Alice Doe",
          username: "alicedoe",
          email: "alice@example.com",
          emailVerified: true,
          role: "USER",
          plan: "FREE",
          onboardingCompleted: true,
          socialLinks: {
            x: "https://x.com/alicedoe",
            linkedin: "https://linkedin.com/in/alicedoe",
          },
        },
      };

      return {
        data: mockResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    let mutationHook!: ReturnType<typeof useOnboardingMutation>;
    function TestComponent() {
      mutationHook = useOnboardingMutation();
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    const payload: OnboardingPayload = {
      fullName: "Alice Doe",
      username: "alicedoe",
      socialLinks: {
        x: "https://x.com/alicedoe",
        linkedin: "https://linkedin.com/in/alicedoe",
      },
    };

    const result = await mutationHook.mutateAsync(payload);

    expect(capturedUrl).toBe("/api/v1/users/onboarding");
    expect(capturedBody).toEqual(payload);
    expect(result.success).toBe(true);
    expect(result.user.username).toBe("alicedoe");
    expect(result.user.name).toBe("Alice Doe");
    expect(result.user.onboardingCompleted).toBe(true);
  });

  it("invalidates user profile query and calls onSuccess callback on success", async () => {
    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      return {
        data: {
          success: true,
          user: {
            id: "usr_456",
            name: "Bob Smith",
            username: "bobsmith",
            email: "bob@example.com",
            emailVerified: true,
            role: "USER",
            plan: "FREE",
            onboardingCompleted: true,
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const invalidateSpy = mock(() => Promise.resolve());
    queryClient.invalidateQueries = invalidateSpy as unknown as typeof queryClient.invalidateQueries;

    let customSuccessCalled = false;
    let mutationHook!: ReturnType<typeof useOnboardingMutation>;

    function TestComponent() {
      mutationHook = useOnboardingMutation({
        onSuccess: (data) => {
          customSuccessCalled = true;
          expect(data.user.username).toBe("bobsmith");
        },
      });
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    await mutationHook.mutateAsync({
      username: "bobsmith",
    });

    expect(customSuccessCalled).toBe(true);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: userQueryKeys.profile(),
    });
  });

  it("handles 409 Conflict error when username is already taken", async () => {
    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      const errResponse: AxiosResponse = {
        data: {
          success: false,
          message: "Username is already taken",
        },
        status: 409,
        statusText: "Conflict",
        headers: {},
        config,
      };
      throw new (await import("axios")).AxiosError(
        "Request failed with status code 409",
        "409",
        config,
        {},
        errResponse
      );
    };

    let mutationHook!: ReturnType<typeof useOnboardingMutation>;
    function TestComponent() {
      mutationHook = useOnboardingMutation();
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    let caughtError: unknown = null;
    try {
      await mutationHook.mutateAsync({ username: "taken_user" });
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).not.toBeNull();
    expect((caughtError as { status: number }).status).toBe(409);
    expect((caughtError as { message: string }).message).toBe(
      "Username is already taken"
    );
  });
});
