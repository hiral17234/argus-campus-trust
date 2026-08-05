import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, KeyRound, MapPin, QrCode, ScanFace, Smartphone, Timer } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { QrScanner } from "@/components/argus/qr-scanner";
import { CameraPreview } from "@/components/argus/camera-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { todayClasses } from "@/lib/argus-data";

export const Route = createFileRoute("/student/attendance")({
  head: () => ({
    meta: [
      { title: "Mark Attendance — ARGUS" },
      {
        name: "description",
        content: "Mark attendance with QR scanning, attendance codes and face verification.",
      },
      { property: "og:title", content: "Mark Attendance — ARGUS" },
      {
        property: "og:description",
        content: "Verified attendance capture with liveness, location and device checks.",
      },
    ],
  }),
  component: AttendancePage,
});

function useCountdown(initial: number) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const m = Math.floor(left / 60)
    .toString()
    .padStart(2, "0");
  const s = (left % 60).toString().padStart(2, "0");
  return { left, label: `${m}:${s}`, percent: (left / initial) * 100 };
}

function AttendancePage() {
  const live = todayClasses.find((c) => c.status === "Live")!;
  const timer = useCountdown(252);
  const [scanning, setScanning] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  return (
    <>
      <PageHeader
        title="Mark attendance"
        description="Verification is bound to your registered face template and trusted device."
        actions={
          <StatusChip tone={verified ? "success" : timer.left > 0 ? "info" : "danger"}>
            {verified ? "Attendance recorded" : timer.left > 0 ? "Window open" : "Window closed"}
          </StatusChip>
        }
      />

      {/* Session + timer */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-xs sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              Active session
            </p>
            <h2 className="mt-1 truncate text-base font-semibold text-foreground">
              {live.subject} · {live.code}
            </h2>
            <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
              {live.teacher} · {live.time} · {live.room}
            </p>
          </div>
          <div className="shrink-0 rounded-md border border-border bg-surface-muted px-4 py-3 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Timer className="size-3.5" />
              Window closes in
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">
              {timer.label}
            </p>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-secondary transition-[width] duration-1000"
            style={{ width: `${timer.percent}%` }}
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <SectionCard title="Verification method" bodyClassName="p-4 sm:p-5">
          <Tabs defaultValue="qr">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="gap-1.5">
                <QrCode className="size-3.5" />
                QR attendance
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5">
                <KeyRound className="size-3.5" />
                Attendance code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="mt-5 space-y-4">
              <div className="flex justify-center">
                <QrScanner scanning={scanning} />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="sm:flex-1"
                  size="lg"
                  onClick={() => setScanning((s) => !s)}
                >
                  {scanning ? "Stop scanner" : "Start QR scanner"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="sm:w-auto"
                  onClick={() => {
                    setVerified(true);
                    toast.success("Attendance recorded", {
                      description: "Database Systems · verified at 98.6% confidence.",
                    });
                  }}
                >
                  <ScanFace />
                  Verify face
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="code" className="mt-5 space-y-4">
              <div className="space-y-3">
                <Label>6-digit attendance code</Label>
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup className="w-full justify-between gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-12 w-full rounded-md border border-input bg-surface text-base font-semibold shadow-xs"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-[12px] text-muted-foreground">
                  The code is displayed by your teacher and rotates every 30 seconds.
                </p>
              </div>
              <Button
                size="lg"
                className="w-full"
                disabled={code.length !== 6}
                onClick={() => {
                  setVerified(true);
                  toast.success("Attendance submitted", {
                    description: "Awaiting face verification confirmation.",
                  });
                }}
              >
                Submit attendance code
              </Button>
            </TabsContent>
          </Tabs>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Face verification" description="Live camera preview">
            <CameraPreview
              active={scanning || verified}
              status={verified ? "Match confirmed" : scanning ? "Analyzing" : "Standby"}
              statusTone={verified ? "success" : "neutral"}
              label={verified ? "Identity confirmed" : "Position your face in the frame"}
              hint={
                verified
                  ? "Confidence 98.6% · liveness passed"
                  : "Remove caps, masks and glasses before verification."
              }
            />
            <div className="mt-4 space-y-0">
              <DetailRow
                label="Liveness"
                value={<StatusChip tone={verified ? "success" : "neutral"}>{verified ? "Passed" : "Pending"}</StatusChip>}
              />
              <DetailRow
                label="Match confidence"
                value={<span className="font-mono">{verified ? "98.6%" : "—"}</span>}
              />
              <DetailRow
                label="Location"
                value={
                  <StatusChip tone="success">
                    <MapPin className="size-3" />
                    In classroom
                  </StatusChip>
                }
              />
              <DetailRow
                label="Device"
                value={
                  <StatusChip tone="success">
                    <Smartphone className="size-3" />
                    Trusted
                  </StatusChip>
                }
              />
            </div>
          </SectionCard>

          {verified ? (
            <Alert>
              <CheckCircle2 className="size-4" />
              <AlertTitle>Attendance recorded</AlertTitle>
              <AlertDescription>
                Database Systems · 05 Aug 2026, 11:34. Your teacher can review this record for the
                next 24 hours.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Timer className="size-4" />
              <AlertTitle>Attendance status: pending</AlertTitle>
              <AlertDescription>
                Complete either QR or code verification along with a face match before the window
                closes.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}
