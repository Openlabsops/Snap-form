"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AUTH_ENTRY_PATH,
  DASHBOARD_PATH,
  hasCompletedProfile,
  ONBOARDING_PATH,
} from "@/lib/auth-navigation";
import { getSession, useSession } from "@/lib/auth-client";

type UseRequireAuthOptions = {
  allowIncompleteProfile?: boolean;
};

export function useRequireAuth(
  { allowIncompleteProfile = false }: UseRequireAuthOptions = {},
) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const profileComplete = hasCompletedProfile(session?.user);
  const isAuthorized = Boolean(
    session && (allowIncompleteProfile ? !profileComplete : profileComplete),
  );

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace(AUTH_ENTRY_PATH);
      return;
    }

    if (allowIncompleteProfile) {
      if (profileComplete) {
        router.replace(DASHBOARD_PATH);
      }
      return;
    }

    if (!profileComplete) {
      router.replace(ONBOARDING_PATH);
    }
  }, [allowIncompleteProfile, isPending, profileComplete, router, session]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void getSession();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return {
    session,
    isPending,
    isAuthorized,
    profileComplete,
  };
}
