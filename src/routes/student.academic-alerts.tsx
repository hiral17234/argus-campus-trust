
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  ShieldAlert,
} from "lucide-react";

import { PageHeader } from "@/components/argus/page-header";
import { SectionCard } from "@/components/argus/section-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/academic-alerts")({
  head: () => ({
    meta: [
      { title: "Academic Alerts | ARGUS" },
      {
        name: "description",
        content: "View academic alerts, attendance warnings and important deadlines.",
      },
    ],
  }),
  component: AcademicAlertsPage,
});

type AlertCategory =
  | "Attendance"
  | "Academic"
  | "Verification"
  | "Deadline"
  | "System";

type AlertPriority = "Critical" | "Warning" | "Information";

type AcademicAlert = {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  priority: AlertPriority;
  date: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionTo?: string;
};

const initialAlerts: AcademicAlert[] = [
  {
    id: "ALT-001",
    title: "Attendance below required threshold",
    description:
      "Your attendance in Mathematics is 68%. The minimum required attendance is 75%.",
    category: "Attendance",
    priority: "Critical",
    date: "31 Oct 2026",
    time: "10:30 AM",
    read: false,
    actionLabel: "View attendance",
    actionTo: "/student/attendance",
  },
  {
    id: "ALT-002",
    title: "Attendance warning",
    description:
      "Your attendance in Computer Networks is approaching the minimum required threshold.",
    category: "Attendance",
    priority: "Warning",
    date: "30 Oct 2026",
    time: "02:15 PM",
    read: false,
    actionLabel: "View attendance",
    actionTo: "/student/attendance",
  },
  {
    id: "ALT-003",
    title: "Face verification required",
    description:
      "Your registered face profile requires verification before your next attendance session.",
    category: "Verification",
    priority: "Warning",
    date: "29 Oct 2026",
    time: "11:00 AM",
    read: false,
    actionLabel: "Review verification",
    actionTo: "/student/verify",
  },
  {
    id: "ALT-004",
    title: "Assignment submission deadline",
    description:
      "Your Data Science assignment is scheduled for submission on 05 November 2026.",
    category: "Deadline",
    priority: "Information",
    date: "28 Oct 2026",
    time: "09:00 AM",
    read: true,
  },
  {
    id: "ALT-005",
    title: "Academic record updated",
    description:
      "Your recent attendance record has been updated in the institutional system.",
    category: "Academic",
    priority: "Information",
    date: "27 Oct 2026",
    time: "04:20 PM",
    read: true,
  },
  {
    id: "ALT-006",
    title: "New device registration",
    description:
      "A device registration request was recorded for your student account.",
    category: "System",
    priority: "Information",
    date: "26 Oct 2026",
    time: "01:45 PM",
    read: true,
  },
];

const filters = [
  "All",
  "Unread",
  "Attendance",
  "Academic",
  "Verification",
  "Deadline",
  "System",
] as const;

type AlertFilter = (typeof filters)[number];

function getPriorityTone(priority: AlertPriority) {
  switch (priority) {
    case "Critical":
      return "danger" as const;
    case "Warning":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
}

function getAlertIcon(category: AlertCategory) {
  switch (category) {
    case "Attendance":
      return AlertTriangle;
    case "Academic":
      return BookIcon;
    case "Verification":
      return ShieldAlert;
    case "Deadline":
      return CalendarDays;
    case "System":
      return Bell;
  }
}

function BookIcon() {
  return <FileText className="size-4" />;
}

function AcademicAlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeFilter, setActiveFilter] = useState<AlertFilter>("All");

  const unreadCount = alerts.filter((alert) => !alert.read).length;
  const criticalCount = alerts.filter(
    (alert) => alert.priority === "Critical",
  ).length;

  const filteredAlerts = useMemo(() => {
    if (activeFilter === "All") return alerts;

    if (activeFilter === "Unread") {
      return alerts.filter((alert) => !alert.read);
    }

    return alerts.filter((alert) => alert.category === activeFilter);
  }, [alerts, activeFilter]);

  function markAsRead(id: string) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert,
      ),
    );
  }

  function markAllAsRead() {
    setAlerts((current) =>
      current.map((alert) => ({ ...alert, read: true })),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Student dashboard
        </Link>

        <PageHeader
          title="Academic alerts"
          description="Monitor attendance warnings, academic deadlines and important account notifications."
        />
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Total alerts
            </span>
            <Bell className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {alerts.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            All notifications
          </p>
        </div>

        <div className="border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Unread alerts
            </span>
            <Info className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {unreadCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Require your attention
          </p>
        </div>

        <div className="border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Critical alerts
            </span>
            <AlertCircle className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {criticalCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Require immediate attention
          </p>
        </div>
      </div>

      {/* Critical notice */}
      {criticalCount > 0 && (
        <div className="flex items-start gap-3 border border-destructive/40 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              You have {criticalCount} critical academic alert
              {criticalCount > 1 ? "s" : ""}.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Review these alerts and contact the concerned faculty or
              department if any information requires correction.
            </p>
          </div>
        </div>
      )}

      {/* Alerts list */}
      <SectionCard
        title="Notifications"
        description="Your academic and institutional activity updates."
        action={
          unreadCount > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          ) : undefined
        }
      >
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {filters.map((filter) => {
              const selected = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`border px-3 py-1.5 text-xs transition-colors ${
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                  {filter === "Unread" && unreadCount > 0 && (
                    <span className="ml-1.5 tabular-nums">
                      ({unreadCount})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Alert items */}
          {filteredAlerts.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredAlerts.map((alert) => {
                const Icon = getAlertIcon(alert.category);

                return (
                  <article
                    key={alert.id}
                    className={`py-4 first:pt-1 last:pb-1 ${
                      !alert.read ? "bg-muted/20" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 px-2">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-border bg-background">
                        <Icon className="size-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-medium text-foreground">
                            {alert.title}
                          </h3>

                          {!alert.read && (
                            <span className="size-1.5 bg-primary" />
                          )}
                        </div>

                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                          {alert.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <StatusChip
                            tone={getPriorityTone(alert.priority)}
                            dot={false}
                          >
                            {alert.priority}
                          </StatusChip>

                          <StatusChip tone="neutral" dot={false}>
                            {alert.category}
                          </StatusChip>

                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <CalendarDays className="size-3" />
                            {alert.date}
                          </span>

                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock3 className="size-3" />
                            {alert.time}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {alert.actionTo && alert.actionLabel && (
                            <Link
                              to={alert.actionTo}
                              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                            >
                              {alert.actionLabel}
                              <ChevronRight className="size-3.5" />
                            </Link>
                          )}

                          {!alert.read && (
                            <button
                              type="button"
                              onClick={() => markAsRead(alert.id)}
                              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-border px-4 py-12 text-center">
              <CheckCircle2 className="size-7 text-muted-foreground" />

              <h3 className="mt-3 text-sm font-medium text-foreground">
                No alerts found
              </h3>

              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                There are no notifications in this category at the moment.
              </p>

              {activeFilter !== "All" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setActiveFilter("All")}
                >
                  View all alerts
                </Button>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* Information */}
      <div className="flex items-start gap-3 border border-border bg-card p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <div>
          <p className="text-xs font-medium text-foreground">
            About academic alerts
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Alerts are intended to keep you informed about attendance,
            academic deadlines and identity verification. For corrections
            to academic records, contact your department coordinator.
          </p>
        </div>
      </div>
    </div>
  );
}
