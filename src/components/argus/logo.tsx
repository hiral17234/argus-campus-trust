import { cn } from "@/lib/utils";

export function ArgusMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 4 6.2v5c0 4.6 3.2 8.6 8 9.8 4.8-1.2 8-5.2 8-9.8v-5L12 3Z" />
        <circle cx="12" cy="11" r="2.4" />
      </svg>
    </span>
  );
}

export function ArgusLogo({
  className,
  showTagline = false,
  size = "md",
}: {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <ArgusMark className={size === "sm" ? "size-7" : "size-8"} />
      <div className="min-w-0 leading-tight">
        <div
          className={cn(
            "font-semibold tracking-[0.16em] text-foreground",
            size === "sm" ? "text-[13px]" : "text-sm",
          )}
        >
          ARGUS
        </div>
        {showTagline ? (
          <div className="truncate text-[11px] text-muted-foreground">
            Identity Verification Platform
          </div>
        ) : null}
      </div>
    </div>
  );
}
