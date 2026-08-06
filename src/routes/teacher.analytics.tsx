import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { MetricCard } from "@/components/argus/metric-card";
import { AttendanceTrendChart, SubjectAttendanceChart } from "@/components/argus/charts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { teacherAppeals, teacherMonthly, teacherSemester, teacherSubjectAttendance, teacherWeekly } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — ARGUS Faculty" },
      { name: "description", content: "Attendance percentage, rejected attempts, spoof attempts, appeals and confidence analytics." },
      { property: "og:title", content: "Analytics — ARGUS Faculty" },
      { property: "og:description", content: "Attendance percentage, rejected attempts, spoof attempts, appeals and confidence analytics." },
    ],
  }),
  component: TeacherAnalytics,
});

function TeacherAnalytics() {
  const [range, setRange] = useState<string>("weekly");
  const data = range === "weekly" ? teacherWeekly : range === "monthly" ? teacherMonthly : teacherSemester;

  return (
    <>
      <PageHeader title="Analytics" description="Verification quality and attendance behaviour across your sections." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Attendance %" value="89.4" unit="%" progress={89} />
        <MetricCard label="Rejected attempts" value={12} hint="This month" />
        <MetricCard label="Spoof attempts" value={4} hint="All blocked" />
        <MetricCard label="Appeals" value={teacherAppeals.length} hint="2 pending" />
        <MetricCard label="Avg. confidence" value="94.8" unit="%" progress={95} />
      </div>

      <SectionCard
        title="Attendance trend"
        description="Switch between weekly, monthly and semester views"
        action={
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="semester">Semester</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <AttendanceTrendChart data={data} />
      </SectionCard>

      <SectionCard title="Section comparison" description="Attendance percentage by subject and section">
        <SubjectAttendanceChart data={teacherSubjectAttendance} />
      </SectionCard>
    </>
  );
}
