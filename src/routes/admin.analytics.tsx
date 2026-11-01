
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Download,
  ShieldCheck,
  Users,
  UserCheck,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

type Range = "7 days" | "30 days" | "90 days";

const attendanceData: Record<Range, { date: string; attendance: number }[]> = {
  "7 days": [
    { date: "Mon", attendance: 84 },
    { date: "Tue", attendance: 89 },
    { date: "Wed", attendance: 86 },
    { date: "Thu", attendance: 92 },
    { date: "Fri", attendance: 88 },
    { date: "Sat", attendance: 81 },
    { date: "Sun", attendance: 85 },
  ],
  "30 days": [
    { date: "Week 1", attendance: 82 },
    { date: "Week 2", attendance: 86 },
    { date: "Week 3", attendance: 84 },
    { date: "Week 4", attendance: 91 },
  ],
  "90 days": [
    { date: "Aug", attendance: 79 },
    { date: "Sep", attendance: 84 },
    { date: "Oct", attendance: 88 },
    { date: "Nov", attendance: 91 },
  ],
};

const departmentData = [
  { department: "CSE", attendance: 92 },
  { department: "IT", attendance: 89 },
  { department: "ECE", attendance: 86 },
  { department: "ME", attendance: 83 },
  { department: "CE", attendance: 88 },
];

const verificationData = [
  { name: "Verified", value: 78 },
  { name: "Review required", value: 15 },
  { name: "Rejected", value: 7 },
];

const riskData = [
  { level: "Low", count: 640 },
  { level: "Medium", count: 190 },
  { level: "High", count: 52 },
  { level: "Critical", count: 18 },
];

const COLORS = [
  "hsl(var(--chart-2))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function AdminAnalytics() {
  const [range, setRange] = useState<Range>("30 days");

  const chartData = attendanceData[range];

  const averageAttendance = useMemo(() => {
    const total = chartData.reduce(
      (sum, item) => sum + item.attendance,
      0,
    );

    return Math.round(total / chartData.length);
  }, [chartData]);

  const exportCSV = () => {
    const rows = [
      ["ARGUS Institutional Analytics - Demonstration Data"],
      ["Selected range", range],
      [],
      ["Attendance trend"],
      ["Period", "Attendance (%)"],
      ...chartData.map((item) => [item.date, item.attendance]),
      [],
      ["Department attendance"],
      ["Department", "Attendance (%)"],
      ...departmentData.map((item) => [
        item.department,
        item.attendance,
      ]),
      [],
      ["Verification outcomes"],
      ["Outcome", "Percentage (%)"],
      ...verificationData.map((item) => [item.name, item.value]),
      [],
      ["Risk distribution"],
      ["Risk level", "Events"],
      ...riskData.map((item) => [item.level, item.count]),
    ];

    const csv = rows
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
    const link = document.createElement("a");

    link.href = url;
    link.download = "argus-institutional-analytics-demo.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Analytics"
        description="Monitor attendance patterns, verification outcomes, departmental performance, and security risk trends."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Activity className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Analytics overview
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              All metrics and charts on this page use illustrative data.
              Live analytics will require backend aggregation APIs.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Reporting period
          </span>
          <select
            value={range}
            onChange={(event) => setRange(event.target.value as Range)}
            className="h-9 border border-input bg-background px-3 text-sm"
          >
            <option value="7 days">Last 7 days</option>
            <option value="30 days">Last 30 days</option>
            <option value="90 days">Last 90 days</option>
          </select>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex h-9 items-center border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Download className="mr-2 h-4 w-4" />
          Export analytics
        </button>
      </div>

      {/* Key metrics */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Institutional performance
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Average attendance"
            value={`${averageAttendance}%`}
            description={`Selected period: ${range}`}
            icon={UserCheck}
          />
          <Metric
            label="Registered students"
            value="2,450"
            description="Illustrative institution total"
            icon={Users}
          />
          <Metric
            label="Verification success"
            value="78%"
            description="Illustrative verification outcomes"
            icon={ShieldCheck}
          />
          <Metric
            label="Flagged events"
            value="260"
            description="Illustrative risk events"
            icon={AlertTriangle}
          />
        </div>
      </section>

      {/* Attendance trend */}
      <SectionCard
        title="Attendance trend"
        description="Average attendance percentage over the selected reporting period."
      >
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {averageAttendance}% average attendance
          </span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 12, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 0,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value}%`, "Attendance"]}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "hsl(var(--foreground))",
                }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Department and verification charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Department-wise attendance"
          description="Comparison of illustrative average attendance across departments."
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                margin={{ top: 10, right: 12, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, "Attendance"]}
                />
                <Bar
                  dataKey="attendance"
                  fill="hsl(var(--foreground))"
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Verification outcomes"
          description="Illustrative distribution of identity verification attempts."
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verificationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={88}
                  innerRadius={48}
                  paddingAngle={2}
                >
                  {verificationData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, "Share"]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="square"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Risk distribution */}
      <SectionCard
        title="Verification risk distribution"
        description="Illustrative count of verification events grouped by risk level."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Risk level</th>
                <th className="py-3 pr-4 font-medium">Events</th>
                <th className="py-3 pr-4 font-medium">Share</th>
                <th className="py-3 font-medium">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {riskData.map((item) => {
                const total = riskData.reduce(
                  (sum, risk) => sum + risk.count,
                  0,
                );
                const percentage = (item.count / total) * 100;

                return (
                  <tr key={item.level}>
                    <td className="py-3 pr-4 font-medium">
                      {item.level}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {item.count}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="py-3">
                      <div className="h-2 w-full bg-muted">
                        <div
                          className="h-full bg-foreground"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Interpretation */}
      <SectionCard
        title="Analytics interpretation"
        description="How the production dashboard should use these metrics."
      >
        <div className="divide-y divide-border">
          <Interpretation
            title="Attendance monitoring"
            description="Identify departments, subjects, and time periods with consistently low attendance."
          />
          <Interpretation
            title="Verification quality"
            description="Track successful verification, manual review, and rejection rates separately."
          />
          <Interpretation
            title="Risk monitoring"
            description="Investigate high-risk patterns without treating a risk score as proof of misconduct."
          />
          <Interpretation
            title="Data integrity"
            description="Calculate metrics from verified backend records and apply role-based access to analytics."
          />
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Activity;
}) {
  return (
    <div className="border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function Interpretation({
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
