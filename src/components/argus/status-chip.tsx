import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info" | "pending";

const toneMap: Record<StatusTone, string> = {
  neutral: "border-border bg-surface-muted text-muted-foreground",
  success: "border-success/25 bg-success-surface text-success",
  warning: "border-warning/25 bg-warning-surface text-warning",
  danger: "border-danger/25 bg-danger-surface text-danger",
  info: "border-info/25 bg-info-surface text-info",
  pending: "border-border-strong bg-surface text-foreground",
};

const dotMap: Record<StatusTone, string> = {
  neutral: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  pending: "bg-secondary",
};

export function StatusChip({
  tone = "neutral",
  children,
  dot = true,
  className,
}: {
  tone?: StatusTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        toneMap[tone],
        className,
      )}
    >
      {dot ? <span className={cn("size-1.5 rounded-full", dotMap[tone])} /> : null}
      {children}
    </span>
  );
}
