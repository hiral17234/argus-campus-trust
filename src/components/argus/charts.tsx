import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

const axisProps = {
  stroke: "var(--color-border-strong)",
  tick: { fill: "var(--color-muted-foreground)", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

function ChartTooltip() {
  return (
    <Tooltip
      cursor={{ fill: "var(--color-surface-muted)" }}
      contentStyle={{
        background: "var(--color-popover)",
        border: "1px solid var(--color-border)",
        borderRadius: 6,
        fontSize: 12,
        color: "var(--color-foreground)",
        boxShadow: "none",
      }}
      labelStyle={{ color: "var(--color-muted-foreground)", fontSize: 11 }}
    />
  );
}

export function SubjectAttendanceChart({
  data,
}: {
  data: { subject: string; percentage: number }[];
}) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton className="h-56 w-full rounded-md" />;
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barSize={22}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="subject" {...axisProps} />
          <YAxis domain={[0, 100]} {...axisProps} />
          {ChartTooltip()}
          <Bar dataKey="percentage" radius={[3, 3, 0, 0]}>
            {data.map((d) => (
              <Cell
                key={d.subject}
                fill={
                  d.percentage >= 75
                    ? "var(--color-chart-1)"
                    : d.percentage >= 65
                      ? "var(--color-warning)"
                      : "var(--color-danger)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AttendanceTrendChart({ data }: { data: { week: string; value: number }[] }) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton className="h-48 w-full rounded-md" />;
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="week" {...axisProps} />
          <YAxis domain={[50, 100]} {...axisProps} />
          {ChartTooltip()}
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            dot={{ r: 2.5, fill: "var(--color-chart-1)", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
