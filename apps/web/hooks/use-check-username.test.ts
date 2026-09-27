import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/api-client";
import { useCheckUsername } from "./use-check-username";
import { userQueryKeys } from "./query-keys";
import type { CheckUsernameResponse } from "./types";

describe("useCheckUsername", () => {
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

  it("returns idle state when username is empty", () => {
    let hook!: ReturnType<typeof useCheckUsername>;
    function TestComponent() {
      hook = useCheckUsername("", { debounceMs: 0 });
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    expect(hook.debouncedUsername).toBe("");
    expect(hook.isAvailable).toBeNull();
    expect(hook.validationError).toBeNull();
    expect(hook.isChecking).toBe(false);
  });

  it("validates client-side for username shorter than 3 characters without querying network", () => {
    let networkCalled = false;
    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      networkCalled = true;
      return {
        data: { success: true, available: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    let hook!: ReturnType<typeof useCheckUsername>;
    function TestComponent() {
      hook = useCheckUsername("ab", { debounceMs: 0 });
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    expect(hook.validationError).toBe("Username must be at least 3 characters");
    expect(hook.isAvailable).toBeNull();
    expect(networkCalled).toBe(false);
  });

  it("validates client-side for invalid characters", () => {
    let hook!: ReturnType<typeof useCheckUsername>;
    function TestComponent() {
      hook = useCheckUsername("invalid user!", { debounceMs: 0 });
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    expect(hook.validationError).toBe(
      "Only lowercase letters, numbers, and underscores allowed"
    );
    expect(hook.isAvailable).toBeNull();
  });

  it("validates client-side for username longer than 30 characters", () => {
    let hook!: ReturnType<typeof useCheckUsername>;
    function TestComponent() {
      hook = useCheckUsername("a".repeat(31), { debounceMs: 0 });
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    expect(hook.validationError).toBe(
      "Username must be 30 characters or fewer"
    );
  });

  it("queries /api/v1/users/check-username with valid debounced username and returns available: true", async () => {
    let capturedUrl = "";
    let capturedParams: unknown = null;

    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      capturedUrl = config.url ?? "";
      capturedParams = config.params;

      const mockResponse: CheckUsernameResponse = {
        success: true,
        available: true,
        isAvailable: true,
        message: "Username is available",
      };

      return {
        data: mockResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    let hook!: ReturnType<typeof useCheckUsername>;
    function TestComponent() {
      hook = useCheckUsername("cool_user", { debounceMs: 0 });
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    const result = await hook.refetch();

    expect(capturedUrl).toBe("/api/v1/users/check-username");
    expect(capturedParams).toEqual({ username: "cool_user" });
    expect(result.data?.available).toBe(true);
    expect(hook.validationError).toBeNull();
  });

  it("returns available: false when username is already taken", async () => {
    apiClient.defaults.adapter = async (
      config: InternalAxiosRequestConfig
    ): Promise<AxiosResponse> => {
      const mockResponse: CheckUsernameResponse = {
        success: true,
        available: false,
        isAvailable: false,
        message: "Username is already taken",
      };

      return {
        data: mockResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    let hook!: ReturnType<typeof useCheckUsername>;
    function TestComponent() {
      hook = useCheckUsername("taken_user", { debounceMs: 0 });
      return React.createElement("div", null, "test");
    }

    renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(TestComponent)
      )
    );

    const result = await hook.refetch();

    expect(result.data?.available).toBe(false);
  });
});
