"use client";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
          <Button variant="ghost" size="sm" render={<a href="#get-started" />}>
            Sign In
          </Button>
          <Button size="sm" render={<a href="#get-started" />}>
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
