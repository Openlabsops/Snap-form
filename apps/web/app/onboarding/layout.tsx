import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <AuthGuard allowIncompleteProfile>{children}</AuthGuard>;
}
