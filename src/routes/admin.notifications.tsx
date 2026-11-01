
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Search,
  ShieldAlert,
  Users,
  CalendarDays,
  Settings,
  AlertTriangle,
  X,
  Clock3,
  GraduationCap,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

type NotificationCategory =
  | "Security"
  | "Attendance"
  | "Academic"
  | "System"
  | "User Management";

type NotificationPriority = "Low" | "Medium" | "High" | "Critical";

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
};

const initialNotifications: NotificationRecord[] = [
  {
    id: "NOT-001",
    title: "Multiple failed login attempts",
    message:
      "Several unsuccessful login attempts were recorded for an administrative account. Review the authentication logs.",
    category: "Security",
    priority: "Critical",
    timestamp: "2026-11-05T09:36:00",
    read: false,
  },
  {
    id: "NOT-002",
    title: "High-risk verification flagged",
    message:
      "A student verification attempt was flagged by the demonstration risk monitoring workflow.",
    category: "Security",
    priority: "High",
    timestamp: "2026-11-05T09:42:00",
    read: false,
  },
  {
    id: "NOT-003",
    title: "Attendance below expected level",
    message:
      "The illustrative attendance summary indicates that one department requires attention.",
    category: "Attendance",
    priority: "Medium",
    timestamp: "2026-11-05T10:05:00",
    read: false,
  },
  {
    id: "NOT-004",
    title: "New faculty account created",
    message:
      "A faculty account was added to the demonstration institution directory.",
    category: "User Management",
    priority: "Low",
    timestamp: "2026-11-05T10:15:00",
    read: true,
  },
  {
    id: "NOT-005",
    title: "Academic subject updated",
    message:
      "The academic subject catalogue contains an updated subject record.",
    category: "Academic",
    priority: "Low",
    timestamp: "2026-11-05T10:25:00",
    read: true,
  },
  {
    id: "NOT-006",
    title: "System backup event",
    message:
      "A demonstration database backup completion event was recorded.",
    category: "System",
    priority: "Low",
    timestamp: "2026-11-05T11:00:00",
    read: false,
  },
  {
    id: "NOT-007",
    title: "Unauthorized resource access blocked",
    message:
      "A request to access a protected administrative resource was blocked in the demonstration security log.",
    category: "Security",
    priority: "Critical",
    timestamp: "2026-11-05T11:12:00",
    read: false,
  },
  {
    id: "NOT-008",
    title: "Student directory updated",
    message:
      "A student account record was updated in the demonstration directory.",
    category: "User Management",
    priority: "Medium",
    timestamp: "2026-11-05T11:30:00",
    read: true,
  },
];

const categoryOptions = [
  "All",
  "Security",
  "Attendance",
  "Academic",
  "System",
  "User Management",
] as const;

const readOptions = ["All", "Unread", "Read"] as const;

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getCategoryIcon(category: NotificationCategory) {
  switch (category) {
    case "Security":
      return ShieldAlert;
    case "Attendance":
      return CalendarDays;
    case "Academic":
      return GraduationCap;
    case "System":
      return Settings;
    case "User Management":
      return Users;
  }
}

function AdminNotifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications,
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]>("All");
  const [readFilter, setReadFilter] =
    useState<(typeof readOptions)[number]>("All");
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationRecord | null>(null);

  const unreadCount = notifications.filter(
    (item) => !item.read,
  ).length;

  const criticalCount = notifications.filter(
    (item) =>
      item.priority === "Critical" && !item.read,
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notifications.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesRead =
        readFilter === "All" ||
        (readFilter === "Unread" && !item.read) ||
        (readFilter === "Read" && item.read);

      return matchesSearch && matchesCategory && matchesRead;
    });
  }, [notifications, search, category, readFilter]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    );

    setSelectedNotification((current) =>
      current?.id === id ? { ...current, read: true } : current,
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true })),
    );

    setSelectedNotification((current) =>
      current ? { ...current, read: true } : current,
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Monitor security alerts, attendance updates, academic events, and institutional system notifications."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Institutional notification center
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Notification records and read states are stored locally
              for this frontend demonstration.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Summary */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Notification overview
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Total notifications"
            value={notifications.length}
            icon={Bell}
          />
          <SummaryCard
            label="Unread notifications"
            value={unreadCount}
            icon={Clock3}
          />
          <SummaryCard
            label="Critical unread alerts"
            value={criticalCount}
            icon={AlertTriangle}
          />
        </div>
      </section>

      {/* Filters and list */}
      <SectionCard
        title="All notifications"
        description="Search, filter, and review institutional notifications."
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications"
              className="pl-9"
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as (typeof categoryOptions)[number],
              )
            }
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All categories" : item}
              </option>
            ))}
          </select>

          <select
            value={readFilter}
            onChange={(event) =>
              setReadFilter(
                event.target.value as (typeof readOptions)[number],
              )
            }
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            {readOptions.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All notifications" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 divide-y divide-border border-y border-border">
          {filteredNotifications.map((item) => {
            const Icon = getCategoryIcon(item.category);

            return (
              <div
                key={item.id}
                className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between ${
                  !item.read ? "bg-muted/20" : ""
                }`}
              >
                <div className="flex min-w-0 gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-border">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="h-1.5 w-1.5 bg-foreground" />
                      )}
                    </div>

                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                      {item.message}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span>{formatTimestamp(item.timestamp)}</span>
                      <span>·</span>
                      <span>{item.id}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusChip status={item.priority} />
                      <StatusChip status={item.read ? "Read" : "Unread"} />
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedNotification(item)}
                  >
                    View
                  </Button>

                  {!item.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(item.id)}
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">
                No notifications found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filteredNotifications.length} of{" "}
          {notifications.length} demonstration notifications.
        </p>
      </SectionCard>

      {/* Notification details */}
      {selectedNotification && (
        <SectionCard
          title="Notification details"
          description={`Notification ${selectedNotification.id}`}
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedNotification(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">
                {selectedNotification.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {selectedNotification.message}
              </p>
            </div>

            <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
              <Detail
                label="Notification ID"
                value={selectedNotification.id}
              />
              <Detail
                label="Category"
                value={selectedNotification.category}
              />
              <Detail
                label="Priority"
                value={selectedNotification.priority}
              />
              <Detail
                label="Created at"
                value={formatTimestamp(selectedNotification.timestamp)}
              />
              <Detail
                label="Read status"
                value={selectedNotification.read ? "Read" : "Unread"}
              />
            </div>

            {!selectedNotification.read && (
              <div className="border-t border-border pt-4">
                <Button
                  size="sm"
                  onClick={() => markAsRead(selectedNotification.id)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as read
                </Button>
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Bell;
}) {
  return (
    <div className="border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}
