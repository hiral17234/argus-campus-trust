import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ActivityIcon,
  ArrowRight,
  CalendarClock,
  CalendarCheck,
  Cpu,
  FileWarning,
  History,
  KeyRound,
  QrCode,
  ScanFace,
  User,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { MetricCard } from "@/components/argus/metric-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { NotificationCard } from "@/components/argus/notification-card";
import { SubjectAttendanceChart } from "@/components/argus/charts";
import {
  attendanceRecords,
  notifications,
  resultTone,
  student,
  subjectAttendance,
  todayClasses,
} from "@/lib/argus-data";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — ARGUS" },
      {
        name: "description",
        content:
          "Track today's classes, attendance percentage, verification sessions and notifications in ARGUS.",
      },
      { property: "og:title", content: "Student Dashboard — ARGUS" },
      {
        property: "og:description",
        content: "Your verified attendance and identity status at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { label: "Scan QR", icon: QrCode, to: "/student/attendance" as const },
  { label: "Attendance code", icon: KeyRound, to: "/student/attendance" as const },
  { label: "History", icon: History, to: "/student/history" as const },
  { label: "Appeals", icon: FileWarning, to: "/student/appeals" as const },
  { label: "Profile", icon: User, to: "/student/profile" as const },
];

function Dashboard() {
  const live = todayClasses.find((c) => c.status === "Live");
  const upcoming = todayClasses.find((c) => c.status === "Upcoming");

  return (
    <>
      <PageHeader
        title={`Good morning, ${student.name.split(" ")[0]}`}
        description={`${student.branch} · ${student.semester} · Section ${student.section} · ${student.rollNumber}`}
        actions={
          <Link to="/student/attendance">
            <Button size="sm">
              <ScanFace />
              Mark attendance
            </Button>
          </Link>
        }
      />

      {/* Welcome / live session card */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-xs sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip tone={live ? "info" : "neutral"}>
                {live ? "Verification window open" : "No active session"}
              </StatusChip>
              <StatusChip tone="success">Face template verified</StatusChip>
              <StatusChip tone="success">Device trusted</StatusChip>
            </div>
            <h2 className="mt-3 text-base font-semibold text-foreground">
              {live ? `${live.subject} · ${live.code}` : "You're all caught up"}
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {live
                ? `${live.teacher} · ${live.time} · ${live.room}. Verification closes in 4 minutes 12 seconds.`
                : `Next session: ${upcoming?.subject ?? "—"} at ${upcoming?.time ?? "—"}.`}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link to="/student/attendance" className="sm:w-auto">
              <Button className="w-full sm:w-auto">
                <QrCode />
                Scan QR
              </Button>
            </Link>
            <Link to="/student/attendance" className="sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <KeyRound />
                Enter code
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Overall attendance"
          value="82.4"
          unit="%"
          progress={82.4}
          hint="Institutional minimum is 75%"
        />
        <MetricCard
          label="Sessions this month"
          value="46"
          icon={CalendarCheck}
          hint="41 verified · 3 flagged · 2 absent"
        />
        <MetricCard
          label="Avg. match confidence"
          value="96.8"
          unit="%"
          icon={ActivityIcon}
          hint="Across face verifications"
        />
        <MetricCard
          label="Open appeals"
          value="1"
          icon={FileWarning}
          hint="APL-2026-0418 under review"
        />
      </div>

      {/* Quick actions */}
      <SectionCard title="Quick actions" bodyClassName="p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-3 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
            >
              <a.icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{a.label}</span>
            </Link>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <SectionCard
            title="Today's classes"
            description="Wednesday, 05 August 2026"
            bodyClassName="p-0"
            action={
              <Link to="/student/history">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight />
                </Button>
              </Link>
            }
          >
            <ul className="divide-y divide-border">
              {todayClasses.map((c) => (
                <li
                  key={c.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5"
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-[13px] font-semibold text-foreground">
                        {c.subject}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        {c.code}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                      {c.teacher} · {c.time} · {c.room}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {c.attendance ? (
                      <StatusChip
                        tone={
                          c.attendance === "Present"
                            ? "success"
                            : c.attendance === "Pending"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {c.attendance}
                      </StatusChip>
                    ) : (
                      <StatusChip tone="neutral" dot={false}>
                        {c.status}
                      </StatusChip>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Attendance by subject"
            description="Current semester · minimum threshold 75%"
          >
            <SubjectAttendanceChart data={subjectAttendance} />
          </SectionCard>

          <SectionCard
            title="Recent attendance"
            bodyClassName="p-0"
            action={
              <Link to="/student/history">
                <Button variant="ghost" size="sm">
                  Full history
                  <ArrowRight />
                </Button>
              </Link>
            }
          >
            <ul className="divide-y divide-border">
              {attendanceRecords.slice(0, 4).map((r) => (
                <li
                  key={r.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">{r.subject}</p>
                    <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                      {r.date} · {r.time} · {r.method}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
                      {r.confidence > 0 ? `${r.confidence}%` : "—"}
                    </span>
                    <StatusChip tone={resultTone[r.result]}>{r.result}</StatusChip>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Upcoming attendance session">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-muted text-muted-foreground">
                <CalendarClock className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground">
                  {upcoming?.subject ?? "No upcoming session"}
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {upcoming ? `${upcoming.teacher} · ${upcoming.time} · ${upcoming.room}` : "—"}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatusChip tone="neutral" dot={false}>
                    Face + QR required
                  </StatusChip>
                  <StatusChip tone="neutral" dot={false}>
                    Geofenced
                  </StatusChip>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="AI verification status">
            <div className="space-y-3">
              {[
                { label: "Face matching engine", value: "Operational", tone: "success" as const },
                { label: "Liveness detection", value: "Operational", tone: "success" as const },
                { label: "Spoof analysis", value: "Operational", tone: "success" as const },
                { label: "Location validation", value: "Degraded", tone: "warning" as const },
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                >
                  <span className="flex min-w-0 items-center gap-2 text-[13px] text-foreground">
                    <Cpu className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{row.label}</span>
                  </span>
                  <StatusChip tone={row.tone}>{row.value}</StatusChip>
                </div>
              ))}
              <p className="border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
                Model v2.4.1 · median latency 340ms · last sync 2 min ago
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Notifications"
            bodyClassName="space-y-2.5"
            action={
              <Link to="/student/notifications">
                <Button variant="ghost" size="sm">
                  All
                  <ArrowRight />
                </Button>
              </Link>
            }
          >
            {notifications.slice(0, 3).map((n) => (
              <NotificationCard
                key={n.id}
                kind={n.kind}
                title={n.title}
                body={n.body}
                time={n.time}
                unread={n.unread}
              />
            ))}
          </SectionCard>
        </div>
      </div>
    </>
  );
}
