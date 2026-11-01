
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings,
  Building2,
  CalendarDays,
  ShieldCheck,
  Bell,
  Save,
  RotateCcw,
  AlertTriangle,
  LockKeyhole,
  Clock3,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type PlatformSettings = {
  institutionName: string;
  institutionCode: string;
  academicYear: string;
  timezone: string;
  attendanceThreshold: number;
  lateEntryMinutes: number;
  allowManualAttendance: boolean;
  requireFaceVerification: boolean;
  requireLiveness: boolean;
  deviceVerification: boolean;
  lowRiskThreshold: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  emailNotifications: boolean;
  securityAlerts: boolean;
  attendanceAlerts: boolean;
  systemAlerts: boolean;
};

const initialSettings: PlatformSettings = {
  institutionName: "Madhav Institute of Technology and Science",
  institutionCode: "MITS-GWL",
  academicYear: "2026-2027",
  timezone: "Asia/Kolkata",
  attendanceThreshold: 75,
  lateEntryMinutes: 10,
  allowManualAttendance: true,
  requireFaceVerification: true,
  requireLiveness: true,
  deviceVerification: true,
  lowRiskThreshold: 30,
  mediumRiskThreshold: 60,
  highRiskThreshold: 80,
  emailNotifications: true,
  securityAlerts: true,
  attendanceAlerts: true,
  systemAlerts: true,
};

function AdminSettings() {
  const [settings, setSettings] =
    useState<PlatformSettings>(initialSettings);

  const [saved, setSaved] = useState(false);
  const [validationError, setValidationError] = useState("");

  const updateSetting = <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setSaved(false);
    setValidationError("");
  };

  const handleSave = () => {
    if (
      settings.attendanceThreshold < 0 ||
      settings.attendanceThreshold > 100
    ) {
      setValidationError(
        "Attendance threshold must be between 0 and 100.",
      );
      return;
    }

    if (
      settings.lateEntryMinutes < 0 ||
      settings.lateEntryMinutes > 120
    ) {
      setValidationError(
        "Late entry allowance must be between 0 and 120 minutes.",
      );
      return;
    }

    const thresholds = [
      settings.lowRiskThreshold,
      settings.mediumRiskThreshold,
      settings.highRiskThreshold,
    ];

    if (
      thresholds.some((value) => value < 0 || value > 100) ||
      !(
        settings.lowRiskThreshold <
        settings.mediumRiskThreshold &&
        settings.mediumRiskThreshold <
        settings.highRiskThreshold
      )
    ) {
      setValidationError(
        "Risk thresholds must be between 0 and 100 and strictly increasing.",
      );
      return;
    }

    setSaved(true);
  };

  const resetSettings = () => {
    setSettings(initialSettings);
    setSaved(false);
    setValidationError("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Settings"
        description="Configure institutional preferences, attendance policies, identity verification, risk thresholds, and notification behaviour."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Settings className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              ARGUS configuration
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Settings are held in local page state. They are not
              persisted or enforced by the backend.
            </p>
          </div>
        </div>
        <StatusChip status="Demo mode" />
      </div>

      {/* General settings */}
      <SectionCard
        title="Institution settings"
        description="Configure the basic institutional identity and reporting preferences."
      >
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">
            General configuration
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Institution name">
            <Input
              value={settings.institutionName}
              onChange={(event) =>
                updateSetting("institutionName", event.target.value)
              }
            />
          </Field>

          <Field label="Institution code">
            <Input
              value={settings.institutionCode}
              onChange={(event) =>
                updateSetting("institutionCode", event.target.value)
              }
            />
          </Field>

          <Field label="Academic year">
            <Input
              value={settings.academicYear}
              onChange={(event) =>
                updateSetting("academicYear", event.target.value)
              }
            />
          </Field>

          <Field label="Timezone">
            <select
              value={settings.timezone}
              onChange={(event) =>
                updateSetting("timezone", event.target.value)
              }
              className="h-10 w-full border border-input bg-background px-3 text-sm"
            >
              <option value="Asia/Kolkata">
                India Standard Time (Asia/Kolkata)
              </option>
              <option value="UTC">UTC</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </Field>
        </div>
      </SectionCard>

      {/* Attendance settings */}
      <SectionCard
        title="Attendance policy"
        description="Set attendance requirements and late-entry rules."
      >
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">
            Attendance configuration
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Minimum attendance threshold (%)">
            <Input
              type="number"
              min={0}
              max={100}
              value={settings.attendanceThreshold}
              onChange={(event) =>
                updateSetting(
                  "attendanceThreshold",
                  Number(event.target.value),
                )
              }
            />
            <p className="text-xs text-muted-foreground">
              Illustrative minimum attendance requirement.
            </p>
          </Field>

          <Field label="Late entry allowance (minutes)">
            <Input
              type="number"
              min={0}
              max={120}
              value={settings.lateEntryMinutes}
              onChange={(event) =>
                updateSetting(
                  "lateEntryMinutes",
                  Number(event.target.value),
                )
              }
            />
            <p className="text-xs text-muted-foreground">
              Time allowed after a session starts.
            </p>
          </Field>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <ToggleRow
            title="Allow manual attendance correction"
            description="Permit authorized staff to submit attendance corrections."
            checked={settings.allowManualAttendance}
            onChange={(value) =>
              updateSetting("allowManualAttendance", value)
            }
          />
        </div>
      </SectionCard>

      {/* Verification settings */}
      <SectionCard
        title="Identity verification"
        description="Configure the verification requirements used by the ARGUS attendance workflow."
      >
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">
            Verification controls
          </h3>
        </div>

        <div className="divide-y divide-border">
          <ToggleRow
            title="Require face verification"
            description="Require a face verification step before accepting attendance."
            checked={settings.requireFaceVerification}
            onChange={(value) =>
              updateSetting("requireFaceVerification", value)
            }
          />

          <ToggleRow
            title="Require liveness detection"
            description="Require a liveness check as part of the face verification workflow."
            checked={settings.requireLiveness}
            onChange={(value) =>
              updateSetting("requireLiveness", value)
            }
          />

          <ToggleRow
            title="Enable device verification"
            description="Include registered-device checks in the verification workflow."
            checked={settings.deviceVerification}
            onChange={(value) =>
              updateSetting("deviceVerification", value)
            }
          />
        </div>

        <div className="mt-4 flex items-start gap-2 border border-border bg-muted/20 p-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            These controls are only configuration placeholders.
            The backend must enforce verification requirements
            regardless of frontend settings.
          </p>
        </div>
      </SectionCard>

      {/* Risk thresholds */}
      <SectionCard
        title="Risk engine thresholds"
        description="Configure illustrative risk score boundaries for adaptive verification."
      >
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">
            Risk score configuration
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Low risk upper boundary">
            <Input
              type="number"
              min={0}
              max={100}
              value={settings.lowRiskThreshold}
              onChange={(event) =>
                updateSetting(
                  "lowRiskThreshold",
                  Number(event.target.value),
                )
              }
            />
          </Field>

          <Field label="Medium risk upper boundary">
            <Input
              type="number"
              min={0}
              max={100}
              value={settings.mediumRiskThreshold}
              onChange={(event) =>
                updateSetting(
                  "mediumRiskThreshold",
                  Number(event.target.value),
                )
              }
            />
          </Field>

          <Field label="High risk upper boundary">
            <Input
              type="number"
              min={0}
              max={100}
              value={settings.highRiskThreshold}
              onChange={(event) =>
                updateSetting(
                  "highRiskThreshold",
                  Number(event.target.value),
                )
              }
            />
          </Field>
        </div>

        <div className="mt-5 border border-border p-4">
          <p className="text-xs font-medium">
            Current threshold interpretation
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <RiskLevel
              label="Low"
              range={`0–${settings.lowRiskThreshold}`}
            />
            <RiskLevel
              label="Medium"
              range={`${settings.lowRiskThreshold + 1}–${settings.mediumRiskThreshold}`}
            />
            <RiskLevel
              label="High"
              range={`${settings.mediumRiskThreshold + 1}–${settings.highRiskThreshold}`}
            />
            <RiskLevel
              label="Critical"
              range={`${settings.highRiskThreshold + 1}–100`}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          These are illustrative score boundaries, not validated
          fraud-detection thresholds. Calibrate the production risk
          engine using evaluation data and documented policies.
        </p>
      </SectionCard>

      {/* Notification settings */}
      <SectionCard
        title="Notification preferences"
        description="Choose which categories of institutional events should trigger notifications."
      >
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">
            Notification configuration
          </h3>
        </div>

        <div className="divide-y divide-border">
          <ToggleRow
            title="Email notifications"
            description="Enable email notification delivery."
            checked={settings.emailNotifications}
            onChange={(value) =>
              updateSetting("emailNotifications", value)
            }
          />

          <ToggleRow
            title="Security alerts"
            description="Receive alerts for suspicious activity and access violations."
            checked={settings.securityAlerts}
            onChange={(value) =>
              updateSetting("securityAlerts", value)
            }
          />

          <ToggleRow
            title="Attendance alerts"
            description="Receive alerts for attendance anomalies and low attendance."
            checked={settings.attendanceAlerts}
            onChange={(value) =>
              updateSetting("attendanceAlerts", value)
            }
          />

          <ToggleRow
            title="System notifications"
            description="Receive system status and maintenance notifications."
            checked={settings.systemAlerts}
            onChange={(value) =>
              updateSetting("systemAlerts", value)
            }
          />
        </div>
      </SectionCard>

      {/* Save actions */}
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border border-border bg-background/95 p-4">
        <div>
          {validationError ? (
            <p role="alert" className="text-sm text-destructive">
              {validationError}
            </p>
          ) : saved ? (
            <p role="status" className="text-sm text-muted-foreground">
              Settings validated. No backend changes were made.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Changes remain local until you save.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetSettings}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Validate settings
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Production configuration changes should require appropriate
          administrator permissions, server-side validation, audit
          logging, and confirmation for security-sensitive policy changes.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 border transition-colors ${
          checked
            ? "border-foreground bg-foreground"
            : "border-input bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 bg-background transition-transform ${
            checked ? "translate-x-[17px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function RiskLevel({
  label,
  range,
}: {
  label: string;
  range: string;
}) {
  return (
    <div className="border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">
        {range}
      </p>
    </div>
  );
}
