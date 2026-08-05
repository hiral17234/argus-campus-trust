import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { NotificationCard } from "@/components/argus/notification-card";
import { EmptyState } from "@/components/argus/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { notifications as seed } from "@/lib/argus-data";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ARGUS" },
      {
        name: "description",
        content: "Attendance windows, approvals, rejections, appeals and institutional announcements.",
      },
      { property: "og:title", content: "Notifications — ARGUS" },
      {
        property: "og:description",
        content: "Every verification event and announcement in one place.",
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

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState<string>("all");

  const visible = items.filter((n) => {
    if (filter === "all") return true;
    if (filter === "attendance") return n.kind.startsWith("attendance");
    if (filter === "appeals") return n.kind.startsWith("appeal");
    return n.kind === "announcement";
  });

  const unread = items.filter((n) => n.unread).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description={unread > 0 ? `${unread} unread notifications` : "You're all caught up"}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
              toast.success("All notifications marked as read");
            }}
          >
            <CheckCheck />
            Mark all read
          </Button>
        }
      />

      <SectionCard bodyClassName="p-3 sm:p-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4">
            {filters.map((f) => (
              <TabsTrigger key={f.id} value={f.id}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </SectionCard>

      {visible.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="Nothing here yet"
          description="Notifications for this category will appear as soon as they're generated."
        />
      ) : (
        <div className="space-y-2.5">
          {visible.map((n) => (
            <NotificationCard
              key={n.id}
              kind={n.kind}
              title={n.title}
              body={n.body}
              time={n.time}
              unread={n.unread}
              icon={Bell}
            />
          ))}
        </div>
      )}
    </>
  );
}
