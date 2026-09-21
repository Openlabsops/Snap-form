type ProfileUser = {
  username?: unknown;
  name?: unknown;
  fullName?: unknown;
};

export const AUTH_ENTRY_PATH = "/";
export const DASHBOARD_PATH = "/dashboard";
export const ONBOARDING_PATH = "/onboarding";

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasCompletedProfile(user: ProfileUser | null | undefined) {
  return Boolean(
    user &&
      hasText(user.username) &&
      (hasText(user.fullName) || hasText(user.name)),
  );
}

export function getAuthenticatedDestination(
  user: ProfileUser | null | undefined,
) {
  return hasCompletedProfile(user) ? DASHBOARD_PATH : ONBOARDING_PATH;
}

export function shouldRedirectOnUnauthorized(pathname: string) {
  return pathname !== AUTH_ENTRY_PATH;
}
