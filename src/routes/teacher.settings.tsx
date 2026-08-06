import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { ThemeToggle } from "@/components/argus/theme-toggle";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ARGUS Faculty" },
      { name: "description", content: "Theme, language, notification preferences, privacy, security and platform information." },
      { property: "og:title", content: "Settings — ARGUS Faculty" },
      { property: "og:description", content: "Theme, language, notification preferences, privacy, security and platform information." },
    ],
  }),
  component: TeacherSettings,
});

const toggles = [
  { id: "n1", label: "Attendance started", hint: "Notify when a session opens" },
  { id: "n2", label: "Attendance closed", hint: "Summary when a session ends" },
  { id: "n3", label: "Spoof alerts", hint: "Immediate alert on blocked attempts" },
  { id: "n4", label: "Appeal activity", hint: "New and escalated appeals" },
  { id: "n5", label: "Announcements", hint: "Institution-wide notices" },
];

function TeacherSettings() {
  return (
    <>
      <PageHeader title="Settings" description="Control appearance, notifications, privacy and security." />

      <SectionCard title="Appearance" description="Theme and language">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-md border border-border bg-surface p-3">
            <div>
              <p className="text-[13px] font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Light, dark or system</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="space-y-1.5">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Notification settings" bodyClassName="p-3 sm:p-4">
        <ul className="space-y-2">
          {toggles.map((t) => (
            <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-surface p-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{t.label}</p>
                <p className="truncate text-xs text-muted-foreground">{t.hint}</p>
              </div>
              <Switch defaultChecked />
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Privacy" description="How your verification data is handled">
          <div className="px-1">
            <DetailRow label="Face template storage" value="Encrypted · on-premise" />
            <DetailRow label="Captured frames retention" value="30 days" />
            <DetailRow label="Location precision" value="Classroom-level only" />
          </div>
        </SectionCard>
        <SectionCard
          title="Security"
          description="Session and sign-in protection"
          action={
            <Button size="sm" variant="outline" onClick={() => toast.success("All other sessions signed out")}>
              Sign out others
            </Button>
          }
        >
          <div className="px-1">
            <DetailRow label="Two-step verification" value="Enabled" />
            <DetailRow label="Device binding" value="Required" />
            <DetailRow label="Session timeout" value="30 minutes" />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="About ARGUS">
        <div className="px-1">
          <DetailRow label="Platform version" value="ARGUS 2.4.1" />
          <DetailRow label="Face engine" value="Liveness v2.4 · Avg. 340 ms" />
          <DetailRow label="Support" value="support@argus.edu" />
        </div>
      </SectionCard>
    </>
  );
}
