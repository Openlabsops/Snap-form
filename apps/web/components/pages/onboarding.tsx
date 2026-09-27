"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import { Separator } from "@repo/ui/components/ui/separator";
import { ArrowRight, Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCheckUsername, useOnboardingMutation, useUserProfile } from "@/hooks";

/* ── Social Link Icons ───────────────────────────────────────────── */

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" />
    </svg>
  );
}

/* ── Onboarding Page Component ───────────────────────────────────── */

export function OnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    x: "",
    linkedin: "",
    instagram: "",
  });

  const { user: userProfile } = useUserProfile({
    retry: false,
  });

  useEffect(() => {
    if (userProfile?.name && !fullName) {
      setFullName(userProfile.name);
    }
  }, [userProfile?.name, fullName]);

  const {
    isAvailable,
    isChecking,
    validationError,
  } = useCheckUsername(username);

  const onboardingMutation = useOnboardingMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  function handleUsernameChange(value: string) {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(sanitized);
  }

  function handleSocialChange(key: keyof typeof socialLinks, value: string) {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || isAvailable !== true || onboardingMutation.isPending) return;

    onboardingMutation.mutate({
      fullName: fullName.trim() || undefined,
      username,
      socialLinks: {
        x: socialLinks.x.trim() || undefined,
        linkedin: socialLinks.linkedin.trim() || undefined,
        instagram: socialLinks.instagram.trim() || undefined,
      },
    });
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex selection:bg-primary selection:text-primary-foreground">
      {/* ─── Left Column: Form ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 lg:flex-none lg:w-1/2 xl:w-5/12 relative">
        {/* Form Container */}
        <div className="w-full max-w-[400px] mx-auto lg:mx-0">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-bold font-[family-name:var(--font-space-grotesk)] text-4xl md:text-[40px] leading-[1.2] tracking-[-0.02em] text-foreground mb-2">
              Claim your space
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Set up your profile to start building powerful, data-driven forms.
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── Error Banner ─────────────────────────── */}
                {onboardingMutation.isError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                    {onboardingMutation.error.message ||
                      "Failed to complete onboarding. Please try again."}
                  </div>
                )}

                {/* ── Full Name Field ──────────────────────── */}
                <Field>
                  <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="e.g. Jane Doe"
                    value={fullName}
                    onChange={(e) =>
                      setFullName((e.target as HTMLInputElement).value)
                    }
                  />
                </Field>

                {/* ── Username Field ─────────────────────────── */}
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <div className="w-full relative">
                    <Input
                      id="username"
                      name="username"
                      placeholder="e.g. acmecorp"
                      value={username}
                      onChange={(e) =>
                        handleUsernameChange(
                          (e.target as HTMLInputElement).value,
                        )
                      }
                    />
                    {/* Availability indicator */}
                    {username.length > 0 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isChecking && (
                          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                        )}
                        {!isChecking && isAvailable === true && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                        {!isChecking && (isAvailable === false || validationError) && (
                          <X className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                  {!isChecking && isAvailable === true && (
                    <p className="text-xs text-green-600">
                      Username is available!
                    </p>
                  )}
                  {!isChecking && isAvailable === false && (
                    <p className="text-xs text-destructive">
                      Username is already taken.
                    </p>
                  )}
                  {!isChecking && validationError && (
                    <p className="text-xs text-destructive">
                      {validationError}
                    </p>
                  )}
                </Field>

                {/* ── Profile Link Field ─────────────────────── */}
                <Field>
                  <FieldLabel>Profile Link</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText className="font-mono text-xs select-none">
                        snapform.ai/
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      value={username}
                      readOnly
                      className="font-mono text-xs"
                      placeholder="username"
                    />
                  </InputGroup>
                  <FieldDescription>
                    This will be your public URL.
                  </FieldDescription>
                </Field>

                <Separator />

                {/* ── Social Links (matching backend schema) ─── */}
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4">
                    Social Links
                  </span>

                  {/* X (Twitter) */}
                  <Field>
                    <FieldLabel htmlFor="social-x">
                      <XIcon className="w-3.5 h-3.5" />
                      X (Twitter)
                    </FieldLabel>
                    <Input
                      id="social-x"
                      name="x"
                      placeholder="https://x.com/username"
                      value={socialLinks.x}
                      onChange={(e) =>
                        handleSocialChange(
                          "x",
                          (e.target as HTMLInputElement).value,
                        )
                      }
                    />
                  </Field>

                  {/* LinkedIn */}
                  <Field>
                    <FieldLabel htmlFor="social-linkedin">
                      <LinkedInIcon className="w-3.5 h-3.5" />
                      LinkedIn
                    </FieldLabel>
                    <Input
                      id="social-linkedin"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={socialLinks.linkedin}
                      onChange={(e) =>
                        handleSocialChange(
                          "linkedin",
                          (e.target as HTMLInputElement).value,
                        )
                      }
                    />
                  </Field>

                  {/* Instagram */}
                  <Field>
                    <FieldLabel htmlFor="social-instagram">
                      <InstagramIcon className="w-3.5 h-3.5" />
                      Instagram
                    </FieldLabel>
                    <Input
                      id="social-instagram"
                      name="instagram"
                      placeholder="https://instagram.com/username"
                      value={socialLinks.instagram}
                      onChange={(e) =>
                        handleSocialChange(
                          "instagram",
                          (e.target as HTMLInputElement).value,
                        )
                      }
                    />
                  </Field>
                </div>

                {/* ── CTA ────────────────────────────────────── */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full justify-center gap-2"
                    disabled={
                      !username ||
                      isAvailable !== true ||
                      isChecking ||
                      onboardingMutation.isPending
                    }
                  >
                    {onboardingMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving profile...
                      </>
                    ) : (
                      <>
                        Continue to Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="text-foreground underline hover:opacity-80 transition-opacity"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right Column: Decorative ──────────────────────────── */}
      <div className="hidden lg:flex relative flex-1 border-l border-border overflow-hidden items-center justify-center">
        {/* Background Image — full quality */}
        <Image
          src="/onboarding-hero.png"
          alt=""
          fill
          sizes="50vw"
          quality={100}
          className="object-cover"
          priority
          unoptimized
        />

        {/* Floating Screen Showcase — Nova Health inspired */}
        <div className="relative z-10 w-[420px] max-w-[85%]" style={{ perspective: "1200px" }}>
          {/* Main floating container with 3D tilt + continuous float */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 8, rotateY: -5 }}
            animate={{
              opacity: 1,
              y: [0, -8, 0],
              rotateX: [2, 0, 2],
              rotateY: [-2, 0, -2],
            }}
            transition={{
              opacity: { duration: 0.8, ease: "easeOut" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
              rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
              rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Browser Chrome Frame */}
            <div className="bg-gray-900 rounded-t-2xl px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-800 rounded-lg px-4 py-1 flex items-center gap-2 max-w-[220px] w-full">
                  <div className="w-3 h-3 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-gray-400 truncate font-mono">snapform.ai/dashboard</span>
                </div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="bg-white rounded-b-2xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="p-5 space-y-4">
                {/* Header with branding */}
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                      <span className="text-white font-bold text-[10px] font-[family-name:var(--font-space-grotesk)]">
                        SF
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm font-[family-name:var(--font-space-grotesk)] text-gray-900">
                        Dashboard
                      </div>
                      <div className="text-[10px] text-gray-400">Welcome back, User</div>
                    </div>
                  </div>
                  <motion.button
                    className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Form
                  </motion.button>
                </motion.div>

                {/* Stats Grid — staggered scale-in */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Total Forms", value: "12", icon: "📋" },
                    { label: "Responses", value: "1.2k", icon: "💬" },
                    { label: "Completion", value: "94%", icon: "✅" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="rounded-xl border border-gray-100 p-3 bg-gray-50/50"
                      initial={{ opacity: 0, scale: 0.7, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 0.6 + i * 0.15,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className="text-sm mb-1">{stat.icon}</div>
                      <div className="font-bold font-[family-name:var(--font-space-grotesk)] text-lg text-gray-900 leading-tight">
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ── Enhanced Animated Chart ── */}
                <motion.div
                  className="rounded-xl border border-gray-100 p-4 bg-gray-50/50"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-700">Response Trends</span>
                      <motion.div
                        className="flex items-center gap-1 bg-green-50 text-green-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.6, duration: 0.3 }}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600" />
                        </span>
                        Live
                      </motion.div>
                    </div>
                    <motion.span
                      className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      +24.5%
                    </motion.span>
                  </div>

                  {/* Bar Chart + Line Chart Combo */}
                  <div className="mt-2 flex flex-col gap-3 w-full">
                    <div className="h-24 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 240 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#f59e0b" />
                          </linearGradient>
                          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[20, 40, 60].map((y) => (
                          <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
                        ))}

                        {/* Animated Bars */}
                        {[
                          { x: 8, h: 35 }, { x: 38, h: 48 }, { x: 68, h: 30 },
                          { x: 98, h: 55 }, { x: 128, h: 42 }, { x: 158, h: 62 },
                          { x: 188, h: 50 }, { x: 218, h: 68 },
                        ].map((bar, i) => (
                          <motion.rect
                            key={i}
                            x={bar.x}
                            width="16"
                            rx="3"
                            fill="url(#barGrad)"
                            initial={{ y: 80, height: 0 }}
                            animate={{ y: 80 - bar.h, height: bar.h }}
                            transition={{
                              delay: 1.3 + i * 0.08,
                              duration: 0.6,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          />
                        ))}

                        {/* Area fill under line */}
                        <motion.path
                          d="M16 55 Q 46 40 76 48 T 136 30 T 196 22 T 226 12 L226 80 L16 80 Z"
                          fill="url(#areaGrad)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.0, duration: 0.8 }}
                        />

                        {/* Animated Line overlay */}
                        <motion.path
                          d="M16 55 Q 46 40 76 48 T 136 30 T 196 22 T 226 12"
                          fill="none"
                          stroke="url(#lineGrad)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 1.8, duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* Data points on line */}
                        {[
                          { cx: 16, cy: 55 }, { cx: 76, cy: 48 },
                          { cx: 136, cy: 30 }, { cx: 196, cy: 22 }, { cx: 226, cy: 12 },
                        ].map((pt, i) => (
                          <motion.circle
                            key={i}
                            cx={pt.cx}
                            cy={pt.cy}
                            r="3.5"
                            fill="white"
                            stroke="#f97316"
                            strokeWidth="2"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2.3 + i * 0.12, duration: 0.3, ease: "backOut" }}
                          />
                        ))}

                        {/* Pulsing dot at latest point */}
                        <motion.circle
                          cx="226" cy="12" r="6"
                          fill="#f97316"
                          opacity="0.3"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ delay: 2.8, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </svg>
                    </div>

                    {/* Chart Legend */}
                    <div className="flex items-center justify-end gap-4">
                      <motion.div
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.6, duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="w-2 h-2 rounded-sm bg-indigo-500" />
                        <span className="text-[9px] text-gray-500 font-medium">Submissions</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.75, duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[9px] text-gray-500 font-medium">Completion Rate</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Form List — staggered slide from right */}
                <div className="space-y-1.5">
                  {[
                    { name: "Customer Feedback", status: "Live", responses: "342" },
                    { name: "Job Application", status: "Live", responses: "128" },
                    { name: "Event Registration", status: "Draft", responses: "—" },
                  ].map((form, i) => (
                    <motion.div
                      key={form.name}
                      className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2.5 bg-white hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 1.4 + i * 0.15,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${form.status === "Live" ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-sm text-gray-800 font-medium">{form.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400">{form.responses}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            form.status === "Live"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {form.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shadow/reflection under the screen */}
          <motion.div
            className="mx-auto mt-4 h-4 rounded-full bg-black/10 blur-xl"
            style={{ width: "70%" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0.3, 0.15, 0.3],
              scaleX: [0.9, 1, 0.9],
            }}
            transition={{
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
              scaleX: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
            }}
          />
        </div>
      </div>
    </div>
  );
}
