"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/components/ui/tooltip";
import {
  Bell,
  ChevronRight,
  Star,
  StarHalf,
  ShoppingCart,
  Eye,
  GitBranch,
} from "lucide-react";

/* ── Mock Data ───────────────────────────────────────────────────── */

const MOCK_TEMPLATES: Record<string, any> = {
  "tpl-1": {
    id: "tpl-1",
    title: "E-Commerce Checkout Flow",
    description:
      "A highly optimized, multi-step checkout form designed for maximum conversion. Includes built-in field validation, address auto-complete integration ready, and stark minimalist styling that blends seamlessly into any modern storefront.",
    rating: 4.8,
    reviewsCount: 124,
    author: "Snap-Form Team",
    price: "$49",
    license: "Commercial Use",
    includes: "4 Steps, 18 Fields, Success State",
    // We don't have actual images, so we use structural placeholders 
    // that match the visual layout of the design
  }
};

export function TemplateDetailsPage({ templateId }: { templateId: string }) {
  const [activeTab, setActiveTab] = useState("templates");
  
  const template = MOCK_TEMPLATES[templateId];

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Template Not Found</h1>
          <p className="text-muted-foreground">The template you are looking for does not exist.</p>
          <Link href="/templates">
            <Button>Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                        layoutId="nav-indicator-templates-detail"
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
                      aria-label="Notifications"
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

        {/* ─── Main Content Canvas ───────────────────────────────── */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── Left Column: Preview & Flow ──────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <Link href="/templates" className="hover:text-foreground transition-colors">
                Templates
              </Link>
              <ChevronRight className="size-4" />
              <span className="text-foreground">{template.title}</span>
            </nav>

            {/* Main Preview Image Placeholder */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full border border-border bg-background p-2 rounded-lg"
            >
              <div className="w-full aspect-[4/3] bg-muted/30 border border-border rounded flex flex-col items-center justify-center text-muted-foreground gap-4">
                 <Eye className="size-12 opacity-20" />
                 <span className="text-sm font-medium opacity-50">Main Checkout Flow Mockup</span>
              </div>
            </motion.div>

            {/* User Flow Diagram Placeholder */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full border border-border bg-background rounded-lg flex flex-col overflow-hidden"
            >
              <div className="border-b border-border px-6 py-4 bg-muted/20 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Expected User Flow</h3>
                <GitBranch className="size-4 text-muted-foreground" />
              </div>
              <div className="p-2">
                <div className="w-full aspect-video bg-muted/30 border border-border rounded flex flex-col items-center justify-center text-muted-foreground gap-4">
                  <GitBranch className="size-10 opacity-20" />
                  <span className="text-sm font-medium opacity-50">User Flow Diagram Map</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right Column: Details & Actions ──────────────────── */}
          <motion.div 
             initial={{ opacity: 0, y: 16 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
             className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Header Info */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)] tracking-tight">
                {template.title}
              </h1>
              
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <div className="flex items-center text-foreground">
                  {Array.from({ length: 5 }).map((_, i) => {
                    if (i < Math.floor(template.rating)) {
                      return <Star key={i} className="size-4 fill-current" />;
                    }
                    if (i === Math.floor(template.rating) && template.rating % 1 >= 0.5) {
                      return <StarHalf key={i} className="size-4 fill-current" />;
                    }
                    return <Star key={i} className="size-4 text-muted opacity-30" />;
                  })}
                  <span className="text-sm font-medium ml-2">
                    {template.rating} ({template.reviewsCount} reviews)
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  By {template.author}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed">
              {template.description}
            </p>

            {/* Details Box */}
            <div className="flex flex-col gap-4 bg-muted/20 border border-border p-6 rounded-lg">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-sm font-semibold text-foreground">License</span>
                <span className="text-sm text-muted-foreground">{template.license}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-sm font-semibold text-foreground">Includes</span>
                <span className="text-sm text-muted-foreground">{template.includes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">Price</span>
                <span className="text-2xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)] tracking-tight">
                  {template.price}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-2">
              <Button size="lg" className="w-full text-base gap-2 h-14">
                <ShoppingCart className="size-5" />
                Purchase Template
              </Button>
              <Button variant="outline" size="lg" className="w-full text-base gap-2 h-14">
                <Eye className="size-5" />
                Live Preview
              </Button>
            </div>
          </motion.div>

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
