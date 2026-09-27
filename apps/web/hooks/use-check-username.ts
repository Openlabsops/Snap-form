import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { apiClient, type ApiError } from "@/lib/api-client";
import { useDebounce } from "./use-debounce";
import { userQueryKeys } from "./query-keys";
import type { CheckUsernameResponse } from "./types";

export interface UseCheckUsernameOptions
  extends Omit<
    UseQueryOptions<CheckUsernameResponse, ApiError, CheckUsernameResponse>,
    "queryKey" | "queryFn"
  > {
  debounceMs?: number;
}

export type UseCheckUsernameResult = UseQueryResult<
  CheckUsernameResponse,
  ApiError
> & {
  debouncedUsername: string;
  isAvailable: boolean | null;
  isChecking: boolean;
  isDebouncing: boolean;
  validationError: string | null;
};

const USERNAME_REGEX = /^[a-z0-9_]+$/i;

/**
 * Validates username format client-side to prevent unnecessary API roundtrips.
 */
function getUsernameValidationError(val: string): string | null {
  if (!val) return null;
  if (val.length < 3) return "Username must be at least 3 characters";
  if (val.length > 30) return "Username must be 30 characters or fewer";
  if (!USERNAME_REGEX.test(val)) {
    return "Only lowercase letters, numbers, and underscores allowed";
  }
  return null;
}

/**
 * TanStack Query hook with debouncing to validate username uniqueness
 * dynamically as the user types on /onboarding.
 *
 * @param username The raw username entered by the user
 * @param options Optional configuration including debounce delay in ms and TanStack query options
 * @returns Query result augmented with availability status, checking state, and validation error
 */
export function useCheckUsername(
  username: string,
  options?: UseCheckUsernameOptions
): UseCheckUsernameResult {
  const { debounceMs = 500, enabled = true, ...queryOptions } = options ?? {};
  const debouncedUsername = useDebounce(username.trim().toLowerCase(), debounceMs);

  const rawTrimmed = username.trim().toLowerCase();
  const isDebouncing =
    rawTrimmed !== debouncedUsername && rawTrimmed.length > 0;

  // Validation based on debounced input (or current input if empty)
  const validationError = getUsernameValidationError(
    rawTrimmed.length > 0 ? (isDebouncing ? rawTrimmed : debouncedUsername) : ""
  );

  const isValidFormat =
    debouncedUsername.length >= 3 &&
    debouncedUsername.length <= 30 &&
    USERNAME_REGEX.test(debouncedUsername);

  const isQueryEnabled = Boolean(enabled && isValidFormat);

  const query = useQuery<CheckUsernameResponse, ApiError>({
    queryKey: userQueryKeys.checkUsername(debouncedUsername),
    queryFn: async (): Promise<CheckUsernameResponse> => {
      const response = await apiClient.get<CheckUsernameResponse>(
        "/api/v1/users/check-username",
        {
          params: { username: debouncedUsername },
          skipAuthRedirect: true,
        }
      );
      return response.data;
    },
    enabled: isQueryEnabled,
    staleTime: 30 * 1000,
    ...queryOptions,
  });

  const isChecking =
    rawTrimmed.length > 0 &&
    (isDebouncing ||
      (isQueryEnabled && (query.isLoading || query.isFetching)));

  let isAvailable: boolean | null = null;
  if (
    validationError ||
    !debouncedUsername ||
    rawTrimmed.length === 0 ||
    isChecking
  ) {
    isAvailable = null;
  } else if (query.isSuccess && query.data) {
    isAvailable = Boolean(query.data.available ?? query.data.isAvailable);
  }

  return Object.assign(query, {
    debouncedUsername,
    isAvailable,
    isChecking,
    isDebouncing,
    validationError,
  });
}
