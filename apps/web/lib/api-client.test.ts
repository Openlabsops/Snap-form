import { describe, it, expect } from "bun:test";
import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { apiClient } from "./api-client";

function adapterFor(status: number, data: unknown) {
  return async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    const response: AxiosResponse = {
      data,
      status,
      statusText: "",
      headers: {},
      config,
    };
    if (status >= 200 && status < 300) return response;
    throw new AxiosError(
      "Request failed",
      String(status),
      config,
      {},
      response
    );
  };
}

describe("apiClient response interceptor", () => {
  it("passes successful responses through unchanged", async () => {
    const res = await apiClient.get("/ok", {
      adapter: adapterFor(200, { success: true, data: { id: 1 } }),
    });
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ success: true, data: { id: 1 } });
  });

  it("normalizes 401 { success, message } shape", async () => {
    const err = await apiClient
      .get("/private", {
        adapter: adapterFor(401, { success: false, message: "Unauthorized" }),
        skipAuthRedirect: true,
      })
      .catch((e) => e);
    expect(err).toEqual({
      status: 401,
      message: "Unauthorized",
      raw: { success: false, message: "Unauthorized" },
    });
  });

  it("normalizes 400 validation shape with Record<string,string> errors", async () => {
    const err = await apiClient
      .get("/forms", {
        adapter: adapterFor(400, {
          success: false,
          message: "Validation failed",
          errors: { email: "Invalid email" },
        }),
      })
      .catch((e) => e);
    expect(err.status).toBe(400);
    expect(err.message).toBe("Validation failed");
    expect(err.fieldErrors).toEqual({ email: "Invalid email" });
  });

  it("flattens Zod-native Record<string,string[]> errors", async () => {
    const err = await apiClient
      .get("/forms", {
        adapter: adapterFor(400, {
          success: false,
          message: "Validation failed",
          errors: { title: ["Too short", "Required"], tags: ["Min 1"] },
        }),
      })
      .catch((e) => e);
    expect(err.fieldErrors).toEqual({ title: "Too short", tags: "Min 1" });
  });

  it("normalizes 500 { error } shape", async () => {
    const err = await apiClient
      .get("/boom", {
        adapter: adapterFor(500, { error: "Internal Server Error" }),
      })
      .catch((e) => e);
    expect(err).toMatchObject({
      status: 500,
      message: "Internal Server Error",
    });
  });

  it("uses fallbacks when there is no response (network failure)", async () => {
    const err = await apiClient
      .get("/offline", {
        adapter: async (config) => {
          throw new AxiosError("Network Error", "ERR_NETWORK", config);
        },
      })
      .catch((e) => e);
    expect(err.status).toBe(0);
    expect(err.message).toBe("Something went wrong");
    expect(err.raw).toBeUndefined();
  });

  it("leaves fieldErrors undefined when errors is not a known shape", async () => {
    const err = await apiClient
      .get("/weird", {
        adapter: adapterFor(400, {
          success: false,
          message: "Bad request",
          errors: "just a string",
        }),
      })
      .catch((e) => e);
    expect(err.message).toBe("Bad request");
    expect(err.fieldErrors).toBeUndefined();
  });
});
