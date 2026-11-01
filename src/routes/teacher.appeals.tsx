
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Search,
  X,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/teacher/appeals")({
  head: () => ({
    meta: [
      { title: "Appeal Management | ARGUS" },
      {
        name: "description",
        content: "Review and manage student attendance appeals.",
      },
    ],
  }),
  component: TeacherAppealsPage,
});

type AppealStatus =
  | "Pending"
  | "Under Review"
  | "Approved"
  | "Rejected";

type Appeal = {
  id: string;
  studentName: string;
  rollNumber: string;
  subject: string;
  subjectCode: string;
  sessionDate: string;
  submittedDate: string;
  reason: string;
  description: string;
  status: AppealStatus;
  facultyRemark: string;
};

type AppealFilter = "All" | AppealStatus;

const initialAppeals: Appeal[] = [
  {
    id: "APL-2026-001",
    studentName: "Aarav Sharma",
    rollNumber: "0827CS221001",
    subject: "Data Structures and Algorithms",
    subjectCode: "CS301",
    sessionDate: "28 Oct 2026",
    submittedDate: "29 Oct 2026",
    reason: "Technical issue",
    description:
      "I attempted attendance verification during the scheduled session, but the verification page stopped responding. I was physically present in the classroom and request that my attendance be reviewed.",
    status: "Pending",
    facultyRemark: "",
  },
  {
    id: "APL-2026-002",
    studentName: "Priya Verma",
    rollNumber: "0827CS221014",
    subject: "Computer Networks",
    subjectCode: "CS303",
    sessionDate: "27 Oct 2026",
    submittedDate: "28 Oct 2026",
    reason: "Device issue",
    description:
      "My phone camera was not working during face verification. I informed the faculty member immediately after the session.",
    status: "Under Review",
    facultyRemark: "",
  },
  {
    id: "APL-2026-003",
    studentName: "Rohan Gupta",
    rollNumber: "0827CS221022",
    subject: "Database Management Systems",
    subjectCode: "CS302",
    sessionDate: "25 Oct 2026",
    submittedDate: "26 Oct 2026",
    reason: "Attendance mismatch",
    description:
      "I attended the complete lecture, but the attendance dashboard shows me as absent. I request a review of the session record.",
    status: "Approved",
    facultyRemark: "Class attendance register reviewed. Attendance correction approved.",
  },
  {
    id: "APL-2026-004",
    studentName: "Ananya Singh",
    rollNumber: "0827CS221035",
    subject: "Operating Systems",
    subjectCode: "CS304",
    sessionDate: "24 Oct 2026",
    submittedDate: "25 Oct 2026",
    reason: "Medical reason",
    description:
      "I was unable to attend the session due to a medical emergency. I have submitted the supporting documentation for review.",
    status: "Rejected",
    facultyRemark: "The submitted evidence does not satisfy the institution's attendance correction policy.",
  },
  {
    id: "APL-2026-005",
    studentName: "Kavya Jain",
    rollNumber: "0827CS221041",
    subject: "Engineering Mathematics",
    subjectCode: "MA301",
    sessionDate: "30 Oct 2026",
    submittedDate: "31 Oct 2026",
    reason: "Verification failure",
    description:
      "The verification process showed an unsuccessful result even though I was present in class. Kindly review the verification record.",
    status: "Pending",
    facultyRemark: "",
  },
];

const filters: AppealFilter[] = [
  "All",
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
];

function getStatusTone(status: AppealStatus) {
  switch (status) {
    case "Approved":
      return "success" as const;
    case "Rejected":
      return "danger" as const;
    case "Pending":
      return "warning" as const;
    case "Under Review":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

function TeacherAppealsPage() {
  const [appeals, setAppeals] = useState(initialAppeals);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AppealFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(
    initialAppeals[0]?.id ?? null,
  );
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredAppeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appeals.filter((appeal) => {
      const matchesSearch =
        !query ||
        appeal.studentName.toLowerCase().includes(query) ||
        appeal.rollNumber.toLowerCase().includes(query) ||
        appeal.subject.toLowerCase().includes(query) ||
        appeal.subjectCode.toLowerCase().includes(query) ||
        appeal.id.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || appeal.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [appeals, search, filter]);

  const counts = useMemo(
    () => ({
      total: appeals.length,
      pending: appeals.filter((item) => item.status === "Pending").length,
      underReview: appeals.filter(
        (item) => item.status === "Under Review",
      ).length,
      approved: appeals.filter((item) => item.status === "Approved").length,
      rejected: appeals.filter((item) => item.status === "Rejected").length,
    }),
    [appeals],
  );

  const updateAppeal = (
    id: string,
    nextStatus: "Approved" | "Rejected" | "Under Review",
  ) => {
    const appeal = appeals.find((item) => item.id === id);

    if (!appeal || appeal.status === "Approved" || appeal.status === "Rejected") {
      return;
    }

    if (nextStatus === "Approved" || nextStatus === "Rejected") {
      const remark = (remarks[id] ?? "").trim();

      if (remark.length < 10) {
        setActionError(
          "Please enter a faculty remark of at least 10 characters before making a decision.",
        );
        return;
      }
    }

    setActionError(null);

    setAppeals((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              facultyRemark:
                (remarks[id] ?? "").trim() || item.facultyRemark,
            }
          : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appeal Management"
        description="Review student attendance disputes and manage appeal decisions."
      />

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total appeals" value={counts.total} />
        <SummaryCard label="Pending" value={counts.pending} />
        <SummaryCard label="Under review" value={counts.underReview} />
        <SummaryCard label="Approved" value={counts.approved} />
        <SummaryCard label="Rejected" value={counts.rejected} />
      </div>

      {/* Appeal directory */}
      <SectionCard
        title="Student appeals"
        description={`${filteredAppeals.length} of ${appeals.length} appeals displayed.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, roll number, subject or appeal ID..."
              className="h-10 rounded-none pl-9"
            />
          </div>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as AppealFilter)
            }
            aria-label="Filter appeals by status"
            className="h-10 min-w-40 border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
          >
            {filters.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All statuses" : item}
              </option>
            ))}
          </select>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-4 border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive"
          >
            {actionError}
          </div>
        )}

        <div className="mt-4 space-y-0">
          {filteredAppeals.length > 0 ? (
            filteredAppeals.map((appeal) => {
              const isExpanded = expandedId === appeal.id;
              const isFinal =
                appeal.status === "Approved" ||
                appeal.status === "Rejected";

              return (
                <div
                  key={appeal.id}
                  className="border-b border-border last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : appeal.id)
                    }
                    aria-expanded={isExpanded}
                    className="flex w-full flex-col gap-3 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-muted/30">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground">
                          {appeal.studentName}
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                          {appeal.rollNumber} · {appeal.id}
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {appeal.subject} ({appeal.subjectCode})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex flex-col items-start gap-1 sm:items-end">
                        <StatusChip tone={getStatusTone(appeal.status)}>
                          {appeal.status}
                        </StatusChip>

                        <span className="text-[10px] text-muted-foreground">
                          Submitted {appeal.submittedDate}
                        </span>
                      </div>

                      <ChevronDown
                        className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border bg-muted/10 px-3 py-4 sm:px-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <InfoField
                          label="Appeal ID"
                          value={appeal.id}
                        />
                        <InfoField
                          label="Session date"
                          value={appeal.sessionDate}
                        />
                        <InfoField
                          label="Appeal reason"
                          value={appeal.reason}
                        />
                        <InfoField
                          label="Submitted on"
                          value={appeal.submittedDate}
                        />
                      </div>

                      <div className="mt-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Student explanation
                        </p>

                        <p className="mt-2 text-xs leading-relaxed text-foreground">
                          {appeal.description}
                        </p>
                      </div>

                      {appeal.facultyRemark && (
                        <div className="mt-4 border border-border p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Existing faculty remark
                          </p>

                          <p className="mt-2 text-xs leading-relaxed text-foreground">
                            {appeal.facultyRemark}
                          </p>
                        </div>
                      )}

                      {!isFinal && (
                        <div className="mt-4 border-t border-border pt-4">
                          <label
                            htmlFor={`remark-${appeal.id}`}
                            className="text-xs font-medium text-foreground"
                          >
                            Faculty remarks
                          </label>

                          <Textarea
                            id={`remark-${appeal.id}`}
                            value={remarks[appeal.id] ?? ""}
                            onChange={(event) => {
                              setRemarks((current) => ({
                                ...current,
                                [appeal.id]: event.target.value,
                              }));
                              setActionError(null);
                            }}
                            placeholder="Enter your review remarks and decision justification..."
                            rows={3}
                            className="mt-2 rounded-none text-xs"
                          />

                          <div className="mt-3 flex flex-wrap gap-2">
                            {appeal.status === "Pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-none"
                                onClick={() =>
                                  updateAppeal(
                                    appeal.id,
                                    "Under Review",
                                  )
                                }
                              >
                                <Clock3 className="size-3.5" />
                                Mark under review
                              </Button>
                            )}

                            <Button
                              size="sm"
                              className="rounded-none"
                              onClick={() =>
                                updateAppeal(appeal.id, "Approved")
                              }
                            >
                              <Check className="size-3.5" />
                              Approve appeal
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-none"
                              onClick={() =>
                                updateAppeal(appeal.id, "Rejected")
                              }
                            >
                              <X className="size-3.5" />
                              Reject appeal
                            </Button>
                          </div>

                          <p className="mt-2 text-[10px] text-muted-foreground">
                            A minimum of 10 characters is required for
                            approval or rejection remarks.
                          </p>
                        </div>
                      )}

                      {isFinal && (
                        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                          <StatusChip tone={getStatusTone(appeal.status)}>
                            Decision recorded locally
                          </StatusChip>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <FileText className="mx-auto size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium text-foreground">
                No appeals found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try another search term or status filter.
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-none"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Policy note */}
      <div className="border border-border bg-muted/20 p-4">
        <p className="text-xs font-semibold text-foreground">
          Appeal review guidelines
        </p>

        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Review the student's explanation and available attendance
          evidence before making a decision. Record a clear justification
          for approval or rejection. Final decisions should follow
          institutional attendance and appeal policies.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border border-border bg-background p-4">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 font-mono text-2xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}
