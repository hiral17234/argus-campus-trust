
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  BellOff,
  CheckCheck,
  Circle,
  MailOpen,
} from "lucide-react";
import { toast } from "sonner";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { NotificationCard } from "@/components/argus/notification-card";
import { EmptyState } from "@/components/argus/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications as seed } from "@/lib/argus-data";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | ARGUS" },
      {
        name: "description",
        content:
          "View attendance updates, appeal decisions and institutional announcements.",
      },
    ],
  }),
  component: NotificationsPage,
});

const filters = [
  { id: "all", label: "All" },
  { id: "attendance", label: "Attendance" },
  { id: "appeals", label: "Appeals" },
  { id: "announcement", label: "Announcements" },
] as const;

type Filter = (typeof filters)[number]["id"];

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    return items.filter((notification) => {
      if (filter === "all") return true;

      if (filter === "attendance") {
        return notification.kind.startsWith("attendance");
      }

      if (filter === "appeals") {
        return notification.kind.startsWith("appeal");
      }

      return notification.kind === "announcement";
    });
  }, [items, filter]);

  const unreadCount = items.filter(
    (notification) => notification.unread,
  ).length;

  const visibleUnreadCount = visible.filter(
    (notification) => notification.unread,
  ).length;

  function markAllAsRead() {
    if (unreadCount === 0) {
      toast.info("There are no unread notifications.");
      return;
    }

    setItems((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );

    toast.success("All notifications marked as read.");
  }

  function toggleRead(id: string) {
    const target = items.find((notification) => notification.id === id);

    if (!target) return;

    setItems((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: !notification.unread,
            }
          : notification,
      ),
    );

    toast.success(
      target.unread
        ? "Notification marked as read."
        : "Notification marked as unread.",
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
            : "You are all caught up."
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        }
      />

      {/* Notification summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SectionCard>
          <p className="text-xs text-muted-foreground">
            Total notifications
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {items.length}
          </p>
        </SectionCard>

        <SectionCard>
          <p className="text-xs text-muted-foreground">
            Unread notifications
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {unreadCount}
          </p>
        </SectionCard>

        <SectionCard>
          <p className="text-xs text-muted-foreground">
            Read notifications
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {items.length - unreadCount}
          </p>
        </SectionCard>
      </div>

      {/* Filters */}
      <SectionCard
        title="Notification inbox"
        description="Filter updates by their category."
        bodyClassName="p-3 sm:p-4"
      >
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as Filter)}
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            {filters.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            Showing {visible.length} notification
            {visible.length === 1 ? "" : "s"}
          </p>

          <p className="text-[11px] text-muted-foreground">
            {visibleUnreadCount} unread in this view
          </p>
        </div>
      </SectionCard>

      {/* Notification list */}
      {visible.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title={
            filter === "all"
              ? "No notifications yet"
              : "No notifications in this category"
          }
          description="Updates for this category will appear here when they are generated."
          action={
            filter !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("all")}
              >
                View all notifications
              </Button>
            ) : undefined
          }
        />
      ) : (
        <SectionCard
          title="Recent activity"
          description="Your attendance, verification and institutional updates."
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border">
            {visible.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-4 ${
                  notification.unread ? "bg-muted/20" : ""
                }`}
              >
                <div className="mt-1 shrink-0">
                  {notification.unread ? (
                    <Circle className="size-2.5 fill-foreground text-foreground" />
                  ) : (
                    <MailOpen className="size-4 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <NotificationCard
                    kind={notification.kind}
                    title={notification.title}
                    body={notification.body}
                    time={notification.time}
                    unread={notification.unread}
                    icon={Bell}
                  />

                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleRead(notification.id)}
                      className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {notification.unread
                        ? "Mark as read"
                        : "Mark as unread"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Backend status */}
      <div className="border border-border bg-muted/20 p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">
            Demonstration mode:
          </span>{" "}
          Notifications are currently loaded from the local frontend
          dataset. Read-status changes are temporary and will reset
          when the page is reloaded. Real-time notifications,
          persistent read status and push delivery require backend
          integration.
        </p>
      </div>
    </div>
  );
}
