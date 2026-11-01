import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, FileText, Search, Table2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { MetricCard } from "@/components/argus/metric-card";
import { DemoDataNotice, LoadingState } from "@/components/argus/analytics/states";
import { EmptyState } from "@/components/argus/empty-state";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  ATTENDANCE_THRESHOLD,
  dateRanges,
  reportKinds,
  reportRows,
  riskFor,
  type DateRangeKey,
} from "@/lib/analytics-data";
import { teacherAnalyticsSummary } from "@/lib/analytics-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/teacher/reports")({
  head: () => ({
    meta: [
      { title: "Reports — ARGUS Faculty" },
      { name: "description", content: "Generate and preview signed attendance, verification and appeal reports for your sections." },
      { property: "og:title", content: "Reports — ARGUS Faculty" },
      { property: "og:description", content: "Generate and preview signed attendance, verification and appeal reports for your sections." },
    ],
  }),
  component: ReportsPage,
});

const teacherKinds = reportKinds.filter((k) => k.scope.includes("teacher"));

const formats = [
  { label: "Excel (.xlsx)", icon: FileSpreadsheet },
  { label: "CSV (.csv)", icon: Table2 },
  { label: "PDF (.pdf)", icon: FileText },
];

function ReportsPage() {
  const [kind, setKind] = useState(teacherKinds[0]!.key);
  const [range, setRange] = useState<DateRangeKey>("month");
  const [subject, setSubject] = useState("All subjects");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [kind, range, subject]);

  const rows = useMemo(() => {
    const filtered = reportRows.filter(
      (r) =>
        (subject === "All subjects" || r.subject.startsWith(subject)) &&
        (search === "" ||
          r.student.toLowerCase().includes(search.toLowerCase()) ||
          r.roll.toLowerCase().includes(search.toLowerCase())),
    );
    return filtered;
  }, [subject, search]);

  const activeKind = teacherKinds.find((k) => k.key === kind)!;
  const rangeLabel = dateRanges.find((d) => d.key === range)?.label ?? "";

  return (
    <>
      <PageHeader
        title="Reports"
        description="Signed, exportable attendance records with verification evidence for every entry."
      />

      <SectionCard title="Report catalogue" description="Select a report to configure and preview it">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {teacherKinds.map((k) => (
            <button
              key={k.key}
              type="button"
              onClick={() => setKind(k.key)}
              className={cn(
                "rounded-md border p-3 text-left transition-colors",
                kind === k.key
                  ? "border-secondary bg-secondary/5"
                  : "border-border bg-surface hover:bg-surface-muted/60",
              )}
            >
              <p className="text-[13px] font-semibold text-foreground">{k.label}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{k.description}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Attendance %" value={teacherAnalyticsSummary.averageAttendance} unit="%" progress={teacherAnalyticsSummary.averageAttendance} />
        <MetricCard label="Sessions conducted" value={teacherAnalyticsSummary.sessionsConducted} hint="This semester" />
        <MetricCard label="Below threshold" value={teacherAnalyticsSummary.belowThreshold} hint={`${ATTENDANCE_THRESHOLD}% minimum`} />
        <MetricCard label="Pending appeals" value={teacherAnalyticsSummary.pendingAppeals} hint="Awaiting your review" />
      </div>

      <SectionCard title="Filters" description="Preview updates with the selected filters">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="report-range">Period</Label>
            <Select value={range} onValueChange={(v) => setRange(v as DateRangeKey)}>
              <SelectTrigger id="report-range"><SelectValue /></SelectTrigger>
              <SelectContent>
                {dateRanges.map((d) => (
                  <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="report-subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="report-subject"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["All subjects", "CS3021", "CS3110", "CS3402"].map((s) => (
                  <SelectItem key={s} value={s}>{s === "All subjects" ? s : `${s}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="report-search">Search student</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="report-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or roll number"
                className="pl-8"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {formats.map((f) => (
            <Button
              key={f.label}
              variant="outline"
              className="justify-start gap-2"
              onClick={() =>
                toast.success("Report queued", {
                  description: `${activeKind.label} · ${rangeLabel} · ${f.label}`,
                })
              }
            >
              <f.icon className="size-4" /> {f.label}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {activeKind.label} · {rangeLabel} · Preview shows {rows.length} of {reportRows.length} records
        </p>
      </SectionCard>

      <SectionCard
        title="Report preview"
        description={`${activeKind.description} — every record carries its verification evidence`}
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="p-4 sm:p-5">
            <LoadingState rows={5} label="Building report preview…" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-4 sm:p-5">
            <EmptyState
              icon={Search}
              title="No records match the current filters"
              description="Try clearing the search box or switching the subject and period filters."
              action={
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSubject("All subjects"); }}>
                  Reset filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll no.</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Sessions</TableHead>
                  <TableHead className="text-right">Present</TableHead>
                  <TableHead className="text-right">Late</TableHead>
                  <TableHead className="text-right">Absent</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const risk = riskFor(r.attendance);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.student}</TableCell>
                      <TableCell className="tabular-nums">{r.roll}</TableCell>
                      <TableCell>{r.subject}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.sessions}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.present}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.late}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.absent}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">
                        {r.attendance}%
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusChip tone={risk === "High Risk" ? "danger" : risk === "Attention" ? "warning" : "success"}>
                          {risk}
                        </StatusChip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <DemoDataNotice />
      <ErrorState
        className="hidden"
        title=""
        description=""
      />
    </>
  );
}
