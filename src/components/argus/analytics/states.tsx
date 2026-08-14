import type { ReactNode } from "react";
import { AlertTriangle, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DEMO_DATA_NOTICE } from "@/lib/analytics-data";

export function LoadingState({
  label = "Loading analytics…",
  rows = 3,
  className,
}: {
  label?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-3 w-32 rounded-sm" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
}

export function ChartLoadingState({ height = 224 }: { height?: number }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading chart</span>
      <Skeleton className="w-full rounded-md" style={{ height }} />
    </div>
  );
}

export function ErrorState({
  title = "Analytics could not be loaded",
  description = "The analytics service did not respond. Try again in a moment.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-md border border-danger/25 bg-danger-surface/40 px-6 py-10 text-center",
        className,
      )}
    >
      <AlertTriangle className="size-5 text-danger" />
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCw className="size-3.5" /> Retry
        </Button>
      ) : null}
    </div>
  );
}

export function PartialDataNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-warning/25 bg-warning-surface/50 px-3 py-2 text-[12px] text-foreground">
      <Info className="mt-0.5 size-3.5 shrink-0 text-warning" />
      <span>{children}</span>
    </div>
  );
}

export function DemoDataNotice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-md border border-border bg-surface-muted/60 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-3.5 shrink-0" />
      <span>{DEMO_DATA_NOTICE}</span>
    </p>
  );
}
