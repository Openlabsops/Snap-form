"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";

type AuthGuardProps = {
  children: ReactNode;
  allowIncompleteProfile?: boolean;
};

export function AuthGuard({
  children,
  allowIncompleteProfile = false,
}: AuthGuardProps) {
  const { isAuthorized, isPending } = useRequireAuth({
    allowIncompleteProfile,
  });

  if (isPending || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
