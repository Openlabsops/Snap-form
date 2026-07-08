"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
} from "@repo/ui/components/ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/components/ui/tooltip";
import {
  Bell,
  Sparkles,
  LayoutGrid,
  List,
  Plus,
  Eye,
  MessageSquare,
  MoreVertical,
  Compass,
  Mail,
  CalendarCheck,
  Bug,
} from "lucide-react";

/* ── Mock Data ───────────────────────────────────────────────────── */

const MOCK_FORMS = [
  {
    id: "1",
    title: "Customer Feedback Survey",
    status: "published" as const,
    views: "1.2k",
    responses: "342",
    updatedAt: "Updated 2d ago",
    preview: "feedback",
  },
  {
    id: "2",
    title: "Q3 Event Registration",
    status: "draft" as const,
    views: null,
    responses: null,
    updatedAt: "Updated just now",
    preview: "event",
  },
  {
    id: "3",
    title: "Employee Onboarding Flow",
    status: "published" as const,
    views: "4.5k",
    responses: "1.2k",
    updatedAt: null,
    conversion: 26,
    preview: "onboarding",
    span: true,
  },
  {
    id: "4",
    title: "Lead Capture - Homepage",
    status: "published" as const,
    views: null,
    responses: null,
    updatedAt: "Updated 1w ago",
    preview: "leadcapture",
  },
];

const MOCK_TEMPLATES = [
  { id: "1", title: "Contact Us Minimal", icon: Mail },
  { id: "2", title: "Event RSVP", icon: CalendarCheck },
  { id: "3", title: "Bug Tracker", icon: Bug },
];

/* ── Miniature Form Preview ──────────────────────────────────────── */

function FormPreview({ type }: { type: string }) {
  if (type === "feedback") {
    return (
      <div className="flex-grow mt-4 mb-4 border border-border bg-muted/30 relative flex flex-col p-2 gap-2 overflow-hidden">
        <div className="h-2 bg-border rounded w-1/3" />
        <div className="h-6 border border-border bg-background rounded w-full" />
        <div className="h-2 bg-border rounded w-1/4 mt-1" />
        <div className="h-6 border border-border bg-background rounded w-full" />
        <div className="h-2 bg-border rounded w-1/2 mt-1" />
        <div className="h-14 border border-border bg-background rounded w-full" />
      </div>
    );
  }
  if (type === "event") {
    return (
      <div className="flex-grow mt-4 mb-4 border border-border bg-muted/30 relative flex flex-col p-2 gap-2 overflow-hidden">
        <div className="h-3 bg-border rounded w-1/2" />
        <div className="h-8 border border-border bg-background rounded w-full" />
        <div className="flex gap-2 w-full">
          <div className="h-8 border border-border bg-background rounded w-1/2" />
          <div className="h-8 border border-border bg-background rounded w-1/2" />
        </div>
      </div>
    );
  }
  if (type === "onboarding") {
    return (
      <div className="flex-grow mt-4 mb-4 border border-border bg-muted/30 relative flex flex-col p-4 gap-3 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full border border-border" />
          <div className="h-2 bg-border rounded w-24" />
        </div>
        <div className="h-10 border border-border bg-background rounded w-full" />
        <div className="h-10 border border-border bg-background rounded w-full" />
        <div className="h-10 border border-border bg-background rounded w-full" />
        <div className="h-px bg-border w-full my-1" />
        <div className="h-2 bg-border rounded w-1/3" />
        <div className="flex gap-2">
          <div className="h-4 w-4 border border-border bg-background rounded" />
          <div className="h-2 bg-border rounded w-16 mt-1" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-4 border border-border bg-background rounded" />
          <div className="h-2 bg-border rounded w-20 mt-1" />
        </div>
      </div>
    );
  }
  // leadcapture
  return (
    <div className="flex-grow mt-4 mb-4 border border-border bg-muted/30 relative flex items-center justify-center p-2">
      <div className="h-24 w-3/4 border border-border bg-background rounded flex flex-col justify-center items-center gap-2 p-2 shadow-sm">
        <div className="h-2 bg-border rounded w-1/2" />
        <div className="h-6 border border-border bg-background rounded w-full" />
        <div className="h-6 bg-foreground rounded w-full mt-1" />
      </div>
    </div>
  );
}

/* ── Main Dashboard Component ────────────────────────────────────── */

export function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [aiPrompt, setAiPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground">
        {/* ─── Top Navigation ────────────────────────────────────── */}
        <nav className="border-b border-border bg-background sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
            {/* Left: Logo + Tabs */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="font-bold text-lg font-[family-name:var(--font-space-grotesk)] text-foreground"
              >
                Snap-Form
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {[
                  { id: "dashboard", label: "Dashboard" },
                  { id: "templates", label: "Templates" },
                  { id: "settings", label: "Settings" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3 py-[18px] text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button variant="ghost" size="icon" className="text-muted-foreground" />
                  }
                >
                  <Bell className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              <Avatar className="size-8 border border-border">
                <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
                  U
                </AvatarFallback>
              </Avatar>

              <Button className="hidden md:flex" size="sm">
                Create Form
              </Button>
            </div>
          </div>
        </nav>

        {/* ─── Main Content ──────────────────────────────────────── */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16 flex flex-col items-center">
          {/* ── AI Prompt Section ─────────────────────────────────── */}
          <motion.div
            className="w-full max-w-2xl mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative group w-full">
              <input
                aria-label="What do you need to collect?"
                className="w-full h-14 pl-6 pr-36 text-base rounded-full border border-border bg-background shadow-sm hover:border-foreground/30 transition-colors focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 text-foreground placeholder:text-muted-foreground"
                placeholder="What do you need to collect?"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full px-5"
                size="sm"
              >
                Generate
                <Sparkles className="size-3.5" />
              </Button>
            </div>
          </motion.div>

          <Separator className="mb-10" />

          {/* ── Your Forms Section ────────────────────────────────── */}
          <motion.section
            className="w-full mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-semibold font-[family-name:var(--font-space-grotesk)] text-foreground">
                  Your Forms
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Published and non-published
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "outline" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "outline" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[240px]">
              {MOCK_FORMS.map((form, i) => (
                <motion.div
                  key={form.id}
                  className={`group border border-border hover:border-foreground/30 rounded-xl p-5 flex flex-col justify-between cursor-pointer bg-background relative overflow-hidden transition-colors ${
                    form.span ? "lg:row-span-2" : ""
                  }`}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -2 }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground mb-1.5">
                        {form.title}
                      </h3>
                      <Badge
                        variant={form.status === "published" ? "default" : "outline"}
                        size="sm"
                        className="gap-1"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full inline-block ${
                            form.status === "published"
                              ? "bg-primary-foreground"
                              : "bg-muted-foreground"
                          }`}
                        />
                        {form.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                      <MoreVertical className="size-4" />
                    </button>
                  </div>

                  {/* Preview */}
                  <FormPreview type={form.preview} />

                  {/* Footer */}
                  <div className="z-10">
                    {form.conversion != null ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-muted-foreground text-xs">
                          <span className="flex items-center gap-1">
                            <Eye className="size-3" />
                            {form.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="size-3" />
                            {form.responses}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-foreground rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${form.conversion}%` }}
                            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-muted-foreground text-[10px] text-right">
                          {form.conversion}% Conversion
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-muted-foreground text-xs">
                        {form.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="size-3" />
                            {form.views}
                          </span>
                        )}
                        {form.responses && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="size-3" />
                            {form.responses}
                          </span>
                        )}
                        {form.updatedAt && (
                          <span>{form.updatedAt}</span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* View All Forms Card */}
              <motion.div
                className="border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center mb-3 group-hover:border-foreground/30 transition-colors">
                  <Plus className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  View All Forms
                </span>
              </motion.div>
            </div>
          </motion.section>

          <Separator className="mb-10" />

          {/* ── Templates Section ─────────────────────────────────── */}
          <motion.section
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-semibold font-[family-name:var(--font-space-grotesk)] text-foreground">
                  Templates
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Owned and published templates
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {MOCK_TEMPLATES.map((template, i) => {
                const IconComponent = template.icon;
                return (
                  <motion.div
                    key={template.id}
                    className="border border-border hover:border-foreground/30 rounded-xl group cursor-pointer bg-background aspect-square flex flex-col p-4 transition-colors"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex-grow border border-border bg-muted/30 rounded-lg mb-4 flex items-center justify-center">
                      <IconComponent className="size-10 text-border group-hover:text-foreground transition-colors" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">
                      {template.title}
                    </h3>
                  </motion.div>
                );
              })}

              {/* Browse Templates Card */}
              <motion.div
                className="border border-dashed border-border rounded-xl group cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors aspect-square flex flex-col items-center justify-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center mb-3 group-hover:border-foreground/30 transition-colors">
                  <Compass className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">
                  Browse Templates
                </h3>
              </motion.div>
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline">Show More</Button>
            </div>
          </motion.section>
        </main>

        {/* ─── Footer ────────────────────────────────────────────── */}
        <footer className="border-t border-border mt-auto py-8 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Snap-Form Inc.
            </span>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Support", "API"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
