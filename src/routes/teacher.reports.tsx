import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Download,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  Users,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/teacher/reports")({
  component: TeacherReports,
});

type AttendanceRecord = {
  id: string;
  student: string;
  rollNumber: string;
  subject: string;
  subjectCode: string;
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
};

const initialRecords: AttendanceRecord[] = [
  {
    id: "1",
    student: "Aarav Sharma",
    rollNumber: "MITS23CS041",
    subject: "Data Structures and Algorithms",
    subjectCode: "CS301",
    date: "2026-10-31",
    present: 18,
    absent: 1,
    late: 1,
    total: 20,
  },
  {
    id: "2",
    student: "Priya Verma",
    rollNumber: "MITS23CS056",
    subject: "Data Structures and Algorithms",
    subjectCode: "CS301",
    date: "2026-10-31",
    present: 19,
    absent: 1,
    late: 0,
    total: 20,
  },
  {
    id: "3",
    student: "Rohan Gupta",
    rollNumber: "MITS23CS063",
    subject: "Database Management Systems",
    subjectCode: "CS302",
    date: "2026-10-30",
    present: 16,
    absent: 2,
    late: 2,
    total: 20,
  },
  {
    id: "4",
    student: "Ananya Singh",
    rollNumber: "MITS23CS072",
    subject: "Database Management Systems",
    subjectCode: "CS302",
    date: "2026-10-30",
    present: 17,
    absent: 2,
    late: 1,
    total: 20,
  },
  {
    id: "5",
    student: "Karan Patel",
    rollNumber: "MITS23CS084",
    subject: "Operating Systems",
    subjectCode: "CS303",
    date: "2026-10-29",
    present: 14,
    absent: 4,
    late: 2,
    total: 20,
  },
  {
    id: "6",
    student: "Meera Joshi",
    rollNumber: "MITS23CS091",
    subject: "Operating Systems",
    subjectCode: "CS303",
    date: "2026-10-29",
    present: 19,
    absent: 0,
    late: 1,
    total: 20,
  },
  {
    id: "7",
    student: "Dev Malhotra",
    rollNumber: "MITS23CS102",
    subject: "Computer Networks",
    subjectCode: "CS304",
    date: "2026-10-28",
    present: 15,
    absent: 3,
    late: 2,
    total: 20,
  },
  {
    id: "8",
    student: "Ishita Rao",
    rollNumber: "MITS23CS118",
    subject: "Computer Networks",
    subjectCode: "CS304",
    date: "2026-10-28",
    present: 18,
    absent: 1,
    late: 1,
    total: 20,
  },
];

const subjectOptions = [
  "All subjects",
  "Data Structures and Algorithms",
  "Database Management Systems",
  "Operating Systems",
  "Computer Networks",
];

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TeacherReports() {
  const [records] = useState(initialRecords);
  const [subject, setSubject] = useState("All subjects");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-31");
  const [generated, setGenerated] = useState(false);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    return records.filter((record) => {
      const matchesSubject =
        subject === "All subjects" || record.subject === subject;

      const matchesSearch =
        record.student.toLowerCase().includes(query) ||
        record.rollNumber.toLowerCase().includes(query) ||
        record.subject.toLowerCase().includes(query) ||
        record.subjectCode.toLowerCase().includes(query);

      const matchesDate =
        (!startDate || record.date >= startDate) &&
        (!endDate || record.date <= endDate);

      return matchesSubject && matchesSearch && matchesDate;
    });
  }, [records, subject, search, startDate, endDate]);

  const totals = useMemo(() => {
    return filteredRecords.reduce(
      (accumulator, record) => ({
        present: accumulator.present + record.present,
        absent: accumulator.absent + record.absent,
        late: accumulator.late + record.late,
        total: accumulator.total + record.total,
      }),
      { present: 0, absent: 0, late: 0, total: 0 },
    );
  }, [filteredRecords]);

  const attendancePercentage =
    totals.total > 0
      ? Math.round(
          ((totals.present + totals.late) / totals.total) * 100,
        )
      : 0;

  const subjectSummary = useMemo(() => {
    const grouped = new Map<
      string,
      {
        name: string;
        code: string;
        present: number;
        absent: number;
        late: number;
        total: number;
      }
    >();

    filteredRecords.forEach((record) => {
      const current = grouped.get(record.subjectCode) ?? {
        name: record.subject,
        code: record.subjectCode,
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
      };

      current.present += record.present;
      current.absent += record.absent;
      current.late += record.late;
      current.total += record.total;

      grouped.set(record.subjectCode, current);
    });

    return Array.from(grouped.values()).map((item) => ({
      ...item,
      percentage:
        item.total > 0
          ? Math.round(
              ((item.present + item.late) / item.total) * 100,
            )
          : 0,
    }));
  }, [filteredRecords]);

  const exportCSV = () => {
    const headers = [
      "Student",
      "Roll Number",
      "Subject",
      "Subject Code",
      "Report Date",
      "Present",
      "Absent",
      "Late",
      "Total Sessions",
      "Attendance Percentage",
    ];

    const rows = filteredRecords.map((record) => [
      record.student,
      record.rollNumber,
      record.subject,
      record.subjectCode,
      record.date,
      record.present,
      record.absent,
      record.late,
      record.total,
      `${Math.round(
        ((record.present + record.late) / record.total) * 100,
      )}%`,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "argus-attendance-report-demo.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSubject("All subjects");
    setSearch("");
    setStartDate("2026-10-01");
    setEndDate("2026-10-31");
    setGenerated(false);
  };

  const generateReport = () => {
    if (startDate && endDate && startDate > endDate) {
      alert("Start date cannot be later than end date.");
      return;
    }

    setGenerated(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Reports"
        description="Generate and review attendance reports for your assigned subjects and students."
      />

      {/* Demo notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Demonstration report data
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Report records and statistics are sample values, not actual
              institutional attendance data.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Report filters */}
      <SectionCard
        title="Report configuration"
        description="Choose the reporting period and subject."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="report-subject">Subject</Label>
            <select
              id="report-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="h-10 w-full border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            >
              {subjectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-date">Start date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-search">Student search</Label>
            <Input
              id="student-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name or roll number"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
          <Button size="sm" onClick={generateReport}>
            <Filter className="mr-2 h-4 w-4" />
            Generate report
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={resetFilters}
          >
            Reset filters
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={exportCSV}
            disabled={filteredRecords.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </SectionCard>

      {/* Report summary */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">Report summary</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Calculated from the currently filtered records.
            </p>
          </div>

          {generated && (
            <StatusChip status="Report generated locally" />
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Students listed",
              value: filteredRecords.length,
              icon: Users,
            },
            {
              label: "Present sessions",
              value: totals.present,
              icon: GraduationCap,
            },
            {
              label: "Absent sessions",
              value: totals.absent,
              icon: CalendarDays,
            },
            {
              label: "Attendance rate",
              value: `${attendancePercentage}%`,
              icon: BarChart3,
            },
          ].map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <p className="mt-3 text-2xl font-semibold tabular-nums">
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subject-wise summary */}
      <SectionCard
        title="Subject-wise attendance"
        description="Attendance distribution across the selected subjects."
      >
        {subjectSummary.length > 0 ? (
          <div className="space-y-5">
            {subjectSummary.map((item) => (
              <div key={item.code}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.code} · {item.total} recorded sessions
                    </p>
                  </div>

                  <p className="text-sm font-semibold tabular-nums">
                    {item.percentage}%
                  </p>
                </div>

                <div className="mt-2 flex h-2 w-full overflow-hidden bg-muted">
                  <div
                    className="h-full bg-foreground"
                    style={{
                      width: `${(item.present / item.total) * 100}%`,
                    }}
                  />
                  <div
                    className="h-full bg-muted-foreground/50"
                    style={{
                      width: `${(item.late / item.total) * 100}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Present: {item.present}</span>
                  <span>Late: {item.late}</span>
                  <span>Absent: {item.absent}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyReport />
        )}
      </SectionCard>

      {/* Detailed report */}
      <SectionCard
        title="Student attendance breakdown"
        description="Detailed attendance records for the selected report period."
        action={
          <span className="text-xs text-muted-foreground">
            {filteredRecords.length} records
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Subject</th>
                <th className="px-3 py-3 font-medium">Report date</th>
                <th className="px-3 py-3 text-center font-medium">Present</th>
                <th className="px-3 py-3 text-center font-medium">Absent</th>
                <th className="px-3 py-3 text-center font-medium">Late</th>
                <th className="px-3 py-3 font-medium">Attendance</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredRecords.map((record) => {
                const percentage = Math.round(
                  ((record.present + record.late) / record.total) * 100,
                );

                return (
                  <tr key={record.id}>
                    <td className="px-3 py-3">
                      <p className="font-medium">{record.student}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {record.rollNumber}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <p className="text-xs">{record.subject}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {record.subjectCode}
                      </p>
                    </td>

                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {formatDate(record.date)}
                    </td>

                    <td className="px-3 py-3 text-center tabular-nums">
                      {record.present}
                    </td>

                    <td className="px-3 py-3 text-center tabular-nums">
                      {record.absent}
                    </td>

                    <td className="px-3 py-3 text-center tabular-nums">
                      {record.late}
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium tabular-nums">
                          {percentage}%
                        </span>
                        <StatusChip
                          status={
                            percentage >= 75
                              ? "On track"
                              : "Below threshold"
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Report notes */}
      <div className="border border-border p-4">
        <p className="text-sm font-medium">Report calculation notes</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
          <li>
            Attendance rate is calculated as (Present + Late) / Total
            sessions.
          </li>
          <li>
            The 75% threshold is illustrative and should be configurable
            according to institutional attendance policy.
          </li>
          <li>
            Exported CSV contains the currently filtered demonstration
            records only.
          </li>
          <li>
            Official reports must use backend-authoritative records and
            server-side access control.
          </li>
        </ul>
      </div>
    </div>
  );
}

function EmptyReport() {
  return (
    <div className="py-10 text-center">
      <FileSpreadsheet className="mx-auto h-7 w-7 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium">No report data available</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Adjust the selected filters to view records.
      </p>
    </div>
  );
}
