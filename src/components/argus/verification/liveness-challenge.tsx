import { RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/argus/status-chip";
import { cn } from "@/lib/utils";
import type { ChallengePhase, LivenessChallenge } from "@/lib/verification/types";

export function LivenessChallengeCard({
  challenge,
  phase,
  index,
  total,
  timeLeft,
  onRetry,
  className,
}: {
  challenge: LivenessChallenge | null;
  phase: ChallengePhase;
  index: number;
  total: number;
  timeLeft: number;
  onRetry: () => void;
  className?: string;
}) {
  if (!challenge) return null;

  const tone =
    phase === "passed" ? "success" : phase === "failed" ? "danger" : phase === "running" ? "info" : "neutral";

  return (
    <div
      className={cn("rounded-md border border-border bg-card p-4 shadow-xs", className)}
      role="status"
      aria-live="assertive"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          Verification challenge
        </p>
        <StatusChip tone={tone} dot={false}>
          {index + 1} / {total}
        </StatusChip>
      </div>

      <p className="mt-2 text-base font-semibold text-foreground">
        {phase === "passed"
          ? "Challenge completed"
          : phase === "failed"
            ? "Challenge not completed"
            : challenge.instruction}
      </p>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {phase === "prompt"
          ? "Get ready — follow the instruction when the timer starts."
          : phase === "running"
            ? "Hold your device steady and follow the instruction."
            : phase === "passed"
              ? "Presence confirmed for this step."
              : "We could not observe the requested movement in time."}
      </p>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-1000",
              phase === "failed" ? "bg-danger" : phase === "passed" ? "bg-success" : "bg-secondary",
            )}
            style={{
              width: `${phase === "passed" ? 100 : Math.max(0, (timeLeft / challenge.timeLimit) * 100)}%`,
            }}
          />
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-muted-foreground">
          <Timer className="size-3" aria-hidden="true" />
          {Math.max(0, timeLeft)}s
        </span>
      </div>

      {phase === "failed" ? (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          <RotateCcw />
          Retry challenge
        </Button>
      ) : null}
    </div>
  );
}
