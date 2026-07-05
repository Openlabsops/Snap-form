import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";

/* ── SVG Icons ───────────────────────────────────────────────────── */

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16h.01" />
      <path d="M11 12h.01" />
      <path d="M15 8h.01" />
      <path d="M19 4h.01" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MoreHorizontalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-4 h-4"}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/* ── Mock Data ───────────────────────────────────────────────────── */

const MOCK_FORMS = [
  {
    id: "1",
    name: "Customer Feedback Survey",
    status: "published" as const,
    responses: 142,
    lastEdited: "2 hours ago",
  },
  {
    id: "2",
    name: "Job Application Form",
    status: "published" as const,
    responses: 89,
    lastEdited: "1 day ago",
  },
  {
    id: "3",
    name: "Event Registration",
    status: "draft" as const,
    responses: 0,
    lastEdited: "3 days ago",
  },
  {
    id: "4",
    name: "Product Feature Request",
    status: "published" as const,
    responses: 57,
    lastEdited: "5 days ago",
  },
  {
    id: "5",
    name: "Bug Report Template",
    status: "draft" as const,
    responses: 0,
    lastEdited: "1 week ago",
  },
];

const MOCK_ACTIVITY = [
  { text: "New response on Customer Feedback Survey", time: "2 min ago" },
  { text: "Job Application Form reached 89 responses", time: "1 hour ago" },
  { text: "Event Registration form saved as draft", time: "3 hours ago" },
  { text: "Product Feature Request form published", time: "Yesterday" },
];

/* ── Dashboard Page (Server Component) ───────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Top Nav ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-lg font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight"
            >
              Snap-Form
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm">
              <SettingsIcon className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-border flex items-center justify-center text-xs font-semibold text-primary">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Layout ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tight">
              Welcome back, John
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here&rsquo;s an overview of your forms and activity.
            </p>
          </div>
          <Button>
            <PlusIcon className="w-4 h-4" />
            Create Form
          </Button>
        </div>

        {/* ── Stats Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Forms", value: "5", change: "+2 this month", icon: FileTextIcon },
            { label: "Total Responses", value: "288", change: "+34 this week", icon: UsersIcon },
            { label: "Avg. Completion", value: "68.4%", change: "+2.1% vs last week", icon: BarChartIcon },
            { label: "Avg. Response Time", value: "2m 14s", change: "-12s vs last week", icon: ClockIcon },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Content Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forms List — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)]">
                Your Forms
              </h2>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {MOCK_FORMS.map((form) => (
                <Card key={form.id} className="group hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <FileTextIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium truncate">{form.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant={form.status === "published" ? "default" : "secondary"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {form.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {form.responses} responses
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {form.lastEdited}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon-xs">
                        <ExternalLinkIcon className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontalIcon className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar — Activity + Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <SparklesIcon className="w-3.5 h-3.5" />
                  Generate with AI
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <PlusIcon className="w-3.5 h-3.5" />
                  Blank Form
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <FileTextIcon className="w-3.5 h-3.5" />
                  Import Template
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Recent Activity</CardTitle>
                <CardDescription className="text-xs">
                  Latest updates across your forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs leading-relaxed">{item.text}</p>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
