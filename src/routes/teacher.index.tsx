import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  FileBarChart,
  KeyRound,
  PauseCircle,
  PlayCircle,
  QrCode,
  RotateCcw,
  ShieldAlert,
  SquarePen,
  StopCircle,
  TrendingDown,
  Users,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { MetricCard } from "@/components/argus/metric-card";
import { StatusChip } from "@/components/argus/status-chip";
import { NotificationCard } from "@/components/argus/notification-card";
import { AttendanceTrendChart, SubjectAttendanceChart } from "@/components/argus/charts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  classStatusTone,
  lowAttendanceStudents,
  sessionHistory,
  spoofAttempts,
  teacher,
  teacherAppeals,
  teacherAppealTone,
  teacherClasses,
  teacherNotifications,
  teacherSubjectAttendance,
  teacherWeekly,
} from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/")({
  head: () => ({
    meta: [
      { title: "Faculty Dashboard — ARGUS" },
      {
        name: "description",
        content:
          "Run verified attendance sessions, monitor spoof attempts and act on appeals from the ARGUS faculty dashboard.",
      },
      { property: "og:title", content: "Faculty Dashboard — ARGUS" },
      {
        property: "og:description",
        content: "Today's schedule, live session control, spoof alerts and class analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeacherDashboard,
});

const quickActions = [
  { label: "Open attendance", icon: PlayCircle, to: "/teacher/session" as const },
  { label: "Pause attendance", icon: PauseCircle },
  { label: "Close attendance", icon: StopCircle },
  { label: "Reopen attendance", icon: RotateCcw },
  { label: "Generate QR", icon: QrCode, to: "/teacher/session" as const },
  { label: "Attendance code", icon: KeyRound, to: "/teacher/session" as const },
  { label: "Manual attendance", icon: SquarePen, to: "/teacher/live" as const },
  { label: "Reports", icon: FileBarChart, to: "/teacher/reports" as const },
];

function TeacherDashboard() {
  const live = teacherClasses.find((c) => c.status === "Live");
  const pendingAppeals = teacherAppeals.filter((a) => a.status === "Pending");

  return (
    <>
      <PageHeader
        title={`Good afternoon, ${teacher.name.replace("Dr. ", "")}`}
        description={`${teacher.designation} · ${teacher.department} · ${teacherClasses.length} sessions scheduled today`}
        actions={
          <Button size="sm" asChild>
            <Link to="/teacher/session">
              <PlayCircle />
              Open attendance
            </Link>
          </Button>
        }
      />

      {live ? (
        <SectionCard
          title="Current class"
          description={`${live.code} · ${live.subject} · ${live.room}`}
          action={<StatusChip tone="success">Live now</StatusChip>}
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0 space-y-3">
              <p className="text-[13px] text-muted-foreground">
                Topic · <span className="text-foreground">{live.topic}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <StatusChip tone="info">{live.time}</StatusChip>
                <StatusChip tone="neutral" dot={false}>
                  {live.year} · {live.branch} · Sec {live.section}
                </StatusChip>
                <StatusChip tone="warning">04:12 remaining</StatusChip>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {live.marked} of {live.strength} verified
                  </span>
                  <span className="tabular-nums">
                    {Math.round((live.marked / live.strength) * 100)}%
                  </span>
                </div>
                <Progress value={(live.marked / live.strength) * 100} className="mt-2 h-1.5" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              <Button size="sm" asChild>
                <Link to="/teacher/live">Monitor live</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info("Session paused", { description: `${live.code} is no longer accepting verifications.` })}
              >
                Pause
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Session closed", { description: `${live.marked} students marked present.` })}
              >
                Close
              </Button>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's attendance" value="91.2" unit="%" icon={CheckCircle2} progress={91} hint="Across 4 scheduled sessions" />
        <MetricCard label="Sessions today" value={teacherClasses.length} icon={Users} hint="1 live · 1 completed · 2 upcoming" />
        <MetricCard label="Spoof attempts" value={spoofAttempts.length} icon={ShieldAlert} hint="All blocked automatically" />
        <MetricCard label="Pending appeals" value={pendingAppeals.length} icon={AlertTriangle} hint="Oldest raised 19 hours ago" />
      </div>

      <SectionCard title="Quick actions" description="Session controls available for your current schedule">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickActions.map((action) =>
            action.to ? (
              <Button key={action.label} variant="outline" className="h-auto justify-start gap-2 py-2.5 text-[13px]" asChild>
                <Link to={action.to}>
                  <action.icon className="size-4" />
                  <span className="truncate">{action.label}</span>
                </Link>
              </Button>
            ) : (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto justify-start gap-2 py-2.5 text-[13px]"
                onClick={() => toast.info(action.label, { description: "Applied to the active session." })}
              >
                <action.icon className="size-4" />
                <span className="truncate">{action.label}</span>
              </Button>
            ),
          )}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Today's schedule"
          description="Tap a class to open its details"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/teacher/classes">View all</Link>
            </Button>
          }
          bodyClassName="p-2 sm:p-2"
        >
          <ul className="space-y-1">
            {teacherClasses.map((c) => (
              <li key={c.id}>
                <Link
                  to="/teacher/classes"
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md p-2.5 transition-colors hover:bg-accent/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-foreground">
                      {c.subject} · {c.code}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.time} · {c.room} · {c.year} {c.branch}-{c.section}
                    </p>
                  </div>
                  <StatusChip tone={classStatusTone[c.status]}>{c.status}</StatusChip>
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Today's attendance sessions" description="Verification outcome per session" bodyClassName="p-2 sm:p-2">
          <ul className="space-y-1">
            {sessionHistory.slice(0, 4).map((s) => (
              <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {s.code} · {s.section}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.mode} · {s.rejected} rejected · {s.spoof} spoof
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold tabular-nums text-foreground">
                  {s.present}/{s.strength}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Detected spoof attempts" description="Blocked by liveness and replay detection" bodyClassName="p-2 sm:p-2">
          <ul className="space-y-1">
            {spoofAttempts.map((s) => (
              <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{s.student}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.type} · {s.subject} · {s.time}
                  </p>
                </div>
                <StatusChip tone={s.severity === "High" ? "danger" : "warning"}>{s.severity}</StatusChip>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Low attendance students" description="Below the 75% institutional threshold" bodyClassName="p-2 sm:p-2">
          <ul className="space-y-1">
            {lowAttendanceStudents.map((s) => (
              <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.roll} · {s.subject}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold tabular-nums text-danger">
                  <TrendingDown className="size-3.5" />
                  {s.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Weekly attendance" description="Average across all your sections">
          <AttendanceTrendChart data={teacherWeekly} />
        </SectionCard>
        <SectionCard title="Subject performance" description="Attendance percentage by section">
          <SubjectAttendanceChart data={teacherSubjectAttendance} />
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Pending appeals"
          description="Awaiting your review"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/teacher/appeals">Review</Link>
            </Button>
          }
          bodyClassName="p-2 sm:p-2"
        >
          <ul className="space-y-1">
            {pendingAppeals.map((a) => (
              <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md p-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {a.student} · {a.reference}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{a.subject}</p>
                </div>
                <StatusChip tone={teacherAppealTone[a.status]}>{a.status}</StatusChip>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Recent notifications"
          description="Session and appeal activity"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/teacher/notifications">Open</Link>
            </Button>
          }
          bodyClassName="space-y-2 p-3 sm:p-3"
        >
          {teacherNotifications.slice(0, 3).map((n) => (
            <NotificationCard key={n.id} kind={n.kind} title={n.title} body={n.body} time={n.time} unread={n.unread} />
          ))}
        </SectionCard>
      </div>
    </>
  );
}
