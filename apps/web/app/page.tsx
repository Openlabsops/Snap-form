import Link from "next/link";
import {
  Card,
  CardContent,
} from "@repo/ui/components/ui/card";
import { Navbar, HeroSection } from "./_components/navbar-hero";
import { AuthCard } from "./_components/auth-card";

/* ── SVG Icons (static, no interactivity needed) ─────────────────── */

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

function BranchIcon({ className }: { className?: string }) {
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
      <path d="M6 3v12" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
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
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ── Main Page (Server Component) ────────────────────────────────── */

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* ─── Navbar (Client) ────────────────────────────────────── */}
      <Navbar />

      {/* ─── Main Content ───────────────────────────────────────── */}
      <main className="flex-grow pt-16">
        {/* ── Hero Section (Client) ─────────────────────────────── */}
        <HeroSection />

        {/* ── Social Proof ───────────────────────────────────────── */}
        <section className="w-full py-12 border-y border-border bg-accent/30">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-8">
              Trusted by engineering teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-300">
              {[
                { name: "TechCorp", icon: "⚡" },
                { name: "NeuroSys", icon: "🧠" },
                { name: "BuildKite", icon: "🔧" },
                { name: "DataFlow", icon: "📊" },
              ].map((company) => (
                <div
                  key={company.name}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <span className="text-xl">{company.icon}</span>
                  <span className="font-semibold font-[family-name:var(--font-space-grotesk)] text-base">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Bento Grid ────────────────────────────────── */}
        <section
          id="features"
          className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28 scroll-mt-20"
        >
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight">
              Engineered for speed.
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Stop dragging and dropping. Start prompting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feature 1 — AI Generation */}
            <Card className="group hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-8 flex flex-col gap-6 h-full">
                <div className="w-12 h-12 rounded-xl border border-border bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold font-[family-name:var(--font-space-grotesk)] text-lg mb-2">
                    AI Generation
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Translate complex natural language requirements into strict
                    JSON schemas and rendering logic instantly.
                  </p>
                </div>
                <div className="mt-auto pt-6 border-t border-border">
                  <span className="inline-flex items-center text-sm font-medium text-foreground cursor-pointer hover:underline">
                    Explore syntax
                    <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 — Logic Mapping */}
            <Card className="group hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-8 flex flex-col gap-6 h-full">
                <div className="w-12 h-12 rounded-xl border border-border bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                  <BranchIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold font-[family-name:var(--font-space-grotesk)] text-lg mb-2">
                    Logic Mapping
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Visual representation of branching paths and validation
                    rules, rendered with stark clarity.
                  </p>
                </div>
                <div className="mt-auto pt-6 border-t border-border w-full h-24 bg-accent/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <BranchIcon className="w-16 h-16 text-border absolute" />
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 — Analytics */}
            <Card className="group hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-8 flex flex-col gap-6 h-full">
                <div className="w-12 h-12 rounded-xl border border-border bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                  <ChartIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold font-[family-name:var(--font-space-grotesk)] text-lg mb-2">
                    High-Density Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Raw performance data. No fluff. Track conversion rates,
                    drop-offs, and interaction times at the field level.
                  </p>
                </div>
                <div className="mt-auto flex flex-col gap-2">
                  <div className="w-full flex justify-between items-center border-b border-border py-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      /api/v1/submit
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      12ms
                    </span>
                  </div>
                  <div className="w-full flex justify-between items-center border-b border-border py-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      Conversion
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      68.4%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="w-full bg-accent/30 border-y border-border py-20 md:py-28 scroll-mt-20"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight">
                Three steps. Zero friction.
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">
                From idea to production-ready form in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Describe",
                  desc: "Write your form requirements in plain English. Include validation rules, branching logic, and field types.",
                },
                {
                  step: "02",
                  title: "Generate",
                  desc: "Our AI engine converts your description into a production-ready form with proper schema validation.",
                },
                {
                  step: "03",
                  title: "Deploy",
                  desc: "Share a link, embed in your app, or export the schema. Get real-time analytics on every submission.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col gap-4">
                  <span className="font-mono text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Step {item.step}
                  </span>
                  <h3 className="font-semibold font-[family-name:var(--font-space-grotesk)] text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Get Started / Auth Section ─────────────────────────── */}
        <section
          id="get-started"
          className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center scroll-mt-20"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight">
              Start building today.
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Sign in to create your first form in seconds.
            </p>
          </div>

          {/* Auth Card (Client) */}
          <AuthCard />
        </section>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="w-full border-t border-border bg-background mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold font-[family-name:var(--font-space-grotesk)] text-sm">
              Snap-Form
            </span>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Snap-Form AI. Precision Engineered.
            </span>
          </div>
          <div className="flex gap-6">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Support", href: "/support" },
              { label: "API", href: "/api-docs" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
