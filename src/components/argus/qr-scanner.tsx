import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusChip } from "./status-chip";

export function QrScanner({
  scanning = false,
  message = "Align the session QR code inside the frame",
  className,
}: {
  scanning?: boolean;
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-sm overflow-hidden rounded-md border border-border-strong bg-surface-muted",
        className,
      )}
    >
      <div className="absolute inset-0 argus-grid-lines opacity-40" aria-hidden="true" />
      <div className="absolute inset-10 rounded-sm border border-border-strong" aria-hidden="true">
        <span className="absolute -left-px -top-px size-6 border-l-2 border-t-2 border-foreground/60" />
        <span className="absolute -right-px -top-px size-6 border-r-2 border-t-2 border-foreground/60" />
        <span className="absolute -bottom-px -left-px size-6 border-b-2 border-l-2 border-foreground/60" />
        <span className="absolute -bottom-px -right-px size-6 border-b-2 border-r-2 border-foreground/60" />
        {scanning ? <span className="absolute inset-x-0 top-1/2 h-px bg-info/70" /> : null}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
        <span className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground">
          <QrCode className="size-4" />
        </span>
        <p className="text-[13px] font-medium text-foreground">
          {scanning ? "Scanning for QR code" : "QR scanner ready"}
        </p>
        <p className="max-w-[16rem] text-xs text-muted-foreground">{message}</p>
      </div>
      <div className="absolute left-3 top-3">
        <StatusChip tone={scanning ? "info" : "neutral"}>
          {scanning ? "Scanning" : "Idle"}
        </StatusChip>
      </div>
    </div>
  );
}
