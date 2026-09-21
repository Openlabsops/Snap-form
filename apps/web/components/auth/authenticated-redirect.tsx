"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthenticatedDestination } from "@/lib/auth-navigation";
import { useSession } from "@/lib/auth-client";

type AuthenticatedRedirectProps = {
  children: ReactNode;
};

export function AuthenticatedRedirect({ children }: AuthenticatedRedirectProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace(getAuthenticatedDestination(session.user));
    }
  }, [isPending, router, session]);

  if (isPending || session) return null;

  return <>{children}</>;
}

