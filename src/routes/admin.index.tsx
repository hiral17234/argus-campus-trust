
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  FileWarning,
  ShieldAlert,
  UserPlus,
  Users,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { MetricCard } from "@/components/argus/metric-card";
import {
  AttendanceTrendChart,
  SubjectAttendanceChart,
} from "@/components/argus/charts";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  admin,
  departments,
  institution,
  institutionTrend,
  manualCorrections,
  securityEvents,
  securityStatusTone,
  severityTone,
  departmentComparison,
  correctionTone,
} from "@/lib/admin-data";

import { adminAnalyticsSummary } from "@/lib/analytics-data";

// Admin dashboard route
export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ARGUS Institution Admin" },
      {
        name: "description",
        content:
          "Institution-wide attendance, verification health, security events and department analytics.",
      },
      {
        property: "og:title",
        content: "Dashboard — ARGUS Institution Admin",
      },
      {
        property: "og:description",
        content:
          "Institution-wide attendance, verification health, security events and department analytics.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const openEvents = securityEvents
    .filter((event) => event.status !== "Resolved")
    .slice(0, 4);

  const pendingCorrections = manualCorrections.filter(
    (correction) => correction.status === "Pending"
  );

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <PageHeader
        title={`Good morning, ${admin.name.split(" ").slice(-1)[0]}`}
        description={`${institution.name} · ${institution.code} — institution overview for today`}
        actions={
          <Button size="sm" asChild>
            <Link to="/admin/reports">
              <FileWarning className="mr-2 size-4" />
              Institution report
            </Link>
          </Button>
        }
      />

      {/* Primary statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Students"
          value={institution.students.toLocaleString()}
          hint={`${adminAnalyticsSummary.belowThreshold} below 75% threshold`}
          icon={Users}
        />

        <MetricCard
          label="Teachers"
          value={institution.teachers}
          hint={`${departments.length} departments shown of ${institution.departments}`}
          icon={UserPlus}
        />

        <MetricCard
          label="Attendance today"
          value={institution.todayAttendance}
          unit="%"
          progress={institution.todayAttendance}
          hint="Institution average"
        />

        <MetricCard
          label="Active sessions"
          value={institution.activeSessions}
          hint="Across 2 campuses"
          icon={CalendarClock}
        />
      </div>

      {/* Verification and security statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Pending appeals"
          value={institution.pendingAppeals}
          hint="SLA: faculty action in 48h"
          icon={FileWarning}
        />

        <MetricCard
          label="Verification failures"
          value={adminAnalyticsSummary.rejectedAttempts}
          hint="Of 13,284 attempts this month"
        />

        <MetricCard
          label="Suspicious attempts"
          value={adminAnalyticsSummary.suspiciousAttempts}
          hint="Blocked by anti-spoofing"
          icon={ShieldAlert}
        />

        <MetricCard
          label="Security alerts"
          value={institution.securityAlerts}
          hint="3 events still open"
        />
      </div>

      {/* Attendance charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Institution attendance"
          description="Weekly average across all departments"
        >
          <AttendanceTrendChart data={institutionTrend} />
        </SectionCard>

        <SectionCard
          title="Department comparison"
          description="Attendance percentage by department"
          action={
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/analytics">Details</Link>
            </Button>
          }
        >
          <SubjectAttendanceChart data={departmentComparison} />
        </SectionCard>
      </div>

      {/* Security events */}
      <SectionCard
        title="Open security events"
        description="Spoof attempts, unknown devices and location violations requiring review"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/security">
              Security centre
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {openEvents.length > 0 ? (
                openEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {event.type}
                    </TableCell>

                    <TableCell>{event.user}</TableCell>

                    <TableCell>
                      <StatusChip tone={severityTone[event.severity]}>
                        {event.severity}
                      </StatusChip>
                    </TableCell>

                    <TableCell>
                      <StatusChip tone={securityStatusTone[event.status]}>
                        {event.status}
                      </StatusChip>
                    </TableCell>

                    <TableCell className="text-right font-mono text-[11px]">
                      {event.time}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No open security events.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* Corrections and departments */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Manual corrections"
          description="Attendance changes awaiting your approval"
        >
          {pendingCorrections.length > 0 ? (
            <ul className="space-y-2">
              {pendingCorrections.map((correction) => (
                <li
                  key={correction.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-surface-muted/40 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {correction.student}
                    </p>

                    <p className="truncate text-[11px] text-muted-foreground">
                      {correction.subject} · {correction.date} · requested by{" "}
                      {correction.requestedBy}
                    </p>
                  </div>

                  <StatusChip tone={correctionTone[correction.status]}>
                    {correction.status}
                  </StatusChip>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              No corrections are waiting for approval.
            </p>
          )}
        </SectionCard>

        <SectionCard
          title="Departments at a glance"
          description="Students, faculty and attendance by department"
        >
          <div className="space-y-2">
            {departments.map((department) => (
              <div
                key={department.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-surface-muted/40 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {department.code} · {department.name}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    {department.students.toLocaleString()} students ·{" "}
                    {department.teachers} teachers · {department.subjects}{" "}
                    subjects
                  </p>
                </div>

                <StatusChip
                  tone={
                    department.attendance >= 90
                      ? "success"
                      : department.attendance >= 85
                        ? "warning"
                        : "danger"
                  }
                >
                  {department.attendance}%
                </StatusChip>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
