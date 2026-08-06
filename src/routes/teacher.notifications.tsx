import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { NotificationCard } from "@/components/argus/notification-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { teacherNotifications } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ARGUS Faculty" },
      { name: "description", content: "Attendance started and closed events, appeal updates and institution announcements." },
      { property: "og:title", content: "Notifications — ARGUS Faculty" },
      { property: "og:description", content: "Attendance started and closed events, appeal updates and institution announcements." },
    ],
  }),
  component: TeacherNotifications,
});

function TeacherNotifications() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Session events, appeals and announcements from the institution."
        actions={
          <Button size="sm" variant="outline" onClick={() => toast.success("All notifications marked as read")}>
            <CheckCheck /> Mark all read
          </Button>
        }
      />
      <SectionCard bodyClassName="space-y-2 p-3 sm:p-4">
        {teacherNotifications.map((n) => (
          <NotificationCard key={n.id} kind={n.kind} title={n.title} body={n.body} time={n.time} unread={n.unread} />
        ))}
      </SectionCard>
    </>
  );
}
