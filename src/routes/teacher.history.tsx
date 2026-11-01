
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  FileClock,
  Search,
  Users,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/teacher/history")({
  head: () => ({
    meta: [
      { title: "Attendance History | ARGUS" },
      {
        name: "description",
        content: "Review historical attendance records for assigned classes.",
      },
    ],
  }),
  component: TeacherHistoryPage,
});

type AttendanceStatus = "Present" | "Absent" | "Late";

type AttendanceRecord = {
  id: string;
  student: string;
  rollNumber: string;
  subject: string;
  subjectCode: string;
  date: string;
  time: string;
  method: string;
  status: AttendanceStatus;
  sessionId: string;
};

type StatusFilter = "All" | AttendanceStatus;
type DateFilter = "All" | "7" | "30" | "90";

const attendanceRecords: AttendanceRecord[] = [
  {
    id: "ATT-001",
    student: "Aarav Sharma",
    rollNumber: "0827CS221001",
    subject: "Data Structures and Algorithms",
    subjectCode: "CS301",
    date: "31 Oct 2026",
    time: "09:04 AM",
    method: "Face verification",
    status: "Present",
    sessionId: "SES-048",
  },
  {
    id: "ATT-002",
    student: "Priya Verma",
    rollNumber: "0827CS221014",
    subject: "Database Management Systems",
    subjectCode: "CS302",
    date: "31 Oct 2026",
    time: "09:08 AM",
    method: "QR verification",
    status: "Present",
    sessionId: "SES-047",
  },
  {
    id: "ATT-003",
    student: "Rohan Gupta",
    rollNumber: "0827CS221022",
    subject: "Computer Networks",
    subjectCode: "CS303",
    date: "30 Oct 2026",
    time: "10:21 AM",
    method: "Face verification",
    status: "Late",
    sessionId: "SES-046",
  },
  {
    id: "ATT-004",
    student: "Ananya Singh",
    rollNumber: "0827CS221035",
    subject: "Operating Systems",
    subjectCode: "CS304",
    date: "30 Oct 2026",
    time: "Not recorded",
    method: "Not recorded",
    status: "Absent",
    sessionId: "SES-045",
  },
  {
    id: "ATT-005",
    student: "Kavya Jain",
    rollNumber: "0827CS221041",
    subject: "Artificial Intelligence",
    subjectCode: "CS305",
    date: "29 Oct 2026",
    time: "12:03 PM",
    method: "Attendance code",
    status: "Present",
    sessionId: "SES-044",
  },
  {
    id: "ATT-006",
    student: "Ishita Patel",
    rollNumber: "0827CS221052",
    subject: "Data Structures and Algorithms",
    subjectCode: "CS301",
    date: "29 Oct 2026",
    time: "09:12 AM",
    method: "QR verification",
    status: "Present",
    sessionId: "SES-043",
  },
  {
    id: "ATT-007",
    student: "Aditya Mishra",
    rollNumber: "0827CS221067",
    subject: "Computer Networks",
    subjectCode: "CS303",
    date: "28 Oct 2026",
    time: "Not recorded",
    method: "Not recorded",
    status: "Absent",
    sessionId: "SES-042",
  },
  {
    id: "ATT-008",
    student: "Meera Joshi",
    rollNumber: "0827CS221073",
    subject: "Database Management Systems",
    subjectCode: "CS302",
    date: "28 Oct 2026",
    time: "09:02 AM",
    method: "Face verification",
    status: "Present",
    sessionId: "SES-041",
  },
  {
    id: "ATT-009",
    student: "Sahil Yadav",
    rollNumber: "0827CS221084",
    subject: "Operating Systems",
    subjectCode: "CS304",
    date: "27 Oct 2026",
    time: "10:29 AM",
    method: "Attendance code",
    status: "Late",
    sessionId: "SES-040",
  },
  {
    id: "ATT-010",
    student: "Diya Agarwal",
    rollNumber: "0827CS221096",
    subject: "Engineering Mathematics",
    subjectCode: "MA301",
    date: "27 Oct 2026",
    time: "Not recorded",
    method: "Not recorded",
    status: "Absent",
    sessionId: "SES-039",
  },
  {
    id: "ATT-011",
    student: "Arjun Tiwari",
    rollNumber: "0827CS221108",
    subject: "Artificial Intelligence",
    subjectCode: "CS305",
    date: "26 Oct 2026",
    time: "12:01 PM",
    method: "Face verification",
    status: "Present",
    sessionId: "SES-038",
  },
  {
    id: "ATT-012",
    student: "Nisha Soni",
    rollNumber: "0827CS221119",
    subject: "Engineering Mathematics",
    subjectCode: "MA301",
    date: "25 Oct 2026",
    time: "09:18 AM",
    method: "QR verification",
    status: "Late",
    sessionId: "SES-037",
  },
];

const statusFilters: StatusFilter[] = [
  "All",
  "Present",
  "Absent",
  "Late",
];

function getStatusTone(status: AttendanceStatus) {
  switch (status) {
    case "Present":
      return "success" as const;
    case "Absent":
      return "danger" as const;
    case "Late":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
}

function TeacherHistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");
  const [dateFilter, setDateFilter] =
    useState<DateFilter>("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  const subjects = useMemo(
    () =>
      Array.from(
        new Set(attendanceRecords.map((record) => record.subjectCode)),
      ),
    [],
  );

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendanceRecords.filter((record) => {
      const matchesSearch =
        !query ||
        record.student.toLowerCase().includes(query) ||
        record.rollNumber.toLowerCase().includes(query) ||
        record.subject.toLowerCase().includes(query) ||
        record.subjectCode.toLowerCase().includes(query) ||
        record.sessionId.toLowerCase().includes(query) ||
        record.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      const matchesSubject =
        subjectFilter === "All" ||
        record.subjectCode === subjectFilter;

      const recordDate = new Date(`${record.date} 00:00:00`);
      const today = new Date("2026-10-31T00:00:00");

      const daysDifference = Math.floor(
        (today.getTime() - recordDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const matchesDate =
        dateFilter === "All" ||
        (daysDifference >= 0 &&
          daysDifference <= Number(dateFilter));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSubject &&
        matchesDate
      );
    });
  }, [search, statusFilter, dateFilter, subjectFilter]);

  const summary = useMemo(
    () => ({
      total: filteredRecords.length,
      present: filteredRecords.filter(
        (record) => record.status === "Present",
      ).length,
      absent: filteredRecords.filter(
        (record) => record.status === "Absent",
      ).length,
      late: filteredRecords.filter(
        (record) => record.status === "Late",
      ).length,
    }),
    [filteredRecords],
  );

  const attendancePercentage =
    summary.total > 0
      ? Math.round((summary.present / summary.total) * 100)
      : 0;

  const handleExport = () => {
    const headers = [
      "Record ID",
      "Student",
      "Roll Number",
      "Subject",
      "Subject Code",
      "Date",
      "Time",
      "Verification Method",
      "Status",
      "Session ID",
    ];

    const rows = filteredRecords.map((record) => [
      record.id,
      record.student,
      record.rollNumber,
      record.subject,
      record.subjectCode,
      record.date,
      record.time,
      record.method,
      record.status,
      record.sessionId,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(/"/g, '""')}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "argus-teacher-attendance-history.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("All");
    setSubjectFilter("All");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance History"
        description="Review, search and export historical attendance records for your assigned classes."
      />

      {/* Summary metrics */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total records"
          value={summary.total}
          description="Filtered attendance records"
        />

        <SummaryCard
          label="Present"
          value={summary.present}
          description="Recorded present"
        />

        <SummaryCard
          label="Absent"
          value={summary.absent}
          description="Recorded absent"
        />

        <SummaryCard
          label="Late"
          value={summary.late}
          description="Recorded late"
        />
      </div>

      {/* Filters and records */}
      <SectionCard
        title="Attendance records"
        description={`${filteredRecords.length} records match the selected filters.`}
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, roll number, subject or session..."
              className="h-10 rounded-none pl-9"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              aria-label="Filter by attendance status"
              className="h-10 border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
            >
              {statusFilters.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All statuses" : item}
                </option>
              ))}
            </select>

            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              aria-label="Filter by subject"
              className="h-10 border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
            >
              <option value="All">All subjects</option>
              {subjects.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value as DateFilter)
              }
              aria-label="Filter by date range"
              className="h-10 border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
            >
              <option value="All">All dates</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <p className="text-[11px] text-muted-foreground">
              Present attendance in current filtered results:{" "}
              <span className="font-semibold text-foreground">
                {attendancePercentage}%
              </span>
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none"
                onClick={clearFilters}
              >
                Clear filters
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="rounded-none"
                onClick={handleExport}
                disabled={filteredRecords.length === 0}
              >
                <Download className="size-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-border bg-muted/20">
                <TableHeading>Student</TableHeading>
                <TableHeading>Subject</TableHeading>
                <TableHeading>Date & time</TableHeading>
                <TableHeading>Method</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading>Session</TableHeading>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-3 py-4">
                    <p className="text-xs font-medium text-foreground">
                      {record.student}
                    </p>

                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                      {record.rollNumber}
                    </p>
                  </td>

                  <td className="px-3 py-4">
                    <p className="text-xs text-foreground">
                      {record.subject}
                    </p>

                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                      {record.subjectCode}
                    </p>
                  </td>

                  <td className="px-3 py-4">
                    <p className="text-xs text-foreground">
                      {record.date}
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {record.time}
                    </p>
                  </td>

                  <td className="px-3 py-4 text-xs text-muted-foreground">
                    {record.method}
                  </td>

                  <td className="px-3 py-4">
                    <StatusChip tone={getStatusTone(record.status)}>
                      {record.status}
                    </StatusChip>
                  </td>

                  <td className="px-3 py-4">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {record.sessionId}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile records */}
        <div className="mt-4 space-y-0 md:hidden">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="border-b border-border py-4 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {record.student}
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {record.rollNumber}
                  </p>
                </div>

                <StatusChip tone={getStatusTone(record.status)}>
                  {record.status}
                </StatusChip>
              </div>

              <p className="mt-3 text-xs text-foreground">
                {record.subject}
              </p>

              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                {record.subjectCode} · {record.sessionId}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    Date & time
                  </p>

                  <p className="mt-1 text-[11px] text-foreground">
                    {record.date}
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    {record.time}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground">
                    Verification method
                  </p>

                  <p className="mt-1 text-[11px] text-foreground">
                    {record.method}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="border-t border-border py-12 text-center">
            <FileClock className="mx-auto size-6 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium text-foreground">
              No attendance records found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </SectionCard>

      {/* Information */}
      <div className="border border-border bg-muted/20 p-4">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" />

          <p className="text-xs font-semibold text-foreground">
            Attendance history information
          </p>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          This page currently uses sample attendance records. The date
          filters and summary metrics operate on the local demonstration
          dataset. Actual records must be retrieved from the backend and
          restricted to classes assigned to the authenticated teacher.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="border border-border bg-background p-4">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-3 py-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </th>
  );
}
