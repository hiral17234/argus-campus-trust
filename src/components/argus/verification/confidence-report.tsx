import type { RiskLevel, SignalStatus, VerificationSignal } from "@/lib/verification/types";
import { StatusChip, type StatusTone } from "@/components/argus/status-chip";
import { DetailRow } from "@/components/argus/section";
import { cn } from "@/lib/utils";

export const riskTone: Record<RiskLevel, StatusTone> = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
  CRITICAL: "danger",
};

const signalTone: Record<SignalStatus, StatusTone> = {
  pass: "success",
  warn: "warning",
  fail: "danger",
  info: "neutral",
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <StatusChip tone={riskTone[risk]}>
      {risk === "CRITICAL" ? "CRITICAL" : `${risk} RISK`}
    </StatusChip>
  );
}

/** Confidence + signal breakdown, shared by student result and teacher review. */
export function ConfidenceReport({
  signals,
  overallConfidence,
  risk,
  riskExplanation,
  className,
}: {
  signals: VerificationSignal[];
  overallConfidence: number;
  risk: RiskLevel;
  riskExplanation: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border border-border bg-surface-muted/40 px-3", className)}>
      {signals.map((s) => (
        <DetailRow
          key={s.id}
          label={s.label}
          value={
            <StatusChip tone={signalTone[s.status]} dot={s.status !== "info"}>
              {s.value}
            </StatusChip>
          }
        />
      ))}
      <DetailRow
        label="Overall confidence"
        value={
          <span className="font-mono text-[13px] font-semibold tabular-nums text-foreground">
            {overallConfidence.toFixed(1)}%
          </span>
        }
      />
      <DetailRow label="Risk classification" value={<RiskBadge risk={risk} />} />
      <div className="border-t border-border py-2.5">
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          {riskExplanation} Confidence values are indicative verification signals, not a legally
          meaningful probability.
        </p>
      </div>
    </div>
  );
}
