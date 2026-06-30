"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// Simple inline SVG icons to avoid extra deps
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.264 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

type FormState = {
  username: string;
  xUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
};

type FieldError = Partial<Record<keyof FormState, string>>;

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    username: "",
    xUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError(null);
  }

  function validate(): boolean {
    const next: FieldError = {};
    if (!form.username) {
      next.username = "Username is required";
    } else if (!/^[a-z0-9_]{3,30}$/.test(form.username)) {
      next.username =
        "3–30 chars, lowercase letters, numbers, underscores only";
    }
    const urlPattern = /^https?:\/\/.+/;
    if (form.xUrl && !urlPattern.test(form.xUrl))
      next.xUrl = "Must be a valid URL (e.g. https://x.com/you)";
    if (form.linkedinUrl && !urlPattern.test(form.linkedinUrl))
      next.linkedinUrl =
        "Must be a valid URL (e.g. https://linkedin.com/in/you)";
    if (form.instagramUrl && !urlPattern.test(form.instagramUrl))
      next.instagramUrl =
        "Must be a valid URL (e.g. https://instagram.com/you)";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/user/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: form.username,
          xUrl: form.xUrl || undefined,
          linkedinUrl: form.linkedinUrl || undefined,
          instagramUrl: form.instagramUrl || undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setErrors({ username: "This username is already taken" });
        return;
      }

      if (!res.ok) {
        setServerError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      // Success — go to dashboard
      router.push("/dashboard");
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground text-xl font-bold mb-4">
            S
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Set up your profile
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Just a few things to get you started
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} noValidate>
            <CardHeader>
              <CardTitle className="text-base">Your details</CardTitle>
              <CardDescription>
                Choose a unique username and optionally add your social links.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    @
                  </span>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="yourhandle"
                    value={form.username}
                    onChange={handleChange}
                    className="rounded-l-none"
                    autoComplete="off"
                    autoCapitalize="none"
                  />
                </div>
                {errors.username && (
                  <p className="text-destructive text-xs">{errors.username}</p>
                )}
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">
                    Social links (optional)
                  </span>
                </div>
              </div>

              {/* X */}
              <div className="space-y-1.5">
                <Label htmlFor="xUrl" className="flex items-center gap-1.5">
                  <XIcon />
                  X (Twitter)
                </Label>
                <Input
                  id="xUrl"
                  name="xUrl"
                  type="url"
                  placeholder="https://x.com/yourhandle"
                  value={form.xUrl}
                  onChange={handleChange}
                />
                {errors.xUrl && (
                  <p className="text-destructive text-xs">{errors.xUrl}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="linkedinUrl"
                  className="flex items-center gap-1.5"
                >
                  <LinkedInIcon />
                  LinkedIn
                </Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourname"
                  value={form.linkedinUrl}
                  onChange={handleChange}
                />
                {errors.linkedinUrl && (
                  <p className="text-destructive text-xs">
                    {errors.linkedinUrl}
                  </p>
                )}
              </div>

              {/* Instagram */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="instagramUrl"
                  className="flex items-center gap-1.5"
                >
                  <InstagramIcon />
                  Instagram
                </Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={form.instagramUrl}
                  onChange={handleChange}
                />
                {errors.instagramUrl && (
                  <p className="text-destructive text-xs">
                    {errors.instagramUrl}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <p className="text-destructive text-sm bg-destructive/10 rounded-md px-3 py-2">
                  {serverError}
                </p>
              )}
            </CardContent>

            <CardFooter>
              <Button
                id="onboarding-submit"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Saving…" : "Continue to dashboard →"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
