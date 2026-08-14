"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/components/ui/tooltip";
import {
  Bell,
  HelpCircle,
  Search,
  ImagePlus,
  Rocket,
  Menu,
} from "lucide-react";

/* ── Mock Data ───────────────────────────────────────────────────── */

const MOCK_FORMS = [
  {
    id: "form-1",
    title: "Q3 Customer Feedback",
    category: "Feedback",
    lastEdited: "Last edited 2 days ago",
    fields: "14 fields",
  },
  {
    id: "form-2",
    title: "Tech Meetup Registration",
    category: "Registration",
    lastEdited: "Last edited 1 week ago",
    fields: "8 fields",
  },
];

export function TemplateCreatePage() {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedFormId, setSelectedFormId] = useState<string>("form-1");
  const [pricingType, setPricingType] = useState<"free" | "commercial">("free");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredForms = MOCK_FORMS.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    form.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground">
        {/* ─── Top Navigation ────────────────────────────────────── */}
        <nav className="border-b border-border bg-background sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
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
                        layoutId="nav-indicator-create-template"
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
              
              {/* Mobile Navigation */}
              <div className="md:hidden relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <Menu className="size-5 text-foreground" />
                </Button>
                {mobileMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50 flex flex-col">
                    <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Dashboard</Link>
                    <Link href="/templates" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Templates</Link>
                  </div>
                )}
              </div>
            </div>

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

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label="Help"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    />
                  }
                >
                  <HelpCircle className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Help</TooltipContent>
              </Tooltip>

              <Button className="hidden md:flex">Create Form</Button>
              <Button variant="outline" className="hidden md:flex">
                Sign Out
              </Button>

              <Avatar className="size-8 border border-border ml-1">
                <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
                  U
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </nav>

        {/* ─── Main Content ──────────────────────────────────────── */}
        <main className="flex-1 w-full flex justify-center py-16 px-4 sm:px-8">
          <div className="w-full max-w-3xl flex flex-col gap-8">
            
            {/* Page Header */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)] tracking-tight">
                Publish as Template
              </h1>
              <p className="text-muted-foreground text-base">
                Share your logic and layout with the Snap-Form community.
              </p>
            </motion.div>

            {/* Content Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background border border-border rounded-xl p-8 flex flex-col gap-12"
            >
              {/* Section 1: Select Form */}
              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold text-foreground font-[family-name:var(--font-space-grotesk)]">
                    1. Select Form
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose an existing form from your workspace to use as the blueprint.
                  </p>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Search your forms..." 
                    className="pl-10 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  role="radiogroup"
                  aria-label="Select form"
                >
                  {filteredForms.length > 0 ? (
                    filteredForms.map((form) => (
                      <button
                        type="button"
                        key={form.id}
                        role="radio"
                        aria-checked={selectedFormId === form.id}
                        onClick={() => setSelectedFormId(form.id)}
                        className={`relative rounded-md p-4 cursor-pointer transition-colors border-2 text-left w-full ${
                          selectedFormId === form.id
                            ? "border-foreground bg-background"
                            : "border-border hover:border-foreground/50 bg-background"
                        }`}
                      >
                        {/* Radio dot indicator */}
                        <div 
                          className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedFormId === form.id 
                              ? "border-foreground bg-foreground" 
                              : "border-muted-foreground"
                          }`}
                        >
                          {selectedFormId === form.id && (
                            <div className="w-1.5 h-1.5 bg-background rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 pr-6">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            {form.category}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {form.title}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {form.lastEdited} • {form.fields}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-md">
                      No matching forms found. Try a different search term.
                    </div>
                  )}
                </div>
              </section>

              {/* Section 2: Template Details */}
              <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold text-foreground font-[family-name:var(--font-space-grotesk)]">
                    2. Template Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    How will the community discover and understand this template?
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="template-name" className="text-sm font-semibold text-foreground">
                      Template Name
                    </label>
                    <Input 
                      id="template-name" 
                      type="text" 
                      defaultValue="Q3 Customer Feedback" 
                      className="h-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-foreground">
                        Category
                      </label>
                      <Select defaultValue="feedback" onValueChange={() => {}}>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectPopup>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="registration">Registration</SelectItem>
                          <SelectItem value="internal">Internal Tools</SelectItem>
                        </SelectPopup>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="tags" className="text-sm font-semibold text-foreground">
                        Tags (Comma separated)
                      </label>
                      <Input 
                        id="tags" 
                        type="text" 
                        placeholder="e.g. nps, saas, b2b" 
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-sm font-semibold text-foreground">
                      Description
                    </label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the purpose of this form, the logic used, and who it's for..." 
                      className="min-h-[100px] resize-y"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Visuals */}
              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold text-foreground font-[family-name:var(--font-space-grotesk)]">
                    3. Visuals
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Upload a preview thumbnail to showcase your form's design.
                  </p>
                </div>

                <div className="border border-dashed border-border hover:border-muted-foreground transition-colors bg-muted/20 rounded-md p-8 flex flex-col items-center justify-center gap-4 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                    <ImagePlus className="size-5" />
                  </div>
                  <div className="text-center flex flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-sm text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 4: Distribution */}
              <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold text-foreground font-[family-name:var(--font-space-grotesk)]">
                    4. Distribution
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Set the terms for how others can access this template.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Pricing Toggle */}
                  <div className="flex bg-muted/30 p-1 rounded-md border border-border self-start">
                    <button 
                      onClick={() => setPricingType("free")}
                      className={`px-6 py-2 rounded-sm text-sm font-semibold transition-all ${
                        pricingType === "free"
                          ? "bg-background border border-border text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Free
                    </button>
                    <button 
                      onClick={() => setPricingType("commercial")}
                      className={`px-6 py-2 rounded-sm text-sm font-semibold transition-all ${
                        pricingType === "commercial"
                          ? "bg-background border border-border text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Commercial
                    </button>
                  </div>

                  {/* Price Input */}
                  <div className={`flex-1 flex flex-col gap-2 transition-opacity ${
                    pricingType === "free" ? "opacity-50 pointer-events-none" : "opacity-100"
                  }`}>
                    <label htmlFor="price" className="text-sm font-semibold text-foreground">
                      Price (USD)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                        $
                      </div>
                      <Input 
                        key={pricingType}
                        id="price" 
                        type="number" 
                        disabled={pricingType === "free"}
                        defaultValue={pricingType === "free" ? 0 : 49}
                        className="pl-7 h-10 disabled:bg-muted/30 disabled:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-t border-border w-full" />

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-4">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-6 text-base">
                  Cancel
                </Button>
                <Button size="lg" className="w-full sm:w-auto h-12 px-6 gap-2 text-base">
                  Publish to Community
                  <Rocket className="size-5" />
                </Button>
              </div>

            </motion.div>
          </div>
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
