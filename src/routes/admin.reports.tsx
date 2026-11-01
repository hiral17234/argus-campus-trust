
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FileText,
  Download,
  CalendarDays,
  Users,
  UserCheck,
  ShieldAlert,
  ClipboardList,
  FileSpreadsheet,
  RefreshCcw,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

type ReportType =
  | "Attendance"
  | "Student Directory"
  | "Verification Activity"
  | "Security Incidents"
  | "Audit Activity";

type ReportPeriod = "7 days" | "30 days" | "90 days" | "Academic year";

type ReportFormat = "CSV";

type ReportRecord = {
  id: string;
  date: string;
  department: string;
  category: ReportType;
  description: string;
  status: string;
};

const demoRecords: ReportRecord[] = [
  {
    id: "RPT-001",
    date: "2026-11-01",
    department: "Computer Science",
    category: "Attendance",
    description: "Daily attendance summary",
    status: "Completed",
  },
  {
    id: "RPT-002",
    date: "2026-11-02",
    department: "Information Technology",
    category: "Attendance",
    description: "Daily attendance summary",
    status: "Completed",
  },
  {
    id: "RPT-003",
    date: "2026-11-03",
    department: "Electronics",
    category: "Verification Activity",
    description: "Identity verification summary",
    status: "Completed",
  },
  {
    id: "RPT-004",
    date: "2026-11-03",
    department: "Computer Science",
    category: "Security Incidents",
    description: "Flagged verification attempts",
    status: "Under review",
  },
  {
    id: "RPT-005",
    date: "2026-11-04",
    department: "Mechanical",
    category: "Student Directory",
    description: "Student directory snapshot",
    status: "Completed",
  },
  {
    id: "RPT-006",
    date: "2026-11-05",
    department: "Computer Science",
    category: "Audit Activity",
    description: "Administrative activity summary",
    status: "Completed",
  },
  {
    id: "RPT-007",
    date: "2026-11-05",
    department: "Civil",
    category: "Attendance",
    description: "Daily attendance summary",
    status: "Completed",
  },
];

const reportTypes: {
  value: ReportType;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    value: "Attendance",
    description: "Attendance rates, present and absent records.",
    icon: UserCheck,
  },
  {
    value: "Student Directory",
    description: "Student identifiers, departments and account status.",
    icon: Users,
  },
  {
    value: "Verification Activity",
    description: "Verification attempts and their outcomes.",
    icon: ShieldAlert,
  },
  {
    value: "Security Incidents",
    description: "Flagged events, risk levels and review status.",
    icon: ShieldAlert,
  },
  {
    value: "Audit Activity",
    description: "Administrative and system activity records.",
    icon: ClipboardList,
  },
];

const departments = [
  "All departments",
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
];

function AdminReports() {
  const [reportType, setReportType] =
    useState<ReportType>("Attendance");
  const [period, setPeriod] =
    useState<ReportPeriod>("30 days");
  const [department, setDepartment] =
    useState("All departments");
  const [format, setFormat] = useState<ReportFormat>("CSV");
  const [generated, setGenerated] = useState(false);

  const filteredRecords = useMemo(() => {
    return demoRecords.filter((record) => {
      const matchesType = record.category === reportType;
      const matchesDepartment =
        department === "All departments" ||
        record.department === department;

      return matchesType && matchesDepartment;
    });
  }, [reportType, department]);

  const summary = useMemo(() => {
    return {
      total: filteredRecords.length,
      completed: filteredRecords.filter(
        (record) => record.status === "Completed",
      ).length,
      underReview: filteredRecords.filter(
        (record) => record.status === "Under review",
      ).length,
    };
  }, [filteredRecords]);

  const generateReport = () => {
    setGenerated(true);
  };

  const exportReport = () => {
    if (!filteredRecords.length) return;

    const headers = [
      "Report ID",
      "Date",
      "Department",
      "Report Category",
      "Description",
      "Status",
      "Selected Period",
    ];

    const rows = filteredRecords.map((record) => [
      record.id,
      record.date,
      record.department,
      record.category,
      record.description,
      record.status,
      period,
    ]);

    const escapeCSV = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `argus-${reportType
      .toLowerCase()
      .replaceAll(" ", "-")}-demo-report.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setReportType("Attendance");
    setPeriod("30 days");
    setDepartment("All departments");
    setFormat("CSV");
    setGenerated(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate institutional reports for attendance, student records, identity verification, security, and administrative activity."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Report generation workspace
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              The current report records are illustrative. Production
              reports must be generated from authorized backend data.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Report configuration */}
      <SectionCard
        title="Configure report"
        description="Choose the report category, period, department, and export format."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium">
              Report category
            </label>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {reportTypes.map((item) => {
                const Icon = item.icon;
                const selected = reportType === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setReportType(item.value);
                      setGenerated(false);
                    }}
                    className={`flex items-start gap-3 border p-3 text-left transition-colors ${
                      selected
                        ? "border-foreground bg-muted/50"
                        : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      <span className="block text-sm font-medium">
                        {item.value}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="report-period"
              className="text-sm font-medium"
            >
              Reporting period
            </label>
            <select
              id="report-period"
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value as ReportPeriod);
                setGenerated(false);
              }}
              className="h-10 w-full border border-input bg-background px-3 text-sm"
            >
              <option value="7 days">Last 7 days</option>
              <option value="30 days">Last 30 days</option>
              <option value="90 days">Last 90 days</option>
              <option value="Academic year">Academic year</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="report-department"
              className="text-sm font-medium"
            >
              Department
            </label>
            <select
              id="report-department"
              value={department}
              onChange={(event) => {
                setDepartment(event.target.value);
                setGenerated(false);
              }}
              className="h-10 w-full border border-input bg-background px-3 text-sm"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="report-format"
              className="text-sm font-medium"
            >
              Export format
            </label>
            <select
              id="report-format"
              value={format}
              onChange={(event) =>
                setFormat(event.target.value as ReportFormat)
              }
              className="h-10 w-full border border-input bg-background px-3 text-sm"
            >
              <option value="CSV">CSV spreadsheet</option>
            </select>
            <p className="text-xs text-muted-foreground">
              CSV export is currently supported in this prototype.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <Button onClick={generateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate report
            </Button>

            <Button variant="outline" onClick={resetFilters}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Report preview */}
      <SectionCard
        title="Report preview"
        description="Preview the records matching the selected report configuration."
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={exportReport}
            disabled={!generated || filteredRecords.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="text-sm font-semibold">{reportType}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {period} · {department}
            </p>
          </div>
          <StatusChip status={generated ? "Generated" : "Preview"} />
        </div>

        {!generated ? (
          <div className="py-10 text-center">
            <FileSpreadsheet className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">
              Report not generated
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Select your filters and generate the report to view matching records.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <SummaryMetric
                label="Matching records"
                value={summary.total}
              />
              <SummaryMetric
                label="Completed"
                value={summary.completed}
              />
              <SummaryMetric
                label="Under review"
                value={summary.underReview}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-3 py-3 font-medium">Report ID</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Department</th>
                    <th className="px-3 py-3 font-medium">Description</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-3 py-3 text-xs font-medium">
                        {record.id}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {record.date}
                      </td>
                      <td className="px-3 py-3 text-xs">
                        {record.department}
                      </td>
                      <td className="px-3 py-3 text-xs">
                        {record.description}
                      </td>
                      <td className="px-3 py-3">
                        <StatusChip status={record.status} />
                      </td>
                    </tr>
                  ))}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-10 text-center text-sm text-muted-foreground"
                      >
                        No records found for this report configuration.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {filteredRecords.length} demonstration records included.
              Selected period is a report parameter only; these sample
              records are not dynamically date-filtered.
            </p>
          </>
        )}
      </SectionCard>

      {/* Report governance */}
      <SectionCard
        title="Report access and governance"
        description="Production requirements for secure institutional reporting."
      >
        <div className="divide-y divide-border">
          <GovernanceRow
            title="Role-based access"
            description="Restrict sensitive student, faculty, and security reports to authorized roles."
          />
          <GovernanceRow
            title="Export tracking"
            description="Record who generated or downloaded each report, when, and with which filters."
          />
          <GovernanceRow
            title="Data minimization"
            description="Include only the personal information required for the report's purpose."
          />
          <GovernanceRow
            title="Server-side generation"
            description="Generate production reports from authorized backend queries rather than browser-side demo arrays."
          />
        </div>
      </SectionCard>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function GovernanceRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
