import { useMemo, useState } from "react";
import { Bot, Database, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  insightSourceLabel,
  type Insight,
  type InsightSource,
} from "@/lib/analytics-data";
import { StatusChip } from "../status-chip";
import { EmptyState } from "../empty-state";

const sourceTone: Record<InsightSource, "info" | "pending" | "neutral"> = {
  data: "info",
  ai: "pending",
  recommendation: "neutral",
};

const sourceIcon = {
  data: Database,
  ai: Bot,
  recommendation: Lightbulb,
} as const;

function InsightRow({ insight }: { insight: Insight }) {
  const Icon = sourceIcon[insight.source];
  return (
    <li className="rounded-md border border-border bg-surface-muted/40 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground">{insight.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {insight.detail}
            </p>
          </div>
        </div>
        {insight.tone ? (
          <StatusChip tone={insight.tone} className="shrink-0">
            {insight.tone === "danger" ? "Action needed" : insight.tone === "warning" ? "Watch" : "Positive"}
          </StatusChip>
        ) : null}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-2 pl-[26px]">
        <StatusChip tone={sourceTone[insight.source]} dot={false}>
          {insightSourceLabel[insight.source]}
        </StatusChip>
        <span className="text-[11px] text-muted-foreground">{insight.basis}</span>
      </div>
    </li>
  );
}

export function InsightsPanel({
  insights,
  className,
}: {
  insights: Insight[];
  className?: string;
}) {
  const [filter, setFilter] = useState<InsightSource | "all">("all");

  const sources = useMemo(() => {
    const present = new Set<InsightSource>();
    insights.forEach((i) => present.add(i.source));
    return Array.from(present);
  }, [insights]);

  const visible = filter === "all" ? insights : insights.filter((i) => i.source === filter);

  return (
    <div className={cn("space-y-3", className)}>
      {sources.length > 1 ? (
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...sources] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-sm border px-2.5 py-1 text-[12px] font-medium transition-colors",
                filter === key
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {key === "all" ? "All insights" : insightSourceLabel[key]}
            </button>
          ))}
        </div>
      ) : null}
      {visible.length ? (
        <ul className="space-y-2.5">
          {visible.map((insight) => (
            <InsightRow key={insight.id} insight={insight} />
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No insights in this category"
          description="Insights appear once enough session data accumulates for the selected period."
        />
      )}
    </div>
  );
}
