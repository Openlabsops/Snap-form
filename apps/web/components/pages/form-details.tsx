"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@repo/ui/components/ui/table";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
} from "@repo/ui/components/ui/avatar";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Braces,
  Pencil,
  Eye,
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  Copy,
  ExternalLink,
} from "lucide-react";

/* ── Mock Data ───────────────────────────────────────────────────── */

const MOCK_FORM = {
  id: "FRM-892X",
  title: "Q3 Customer Feedback Survey",
  description:
    "Collecting quarterly sentiment from enterprise clients regarding the new dashboard rollout.",
  status: "active" as const,
  createdAt: "Sep 15, 2025",
  totalResponses: 1248,
  completionRate: 87.3,
  avgTime: "2m 14s",
  npsScore: 42,
};

const MOCK_RESPONSES = [
  {
    id: "r1",
    date: "Oct 24, 09:12 AM",
    respondent: "user_8829@acme.co",
    rating: 9,
    status: "complete" as const,
  },
  {
    id: "r2",
    date: "Oct 24, 08:45 AM",
    respondent: "anonymous",
    rating: 7,
    status: "complete" as const,
  },
  {
    id: "r3",
    date: "Oct 23, 04:20 PM",
    respondent: "contact@globex.io",
    rating: 10,
    status: "complete" as const,
  },
  {
    id: "r4",
    date: "Oct 23, 02:05 PM",
    respondent: "sarah.j@stark.com",
    rating: 4,
    status: "complete" as const,
  },
  {
    id: "r5",
    date: "Oct 22, 11:30 AM",
    respondent: "mike.chen@wayne.co",
    rating: 8,
    status: "complete" as const,
  },
  {
    id: "r6",
    date: "Oct 22, 09:15 AM",
    respondent: "info@umbrella.corp",
    rating: 6,
    status: "partial" as const,
  },
  {
    id: "r7",
    date: "Oct 21, 03:45 PM",
    respondent: "alex.dev@initech.io",
    rating: 9,
    status: "complete" as const,
  },
  {
    id: "r8",
    date: "Oct 21, 01:20 PM",
    respondent: "anonymous",
    rating: 5,
    status: "complete" as const,
  },
];

/* ── Stat Card ───────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: typeof BarChart3;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="border border-border rounded-lg p-6 bg-background"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="text-4xl font-bold text-foreground tracking-tight font-[family-name:var(--font-space-grotesk)]">
        {value}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {subtitle}
      </div>
    </motion.div>
  );
}

/* ── Main Form Details Component ─────────────────────────────────── */

export function FormDetailsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const responsesPerPage = 5;
  const totalPages = Math.ceil(MOCK_RESPONSES.length / responsesPerPage);
  const paginatedResponses = MOCK_RESPONSES.slice(
    (currentPage - 1) * responsesPerPage,
    currentPage * responsesPerPage
  );

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground">
        {/* ─── Top Navigation ────────────────────────────────────── */}
        <nav className="border-b border-border bg-background sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
            {/* Left: Logo + Back */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="font-bold text-lg font-[family-name:var(--font-space-grotesk)] text-foreground"
              >
                Snap-Form
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
                All Forms
              </Link>
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

        {/* ─── Form Header ───────────────────────────────────────── */}
        <div className="border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              {/* Title & Meta */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    ID: {MOCK_FORM.id}
                  </span>
                  <Badge
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                  >
                    <span className="size-1.5 rounded-full bg-foreground inline-block" />
                    Active
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight font-[family-name:var(--font-space-grotesk)]">
                  {MOCK_FORM.title}
                </h1>
                <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                  {MOCK_FORM.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button variant="outline" size="sm" className="gap-2" />
                    }
                  >
                    <Download className="size-4" />
                    CSV Export
                  </TooltipTrigger>
                  <TooltipContent>Export responses as CSV</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button variant="outline" size="sm" className="gap-2" />
                    }
                  >
                    <FileSpreadsheet className="size-4" />
                    Google Sheets
                  </TooltipTrigger>
                  <TooltipContent>
                    Export to Google Sheets
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button variant="outline" size="sm" className="gap-2" />
                    }
                  >
                    <Braces className="size-4" />
                    Raw JSON
                  </TooltipTrigger>
                  <TooltipContent>Export raw JSON data</TooltipContent>
                </Tooltip>

                <Link href="/forms/create">
                  <Button size="sm" className="gap-2">
                    <Pencil className="size-4" />
                    Edit Form
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Main Content ──────────────────────────────────────── */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* ── Stat Cards ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total Responses"
              value={MOCK_FORM.totalResponses.toLocaleString()}
              subtitle={`+12% this week`}
              icon={BarChart3}
              delay={0}
            />
            <StatCard
              label="Completion Rate"
              value={`${MOCK_FORM.completionRate}%`}
              subtitle={`Avg time: ${MOCK_FORM.avgTime}`}
              icon={CheckCircle2}
              delay={0.1}
            />
            <StatCard
              label="NPS Score"
              value={String(MOCK_FORM.npsScore)}
              subtitle="Based on 890 ratings"
              icon={TrendingUp}
              delay={0.2}
            />
          </div>

          {/* ── Content Grid: Table + Side Panel ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Responses Table (2 cols) ─────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 border border-border rounded-lg bg-background flex flex-col"
            >
              {/* Table Header */}
              <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-muted/30 rounded-t-lg">
                <h3 className="text-sm font-semibold text-foreground">
                  Recent Responses
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <Filter className="size-4" />
                </Button>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Respondent
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Rating
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResponses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {response.date}
                        </TableCell>
                        <TableCell className="text-sm font-mono">
                          {response.respondent}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            size="sm"
                            className="text-xs font-mono"
                          >
                            {response.rating}/10
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              response.status === "complete"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={`text-xs capitalize ${
                              response.status === "complete"
                                ? "bg-foreground/10 text-foreground border-transparent"
                                : "text-muted-foreground"
                            }`}
                          >
                            {response.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-muted-foreground hover:text-foreground"
                                />
                              }
                            >
                              <Eye className="size-4" />
                            </TooltipTrigger>
                            <TooltipContent>View response</TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-border flex justify-between items-center text-xs text-muted-foreground rounded-b-lg">
                <span>
                  Showing{" "}
                  {(currentPage - 1) * responsesPerPage + 1}–
                  {Math.min(
                    currentPage * responsesPerPage,
                    MOCK_RESPONSES.length
                  )}{" "}
                  of {MOCK_FORM.totalResponses.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                  >
                    <ChevronLeft className="size-3.5 mr-1" />
                    Prev
                  </Button>
                  <span className="text-xs font-medium text-foreground px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next
                    <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* ── Side Panel (1 col) ──────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              {/* Form Info Card */}
              <div className="border border-border rounded-lg p-5 bg-background">
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  Form Info
                </h4>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground font-medium">
                      {MOCK_FORM.createdAt}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs capitalize"
                    >
                      <span className="size-1.5 rounded-full bg-foreground inline-block" />
                      {MOCK_FORM.status}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Form ID</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground font-mono text-xs">
                        {MOCK_FORM.id}
                      </span>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrations Card */}
              <div className="border border-border rounded-lg p-5 bg-background">
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  Integrations
                </h4>
                <div className="flex flex-col gap-3">
                  {/* Google Sheets */}
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="size-5 text-foreground" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Google Sheets
                        </div>
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">
                          Connected
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-4 bg-foreground rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-background rounded-full" />
                    </div>
                  </div>

                  {/* Webhook */}
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="size-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Webhook
                        </div>
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">
                          Not configured
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-4 bg-muted-foreground/30 rounded-full relative cursor-pointer">
                      <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-background rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="border border-border rounded-lg p-5 bg-background">
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  Quick Actions
                </h4>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-sm"
                  >
                    <Copy className="size-4" />
                    Duplicate Form
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-sm"
                  >
                    <ExternalLink className="size-4" />
                    Share Link
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
