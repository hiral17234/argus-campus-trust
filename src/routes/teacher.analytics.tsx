import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { MetricCard } from "@/components/argus/metric-card";
import { AttendanceTrendChart, SubjectAttendanceChart } from "@/components/argus/charts";
import { AttendanceHeatmap } from "@/components/argus/analytics/heatmap";
import { InsightsPanel } from "@/components/argus/analytics/insights";
import { ChartLoadingState, DemoDataNotice, ErrorState, LoadingState, PartialDataNotice } from "@/components/argus/analytics/states";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusChip } from "@/components/argus/status-chip";
import { toast } from "sonner";
import {
  comparisonSets,
  confidenceBuckets,
  confidenceSummary,
  heatmapData,
  teacherAnalyticsSummary,
  teacherInsights,
  teacherSubjectOptions,
  verificationMetrics,
  riskFor,
} from "@/lib/analytics-data";
import { lowAttendanceStudents, teacherWeekly } from "@/lib/teacher-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/teacher/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — ARGUS Faculty" },
      { name: "description", content: "Attendance heatmaps, insights, verification failures, security risks and confidence analytics for your sections." },
      { property: "og:title", content: "Analytics — ARGUS Faculty" },
      { property: "og:description", content: "Attendance heatmaps, insights, verification failures, security risks and confidence analytics for your sections." },
    ],
  }),
  component: TeacherAnalytics,
});

type HeatmapView = "day" | "week" | "month" | "session";

function TeacherAnalytics() {
  const [subject, setSubject] = useState("All subjects");
  const [heatView, setHeatView] = useState<HeatmapView>("day");
  const [compare, setCompare] = useState<keyof typeof comparisonSets>("sections");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Simulated fetch: refetch whenever the filters change so the loading and
  // error states are exercised like a real analytics request.
  useEffect(() => {
    setLoading(true);
    setError(false);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [subject, heatView, compare]);

  const seed = 11 + subject.length + heatView.length * 3;
  const heat = heatmapData(heatView, seed);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Attendance behaviour, verification quality and risk indicators across your subjects."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Analytics export queued", { description: "You will receive a CSV by email." })}
          >
            <Download /> Export
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Label className="sr-only" htmlFor="subject-filter">Subject filter</Label>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger id="subject-filter" aria-label="Subject filter"><SelectValue /></SelectTrigger>
          <SelectContent>
            {teacherSubjectOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="sm:col-span-2 flex items-center text-[12px] text-muted-foreground">
          Figures update with the selected subject and period.
        </div>
      </div>

      {error ? (
        <ErrorState onRetry={() => setError(false)} />
      ) : loading ? (
        <LoadingState rows={4} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Average attendance" value={teacherAnalyticsSummary.averageAttendance} unit="%" progress={teacherAnalyticsSummary.averageAttendance} />
            <MetricCard label="Below 75%" value={teacherAnalyticsSummary.belowThreshold} hint="Students flagged for detention review" />
            <MetricCard label="Rejected attempts" value={teacherAnalyticsSummary.rejected} hint="This month" />
            <MetricCard label="Security-flagged" value={teacherAnalyticsSummary.suspicious} hint="Replay, print or synthetic media" />
            <MetricCard label="Late verifications" value={teacherAnalyticsSummary.lateCount} hint="Outside the default window" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Attendance trend" description="Weekly average across your sections">
              <AttendanceTrendChart data={teacherWeekly} />
            </SectionCard>
            <SectionCard title="Insights" description="Derived from your session records and suggested actions">
              <InsightsPanel insights={teacherInsights} />
            </SectionCard>
          </div>

          <SectionCard
            title="Attendance heatmap"
            description="Attendance percentage by slot and period — gaps and low slots stand out"
            action={
              <Tabs value={heatView} onValueChange={(v) => setHeatView(v as HeatmapView)}>
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="session">Session</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          >
            <AttendanceHeatmap data={heat} />
          </SectionCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Verification failures" description="Where the identity pipeline rejects attempts">
              <ul className="space-y-2">
                {verificationMetrics.filter((m) => m.kind === "failure").map((m) => (
                  <li key={m.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-surface-muted/40 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground">{m.label}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{m.description}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-foreground">{m.count.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title="Security risk indicators" description="Signals that require review — not automatic verdicts">
              <ul className="space-y-2">
                {verificationMetrics.filter((m) => m.kind === "risk").map((m) => (
                  <li key={m.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-surface-muted/40 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground">{m.label}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{m.description}</p>
                    </div>
                    <StatusChip tone="warning">{m.count.toLocaleString()}</StatusChip>
                  </li>
                ))}
              </ul>
              <PartialDataNotice>
                Risk indicators are advisory. Confirm each case in the verification review before acting on a student record.
              </PartialDataNotice>
            </SectionCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard
              title="Confidence distribution"
              description={`Average ${confidenceSummary.average}% across ${confidenceSummary.sampled.toLocaleString()} sampled attempts`}
            >
              <SubjectAttendanceChart data={confidenceBuckets} />
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Successful", value: confidenceSummary.success },
                  { label: "Failed", value: confidenceSummary.failed },
                  { label: "Average", value: confidenceSummary.average },
                ].map((s) => (
                  <div key={s.label} className="rounded-md border border-border bg-surface-muted/40 p-2.5">
                    <p className="text-lg font-semibold tabular-nums text-foreground">{s.value}%</p>
                    <p className="text-[11px] text-muted-foreground">{s.label} attempts</p>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard
              title="Comparisons"
              description="Attendance side by side across subjects, sections and departments"
              action={
                <Tabs value={compare} onValueChange={(v) => setCompare(v as keyof typeof comparisonSets)}>
                  <TabsList>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    <TabsTrigger value="sections">Sections</TabsTrigger>
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                    <TabsTrigger value="periods">Periods</TabsTrigger>
                  </TabsList>
                </Tabs>
              }
            >
              <SubjectAttendanceChart data={comparisonSets[compare].series} />
              <p className="mt-2 text-[11px] text-muted-foreground">{comparisonSets[compare].label}</p>
            </SectionCard>
          </div>

          <SectionCard
            title="Students below threshold"
            description="Sorted by attendance percentage — review before detention lists are published"
          >
            {lowAttendanceStudents.length ? (
              <ul className="space-y-2">
                {lowAttendanceStudents
                  .slice()
                  .sort((a, b) => a.attendance - b.attendance)
                  .map((s) => {
                    const risk = riskFor(s.attendance);
                    return (
                      <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-surface-muted/40 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-foreground">{s.name} · {s.roll}</p>
                          <div className="mt-2 h-1.5 w-full max-w-56 overflow-hidden rounded-full bg-surface">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                s.attendance < 65 ? "bg-danger" : s.attendance < 75 ? "bg-warning" : "bg-secondary",
                              )}
                              style={{ width: `${s.attendance}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold tabular-nums text-foreground">{s.attendance}%</span>
                          <StatusChip tone={risk === "High Risk" ? "danger" : risk === "Attention" ? "warning" : "success"}>
                            {risk}
                          </StatusChip>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <p className="text-[13px] text-muted-foreground">No students are below the 75% threshold for the selected subject.</p>
            )}
          </SectionCard>

          <DemoDataNotice />
          <p className="text-[12px] text-muted-foreground">
            Need a deeper verification breakdown? Open <Link to="/teacher/reports" className="underline underline-offset-4">Reports</Link> for exportable records.
          </p>
        </>
      )}
    </>
  );
}
