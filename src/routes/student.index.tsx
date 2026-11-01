
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  Cpu,
  FileWarning,
  History,
  KeyRound,
  QrCode,
  ScanFace,
  User,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
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
      { title: "Student Dashboard | ARGUS" },
      {
        name: "description",
        content:
          "View your attendance, classes, verification status and notifications in ARGUS.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  {
    label: "Scan QR",
    icon: QrCode,
    to: "/student/attendance" as const,
  },
  {
    label: "Attendance code",
    icon: KeyRound,
    to: "/student/attendance" as const,
  },
  {
    label: "History",
    icon: History,
    to: "/student/history" as const,
  },
  {
    label: "Appeals",
    icon: FileWarning,
    to: "/student/appeals" as const,
  },
  {
    label: "Profile",
    icon: User,
    to: "/student/profile" as const,
  },
];

function Dashboard() {
  const live = todayClasses.find((item) => item.status === "Live");

  const upcoming = todayClasses.find(
    (item) => item.status === "Upcoming",
  );

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <PageHeader
        title={`Good morning, ${student.name.split(" ")[0]}`}
        description={`${student.branch} · ${student.semester} · Section ${student.section} · ${student.rollNumber}`}
        actions={
          <Link to="/student/attendance">
            <Button size="sm">
              <ScanFace className="size-4" />
              Mark attendance
            </Button>
          </Link>
        }
      />

      {/* Current session */}
      <div className="border border-border bg-card p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip tone={live ? "info" : "neutral"}>
                {live
                  ? "Verification window open"
                  : "No active session"}
              </StatusChip>

              <StatusChip tone="neutral" dot={false}>
                Student portal
              </StatusChip>
            </div>

            <h2 className="mt-3 text-base font-semibold text-foreground">
              {live
                ? `${live.subject} · ${live.code}`
                : "You're all caught up"}
            </h2>

            <p className="mt-1 text-[13px] text-muted-foreground">
              {live
                ? `${live.teacher} · ${live.time} · ${live.room}`
                : upcoming
                  ? `Next session: ${upcoming.subject} · ${upcoming.time} · ${upcoming.room}`
                  : "There are no upcoming classes in the current schedule."}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/student/attendance"
              className="sm:w-auto"
            >
              <Button className="w-full sm:w-auto">
                <QrCode className="size-4" />
                Scan QR
              </Button>
            </Link>

            <Link
              to="/student/attendance"
              className="sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto"
              >
                <KeyRound className="size-4" />
                Enter code
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Overall attendance"
          value="82.4"
          unit="%"
          progress={82.4}
          hint="Demonstration data · Minimum threshold 75%"
        />

        <MetricCard
          label="Sessions this month"
          value="46"
          icon={CalendarCheck}
          hint="Sample: 41 verified · 3 flagged · 2 absent"
        />

        <MetricCard
          label="Average match confidence"
          value="96.8"
          unit="%"
          icon={Activity}
          hint="Sample verification data"
        />

        <MetricCard
          label="Open appeals"
          value="1"
          icon={FileWarning}
          hint="Sample appeal record under review"
        />
      </div>

      {/* Quick actions */}
      <SectionCard
        title="Quick actions"
        description="Access frequently used student portal features."
        bodyClassName="p-3 sm:p-4"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center gap-2.5 border border-border bg-background px-3 py-3 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/30"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />

                <span className="truncate">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </SectionCard>

      {/* Main dashboard columns */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          {/* Today's classes */}
          <SectionCard
            title="Today's classes"
            description="Your scheduled academic sessions."
            bodyClassName="p-0"
            action={
              <Link to="/student/history">
                <Button variant="ghost" size="sm">
                  View history
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            }
          >
            {todayClasses.length > 0 ? (
              <ul className="divide-y divide-border">
                {todayClasses.map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5"
                  >
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-[13px] font-semibold text-foreground">
                          {item.subject}
                        </span>

                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                          {item.code}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                        {item.teacher} · {item.time} · {item.room}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {item.attendance ? (
                        <StatusChip
                          tone={
                            item.attendance === "Present"
                              ? "success"
                              : item.attendance === "Pending"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {item.attendance}
                        </StatusChip>
                      ) : (
                        <StatusChip tone="neutral" dot={false}>
                          {item.status}
                        </StatusChip>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No classes are currently scheduled.
              </div>
            )}
          </SectionCard>

          {/* Subject attendance chart */}
          <SectionCard
            title="Attendance by subject"
            description="Current semester · Minimum threshold 75%"
          >
            <SubjectAttendanceChart data={subjectAttendance} />
          </SectionCard>

          {/* Recent attendance */}
          <SectionCard
            title="Recent attendance"
            description="Your latest attendance records."
            bodyClassName="p-0"
            action={
              <Link to="/student/history">
                <Button variant="ghost" size="sm">
                  Full history
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            }
          >
            {attendanceRecords.length > 0 ? (
              <ul className="divide-y divide-border">
                {attendanceRecords.slice(0, 4).map((record) => (
                  <li
                    key={record.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {record.subject}
                      </p>

                      <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                        {record.date} · {record.time} · {record.method}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
                        {record.confidence > 0
                          ? `${record.confidence}%`
                          : "—"}
                      </span>

                      <StatusChip tone={resultTone[record.result]}>
                        {record.result}
                      </StatusChip>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No attendance records available.
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Upcoming session */}
          <SectionCard
            title="Upcoming attendance session"
            description="Your next scheduled class."
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center border border-border bg-muted/30 text-muted-foreground">
                <CalendarClock className="size-4" />
              </span>

              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground">
                  {upcoming?.subject ?? "No upcoming session"}
                </p>

                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {upcoming
                    ? `${upcoming.teacher} · ${upcoming.time} · ${upcoming.room}`
                    : "No upcoming session in the current schedule."}
                </p>

                {upcoming && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <StatusChip tone="neutral" dot={false}>
                      Face + QR required
                    </StatusChip>

                    <StatusChip tone="neutral" dot={false}>
                      Geofencing
                    </StatusChip>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Verification components */}
          <SectionCard
            title="Verification components"
            description="Services involved in the attendance verification workflow."
          >
            <div className="space-y-3">
              {[
                {
                  label: "Face matching",
                  description: "Identity comparison",
                },
                {
                  label: "Liveness detection",
                  description: "Presentation attack detection",
                },
                {
                  label: "Spoof analysis",
                  description: "Attempt risk assessment",
                },
                {
                  label: "Location validation",
                  description: "Location-based eligibility",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Cpu className="size-3.5 shrink-0 text-muted-foreground" />

                    <div className="min-w-0">
                      <p className="truncate text-[13px] text-foreground">
                        {item.label}
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <StatusChip tone="neutral" dot={false}>
                    Backend status pending
                  </StatusChip>
                </div>
              ))}

              <p className="border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
                Live service health, model version and processing
                latency will be displayed after backend integration.
              </p>
            </div>
          </SectionCard>

          {/* Notifications */}
          <SectionCard
            title="Notifications"
            description="Recent updates and account alerts."
            bodyClassName="space-y-2.5"
            action={
              <Link to="/student/notifications">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            }
          >
            {notifications.length > 0 ? (
              notifications.slice(0, 3).map((notification) => (
                <NotificationCard
                  key={notification.id}
                  kind={notification.kind}
                  title={notification.title}
                  body={notification.body}
                  time={notification.time}
                  unread={notification.unread}
                />
              ))
            ) : (
              <div className="py-5 text-center text-xs text-muted-foreground">
                No new notifications.
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Demo data notice */}
      <div className="border border-border bg-muted/20 p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">
            Demonstration environment:
          </span>{" "}
          Attendance percentages, session counts, subject analytics
          and notification records currently use sample data from
          the frontend dataset. Live institutional records and
          verification service status require backend integration.
        </p>
      </div>
    </div>
  );
}
