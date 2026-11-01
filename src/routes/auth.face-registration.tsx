
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Check,
  CircleAlert,
  RefreshCcw,
  ScanFace,
} from "lucide-react";

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
        content:
          "Complete multi-angle face enrollment to activate ARGUS identity verification.",
      },
      { property: "og:title", content: "Face registration — ARGUS" },
      {
        property: "og:description",
        content:
          "Guided multi-angle biometric enrollment with liveness checks.",
      },
    ],
  }),
  component: FaceRegistrationPage,
});

function FaceRegistrationPage() {
  const navigate = useNavigate();

  const [captured, setCaptured] = useState<string[]>([]);
  const [cameraPermission, setCameraPermission] = useState<
    "checking" | "granted" | "denied" | "unsupported"
  >("checking");

  const [cameraError, setCameraError] = useState("");

  const nextIndex = captured.length;
  const current = faceAngles[nextIndex];
  const done = nextIndex >= faceAngles.length;

  const progress =
    faceAngles.length > 0
      ? Math.round((captured.length / faceAngles.length) * 100)
      : 0;

  useEffect(() => {
    let mounted = true;

    async function checkCameraPermission() {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        if (mounted) {
          setCameraPermission("unsupported");
          setCameraError(
            "Camera access is not supported in this browser."
          );
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        stream.getTracks().forEach((track) => track.stop());

        if (mounted) {
          setCameraPermission("granted");
          setCameraError("");
        }
      } catch {
        if (mounted) {
          setCameraPermission("denied");
          setCameraError(
            "Camera permission is required for face registration. Allow camera access in your browser settings."
          );
        }
      }
    }

    checkCameraPermission();

    return () => {
      mounted = false;
    };
  }, []);

  function captureAngle() {
    if (!current || cameraPermission !== "granted") {
      return;
    }

    // Prototype only: this records the requested angle in frontend state.
    // Actual image capture, face detection and biometric processing
    // must be implemented through the camera and backend integration.

    setCaptured((previous) => [...previous, current.id]);
  }

  function retakeLast() {
    setCaptured((previous) => previous.slice(0, -1));
  }

  function redoEnrollment() {
    setCaptured([]);
  }

  return (
    <AuthLayout
      eyebrow="Biometric enrollment"
      title="Register your face"
      description="Follow each prompt in order. Actual biometric captures and encrypted template storage require backend integration."
      step={{ current: 2, total: 3 }}
    >
      <div className="space-y-5">
        <CameraPreview
          active={!done && cameraPermission === "granted"}
          status={
            done
              ? "Capture sequence complete"
              : cameraPermission === "checking"
                ? "Checking camera access"
                : cameraPermission === "denied"
                  ? "Camera access denied"
                  : cameraPermission === "unsupported"
                    ? "Camera unavailable"
                    : `Capturing · ${current?.label ?? ""}`
          }
          statusTone={
            done
              ? "success"
              : cameraPermission === "granted"
                ? "info"
                : "warning"
          }
          label={
            done
              ? "All angles recorded"
              : (current?.label ?? "Camera unavailable")
          }
          hint={
            done
              ? "The capture sequence is complete. Biometric verification is pending."
              : (current?.hint ?? "")
          }
        />

        {cameraError && (
          <div className="flex items-start gap-2 border border-warning/30 bg-surface-muted p-3">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
            <p className="text-[12px] text-muted-foreground">
              {cameraError}
            </p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between text-[12px] font-medium text-muted-foreground">
            <span>
              {captured.length} of {faceAngles.length} angles captured
            </span>
            <span className="tabular-nums">{progress}%</span>
          </div>

          <div className="mt-2 h-1.5 w-full bg-surface-muted">
            <div
              className="h-full bg-secondary transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ol className="grid grid-cols-2 gap-1.5">
          {faceAngles.map((angle, index) => {
            const isDone = index < captured.length;
            const isCurrent = index === captured.length;

            return (
              <li
                key={angle.id}
                className={cn(
                  "flex items-center gap-2 border px-2.5 py-2 text-[12px]",
                  isDone
                    ? "border-success/25 bg-success-surface text-success"
                    : isCurrent
                      ? "border-secondary bg-surface-muted text-foreground"
                      : "border-border bg-surface text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-4 shrink-0 items-center justify-center border text-[9px] font-semibold",
                    isDone
                      ? "border-success bg-success text-success-foreground"
                      : "border-current"
                  )}
                >
                  {isDone ? (
                    <Check className="size-2.5" />
                  ) : (
                    index + 1
                  )}
                </span>

                <span className="truncate font-medium">
                  {angle.label}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="border border-border bg-surface-muted/40 p-3">
          <div className="flex items-center gap-2">
            <CircleAlert className="size-4 shrink-0 text-warning" />
            <p className="text-[12px] font-semibold text-foreground">
              Before you capture
            </p>
          </div>

          <ul className="mt-2 space-y-1">
            {faceRules.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-1.5 text-[12px] text-muted-foreground"
              >
                <span className="mt-1.5 size-1 shrink-0 bg-muted-foreground" />
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
                onClick={() =>
                  navigate({ to: "/auth/device-registration" })
                }
                className="sm:flex-1"
              >
                Continue to device registration
              </Button>

              <Button
                variant="outline"
                size="xl"
                onClick={redoEnrollment}
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
                onClick={captureAngle}
                disabled={cameraPermission !== "granted" || !current}
                className="sm:flex-1"
              >
                <ScanFace />
                Capture {current?.label.toLowerCase() ?? "face"}
              </Button>

              <Button
                variant="outline"
                size="xl"
                onClick={retakeLast}
                disabled={captured.length === 0}
                className="sm:w-auto sm:shrink-0"
              >
                Retake last
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <StatusChip tone={done ? "pending" : "pending"}>
            {done
              ? "Biometric verification pending"
              : "Liveness verification pending"}
          </StatusChip>

          <span className="font-mono text-[11px] text-muted-foreground">
            Encryption: Backend pending
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}
