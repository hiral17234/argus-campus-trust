import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, HelpCircle, Info, Lock, Moon, Sun } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { StatusChip } from "@/components/argus/status-chip";

export const Route = createFileRoute("/student/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ARGUS" },
      {
        name: "description",
        content: "Theme, language, notification preferences, privacy and help for ARGUS.",
      },
      { property: "og:title", content: "Settings — ARGUS" },
      { property: "og:description", content: "Control how ARGUS looks, notifies and protects you." },
    ],
  }),
  component: SettingsPage,
});

const notificationPrefs = [
  { id: "open", label: "Attendance window opened", desc: "Alert me when a session starts accepting verification." },
  { id: "closed", label: "Attendance window closed", desc: "Confirm when a session stops accepting entries." },
  { id: "result", label: "Attendance approved or rejected", desc: "Notify me of the final verification result." },
  { id: "appeal", label: "Appeal updates", desc: "Teacher responses and status changes on my appeals." },
  { id: "announce", label: "Institutional announcements", desc: "Department and examination notices." },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader title="Settings" description="Preferences apply to this account across devices." />

      <SectionCard title="Appearance" description="Theme applies immediately">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { id: "light" as const, label: "Light", icon: Sun, desc: "Background #F7F8FA" },
            { id: "dark" as const, label: "Dark", icon: Moon, desc: "Background #121417" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={cn(
                "flex items-start gap-3 rounded-md border px-3.5 py-3 text-left transition-colors",
                theme === opt.id
                  ? "border-secondary bg-surface-muted"
                  : "border-border bg-surface hover:bg-accent/60",
              )}
            >
              <opt.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-foreground">{opt.label}</span>
                <span className="block text-[12px] text-muted-foreground">{opt.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Language and region">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en-IN">
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-IN">English (India)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tz">Time zone</Label>
            <Select defaultValue="ist">
              <SelectTrigger id="tz">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ist">IST · UTC+05:30</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Notification preferences">
        <div className="space-y-1">
          {notificationPrefs.map((p, i) => (
            <div
              key={p.id}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3",
                i !== notificationPrefs.length - 1 && "border-b border-border",
              )}
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground">{p.label}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{p.desc}</p>
              </div>
              <Switch defaultChecked={p.id !== "announce"} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Privacy and biometrics">
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface-muted/70 p-3">
            <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Face templates are encrypted and stored within your institution's infrastructure.
              ARGUS never stores raw camera footage and never shares biometric data with third
              parties.
            </p>
          </div>
          <DetailRow label="Biometric consent" value={<StatusChip tone="success">Granted</StatusChip>} />
          <DetailRow label="Location capture" value={<StatusChip tone="success">Session only</StatusChip>} />
          <DetailRow label="Audit log retention" value="5 years" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="outline" size="sm">
              Download my data
            </Button>
            <Button variant="outline" size="sm">
              Revoke biometric consent
            </Button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Help and support">
          <div className="space-y-2">
            {[
              "How face verification works",
              "Why was my attendance flagged?",
              "Registering a second device",
              "Appeal process and timelines",
            ].map((q) => (
              <button
                key={q}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left text-[13px] text-foreground transition-colors hover:bg-accent"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <HelpCircle className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{q}</span>
                </span>
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="About ARGUS">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              ARGUS is an enterprise identity verification platform covering attendance,
              examination verification, library access, hostel entry, laboratory access, visitor
              management and digital student ID.
            </p>
          </div>
          <div className="mt-3">
            <DetailRow label="Platform version" value={<span className="font-mono">2.4.1</span>} />
            <DetailRow label="Verification model" value={<span className="font-mono">argus-face-v2</span>} />
            <DetailRow label="Deployment" value="Institutional (on-premise)" />
            <DetailRow label="Support" value="identity-support@college.edu" />
          </div>
          <Link to="/design-system" className="mt-3 inline-block">
            <Button variant="outline" size="sm">
              View design system
            </Button>
          </Link>
        </SectionCard>
      </div>
    </>
  );
}
