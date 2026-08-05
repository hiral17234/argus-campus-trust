import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Initials({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-muted text-[12px] font-semibold text-foreground",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function UserCard({
  name,
  role,
  meta,
  trailing,
  className,
}: {
  name: string;
  role: string;
  meta?: string;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-card p-3 shadow-xs",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Initials name={name} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {role}
            {meta ? ` · ${meta}` : ""}
          </p>
        </div>
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
