import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, CircleAlert, RefreshCcw, ScanFace } from "lucide-react";
import { AuthLayout } from "@/components/argus/auth-layout";
import { CameraPreview } from "@/components/argus/camera-preview";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/argus/status-chip";
import { faceAngles, faceRules } from "@/lib/argus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/face-registration")({
  head: () => ({
    meta: [
      { title: "Face registration — ARGUS" },
      {
        name: "description",
        content: "Complete multi-angle face enrollment to activate ARGUS identity verification.",
      },
      { property: "og:title", content: "Face registration — ARGUS" },
      {
        property: "og:description",
        content: "Guided multi-angle biometric enrollment with liveness checks.",
      },
    ],
  }),
  component: FaceRegistrationPage,
});

function FaceRegistrationPage() {
  const navigate = useNavigate();
  const [captured, setCaptured] = useState<string[]>([]);
  const nextIndex = captured.length;
  const current = faceAngles[nextIndex];
  const done = nextIndex >= faceAngles.length;
  const progress = Math.round((captured.length / faceAngles.length) * 100);

  return (
    <AuthLayout
      eyebrow="Biometric enrollment"
      title="Register your face"
      description="Follow each prompt in order. Captures are processed on device and stored as an encrypted template."
      step={{ current: 2, total: 3 }}
    >
      <div className="space-y-5">
        <CameraPreview
          active={!done}
          status={done ? "Enrollment complete" : `Capturing · ${current?.label}`}
          statusTone={done ? "success" : "info"}
          label={done ? "All angles captured" : (current?.label ?? "")}
          hint={done ? "Your face template is ready for verification." : (current?.hint ?? "")}
        />

        <div>
          <div className="flex items-center justify-between text-[12px] font-medium text-muted-foreground">
            <span>
              {captured.length} of {faceAngles.length} angles captured
            </span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-secondary transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ol className="grid grid-cols-2 gap-1.5">
          {faceAngles.map((angle, i) => {
            const isDone = i < captured.length;
            const isCurrent = i === captured.length;
            return (
              <li
                key={angle.id}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-2.5 py-2 text-[12px]",
                  isDone
                    ? "border-success/25 bg-success-surface text-success"
                    : isCurrent
                      ? "border-secondary bg-surface-muted text-foreground"
                      : "border-border bg-surface text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold",
                    isDone ? "border-success bg-success text-success-foreground" : "border-current",
                  )}
                >
                  {isDone ? <Check className="size-2.5" /> : i + 1}
                </span>
                <span className="truncate font-medium">{angle.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="rounded-md border border-border bg-surface-muted/70 p-3">
          <div className="flex items-center gap-2">
            <CircleAlert className="size-4 shrink-0 text-warning" />
            <p className="text-[12px] font-semibold text-foreground">Before you capture</p>
          </div>
          <ul className="mt-2 space-y-1">
            {faceRules.map((rule) => (
              <li key={rule} className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {done ? (
            <>
              <Button
                size="xl"
                onClick={() => navigate({ to: "/auth/device-registration" })}
                className="sm:flex-1"
              >
                Continue to device registration
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => setCaptured([])}
                className="sm:w-auto sm:shrink-0"
              >
                <RefreshCcw />
                Redo
              </Button>
            </>
          ) : (
            <>
              <Button
                size="xl"
                onClick={() => setCaptured((c) => [...c, faceAngles[c.length]!.id])}
                className="sm:flex-1"
              >
                <ScanFace />
                Capture {current?.label.toLowerCase()}
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => setCaptured((c) => c.slice(0, -1))}
                disabled={captured.length === 0}
                className="sm:w-auto sm:shrink-0"
              >
                Retake last
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <StatusChip tone={done ? "success" : "pending"}>
            {done ? "Liveness passed" : "Liveness check in progress"}
          </StatusChip>
          <span className="font-mono text-[11px] text-muted-foreground">Template: AES-256</span>
        </div>
      </div>
    </AuthLayout>
  );
}
