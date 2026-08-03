"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Input } from "@repo/ui/components/ui/input";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@repo/ui/components/ui/select";
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
  Search,
  Star,
  Copy,
  ArrowRight,
  Megaphone,
  MessageSquareText,
  UserCheck,
  Headset,
  FileText,
  MoreVertical,
} from "lucide-react";

/* ── Types ───────────────────────────────────────────────────────── */

type TemplateCategory = "marketing" | "feedback" | "registration" | "internal";

type CommunityTemplate = {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  icon: typeof Megaphone;
  featured: boolean;
  copies?: string;
  rating?: number;
  author: string;
  authorInitials: string;
};

type OwnedTemplate = {
  id: string;
  title: string;
  status: "active" | "draft";
  lastEdited: string;
};

/* ── Mock Data ───────────────────────────────────────────────────── */

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "marketing", label: "Marketing" },
  { value: "feedback", label: "Feedback" },
  { value: "registration", label: "Registration" },
  { value: "internal", label: "Internal" },
];

const COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    id: "tpl-1",
    title: "Comprehensive Lead Capture",
    description:
      "A multi-step form optimized for conversion, featuring progressive profiling, dynamic conditional logic fields, and integrated calendar booking functionality. Ideal for high-ticket B2B services.",
    category: "marketing",
    icon: Megaphone,
    featured: true,
    copies: "12.4k",
    author: "Snap-Form",
    authorInitials: "SF",
  },
  {
    id: "tpl-2",
    title: "Post-Event Survey",
    description:
      "Gather actionable insights from attendees with NPS scoring and open-ended feedback.",
    category: "feedback",
    icon: MessageSquareText,
    featured: false,
    rating: 4.8,
    author: "FormLabs",
    authorInitials: "FL",
  },
  {
    id: "tpl-3",
    title: "Webinar Signup",
    description:
      "Simple registration flow integrated directly with major webinar platforms and CRM systems.",
    category: "registration",
    icon: UserCheck,
    featured: false,
    rating: 4.5,
    author: "EventPro",
    authorInitials: "EP",
  },
  {
    id: "tpl-4",
    title: "IT Support Request",
    description:
      "Structured internal ticketing form to gather necessary hardware/software details upfront.",
    category: "internal",
    icon: Headset,
    featured: false,
    rating: 4.9,
    author: "TechOps",
    authorInitials: "TO",
  },
  {
    id: "tpl-5",
    title: "Product Feedback Loop",
    description:
      "Collect structured feature requests and bug reports with priority scoring and screenshots.",
    category: "feedback",
    icon: MessageSquareText,
    featured: false,
    rating: 4.7,
    author: "BuilderIO",
    authorInitials: "BI",
  },
  {
    id: "tpl-6",
    title: "Newsletter Subscription",
    description:
      "Minimal, high-converting signup form with preference center and double opt-in flow.",
    category: "marketing",
    icon: Megaphone,
    featured: false,
    rating: 4.6,
    author: "GrowthKit",
    authorInitials: "GK",
  },
];

const OWNED_TEMPLATES: OwnedTemplate[] = [
  {
    id: "own-1",
    title: "Q3 Customer Survey",
    status: "active",
    lastEdited: "Last edited 2 days ago",
  },
  {
    id: "own-2",
    title: "Internal Onboarding",
    status: "draft",
    lastEdited: "Draft created 1 week ago",
  },
  {
    id: "own-3",
    title: "Feature Request Portal",
    status: "active",
    lastEdited: "Last edited 1 month ago",
  },
];

/* ── Main Templates Page Component ───────────────────────────────── */

export function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* ── Filtered Templates ─────────────────────────────────────── */
  const filteredTemplates = useMemo(() => {
    return COMMUNITY_TEMPLATES.filter((tpl) => {
      const matchesSearch =
        !searchQuery ||
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || tpl.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
                  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
                  { id: "templates", label: "Templates", href: "/templates" },
                  { id: "settings", label: "Settings", href: "#" },
                ].map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
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
                        layoutId="nav-indicator-templates"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    />
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
            </div>
          </div>
        </nav>

        {/* ─── Main Content ──────────────────────────────────────── */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-12">
          {/* ── Templates Gallery (Community) ─────────────────────── */}
          <section className="flex flex-col gap-6">
            {/* Section Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-2"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight font-[family-name:var(--font-space-grotesk)]">
                  Templates Gallery
                </h1>
                <p className="text-sm text-muted-foreground">
                  Discover and duplicate high-converting forms created by the
                  community.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
              >
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="pl-9"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value ?? "all")}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectPopup>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              </motion.div>
            </div>

            {/* Bento Grid - Public Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((tpl, i) => {
                const Icon = tpl.icon;
                return (
                  <motion.article
                    key={tpl.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`bg-background border border-border rounded-lg flex flex-col hover:border-foreground/30 transition-colors group cursor-pointer overflow-hidden ${
                      tpl.featured ? "lg:col-span-2 row-span-1" : ""
                    }`}
                  >
                    {/* Icon Banner */}
                    <div className="h-32 bg-muted/30 border-b border-border flex items-center justify-center">
                      <Icon className="size-9 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge
                            variant="outline"
                            className="mb-2 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground"
                          >
                            {tpl.category}
                          </Badge>
                          <h3
                            className={`font-semibold text-foreground group-hover:text-foreground/80 transition-colors ${
                              tpl.featured ? "text-lg" : "text-sm"
                            }`}
                          >
                            {tpl.title}
                          </h3>
                        </div>
                        {tpl.copies && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border shrink-0">
                            <Copy className="size-3" />
                            {tpl.copies}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground flex-grow line-clamp-3">
                        {tpl.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        {tpl.featured ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                              {tpl.authorInitials}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                              By {tpl.author}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs font-medium flex items-center gap-1">
                            <Star className="size-3.5 fill-current" />
                            {tpl.rating}
                          </span>
                        )}

                        {tpl.featured ? (
                          <Button size="sm" aria-label={`Use ${tpl.title} Template`}>
                            Use Template
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            aria-label={`Preview ${tpl.title}`}
                          >
                            Preview
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}

              {/* "Explore More" CTA Card */}
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.15 + filteredTemplates.length * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-muted/20 border border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-foreground/30 transition-colors cursor-pointer min-h-[280px] p-6 text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors">
                  <ArrowRight className="size-5 text-muted-foreground group-hover:text-background transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Explore 200+ Templates
                </h3>
                <p className="text-sm text-muted-foreground">
                  Browse the full community library
                </p>
              </motion.article>

              {/* Empty state when no results */}
              {filteredTemplates.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                >
                  <Search className="size-10 text-muted-foreground/40 mb-4" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    No templates found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or category filter.
                  </p>
                </motion.div>
              )}
            </div>
          </section>

          {/* ── Divider ───────────────────────────────────────────── */}
          <Separator />

          {/* ── Owned Templates ────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Owned by You
              </h2>
              <Badge variant="outline" className="font-mono text-xs">
                {OWNED_TEMPLATES.length} items
              </Badge>
            </div>

            {/* Owned Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {OWNED_TEMPLATES.map((tpl, i) => (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.55 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="bg-background border border-border rounded-lg p-5 flex flex-col gap-4 relative hover:border-foreground/30 transition-colors group"
                >
                  {/* Status Dot */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <span
                            className={`w-2 h-2 rounded-full ${
                              tpl.status === "active"
                                ? "bg-emerald-500"
                                : "bg-muted-foreground/40"
                            }`}
                          />
                        }
                      />
                      <TooltipContent>
                        {tpl.status === "active" ? "Active" : "Draft"}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-muted/30 border border-border flex items-center justify-center">
                    <FileText className="size-5 text-muted-foreground" />
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {tpl.lastEdited}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      render={
                        <Link href={`/forms/${tpl.id}/edit`} />
                      }
                    >
                      Edit Form
                    </Button>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground size-8"
                            aria-label={`More options for ${tpl.title}`}
                          />
                        }
                      >
                        <MoreVertical className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent>More options</TooltipContent>
                    </Tooltip>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </main>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="bg-background w-full py-8 border-t border-border mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 lg:px-8 max-w-7xl mx-auto gap-4">
            <span className="text-sm text-muted-foreground">
              © 2024 Snap-Form Inc.
            </span>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Support", "API"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
