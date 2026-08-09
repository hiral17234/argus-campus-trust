import { useState } from "react";
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
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eligibilityCopy, mockSession } from "@/lib/verification/mock-service";
import type { EligibilityCode } from "@/lib/verification/types";
import { useCountdown } from "@/hooks/use-countdown";

export const Route = createFileRoute("/student/attendance")({
  head: () => ({
    meta: [
      { title: "Mark Attendance — ARGUS" },
      {
        name: "description",
        content: "Mark attendance with QR scanning, attendance codes and face verification.",
      },
      { property: "og:title", content: "Mark Attendance — ARGUS" },
      {
        property: "og:description",
        content: "Verified attendance capture with liveness, location and device checks.",
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
  const [eligibility, setEligibility] = useState<EligibilityCode>("eligible");
  const timer = useCountdown(252);
  const copy = eligibilityCopy[eligibility];
  const eligible = eligibility === "eligible" && timer.left > 0;

  return (
    <>
      <PageHeader
        title="Mark attendance"
        description="Verification is bound to your registered face template and trusted device."
        actions={
          <StatusChip tone={eligible ? "info" : eligibility === "already-marked" ? "success" : "danger"}>
            {eligible ? "Window open" : eligibility === "already-marked" ? "Recorded" : "Unavailable"}
          </StatusChip>
        }
      />

      <SectionCard bodyClassName="p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              Today&apos;s class
            </p>
            <h2 className="mt-1 truncate text-base font-semibold text-foreground">
              {mockSession.subject} · {mockSession.subjectCode}
            </h2>
            <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
              {mockSession.teacher} · {mockSession.window} · {mockSession.room}
            </p>
          </div>
          <div className="shrink-0 rounded-md border border-border bg-surface-muted px-4 py-3 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Timer className="size-3.5" aria-hidden="true" />
              Time remaining
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">
              {eligible ? timer.label : "--:--"}
            </p>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-secondary transition-[width] duration-1000"
            style={{ width: `${eligible ? timer.percent : 0}%` }}
          />
        </div>
      </SectionCard>

      {eligible ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <SectionCard title="Choose a verification method" bodyClassName="p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodCard
                to="qr"
                icon={QrCode}
                title="Scan QR"
                description="Scan the QR projected by your teacher, then complete face verification."
              />
              <MethodCard
                to="code"
                icon={KeyRound}
                title="Enter attendance code"
                description="Enter the rotating 6-digit code, then complete face verification."
              />
            </div>
            <p className="mt-4 text-[12px] text-muted-foreground">
              Both methods require a live face check. Only you should be visible during verification.
            </p>
          </SectionCard>

          <SectionCard title="Pre-checks" description="Verified before you start">
            <div className="rounded-md border border-border bg-surface-muted/40 px-3">
              <DetailRow
                label="Face registration"
                value={
                  <StatusChip tone="success">
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    Enrolled
                  </StatusChip>
                }
              />
              <DetailRow
                label="Device"
                value={
                  <StatusChip tone="success">
                    <Smartphone className="size-3" aria-hidden="true" />
                    Trusted
                  </StatusChip>
                }
              />
              <DetailRow
                label="Location"
                value={
                  <StatusChip tone="success">
                    <MapPin className="size-3" aria-hidden="true" />
                    On campus
                  </StatusChip>
                }
              />
              <DetailRow
                label="Attendance status"
                value={<StatusChip tone="pending">Pending verification</StatusChip>}
              />
            </div>
          </SectionCard>
        </div>
      ) : (
        <Alert>
          {eligibility === "already-marked" ? (
            <CheckCircle2 className="size-4" />
          ) : eligibility === "detained" ? (
            <Ban className="size-4" />
          ) : (
            <Clock className="size-4" />
          )}
          <AlertTitle>{copy.title}</AlertTitle>
          <AlertDescription>
            {copy.message}
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link to="/student/history">View attendance history</Link>
              </Button>
              {eligibility !== "detained" && eligibility !== "already-marked" ? (
                <Button size="sm" variant="outline" asChild>
                  <Link to="/student/appeals">Raise an appeal</Link>
                </Button>
              ) : null}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <SectionCard
        title="Demo controls"
        description="Preview each eligibility state — replaced by the verification engine later"
        bodyClassName="p-3 sm:p-4"
      >
        <Select value={eligibility} onValueChange={(v) => setEligibility(v as EligibilityCode)}>
          <SelectTrigger className="w-full sm:w-[280px]" aria-label="Eligibility state">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {eligibilityOptions.map((code) => (
              <SelectItem key={code} value={code}>
                {eligibilityCopy[code].title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SectionCard>
    </>
  );
}

function MethodCard({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: "qr" | "code";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      to="/student/verify"
      search={{ method: to, scenario: "success" as const }}
      className="group rounded-md border border-border bg-card p-4 shadow-xs transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-surface-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
    </Link>
  );
}
