import { AUTH_ENTRY_PATH, shouldRedirectOnUnauthorized } from "@/lib/auth-navigation";

let onSessionCleared: (() => void) | undefined;

export function registerSessionClearedHandler(handler: () => void) {
  onSessionCleared = handler;
}

export function expireClientSession() {
  onSessionCleared?.();

  if (typeof window === "undefined") return;
  if (!shouldRedirectOnUnauthorized(window.location.pathname)) return;

  window.location.replace(AUTH_ENTRY_PATH);
}
