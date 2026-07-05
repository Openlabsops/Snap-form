"use client";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center text-center pt-20 md:pt-32 pb-16 md:pb-24 px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-accent/50 text-sm text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-foreground" />
        <span>AI-native form builder</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-[-0.03em] leading-[1.1] max-w-4xl">
        Forms at the speed
        <br />
        of thought.
      </h1>

      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
        The AI-native form builder for technical teams. Describe your logic, and
        let the engine generate production-ready interfaces instantly.
      </p>

      {/* AI Prompt Pill */}
      <div className="w-full max-w-2xl mt-10 relative group">
        <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors duration-500 rounded-full" />
        <a
          href="#get-started"
          className="relative flex items-center bg-background border border-border rounded-full p-1.5 shadow-sm transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background cursor-pointer"
        >
          <Sparkles className="ml-4 mr-2 text-muted-foreground w-5 h-5 shrink-0" />
          <span className="flex-grow text-left text-muted-foreground text-base h-11 flex items-center select-none">
            Describe your form...
          </span>
          <Button
            className="rounded-full h-10 px-6 shrink-0 pointer-events-none"
            tabIndex={-1}
            aria-hidden
          >
            Generate
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </a>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button variant="outline" size="lg" render={<a href="#get-started" />}>
          Get Started
        </Button>
      </div>
    </section>
  );
}
