import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  Clock3,
  Globe,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/teacher/settings")({
  component: TeacherSettings,
});

function TeacherSettings() {
  const { theme, setTheme } = useTheme();

  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [notifications, setNotifications] = useState({
    attendance: true,
    appeals: true,
    security: true,
    announcements: true,
    email: false,
  });

  const [saved, setSaved] = useState(false);

  const updateNotification = (
    key: keyof typeof notifications,
    value: boolean,
  ) => {
    setNotifications((current) => ({
      ...current,
      [key]: value,
    }));
    setSaved(false);
  };

  const savePreferences = () => {
    console.info("Teacher settings demonstration:", {
      language,
      timezone,
      notifications,
      theme,
    });

    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your faculty workspace preferences, notifications, and account settings."
      />

      {/* Demo notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Settings and preferences
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Theme changes are applied through the existing theme provider.
              Other preferences are currently stored in local page state.
            </p>
          </div>
        </div>
        <StatusChip status="Demo preferences" />
      </div>

      {/* Appearance */}
      <SectionCard
        title="Appearance"
        description="Choose how the ARGUS teacher workspace looks."
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setSaved(false);
            }}
            className={`flex flex-1 items-center gap-3 border p-4 text-left transition-colors ${
              theme === "light"
                ? "border-foreground bg-muted/30"
                : "border-border hover:bg-muted/20"
            }`}
          >
            <Sun className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Light mode</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use a light interface.
              </p>
            </div>
            {theme === "light" && (
              <span className="ml-auto text-xs font-medium">
                Selected
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              setSaved(false);
            }}
            className={`flex flex-1 items-center gap-3 border p-4 text-left transition-colors ${
              theme === "dark"
                ? "border-foreground bg-muted/30"
                : "border-border hover:bg-muted/20"
            }`}
          >
            <Moon className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use a dark interface.
              </p>
            </div>
            {theme === "dark" && (
              <span className="ml-auto text-xs font-medium">
                Selected
              </span>
            )}
          </button>
        </div>
      </SectionCard>

      {/* Regional preferences */}
      <SectionCard
        title="Regional preferences"
        description="Configure the language and timezone used in your workspace."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Display language</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  setSaved(false);
                }}
                className="h-10 w-full appearance-none border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              Language selection is saved locally in this prototype.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <div className="relative">
              <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="timezone"
                value={timezone}
                onChange={(event) => {
                  setTimezone(event.target.value);
                  setSaved(false);
                }}
                className="h-10 w-full appearance-none border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="Asia/Kolkata">
                  India Standard Time (IST)
                </option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="Asia/Dubai">
                  Gulf Standard Time (GST)
                </option>
                <option value="Europe/London">
                  Greenwich Mean Time (GMT)
                </option>
                <option value="America/New_York">
                  Eastern Time (ET)
                </option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              Selected timezone: {timezone}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Notification preferences */}
      <SectionCard
        title="Notification preferences"
        description="Choose which events should appear in your teacher notification feed."
      >
        <div className="divide-y divide-border">
          <PreferenceRow
            title="Attendance updates"
            description="Updates about attendance sessions and student records."
            checked={notifications.attendance}
            onChange={(value) =>
              updateNotification("attendance", value)
            }
          />

          <PreferenceRow
            title="Student appeals"
            description="New appeals and changes to appeal review status."
            checked={notifications.appeals}
            onChange={(value) =>
              updateNotification("appeals", value)
            }
          />

          <PreferenceRow
            title="Security alerts"
            description="Verification warnings and security-related events."
            checked={notifications.security}
            onChange={(value) =>
              updateNotification("security", value)
            }
          />

          <PreferenceRow
            title="Academic announcements"
            description="Institutional notices and academic schedule updates."
            checked={notifications.announcements}
            onChange={(value) =>
              updateNotification("announcements", value)
            }
          />

          <PreferenceRow
            title="Email notifications"
            description="Receive supported notifications through your registered email."
            checked={notifications.email}
            onChange={(value) =>
              updateNotification("email", value)
            }
          />
        </div>
      </SectionCard>

      {/* Privacy */}
      <SectionCard
        title="Privacy and data"
        description="Review your account privacy and data management options."
      >
        <div className="divide-y divide-border">
          <div className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Privacy controls
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review how account and attendance information is handled.
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to="/teacher/profile">View profile</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 py-4 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Account information
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage your faculty profile details.
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to="/teacher/profile">Manage profile</Link>
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard
        title="Security"
        description="Authentication and access management."
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Password management</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Password changes must be handled by the authentication
                service.
              </p>
            </div>
            <StatusChip status="Backend pending" />
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Multi-factor authentication
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Availability and enrollment status must be verified by
                  the authentication backend.
                </p>
              </div>
              <StatusChip status="Not configured" />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Active sessions</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review and revoke other authenticated sessions.
                </p>
              </div>
              <StatusChip status="Backend pending" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Save preferences */}
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">
            Save workspace preferences
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Saving currently confirms the local prototype state only.
          </p>
          {saved && (
            <p className="mt-2 text-xs font-medium">
              Preferences confirmed locally.
            </p>
          )}
        </div>

        <Button onClick={savePreferences}>
          Save preferences
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Production settings should be stored against the authenticated
        teacher account. Notification delivery preferences, password
        management, multi-factor authentication, and session revocation
        require backend support.
      </p>
    </div>
  );
}

type PreferenceRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
