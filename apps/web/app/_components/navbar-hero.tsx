"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";

/* ── SVG Icons ───────────────────────────────────────────────────── */

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "w-4 h-4"}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "w-5 h-5"}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

/* ── Helper ──────────────────────────────────────────────────────── */

function scrollToGetStarted() {
  document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
}

/* ── Navbar ──────────────────────────────────────────────────────── */

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight"
          >
            Snap-Form
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#features"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              How It Works
            </a>
            <a
              href="#get-started"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              Get Started
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={scrollToGetStarted}>
            Sign In
          </Button>
          <Button size="sm" onClick={scrollToGetStarted}>
            Get Started
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ── Hero Section ────────────────────────────────────────────────── */

export function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center text-center pt-20 md:pt-32 pb-16 md:pb-24 px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-accent/50 text-sm text-muted-foreground">
        <SparklesIcon className="w-3.5 h-3.5 text-foreground" />
        <span>AI-native form builder</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-[-0.03em] leading-[1.1] max-w-4xl">
        Forms at the speed
        <br />
        of thought.
      </h1>

      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
        The AI-native form builder for technical teams. Describe your logic,
        and let the engine generate production-ready interfaces instantly.
      </p>

      {/* AI Prompt Pill (decorative teaser) */}
      <div className="w-full max-w-2xl mt-10 relative group">
        <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors duration-500 rounded-full" />
        <div
          role="button"
          tabIndex={0}
          onClick={scrollToGetStarted}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") scrollToGetStarted();
          }}
          className="relative flex items-center bg-background border border-border rounded-full p-1.5 shadow-sm cursor-pointer transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background"
        >
          <SparklesIcon className="ml-4 mr-2 text-muted-foreground w-5 h-5 shrink-0" />
          <span className="flex-grow text-muted-foreground text-base h-11 flex items-center select-none">
            Describe your form...
          </span>
          <Button
            className="rounded-full h-10 px-6 shrink-0 pointer-events-none"
            tabIndex={-1}
            aria-hidden
          >
            Generate
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button variant="outline" size="lg" onClick={scrollToGetStarted}>
          Get Started
        </Button>
        <Button
          variant="ghost"
          size="lg"
          render={<Link href="/dashboard" />}
        >
          Open Dashboard
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Button>
      </div>
    </section>
  );
}
