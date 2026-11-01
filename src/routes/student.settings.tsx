
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ExternalLink,
  HelpCircle,
  Info,
  Lock,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  Download,
  ChevronRight,
  Globe,
  Clock3,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
  DetailRow,
} from "@/components/argus/section";
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
import { StatusChip } from "@/components/argus/status-chip";

import { toast } from "sonner";

export const Route = createFileRoute("/student/settings")({
  head: () => ({
    meta: [
      { title: "Settings | ARGUS" },
      {
        name: "description",
        content:
          "Manage your ARGUS appearance, language, notification and privacy preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

const initialNotificationPrefs = [
  {
    id: "open",
    label: "Attendance window opened",
    description:
      "Notify me when a session starts accepting attendance verification.",
    enabled: true,
  },
  {
    id: "closed",
    label: "Attendance window closed",
    description:
      "Notify me when a session stops accepting attendance entries.",
    enabled: true,
  },
  {
    id: "result",
    label: "Attendance approved or rejected",
    description:
      "Notify me when an attendance verification result is available.",
    enabled: true,
  },
  {
    id: "appeal",
    label: "Appeal updates",
    description:
      "Notify me about faculty responses and appeal status changes.",
    enabled: true,
  },
  {
    id: "announce",
    label: "Institutional announcements",
    description:
      "Receive department, examination and institutional notices.",
    enabled: false,
  },
];

const helpItems = [
  {
    question: "How face verification works",
    description: "Understand identity verification requirements.",
  },
  {
    question: "Why was my attendance flagged?",
    description: "Understand risk-based attendance decisions.",
  },
  {
    question: "Registering a second device",
    description: "Learn about device registration and trust.",
  },
  {
    question: "Appeal process and timelines",
    description: "Understand attendance correction requests.",
  },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [language, setLanguage] = useState("en-IN");
  const [timezone, setTimezone] = useState("ist");

  const [notificationPrefs, setNotificationPrefs] = useState(
    initialNotificationPrefs,
  );

  function toggleNotification(id: string, checked: boolean) {
    setNotificationPrefs((previous) =>
      previous.map((preference) =>
        preference.id === id
          ? { ...preference, enabled: checked }
          : preference,
      ),
    );

    // Frontend demonstration only.
    // Persist this preference through the backend later.
    toast.success("Notification preference updated locally.");
  }

  function handleDataExport() {
    // Connect to the backend data export endpoint later.
    toast.info("Data export is not connected yet.", {
      description:
        "Your institutional administrator can assist with a data request.",
    });
  }

  function handleConsentRequest() {
    // Consent changes must be recorded and enforced by the backend.
    toast.info("Biometric consent management is not connected yet.", {
      description:
        "Contact your institutional administrator to submit a consent request.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your student account preferences and privacy options."
      />

      {/* Appearance */}
      <SectionCard
        title="Appearance"
        description="Choose how the ARGUS interface is displayed."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              id: "light" as const,
              label: "Light",
              icon: Sun,
              description: "Light background and dark text.",
            },
            {
              id: "dark" as const,
              label: "Dark",
              icon: Moon,
              description: "Dark background and light text.",
            },
          ].map((option) => {
            const Icon = option.icon;
            const selected = theme === option.id;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setTheme(option.id)}
                className={`flex items-start gap-3 border p-4 text-left transition-colors ${
                  selected
                    ? "border-foreground bg-muted/30"
                    : "border-border bg-background hover:bg-muted/20"
                }`}
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">
                    {option.label}
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {option.description}
                  </p>
                </div>

                {selected && (
                  <StatusChip tone="success" dot={false}>
                    Active
                  </StatusChip>
                )}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Language and region */}
      <SectionCard
        title="Language and region"
        description="Set your preferred language and local time zone."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="language"
              className="flex items-center gap-2"
            >
              <Globe className="size-3.5 text-muted-foreground" />
              Language
            </Label>

            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger
                id="language"
                className="rounded-none"
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="en-IN">
                  English (India)
                </SelectItem>

                <SelectItem value="en-GB">
                  English (UK)
                </SelectItem>

                <SelectItem value="hi">
                  हिन्दी
                </SelectItem>

                <SelectItem value="ta">
                  தமிழ்
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="timezone"
              className="flex items-center gap-2"
            >
              <Clock3 className="size-3.5 text-muted-foreground" />
              Time zone
            </Label>

            <Select
              value={timezone}
              onValueChange={setTimezone}
            >
              <SelectTrigger
                id="timezone"
                className="rounded-none"
              >
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ist">
                  IST · UTC+05:30
                </SelectItem>

                <SelectItem value="utc">
                  UTC
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          Language and time-zone selections currently apply to
          this page's local state. Full localization and account-wide
          persistence require backend integration.
        </p>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        title="Notification preferences"
        description="Choose which types of updates you want to receive."
      >
        <div className="divide-y divide-border">
          {notificationPrefs.map((preference) => (
            <div
              key={preference.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 first:pt-1 last:pb-1"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground">
                  {preference.label}
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {preference.description}
                </p>
              </div>

              <Switch
                checked={preference.enabled}
                onCheckedChange={(checked) =>
                  toggleNotification(preference.id, checked)
                }
                aria-label={preference.label}
              />
            </div>
          ))}
        </div>

        <p className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
          Notification preferences are currently stored in local
          page state. They will reset after a page reload until
          connected to the backend.
        </p>
      </SectionCard>

      {/* Privacy and biometrics */}
      <SectionCard
        title="Privacy and biometrics"
        description="Review biometric and personal data management options."
      >
        <div className="border border-border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-semibold text-foreground">
                Biometric data protection
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Face enrollment and verification data should be
                processed and protected according to institutional
                security and privacy policies. Actual encryption,
                access restrictions and retention must be enforced
                by the backend.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <DetailRow
            label="Biometric consent"
            value={
              <StatusChip tone="neutral" dot={false}>
                Backend confirmation pending
              </StatusChip>
            }
          />

          <DetailRow
            label="Location processing"
            value="Session eligibility checks"
          />

          <DetailRow
            label="Data retention period"
            value="Defined by institutional policy"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDataExport}
          >
            <Download className="size-4" />
            Request my data
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleConsentRequest}
          >
            <ShieldCheck className="size-4" />
            Manage biometric consent
          </Button>
        </div>

        <Link
          to="/student/privacy"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
        >
          View detailed privacy information
          <ChevronRight className="size-3.5" />
        </Link>
      </SectionCard>

      {/* Help and support */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="Help and support"
          description="Find answers to common student questions."
        >
          <div className="space-y-2">
            {helpItems.map((item) => (
              <Link
                key={item.question}
                to="/student/help"
                className="flex items-center justify-between gap-3 border border-border bg-background p-3 transition-colors hover:bg-muted/20"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <HelpCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {item.question}
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <Link to="/student/help">
              Open help centre
            </Link>
          </Button>
        </SectionCard>

        {/* About ARGUS */}
        <SectionCard
          title="About ARGUS"
          description="Platform information and institutional support."
        >
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <p className="text-[12px] leading-relaxed text-muted-foreground">
              ARGUS is an identity verification and smart attendance
              platform designed for educational institutions. Its
              intended workflows include attendance verification,
              identity assurance, device checks and institutional
              access management.
            </p>
          </div>

          <div className="mt-4">
            <DetailRow
              label="Platform"
              value="ARGUS"
            />

            <DetailRow
              label="Application version"
              value={
                <span className="font-mono">
                  Frontend build
                </span>
              }
            />

            <DetailRow
              label="Verification model"
              value="Backend information pending"
            />

            <DetailRow
              label="Deployment"
              value="Configuration pending"
            />

            <DetailRow
              label="Support contact"
              value="Institutional administrator"
            />
          </div>

          <Link
            to="/design-system"
            className="mt-4 inline-block"
          >
            <Button variant="outline" size="sm">
              View design system
            </Button>
          </Link>
        </SectionCard>
      </div>

      {/* Settings information */}
      <div className="border border-border bg-muted/20 p-3">
        <div className="flex items-start gap-2">
          <Bell className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              Settings status:
            </span>{" "}
            Theme selection is connected to the existing theme
            provider. Other preferences currently use frontend
            state and are not yet synchronized across devices.
            Account-wide settings persistence, notification
            delivery and privacy enforcement require backend APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
