import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { StatusChip, type StatusTone } from "./status-chip";

export type NotificationKind =
  | "attendance-open"
  | "attendance-closed"
  | "attendance-approved"
  | "attendance-rejected"
  | "appeal-approved"
  | "appeal-rejected"
  | "announcement";

export const notificationMeta: Record<NotificationKind, { label: string; tone: StatusTone }> = {
  "attendance-open": { label: "Attendance open", tone: "info" },
  "attendance-closed": { label: "Attendance closed", tone: "neutral" },
  "attendance-approved": { label: "Attendance approved", tone: "success" },
  "attendance-rejected": { label: "Attendance rejected", tone: "danger" },
  "appeal-approved": { label: "Appeal approved", tone: "success" },
  "appeal-rejected": { label: "Appeal rejected", tone: "danger" },
  announcement: { label: "Announcement", tone: "warning" },
};

export function NotificationCard({
  kind,
  title,
  body,
  time,
  unread = false,
  icon: Icon,
  className,
}: {
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  const meta = notificationMeta[kind];
  return (
    <article
      className={cn(
        "relative rounded-md border border-border bg-card p-3.5 shadow-xs transition-colors hover:bg-accent/40 sm:p-4",
        unread && "border-l-2 border-l-secondary",
        className,
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon ? (
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-muted text-muted-foreground">
              <Icon className="size-4" />
            </span>
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-[13px] font-semibold text-foreground">{title}</h3>
              <StatusChip tone={meta.tone} dot={false}>
                {meta.label}
              </StatusChip>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
          </div>
        </div>
        <time className="shrink-0 font-mono text-[11px] text-muted-foreground">{time}</time>
      </div>
    </article>
  );
}
