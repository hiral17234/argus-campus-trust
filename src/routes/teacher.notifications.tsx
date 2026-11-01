import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  CheckCheck,
  Clock3,
  FileClock,
  Info,
  Megaphone,
  ShieldAlert,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/teacher/notifications")({
  component: TeacherNotifications,
});

type NotificationCategory =
  | "Attendance"
  | "Appeals"
  | "Academic"
  | "Security"
  | "Announcements";

type TeacherNotification = {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  date: string;
  time: string;
  read: boolean;
  priority: "Normal" | "Important" | "Critical";
  link?: string;
};

const initialNotifications: TeacherNotification[] = [
  {
    id: "TN-001",
    title: "New attendance appeal received",
    message:
      "A student has submitted an attendance appeal for the Data Structures and Algorithms session.",
    category: "Appeals",
    date: "31 Oct 2026",
    time: "10:35 AM",
    read: false,
    priority: "Important",
    link: "/teacher/appeals",
  },
  {
    id: "TN-002",
    title: "Attendance session completed",
    message:
      "The demonstration attendance session for Database Management Systems has ended.",
    category: "Attendance",
    date: "31 Oct 2026",
    time: "09:45 AM",
    read: false,
    priority: "Normal",
    link: "/teacher/history",
  },
  {
    id: "TN-003",
    title: "Verification risk flagged",
    message:
      "A demonstration attendance record has been assigned a high-risk label. Review the record before taking action.",
    category: "Security",
    date: "30 Oct 2026",
    time: "03:20 PM",
    read: false,
    priority: "Critical",
    link: "/teacher/history",
  },
  {
    id: "TN-004",
    title: "Class schedule updated",
    message:
      "The sample schedule for Operating Systems has been updated.",
    category: "Academic",
    date: "30 Oct 2026",
    time: "11:10 AM",
    read: true,
    priority: "Normal",
    link: "/teacher/classes",
  },
  {
    id: "TN-005",
    title: "New institutional announcement",
    message:
      "An academic notice has been added to the demonstration notification feed.",
    category: "Announcements",
    date: "29 Oct 2026",
    time: "02:00 PM",
    read: true,
    priority: "Normal",
  },
  {
    id: "TN-006",
    title: "Attendance report available",
    message:
      "A sample attendance report is available for review and export.",
    category: "Attendance",
    date: "28 Oct 2026",
    time: "12:15 PM",
    read: true,
    priority: "Normal",
    link: "/teacher/analytics",
  },
  {
    id: "TN-007",
    title: "Appeal review reminder",
    message:
      "There are demonstration appeal records awaiting faculty review.",
    category: "Appeals",
    date: "27 Oct 2026",
    time: "09:30 AM",
    read: false,
    priority: "Important",
    link: "/teacher/appeals",
  },
];

const categories = [
  "All",
  "Attendance",
  "Appeals",
  "Academic",
  "Security",
  "Announcements",
] as const;

type CategoryFilter = (typeof categories)[number];

function getNotificationIcon(category: NotificationCategory) {
  switch (category) {
    case "Attendance":
      return Clock3;
    case "Appeals":
      return FileClock;
    case "Academic":
      return BookOpen;
    case "Security":
      return ShieldAlert;
    case "Announcements":
      return Megaphone;
    default:
      return Bell;
  }
}

function getPriorityStatus(priority: TeacherNotification["priority"]) {
  switch (priority) {
    case "Critical":
      return "Critical";
    case "Important":
      return "Important";
    default:
      return "Normal";
  }
}

function TeacherNotifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications,
  );

  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [readFilter, setReadFilter] = useState<
    "All" | "Unread" | "Read"
  >("All");
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const readCount = notifications.length - unreadCount;

  const criticalCount = notifications.filter(
    (notification) =>
      notification.priority === "Critical" && !notification.read,
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notifications.filter((notification) => {
      const matchesCategory =
        filter === "All" || notification.category === filter;

      const matchesRead =
        readFilter === "All" ||
        (readFilter === "Unread" && !notification.read) ||
        (readFilter === "Read" && notification.read);

      const matchesSearch =
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.category.toLowerCase().includes(query);

      return matchesCategory && matchesRead && matchesSearch;
    });
  }, [notifications, filter, readFilter, search]);

  const toggleRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification,
      ),
    );
  };

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const markAllUnread = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: false,
      })),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay informed about attendance activity, student appeals, academic updates, and security events."
      />

      {/* Demo notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Demonstration notification feed
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Notifications are stored locally and will reset when the page
              reloads.
            </p>
          </div>
        </div>

        <StatusChip status="Demo data" />
      </div>

      {/* Summary */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold">Notification overview</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total notifications",
              value: notifications.length,
              icon: Bell,
            },
            {
              label: "Unread",
              value: unreadCount,
              icon: Info,
            },
            {
              label: "Read",
              value: readCount,
              icon: CheckCheck,
            },
            {
              label: "Critical unread",
              value: criticalCount,
              icon: ShieldAlert,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <p className="mt-3 text-2xl font-semibold tabular-nums">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Notification controls */}
      <SectionCard
        title="All notifications"
        description="Search, filter, and manage your notification feed."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={unreadCount === 0}
              onClick={markAllRead}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all read
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={readCount === 0}
              onClick={markAllUnread}
            >
              Mark all unread
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notifications..."
          />

          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <div className="flex flex-wrap gap-1">
              {(["All", "Unread", "Read"] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={readFilter === status ? "secondary" : "ghost"}
                  onClick={() => setReadFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>

            <span className="text-xs text-muted-foreground">
              {filteredNotifications.length} results
            </span>
          </div>
        </div>

        {/* Notification list */}
        <div className="mt-4 divide-y divide-border">
          {filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.category);

            return (
              <article
                key={notification.id}
                className={`flex gap-3 py-4 ${
                  !notification.read ? "bg-muted/20 px-3" : ""
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">
                      {notification.title}
                    </p>

                    {!notification.read && (
                      <span className="h-1.5 w-1.5 bg-foreground" />
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {notification.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusChip status={notification.category} />
                    <StatusChip
                      status={getPriorityStatus(notification.priority)}
                    />

                    <span className="text-xs text-muted-foreground">
                      {notification.date} · {notification.time}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {notification.link && (
                      <Link
                        to={notification.link}
                        className="text-xs font-medium hover:underline"
                      >
                        View details
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleRead(notification.id)}
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      Mark as {notification.read ? "unread" : "read"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">
                No notifications found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try changing the search term or filters.
              </p>

              <Button
                className="mt-4"
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                  setReadFilter("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Integration note */}
      <div className="flex items-start gap-3 border border-border p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            Notification service integration
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Production notifications should be fetched for the authenticated
            teacher, with server-side read status, timestamps, priority,
            category, and related resource IDs. Real-time delivery can be
            implemented using WebSockets or Server-Sent Events.
          </p>
        </div>
      </div>
    </div>
  );
}
