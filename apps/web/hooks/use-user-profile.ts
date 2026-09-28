import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { apiClient, type ApiError } from "@/lib/api-client";
import { userQueryKeys } from "./query-keys";
import type { UserProfile, UserProfileResponse } from "./types";

export type UseUserProfileResult<TData = UserProfile> = UseQueryResult<
  TData,
  ApiError
> & {
  user: TData | undefined;
};

/**
 * TanStack Query hook to fetch active user profile details.
 * Queries GET /api/v1/users/profile.
 *
 * @param options Optional TanStack useQuery configuration options
 * @returns Query result with user profile details
 */
export function useUserProfile<TData = UserProfile>(
  options?: Omit<
    UseQueryOptions<UserProfile, ApiError, TData>,
    "queryKey" | "queryFn"
  >
): UseUserProfileResult<TData> {
  const query = useQuery<UserProfile, ApiError, TData>({
    queryKey: userQueryKeys.profile(),
    queryFn: async (): Promise<UserProfile> => {
      const response = await apiClient.get<UserProfileResponse>(
        "/api/v1/users/profile"
      );
      return response.data.user;
    },
    staleTime: 60 * 1000,
    ...options,
  });

  return Object.assign(query, {
    user: query.data,
  });
}
