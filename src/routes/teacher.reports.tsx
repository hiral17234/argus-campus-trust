import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, FileText, Table2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { MetricCard } from "@/components/argus/metric-card";
import { AttendanceTrendChart, SubjectAttendanceChart } from "@/components/argus/charts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { lowAttendanceStudents, spoofAttempts, teacherSubjectAttendance, teacherWeekly, teacherClasses } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/reports")({
  head: () => ({
    meta: [
      { title: "Reports — ARGUS Faculty" },
      { name: "description", content: "Generate Excel, CSV and PDF attendance reports with trends, low attendance and spoof analytics." },
      { property: "og:title", content: "Reports — ARGUS Faculty" },
      { property: "og:description", content: "Generate Excel, CSV and PDF attendance reports with trends, low attendance and spoof analytics." },
    ],
  }),
  component: ReportsPage,
});

const formats = [
  { label: "Excel (.xlsx)", icon: FileSpreadsheet },
  { label: "CSV (.csv)", icon: Table2 },
  { label: "PDF (.pdf)", icon: FileText },
];

function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Signed attendance reports for your sections and subjects." />

      <SectionCard title="Generate report" description="Reports include verification evidence for every record">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select defaultValue={teacherClasses[0]!.code}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {teacherClasses.map((c) => (
                  <SelectItem key={c.id} value={c.code}>{c.code} · {c.subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Select defaultValue="monthly">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["daily", "weekly", "monthly", "semester"].map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Report type</Label>
            <Select defaultValue="attendance">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance percentage</SelectItem>
                <SelectItem value="trends">Student trends</SelectItem>
                <SelectItem value="low">Low attendance</SelectItem>
                <SelectItem value="spoof">Spoof attempts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {formats.map((f) => (
            <Button key={f.label} variant="outline" className="justify-start gap-2" onClick={() => toast.success("Report queued", { description: f.label })}>
              <f.icon className="size-4" /> {f.label}
            </Button>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Attendance %" value="89.4" unit="%" progress={89} />
        <MetricCard label="Low attendance" value={lowAttendanceStudents.length} hint="Below 75% threshold" />
        <MetricCard label="Spoof attempts" value={spoofAttempts.length} hint="All blocked" />
        <MetricCard label="Sessions conducted" value={214} hint="This semester" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Attendance trend" description="Weekly average across sections">
          <AttendanceTrendChart data={teacherWeekly} />
        </SectionCard>
        <SectionCard title="Attendance percentage" description="By subject and section">
          <SubjectAttendanceChart data={teacherSubjectAttendance} />
        </SectionCard>
      </div>
    </>
  );
}
