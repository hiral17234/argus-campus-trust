
import { useState, type ComponentType } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ban,
  CheckCircle2,
  Clock,
  KeyRound,
  MapPin,
  QrCode,
  ShieldCheck,
  Smartphone,
  Timer,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
  DetailRow,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  eligibilityCopy,
  mockSession,
} from "@/lib/verification/mock-service";
import type { EligibilityCode } from "@/lib/verification/types";
import { useCountdown } from "@/hooks/use-countdown";

export const Route = createFileRoute("/student/attendance")({
  head: () => ({
    meta: [
      { title: "Mark Attendance — ARGUS" },
      {
        name: "description",
        content:
          "Mark attendance using QR scanning, attendance codes and face verification.",
      },
      {
        property: "og:title",
        content: "Mark Attendance — ARGUS",
      },
      {
        property: "og:description",
        content:
          "Attendance verification with face, device and location checks.",
      },
    ],
  }),
  component: AttendancePage,
});

const eligibilityOptions: EligibilityCode[] = [
  "eligible",
  "session-closed",
  "detained",
  "already-marked",
  "outside-window",
  "session-unavailable",
];

function AttendancePage() {
  const [eligibility, setEligibility] =
    useState<EligibilityCode>("eligible");

  const timer = useCountdown(252);

  const copy = eligibilityCopy[eligibility];

  const eligible =
    eligibility === "eligible" && timer.left > 0;

  const alreadyMarked = eligibility === "already-marked";

  const statusLabel = eligible
    ? "Window open"
    : alreadyMarked
      ? "Recorded"
      : "Unavailable";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark attendance"
        description="Complete the required verification steps to record your attendance."
        actions={
          <StatusChip
            tone={
              eligible
                ? "info"
                : alreadyMarked
                  ? "success"
                  : "danger"
            }
          >
            {statusLabel}
          </StatusChip>
        }
      />

      {/* Current session */}
      <SectionCard bodyClassName="p-4 sm:p-5">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Current class session
            </p>

            <h2 className="mt-2 truncate text-base font-semibold text-foreground">
              {mockSession.subject} · {mockSession.subjectCode}
            </h2>

            <p className="mt-1 text-[13px] text-muted-foreground">
              {mockSession.teacher}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span>{mockSession.window}</span>
              <span>{mockSession.room}</span>
            </div>
          </div>

          <div className="border border-border bg-muted/20 px-5 py-3 text-center sm:min-w-[150px]">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Timer className="size-3.5" aria-hidden="true" />
              Time remaining
            </p>

            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">
              {eligible ? timer.label : "--:--"}
            </p>
          </div>
        </div>

        <div
          className="mt-5 h-1 w-full overflow-hidden bg-muted"
          role="progressbar"
          aria-label="Attendance window remaining"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={eligible ? timer.percent : 0}
        >
          <div
            className="h-full bg-foreground transition-[width] duration-1000"
            style={{
              width: `${eligible ? timer.percent : 0}%`,
            }}
          />
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">
          Demonstration session data. Actual session details will come from
          the institutional server.
        </p>
      </SectionCard>

      {/* Eligible state */}
      {eligible ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Verification methods */}
          <SectionCard
            title="Choose a verification method"
            description="Select one method to begin attendance verification."
            bodyClassName="p-4 sm:p-5"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodCard
                to="qr"
                icon={QrCode}
                title="Scan QR"
                description="Scan the QR code displayed by your teacher, then complete face verification."
              />

              <MethodCard
                to="code"
                icon={KeyRound}
                title="Enter attendance code"
                description="Enter the rotating six-digit attendance code, then complete face verification."
              />
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Both methods require a face verification step. Ensure that
                your camera is available and your face is clearly visible.
              </p>
            </div>
          </SectionCard>

          {/* Verification pre-checks */}
          <SectionCard
            title="Verification pre-checks"
            description="Sample eligibility information for this demonstration."
          >
            <div className="border border-border bg-background px-3">
              <DetailRow
                label="Face registration"
                value={
                  <StatusChip tone="neutral">
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    Demo enrolled
                  </StatusChip>
                }
              />

              <DetailRow
                label="Registered device"
                value={
                  <StatusChip tone="neutral">
                    <Smartphone className="size-3" aria-hidden="true" />
                    Demo trusted
                  </StatusChip>
                }
              />

              <DetailRow
                label="Location"
                value={
                  <StatusChip tone="neutral">
                    <MapPin className="size-3" aria-hidden="true" />
                    Demo location
                  </StatusChip>
                }
              />

              <DetailRow
                label="Attendance status"
                value={
                  <StatusChip tone="pending">
                    Pending verification
                  </StatusChip>
                }
              />
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              These statuses are mock values. Real device trust, GPS
              validation and face enrollment checks require backend
              integration.
            </p>
          </SectionCard>
        </div>
      ) : (
        /* Ineligible state */
        <Alert>
          {alreadyMarked ? (
            <CheckCircle2 className="size-4" />
          ) : eligibility === "detained" ? (
            <Ban className="size-4" />
          ) : (
            <Clock className="size-4" />
          )}

          <AlertTitle>{copy.title}</AlertTitle>

          <AlertDescription>
            {copy.message}

            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link to="/student/history">
                  View attendance history
                </Link>
              </Button>

              {eligibility !== "detained" &&
                eligibility !== "already-marked" && (
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/student/appeals">
                      Raise an appeal
                    </Link>
                  </Button>
                )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Demo controls */}
      <SectionCard
        title="Development controls"
        description="Simulate different attendance eligibility states for frontend testing."
        bodyClassName="p-4"
      >
        <div className="space-y-3">
          <Select
            value={eligibility}
            onValueChange={(value) =>
              setEligibility(value as EligibilityCode)
            }
          >
            <SelectTrigger
              className="w-full sm:w-[300px]"
              aria-label="Select attendance eligibility state"
            >
              <SelectValue placeholder="Select eligibility state" />
            </SelectTrigger>

            <SelectContent>
              {eligibilityOptions.map((code) => (
                <SelectItem key={code} value={code}>
                  {eligibilityCopy[code].title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-[11px] text-muted-foreground">
            This selector is for development and testing only. It must be
            removed or restricted before production deployment.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

function MethodCard({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: "qr" | "code";
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      to="/student/verify"
      search={{
        method: to,
        scenario: "success",
      }}
      className="group block border border-border bg-card p-4 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="inline-flex size-9 items-center justify-center border border-border bg-background text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>

      <p className="mt-3 text-sm font-semibold text-foreground">
        {title}
      </p>

      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>

      <span className="mt-4 inline-block text-xs font-medium text-foreground">
        Continue verification →
      </span>
    </Link>
  );
}
