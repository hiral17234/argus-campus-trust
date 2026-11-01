
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Download,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/teacher/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | ARGUS" },
      {
        name: "description",
        content: "Faculty attendance and verification analytics.",
      },
    ],
  }),
  component: TeacherAnalyticsPage,
});

type DateRange = "7d" | "30d" | "90d";

const attendanceTrend = [
  { day: "Mon", present: 86, absent: 10, late: 4 },
  { day: "Tue", present: 91, absent: 6, late: 3 },
  { day: "Wed", present: 83, absent: 12, late: 5 },
  { day: "Thu", present: 94, absent: 4, late: 2 },
  { day: "Fri", present: 88, absent: 8, late: 4 },
  { day: "Sat", present: 90, absent: 7, late: 3 },
  { day: "Sun", present: 0, absent: 0, late: 0 },
];

const subjectPerformance = [
  { subject: "DSA", attendance: 88, target: 75 },
  { subject: "DBMS", attendance: 92, target: 75 },
  { subject: "CN", attendance: 71, target: 75 },
  { subject: "OS", attendance: 84, target: 75 },
  { subject: "AI", attendance: 95, target: 75 },
  { subject: "Maths", attendance: 78, target: 75 },
];

const attendanceDistribution = [
  { name: "Present", value: 82 },
  { name: "Absent", value: 12 },
  { name: "Late", value: 6 },
];

const verificationMethods = [
  { method: "Face verification", attempts: 420 },
  { method: "QR verification", attempts: 310 },
  { method: "Attendance code", attempts: 170 },
];

const riskDistribution = [
  { level: "Low risk", count: 680 },
  { level: "Medium risk", count: 165 },
  { level: "High risk", count: 45 },
];

const rangeLabels: Record<DateRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

function TeacherAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("7d");

  const summary = useMemo(() => {
    const multiplier =
      dateRange === "7d" ? 1 : dateRange === "30d" ? 4 : 12;

    return {
      attendance: 86.4,
      totalStudents: 120,
      totalSessions: 48 * multiplier,
      verificationRate: 94.8,
      highRisk: 45 * multiplier,
      attendanceChange: 3.2,
      verificationChange: 1.8,
    };
  }, [dateRange]);

  const handleExport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Date range", rangeLabels[dateRange]],
      ["Average attendance", `${summary.attendance}%`],
      ["Total students", String(summary.totalStudents)],
      ["Total sessions", String(summary.totalSessions)],
      ["Verification success rate", `${summary.verificationRate}%`],
      ["High-risk attempts", String(summary.highRisk)],
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `argus-analytics-${dateRange}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Monitor attendance patterns, verification performance and student participation."
      />

      {/* Date range and export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 border border-border p-1">
          {(["7d", "30d", "90d"] as DateRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDateRange(range)}
              className={`px-3 py-2 text-xs transition-colors ${
                dateRange === range
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {rangeLabels[range]}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-none"
          onClick={handleExport}
        >
          <Download className="size-4" />
          Export summary
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Average attendance"
          value={`${summary.attendance}%`}
          description="Across recorded sessions"
          icon={Users}
          change={summary.attendanceChange}
        />

        <MetricCard
          label="Total students"
          value={String(summary.totalStudents)}
          description="Students in assigned classes"
          icon={Users}
        />

        <MetricCard
          label="Total sessions"
          value={String(summary.totalSessions)}
          description={rangeLabels[dateRange]}
          icon={CalendarDays}
        />

        <MetricCard
          label="Verification success"
          value={`${summary.verificationRate}%`}
          description="Successful verification attempts"
          icon={ShieldAlert}
          change={summary.verificationChange}
        />
      </div>

      {/* Attendance trend */}
      <SectionCard
        title="Attendance trend"
        description="Daily attendance distribution across recorded sessions."
      >
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={attendanceTrend}
              margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                stroke="var(--muted-foreground)"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 0,
                  fontSize: 11,
                }}
                formatter={(value) => [`${value}%`]}
              />

              <Legend wrapperStyle={{ fontSize: 11 }} />

              <Line
                type="monotone"
                dataKey="present"
                name="Present"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              <Line
                type="monotone"
                dataKey="absent"
                name="Absent"
                stroke="var(--chart-5)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />

              <Line
                type="monotone"
                dataKey="late"
                name="Late"
                stroke="var(--chart-4)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Subject and distribution charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Subject-wise attendance"
          description="Attendance percentage compared with the 75% requirement."
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectPerformance}
                margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 11 }}
                  stroke="var(--muted-foreground)"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 0,
                    fontSize: 11,
                  }}
                  formatter={(value) => [`${value}%`, "Attendance"]}
                />

                <Bar
                  dataKey="attendance"
                  name="Attendance"
                  fill="var(--chart-2)"
                  barSize={26}
                />

                <Bar
                  dataKey="target"
                  name="Minimum requirement"
                  fill="var(--chart-4)"
                  barSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Attendance distribution"
          description="Proportion of present, absent and late records."
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={88}
                  innerRadius={48}
                  paddingAngle={2}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 0,
                    fontSize: 11,
                  }}
                  formatter={(value) => [`${value}%`]}
                />

                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Verification analytics */}
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Verification methods"
          description="Distribution of attendance verification attempts."
        >
          <div className="space-y-5">
            {verificationMethods.map((item) => {
              const total = verificationMethods.reduce(
                (sum, method) => sum + method.attempts,
                0,
              );

              const percentage = Math.round(
                (item.attempts / total) * 100,
              );

              return (
                <div key={item.method}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-foreground">
                      {item.method}
                    </span>

                    <span className="font-mono text-xs text-muted-foreground">
                      {item.attempts} · {percentage}%
                    </span>
                  </div>

                  <div className="h-2 bg-muted">
                    <div
                      className="h-full bg-foreground"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Risk distribution"
          description="Illustrative risk classification of verification attempts."
        >
          <div className="space-y-4">
            {riskDistribution.map((item) => {
              const total = riskDistribution.reduce(
                (sum, risk) => sum + risk.count,
                0,
              );

              const percentage = Math.round(
                (item.count / total) * 100,
              );

              const tone =
                item.level === "High risk"
                  ? "danger"
                  : item.level === "Medium risk"
                    ? "warning"
                    : "success";

              return (
                <div
                  key={item.level}
                  className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0"
                >
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {item.level}
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {percentage}% of classified attempts
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-foreground">
                      {item.count}
                    </span>

                    <StatusChip tone={tone}>
                      {item.level}
                    </StatusChip>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Alerts and insights */}
      <SectionCard
        title="Attendance insights"
        description="Items that may require faculty attention."
      >
        <div className="space-y-0">
          <InsightRow
            icon={AlertTriangle}
            title="Computer Networks below requirement"
            description="Current sample attendance is 71%, below the 75% threshold."
            status="Attention required"
            tone="danger"
          />

          <InsightRow
            icon={Activity}
            title="Engineering Mathematics near threshold"
            description="Current sample attendance is 78%. Monitor future attendance."
            status="Monitor"
            tone="warning"
          />

          <InsightRow
            icon={CheckCircle2}
            title="Database Management Systems performing well"
            description="Current sample attendance is 92%."
            status="On track"
            tone="success"
          />
        </div>
      </SectionCard>

      {/* Footer notice */}
      <div className="border border-border bg-muted/20 p-4">
        <p className="text-xs font-semibold text-foreground">
          Analytics data notice
        </p>

        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          All charts, metrics, verification counts and risk classifications
          on this page are demonstration data. Date-range selection changes
          the displayed summary only; it does not query historical records.
          Connect the analytics API before using these figures for
          institutional decisions.
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  change,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Users;
  change?: number;
}) {
  return (
    <div className="border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-muted-foreground">
          {label}
        </p>

        <Icon className="size-4 text-muted-foreground" />
      </div>

      <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="text-[10px] text-muted-foreground">
          {description}
        </p>

        {change !== undefined && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            {change >= 0 ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}

function InsightRow({
  icon: Icon,
  title,
  description,
  status,
  tone,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  status: string;
  tone: "success" | "warning" | "danger";
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">
            {title}
          </p>

          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <StatusChip tone={tone}>
          {status}
        </StatusChip>
      </div>
    </div>
  );
}
