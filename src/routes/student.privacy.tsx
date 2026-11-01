
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Database,
  Download,
  Eye,
  Fingerprint,
  Info,
  LockKeyhole,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy and Data | ARGUS" },
      {
        name: "description",
        content:
          "Review your ARGUS data, biometric privacy information and privacy controls.",
      },
    ],
  }),
  component: StudentPrivacyPage,
});

type PrivacyPreference = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const dataCategories = [
  {
    title: "Personal information",
    description:
      "Name, institutional email, student ID, department and academic details.",
    icon: ShieldCheck,
    purpose: "Student identification and account management",
  },
  {
    title: "Biometric information",
    description:
      "Face enrollment data and verification-related biometric representations.",
    icon: Fingerprint,
    purpose: "Identity matching and attendance verification",
  },
  {
    title: "Device information",
    description:
      "Registered device identifiers, device type and trust status.",
    icon: Smartphone,
    purpose: "Device recognition and suspicious-access detection",
  },
  {
    title: "Attendance records",
    description:
      "Attendance sessions, timestamps, verification results and related records.",
    icon: Database,
    purpose: "Attendance management and academic reporting",
  },
  {
    title: "Verification information",
    description:
      "Verification outcomes, confidence scores and risk-related events.",
    icon: Eye,
    purpose: "Identity assurance and security review",
  },
];

const initialPreferences: PrivacyPreference[] = [
  {
    id: "security",
    title: "Security notifications",
    description:
      "Receive notifications about important account and verification events.",
    enabled: true,
  },
  {
    id: "academic",
    title: "Academic notifications",
    description:
      "Receive updates about attendance, appeals and institutional announcements.",
    enabled: true,
  },
];

function StudentPrivacyPage() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [showDataDetails, setShowDataDetails] = useState(false);

  function togglePreference(id: string) {
    setPreferences((previous) =>
      previous.map((preference) =>
        preference.id === id
          ? {
              ...preference,
              enabled: !preference.enabled,
            }
          : preference,
      ),
    );
  }

  function handleDataRequest() {
    // Frontend prototype only.
    // Connect this action to the institutional data-export API.
    console.info("Student data export requested.");

    window.alert(
      "Data export is not connected yet. Please contact your institutional administrator.",
    );
  }

  function handleDeletionRequest() {
    // Frontend prototype only.
    // Account and biometric deletion must be handled by the backend
    // after institutional policy and retention requirements are checked.
    window.alert(
      "Data deletion requests must be submitted to your institutional administrator.",
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Student dashboard
        </Link>

        <PageHeader
          title="Privacy and data"
          description="Understand how your information is used and review the available privacy controls."
        />
      </div>

      {/* Privacy overview */}
      <div className="border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">
              Your privacy matters
            </h2>

            <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
              ARGUS uses identity and attendance-related information
              to support institutional verification workflows.
              Access, processing, storage and retention should be
              governed by institutional policies and applicable
              data-protection requirements.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <StatusChip tone="neutral" dot={false}>
                Privacy information
              </StatusChip>

              <StatusChip tone="warning" dot={false}>
                Backend controls pending
              </StatusChip>
            </div>
          </div>
        </div>
      </div>

      {/* Data categories */}
      <SectionCard
        title="Your data"
        description="Categories of information that may be processed by the ARGUS platform."
      >
        <div className="divide-y divide-border">
          {dataCategories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.title}
                className="flex items-start gap-3 py-4 first:pt-1 last:pb-1"
              >
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center border border-border bg-muted/20">
                  <Icon className="size-4 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-foreground">
                    {category.title}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Purpose:
                    </span>{" "}
                    {category.purpose}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Biometric privacy */}
      <SectionCard
        title="Biometric information"
        description="Information about face enrollment and identity verification."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 border border-border p-4">
            <Fingerprint className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-semibold text-foreground">
                Face verification data
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Face-related information may be processed to compare
                an enrolled identity with a verification attempt.
                The actual processing method, storage format and
                retention period must be defined by the institution's
                backend implementation and privacy policy.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-border p-3">
              <p className="text-xs font-medium text-foreground">
                Face enrollment
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Review your enrollment status and available
                registration information.
              </p>

              <Link
                to="/student/face-profile"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
              >
                View face profile
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="border border-border p-3">
              <p className="text-xs font-medium text-foreground">
                Registered devices
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Review devices associated with your student account.
              </p>

              <Link
                to="/student/devices"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
              >
                View devices
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Data access */}
      <SectionCard
        title="Data access and transparency"
        description="Review the information associated with your student account."
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowDataDetails((value) => !value)}
            className="flex w-full items-center justify-between gap-3 border border-border p-3 text-left hover:bg-muted/20"
          >
            <div className="flex items-center gap-3">
              <Database className="size-4 text-muted-foreground" />

              <div>
                <p className="text-xs font-medium text-foreground">
                  Information categories
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  See what types of data may be associated with your account.
                </p>
              </div>
            </div>

            <ChevronRight
              className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                showDataDetails ? "rotate-90" : ""
              }`}
            />
          </button>

          {showDataDetails && (
            <div className="border border-border bg-muted/10 p-3">
              <ul className="space-y-2">
                {dataCategories.map((category) => (
                  <li
                    key={category.title}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Check className="size-3.5 shrink-0" />
                    {category.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3 border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Download className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs font-medium text-foreground">
                  Request a copy of your data
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  Request an export of information associated with your account.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDataRequest}
            >
              Request export
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Notification preferences */}
      <SectionCard
        title="Privacy preferences"
        description="Manage optional notification preferences for this demonstration."
      >
        <div className="divide-y divide-border">
          {preferences.map((preference) => (
            <div
              key={preference.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-1"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">
                  {preference.title}
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {preference.description}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={preference.enabled}
                aria-label={preference.title}
                onClick={() => togglePreference(preference.id)}
                className={`relative h-5 w-9 shrink-0 border transition-colors ${
                  preference.enabled
                    ? "border-foreground bg-foreground"
                    : "border-border bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-3.5 bg-background transition-transform ${
                    preference.enabled
                      ? "translate-x-[17px]"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          These preferences currently update local page state only.
          They do not change server-side notification delivery.
        </p>
      </SectionCard>

      {/* Data retention */}
      <SectionCard
        title="Data retention and deletion"
        description="Understand how to request changes to your stored information."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-medium text-foreground">
                Data retention
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Retention periods should be established by the
                institution according to academic, operational,
                security and legal requirements. ARGUS should not
                assume a fixed retention period without an approved
                institutional policy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Trash2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground">
                Request data deletion
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                You can request a review of your account or biometric
                data. Deletion may be subject to institutional
                retention requirements and authorization.
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleDeletionRequest}
              >
                Submit deletion request
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Security information */}
      <div className="border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-xs font-semibold text-foreground">
              Important privacy information
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              This page describes intended ARGUS privacy features.
              Actual encryption, access restrictions, biometric
              deletion, retention enforcement and data-export
              functionality must be implemented and verified on the
              backend. This frontend page does not independently
              enforce those controls.
            </p>
          </div>
        </div>
      </div>

      {/* Support link */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border p-4">
        <div>
          <p className="text-xs font-medium text-foreground">
            Have a privacy-related question?
          </p>

          <p className="mt-1 text-[11px] text-muted-foreground">
            Contact your institution through the ARGUS support centre.
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link to="/student/help">
            Contact support
          </Link>
        </Button>
      </div>
    </div>
  );
}

