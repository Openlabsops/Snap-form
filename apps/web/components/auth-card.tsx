"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { GithubIcon } from "@/components/icons/github-icon";
import { GoogleIcon } from "@/components/icons/google-icon";

export function AuthCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Welcome to Snap-Form</CardTitle>
        <CardDescription>
          Choose your preferred method to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mock Buttons — no onClick handlers since this is a server component */}
        <Button
          id="google-login-btn"
          variant="outline"
          size="lg"
          className="w-full justify-center gap-3"
          render={<a href="#get-started" />}
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </Button>

        <Button
          id="github-login-btn"
          variant="outline"
          size="lg"
          className="w-full justify-center gap-3"
          render={<a href="#get-started" />}
        >
          <GithubIcon className="w-5 h-5" />
          Continue with GitHub
        </Button>

        <div className="relative py-2">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <p className="text-xs text-center text-muted-foreground leading-relaxed">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
