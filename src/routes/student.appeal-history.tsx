
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  Search,
  XCircle,
} from "lucide-react";

import { PageHeader } from "@/components/argus/page-header";
import { SectionCard } from "@/components/argus/section-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/appeal-history")({
  head: () => ({
    meta: [
      { title: "Appeal History | ARGUS" },
      {
        name: "description",
        content: "Review submitted attendance appeals and their resolution status.",
      },
    ],
  }),
  component: AppealHistoryPage,
});

type AppealStatus = "Pending" | "Under Review" | "Approved" | "Rejected";

type Appeal = {
  id: string;
  subject: string;
  date: string;
  sessionDate: string;
  reason: string;
  status: AppealStatus;
  facultyRemark: string;
  lastUpdated: string;
};

const initialAppeals: Appeal[] = [
  {
    id: "APL-2026-001",
    subject: "Computer Networks",
    date: "28 Oct 2026",
    sessionDate: "24 Oct 2026",
    reason:
      "I was present in the classroom, but my attendance was not recorded because the verification process failed.",
    status: "Approved",
    facultyRemark:
      "Attendance verified with the faculty session record. Attendance has been corrected.",
    lastUpdated: "30 Oct 2026",
  },
  {
    id: "APL-2026-002",
    subject: "Data Science",
    date: "29 Oct 2026",
    sessionDate: "27 Oct 2026",
    reason:
      "My face verification was unsuccessful during the attendance session despite being physically present.",
    status: "Under Review",
    facultyRemark: "Your appeal is being reviewed by the concerned faculty member.",
    lastUpdated: "30 Oct 2026",
  },
  {
    id: "APL-2026-003",
    subject: "Mathematics",
    date: "20 Oct 2026",
    sessionDate: "18 Oct 2026",
    reason:
      "I attended the lecture, but the attendance register shows me as absent.",
    status: "Rejected",
    facultyRemark:
      "The session verification records do not confirm your presence during the attendance window.",
    lastUpdated: "22 Oct 2026",
  },
  {
    id: "APL-2026-004",
    subject: "Operating Systems",
    date: "31 Oct 2026",
    sessionDate: "30 Oct 2026",
    reason:
      "My registered device was unavailable during the session, so I could not complete verification.",
    status: "Pending",
    facultyRemark: "Your appeal has been submitted and is awaiting review.",
    lastUpdated: "31 Oct 2026",
  },
];

const filters = [
  "All",
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
] as const;

type AppealFilter = (typeof filters)[number];

function getStatusTone(status: AppealStatus) {
  switch (status) {
    case "Approved":
      return "success" as const;
    case "Rejected":
      return "danger" as const;
    case "Under Review":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
}

function getStatusIcon(status: AppealStatus) {
  switch (status) {
    case "Approved":
      return CheckCircle2;
    case "Rejected":
      return XCircle;
    case "Under Review":
      return Clock3;
    default:
      return FileText;
  }
}

function AppealHistoryPage() {
  const [appeals] = useState(initialAppeals);
  const [activeFilter, setActiveFilter] = useState<AppealFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAppeal, setExpandedAppeal] = useState<string | null>(
    null,
  );

  const counts = useMemo(
    () => ({
      total: appeals.length,
      pending: appeals.filter(
        (appeal) => appeal.status === "Pending",
      ).length,
      underReview: appeals.filter(
        (appeal) => appeal.status === "Under Review",
      ).length,
      approved: appeals.filter(
        (appeal) => appeal.status === "Approved",
      ).length,
      rejected: appeals.filter(
        (appeal) => appeal.status === "Rejected",
      ).length,
    }),
    [appeals],
  );

  const filteredAppeals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return appeals.filter((appeal) => {
      const matchesFilter =
        activeFilter === "All" || appeal.status === activeFilter;

      const matchesSearch =
        !query ||
        appeal.id.toLowerCase().includes(query) ||
        appeal.subject.toLowerCase().includes(query) ||
        appeal.reason.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [appeals, activeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Student dashboard
        </Link>

        <PageHeader
          title="Appeal history"
          description="Track your submitted attendance appeals and review their decisions."
          action={
            <Link to="/student/appeals">
              <Button size="sm">
                Submit new appeal
              </Button>
            </Link>
          }
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total appeals", value: counts.total },
          { label: "Pending", value: counts.pending },
          { label: "Under review", value: counts.underReview },
          { label: "Approved", value: counts.approved },
          { label: "Rejected", value: counts.rejected },
        ].map((item) => (
          <div
            key={item.label}
            className="border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Appeal records */}
      <SectionCard
        title="Submitted appeals"
        description="A record of your attendance correction requests."
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by appeal ID, subject or reason..."
              className="h-10 w-full border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {filters.map((filter) => {
              const selected = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`border px-3 py-1.5 text-xs transition-colors ${
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Records */}
          {filteredAppeals.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredAppeals.map((appeal) => {
                const StatusIcon = getStatusIcon(appeal.status);
                const isExpanded = expandedAppeal === appeal.id;

                return (
                  <article key={appeal.id} className="py-4 first:pt-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-background">
                          <StatusIcon className="size-4 text-muted-foreground" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-foreground">
                              {appeal.subject}
                            </h3>

                            <StatusChip
                              tone={getStatusTone(appeal.status)}
                              dot={false}
                            >
                              {appeal.status}
                            </StatusChip>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Appeal ID: {appeal.id}
                          </p>

                          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                            {appeal.reason}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" />
                              Submitted: {appeal.date}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" />
                              Session: {appeal.sessionDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        onClick={() =>
                          setExpandedAppeal(
                            isExpanded ? null : appeal.id,
                          )
                        }
                      >
                        {isExpanded ? "Hide details" : "View details"}
                        <ArrowUpRight className="size-3.5" />
                      </Button>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="ml-0 mt-4 border border-border bg-muted/20 p-4 sm:ml-12">
                        <h4 className="flex items-center gap-2 text-xs font-semibold text-foreground">
                          <MessageSquare className="size-3.5" />
                          Faculty remarks
                        </h4>

                        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                          {appeal.facultyRemark}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                          <span className="text-xs text-muted-foreground">
                            Last updated: {appeal.lastUpdated}
                          </span>

                          <StatusChip
                            tone={getStatusTone(appeal.status)}
                            dot={false}
                          >
                            {appeal.status}
                          </StatusChip>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-border px-4 py-12 text-center">
              <FileText className="size-7 text-muted-foreground" />

              <h3 className="mt-3 text-sm font-medium text-foreground">
                No appeals found
              </h3>

              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                No appeal records match your current search or filter.
              </p>

              {(activeFilter !== "All" || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchQuery("");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* Help information */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-xs font-medium text-foreground">
              Need assistance with an appeal?
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              If you disagree with an appeal decision or need clarification,
              contact your concerned faculty member or department coordinator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
