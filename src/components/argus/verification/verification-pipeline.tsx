import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStage } from "@/lib/verification/types";

export function VerificationPipeline({
  stages,
  className,
}: {
  stages: PipelineStage[];
  className?: string;
}) {
  const active = stages.find((s) => s.status === "active");
  return (
    <div className={cn("space-y-3", className)}>
      {active ? (
        <p className="text-[13px] font-medium text-foreground" aria-live="polite">
          {active.activeMessage}
        </p>
      ) : null}
      <ol className="space-y-1.5">
        {stages.map((stage) => (
          <li key={stage.id} className="flex items-center gap-2.5">
            <span
              className={cn(
                "inline-flex size-5 shrink-0 items-center justify-center rounded-md border text-[10px]",
                stage.status === "passed" && "border-success/30 bg-success-surface text-success",
                stage.status === "failed" && "border-danger/30 bg-danger-surface text-danger",
                stage.status === "active" && "border-info/30 bg-info-surface text-info",
                stage.status === "pending" && "border-border bg-surface-muted text-muted-foreground",
              )}
              aria-hidden="true"
            >
              {stage.status === "passed" ? (
                <Check className="size-3" />
              ) : stage.status === "failed" ? (
                <X className="size-3" />
              ) : stage.status === "active" ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <span className="size-1.5 rounded-full bg-muted-foreground/60" />
              )}
            </span>
            <span
              className={cn(
                "text-[13px]",
                stage.status === "pending" ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {stage.label}
            </span>
            <span className="sr-only">
              {stage.status === "passed"
                ? "completed"
                : stage.status === "failed"
                  ? "failed"
                  : stage.status === "active"
                    ? "in progress"
                    : "waiting"}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
