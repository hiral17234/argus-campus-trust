import { AlertTriangle, Eye, ShieldAlert } from "lucide-react";
import { StatusChip } from "@/components/argus/status-chip";
import { cn } from "@/lib/utils";
import { faceDetectionCopy, occlusionCopy, spoofCopy } from "@/lib/verification/mock-service";
import type { FaceDetectionState, OcclusionKind, SpoofKind } from "@/lib/verification/types";

/** Face detection, occlusion and anti-spoofing guidance in one place. */
export function FaceGuidance({
  faceState,
  occlusion,
  spoof,
  className,
}: {
  faceState: FaceDetectionState;
  occlusion?: OcclusionKind | null;
  spoof?: SpoofKind | null;
  className?: string;
}) {
  const copy = faceDetectionCopy[faceState];

  return (
    <div className={cn("space-y-2", className)} aria-live="polite">
      <div className="flex flex-wrap items-center gap-2">
        <StatusChip tone={copy.tone}>{copy.label}</StatusChip>
        {occlusion ? (
          <StatusChip tone="warning" dot={false}>
            <Eye className="size-3" aria-hidden="true" />
            Face partially covered
          </StatusChip>
        ) : null}
      </div>
      <p className="text-[13px] text-muted-foreground">{copy.guidance}</p>
      {occlusion ? (
        <p className="flex items-start gap-2 rounded-md border border-warning/25 bg-warning-surface px-3 py-2 text-[13px] text-warning">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {occlusionCopy[occlusion]}
        </p>
      ) : null}
      {spoof ? (
        <p className="flex items-start gap-2 rounded-md border border-danger/25 bg-danger-surface px-3 py-2 text-[13px] text-danger">
          <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {spoofCopy[spoof]}
        </p>
      ) : null}
    </div>
  );
}
