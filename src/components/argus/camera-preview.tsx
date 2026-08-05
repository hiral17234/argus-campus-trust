import type { ReactNode } from "react";
import { Camera, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusChip, type StatusTone } from "./status-chip";

export function CameraPreview({
  label = "Live camera preview",
  hint,
  status,
  statusTone = "neutral",
  active = false,
  overlay,
  className,
}: {
  label?: string;
  hint?: string;
  status?: string;
  statusTone?: StatusTone;
  active?: boolean;
  overlay?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border-strong bg-surface-muted",
        className,
      )}
    >
      <div className="absolute inset-0 argus-grid-lines opacity-40" aria-hidden="true" />

      <div className="absolute inset-6 argus-scan-frame rounded-sm" aria-hidden="true">
        <div
          className={cn(
            "absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-border-strong",
            active && "bg-info/70",
          )}
        />
        <div className="absolute left-1/2 inset-y-8 w-px -translate-x-1/2 bg-border-strong/70" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground">
          <Camera className="size-4" />
        </span>
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        {hint ? <p className="max-w-xs text-xs text-muted-foreground">{hint}</p> : null}
      </div>

      <div className="absolute left-3 top-3 flex items-center gap-2">
        <StatusChip tone={active ? "info" : statusTone}>
          {status ?? (active ? "Camera active" : "Camera idle")}
        </StatusChip>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          ARGUS · Secure capture
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="size-3" />
          On-device
        </span>
      </div>

      {overlay}
    </div>
  );
}
