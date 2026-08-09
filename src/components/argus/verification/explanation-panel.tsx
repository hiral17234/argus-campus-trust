import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Teacher/admin facing explanation of a verification decision.
 * Reasons must come from recorded verification signals — the UI never
 * synthesises an explanation of its own.
 */
export function AiExplanationPanel({
  outcome,
  reasons,
  className,
}: {
  outcome: "verified" | "rejected";
  reasons: string[];
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-md border border-border bg-card p-3.5 shadow-xs", className)}
      aria-label="Verification explanation"
    >
      <h3 className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
        <Info className="size-3.5 text-muted-foreground" aria-hidden="true" />
        {outcome === "rejected" ? "Verification rejected because:" : "Verification accepted because:"}
      </h3>
      {reasons.length === 0 ? (
        <p className="mt-2 text-[13px] text-muted-foreground">
          All recorded verification signals met the configured thresholds.
        </p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-[13px] text-muted-foreground">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
              {reason}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 border-t border-border pt-2.5 text-[12px] text-muted-foreground">
        Based on signals recorded during this attempt. Detection is probabilistic and may be reviewed
        manually.
      </p>
    </section>
  );
}
