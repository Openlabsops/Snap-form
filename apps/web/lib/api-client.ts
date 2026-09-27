import axios, { AxiosError } from "axios";
import { expireClientSession } from "@/lib/auth-session";

export type ApiError = {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
  raw?: unknown;
};

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

type ErrorData = {
  message?: unknown;
  error?: unknown;
  errors?: unknown;
};

function normalizeFieldErrors(
  errors: unknown
): Record<string, string> | undefined {
  if (
    !errors ||
    typeof errors !== "object" ||
    Array.isArray(errors)
  ) {
    return undefined;
  }

  const entries = Object.entries(errors);
  if (entries.length === 0) return undefined;

  if (entries.every(([, value]) => typeof value === "string")) {
    return Object.fromEntries(entries);
  }

  if (
    entries.every(
      ([, value]) => Array.isArray(value) && typeof value[0] === "string"
    )
  ) {
    return Object.fromEntries(
      entries.map(([key, value]) => [key, (value as string[])[0]])
    );
  }

  return undefined;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorData>) => {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    const message =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      "Something went wrong";

    const apiError: ApiError = {
      status,
      message,
      raw: data,
    };

    const fieldErrors = normalizeFieldErrors(data?.errors);
    if (fieldErrors) {
      apiError.fieldErrors = fieldErrors;
    }

    if (
      status === 401 &&
      typeof window !== "undefined" &&
      !error.config?.skipAuthRedirect
    ) {
      expireClientSession();
    }

    return Promise.reject(apiError);
  }
);
