import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileClock,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/teacher/")({
  component: TeacherDashboard,
});

const overview = [
  {
    label: "Assigned classes",
    value: "06",
    description: "Across current semester",
    icon: BookOpen,
  },
  {
    label: "Total students",
    value: "248",
    description: "Across assigned classes",
    icon: Users,
  },
  {
    label: "Average attendance",
    value: "86.4%",
    description: "Demonstration data",
    icon: Activity,
  },
  {
    label: "Pending appeals",
    value: "04",
    description: "Require review",
    icon: FileClock,
  },
];

const todayClasses = [
  {
    time: "09:00 – 10:00",
    subject: "Data Structures and Algorithms",
    code: "CS301",
    room: "Lecture Hall 204",
    students: 48,
    status: "Completed",
  },
  {
    time: "11:00 – 12:00",
    subject: "Database Management Systems",
    code: "CS302",
    room: "Lab 03",
    students: 42,
    status: "Upcoming",
  },
  {
    time: "14:00 – 15:00",
    subject: "Operating Systems",
    code: "CS303",
    room: "Lecture Hall 105",
    students: 45,
    status: "Upcoming",
  },
];

const recentActivity = [
  {
    student: "Aarav Sharma",
    rollNumber: "MITS23CS041",
    subject: "Data Structures and Algorithms",
    time: "09:42 AM",
    method: "Face verification",
    status: "Present",
  },
  {
    student: "Priya Verma",
    rollNumber: "MITS23CS056",
    subject: "Database Management Systems",
    time: "09:35 AM",
    method: "QR verification",
    status: "Present",
  },
  {
    student: "Rohan Gupta",
    rollNumber: "MITS23CS063",
    subject: "Operating Systems",
    time: "09:28 AM",
    method: "Attendance code",
    status: "Late",
  },
  {
    student: "Ananya Singh",
    rollNumber: "MITS23CS072",
    subject: "Data Structures and Algorithms",
    time: "09:21 AM",
    method: "Face verification",
    status: "Present",
  },
];

const quickActions = [
  {
    title: "Manage classes",
    description: "View assigned subjects and class details.",
    icon: BookOpen,
    to: "/teacher/classes",
  },
  {
    title: "Attendance history",
    description: "Review and export attendance records.",
    icon: CalendarDays,
    to: "/teacher/history",
  },
  {
    title: "Review appeals",
    description: "Check and process student appeals.",
    icon: FileClock,
    to: "/teacher/appeals",
  },
  {
    title: "View analytics",
    description: "Explore attendance and verification trends.",
    icon: Activity,
    to: "/teacher/analytics",
  },
];

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Dashboard"
        description="Overview of your classes, attendance activity, and student requests."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Dashboard data</span>
          <StatusChip status="Demo data" />
        </div>
        <span className="text-xs text-muted-foreground">
          Live institutional data will appear after backend integration.
        </span>
      </div>

      {/* Overview metrics */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Overview</h2>
          <span className="text-xs text-muted-foreground">
            Current semester
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {overview.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <p className="mt-4 text-2xl font-semibold tabular-nums">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Schedule and pending work */}
      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <SectionCard
          title="Today's schedule"
          description="Your scheduled teaching sessions."
          action={
            <Link
              to="/teacher/classes"
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
            >
              All classes
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="divide-y divide-border">
            {todayClasses.map((session) => (
              <div
                key={`${session.code}-${session.time}`}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-muted/30">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {session.subject}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {session.code} · {session.room}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      {session.time}
                      <span className="mx-1">·</span>
                      {session.students} students
                    </p>
                  </div>
                </div>

                <StatusChip
                  status={session.status}
                  className="w-fit shrink-0"
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Pending actions"
          description="Items that may require your attention."
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border">
                <FileClock className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Student appeals</p>
                  <span className="text-sm font-semibold tabular-nums">
                    04
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Appeals awaiting faculty review.
                </p>
                <Link
                  to="/teacher/appeals"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  Review appeals
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  Verification monitoring
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review verification and risk records through attendance
                  history.
                </p>
                <Link
                  to="/teacher/history"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  View records
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Recent attendance */}
      <SectionCard
        title="Recent attendance activity"
        description="Illustrative records from recent verification sessions."
        action={
          <Link
            to="/teacher/history"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            View history
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Subject</th>
                <th className="px-3 py-3 font-medium">Verification</th>
                <th className="px-3 py-3 font-medium">Time</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentActivity.map((record) => (
                <tr key={record.rollNumber}>
                  <td className="px-3 py-3">
                    <p className="font-medium">{record.student}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {record.rollNumber}
                    </p>
                  </td>

                  <td className="px-3 py-3">
                    <span className="text-xs">{record.subject}</span>
                  </td>

                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {record.method}
                  </td>

                  <td className="px-3 py-3 text-xs tabular-nums text-muted-foreground">
                    {record.time}
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Quick actions */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold">Quick access</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Navigate to your primary teaching tools.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group border border-border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>

                <p className="mt-4 text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Backend integration notice */}
      <div className="flex items-start gap-3 border border-border bg-muted/20 p-4">
        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            Teacher workspace integration
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Classes, student lists, attendance records, appeals, and analytics
            currently use demonstration data. These sections must be connected
            to authenticated teacher-specific API endpoints before production
            use.
          </p>
        </div>
      </div>
    </div>
  );
}
