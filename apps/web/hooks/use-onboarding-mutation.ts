import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { apiClient, type ApiError } from "@/lib/api-client";
import { userQueryKeys } from "./query-keys";
import type { OnboardingPayload, OnboardingResponse } from "./types";

/**
 * TanStack mutation hook for user onboarding.
 * Submits full name, username, and social links to POST /api/v1/users/onboarding.
 * On success, automatically invalidates the user profile query cache.
 *
 * @param options Optional TanStack useMutation configuration options
 * @returns TanStack Mutation result for user onboarding
 */
export function useOnboardingMutation<TContext = unknown>(
  options?: UseMutationOptions<
    OnboardingResponse,
    ApiError,
    OnboardingPayload,
    TContext
  >
): UseMutationResult<
  OnboardingResponse,
  ApiError,
  OnboardingPayload,
  TContext
> {
  const queryClient = useQueryClient();

  return useMutation<OnboardingResponse, ApiError, OnboardingPayload, TContext>({
    mutationFn: async (payload: OnboardingPayload): Promise<OnboardingResponse> => {
      const response = await apiClient.post<OnboardingResponse>(
        "/api/v1/users/onboarding",
        payload
      );
      return response.data;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
      if (options?.onSuccess) {
        // Forward all arguments to consumer onSuccess callback
        (options.onSuccess as (...a: typeof args) => unknown)(...args);
      }
    },
  });
}
