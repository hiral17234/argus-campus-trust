import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  CheckCircle2,
  KeyRound,
  Loader2,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Timer,
  WifiOff,
  XCircle,
} from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { CameraPreview } from "@/components/argus/camera-preview";
import { QrScanner } from "@/components/argus/qr-scanner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VerificationPipeline } from "@/components/argus/verification/verification-pipeline";
import { LivenessChallengeCard } from "@/components/argus/verification/liveness-challenge";
import { FaceGuidance } from "@/components/argus/verification/face-guidance";
import { ConfidenceReport } from "@/components/argus/verification/confidence-report";
import { AiExplanationPanel } from "@/components/argus/verification/explanation-panel";
import { useVerificationFlow, type VerificationScenario } from "@/hooks/use-verification-flow";
import {
  activeSessionId,
  cameraCopy,
  mockSession,
  verificationService,
} from "@/lib/verification/mock-service";
import type { CameraState, CodeValidation, QrValidation } from "@/lib/verification/types";
import { toast } from "sonner";

type Search = { method: "qr" | "code"; scenario: VerificationScenario };

export const Route = createFileRoute("/student/verify")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    method: search.method === "code" ? "code" : "qr",
    scenario: (["success", "reject-match", "reject-gesture", "spoof"] as const).includes(
      search.scenario as VerificationScenario,
    )
      ? (search.scenario as VerificationScenario)
      : "success",
  }),
  head: () => ({
    meta: [
      { title: "Identity Verification — ARGUS" },
      {
        name: "description",
        content:
          "Complete QR or code entry, liveness challenges and face matching to record verified attendance.",
      },
      { property: "og:title", content: "Identity Verification — ARGUS" },
      {
        property: "og:description",
        content: "The ARGUS verification pipeline: presence, liveness, identity match, device and location.",
      },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { method, scenario } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState<"capture" | "camera">("capture");

  const flow = useVerificationFlow({ method, scenario, riskTier: scenario === "spoof" ? "elevated" : "standard" });

  return (
    <>
      <PageHeader
        title="Identity verification"
        description={`${mockSession.subjectCode} · ${mockSession.subject} · ${mockSession.room}`}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/student/attendance" })}>
            <ArrowLeft />
            Cancel
          </Button>
        }
      />

      {!flow.online ? (
        <Alert>
          <WifiOff className="size-4" />
          <AlertTitle>Network lost — verification paused</AlertTitle>
          <AlertDescription>
            Nothing has been submitted yet. Verification will resume from this step once the connection
            is restored.
            <Button size="sm" variant="outline" className="mt-2 w-fit" onClick={flow.goOnline}>
              Retry connection
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {step === "capture" ? (
        method === "qr" ? (
          <QrStep onDetected={() => setStep("camera")} scenario={scenario} />
        ) : (
          <CodeStep onValid={() => setStep("camera")} />
        )
      ) : (
        <CameraStep flow={flow} method={method} />
      )}

      <SectionCard
        title="Demo controls"
        description="Frontend simulation only — replaced by the verification engine later"
        bodyClassName="p-3 sm:p-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={scenario}
            onValueChange={(value) =>
              navigate({ to: "/student/verify", search: { method, scenario: value as VerificationScenario } })
            }
          >
            <SelectTrigger className="w-[210px]" aria-label="Verification outcome scenario">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="success">Successful verification</SelectItem>
              <SelectItem value="reject-gesture">Gesture not completed</SelectItem>
              <SelectItem value="reject-match">Identity match too low</SelectItem>
              <SelectItem value="spoof">Possible presentation attack</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={flow.goOffline}>
            <WifiOff />
            Simulate network loss
          </Button>
          <Button variant="outline" size="sm" onClick={() => flow.simulateCamera("denied")}>
            Camera denied
          </Button>
          <Button variant="outline" size="sm" onClick={() => flow.simulateCamera("unavailable")}>
            Camera unavailable
          </Button>
          <Button variant="outline" size="sm" onClick={() => flow.simulateCamera("disconnected")}>
            Camera disconnected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              flow.reset();
              setStep("capture");
            }}
          >
            <RotateCcw />
            Restart flow
          </Button>
        </div>
      </SectionCard>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Step 1a — QR                                                        */
/* ------------------------------------------------------------------ */

function QrStep({ onDetected, scenario }: { onDetected: () => void; scenario: VerificationScenario }) {
  const [permission, setPermission] = useState<CameraState>("permission-required");
  const [scanning, setScanning] = useState(false);
  const [validation, setValidation] = useState<QrValidation | null>(null);

  async function scan(payload: string) {
    setScanning(true);
    setValidation(null);
    const res = await verificationService.validateQr(activeSessionId, payload);
    setScanning(false);
    setValidation(res);
    if (res.outcome === "valid") {
      toast.success("QR verified", { description: "Continuing to face verification." });
      setTimeout(onDetected, 600);
    }
  }

  if (permission !== "granted") {
    return (
      <CameraStatePanel
        state={permission === "permission-required" ? "permission-required" : permission}
        onEnable={() => setPermission("granted")}
      />
    );
  }

  return (
    <SectionCard title="Scan attendance QR" bodyClassName="p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="flex justify-center">
          <QrScanner
            scanning={scanning}
            message="Position the attendance QR inside the frame."
            className="max-w-md"
          />
        </div>
        <div className="space-y-4">
          <SessionFacts />
          {validation ? (
            <Alert>
              {validation.outcome === "valid" ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <XCircle className="size-4" />
              )}
              <AlertTitle>
                {validation.outcome === "valid"
                  ? "QR code detected"
                  : validation.outcome === "expired"
                    ? "QR code expired"
                    : validation.outcome === "already-used"
                      ? "QR code already used"
                      : validation.outcome === "session-closed"
                        ? "Attendance window closed"
                        : "QR code not recognised"}
              </AlertTitle>
              <AlertDescription>{validation.message}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void scan(scenario === "spoof" ? "valid" : "valid")} disabled={scanning}>
              {scanning ? <Loader2 className="animate-spin" /> : <Camera />}
              {scanning ? "Scanning" : "Simulate scan"}
            </Button>
            <Button variant="outline" onClick={() => void scan("expired")} disabled={scanning}>
              Expired QR
            </Button>
            <Button variant="outline" onClick={() => void scan("used")} disabled={scanning}>
              Used QR
            </Button>
            <Button variant="outline" onClick={() => void scan("invalid")} disabled={scanning}>
              Invalid QR
            </Button>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Camera frames are used only to read the session QR and are never stored.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/* Step 1b — attendance code                                           */
/* ------------------------------------------------------------------ */

function CodeStep({ onValid }: { onValid: () => void }) {
  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(3);
  const [result, setResult] = useState<CodeValidation | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const res = await verificationService.validateCode(activeSessionId, code);
    setBusy(false);
    setResult(res);
    if (res.outcome === "valid") {
      toast.success("Attendance code accepted", { description: "Continuing to face verification." });
      setTimeout(onValid, 500);
    } else if (res.outcome === "invalid") {
      setAttempts((a) => Math.max(0, a - 1));
    }
  }

  const lockedOut = attempts === 0;

  return (
    <SectionCard title="Enter attendance code" bodyClassName="p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="attendance-code">6-digit attendance code</Label>
            <InputOTP id="attendance-code" maxLength={6} value={code} onChange={setCode} disabled={lockedOut}>
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
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip tone={attempts > 1 ? "neutral" : "warning"} dot={false}>
                {attempts} attempts remaining
              </StatusChip>
              <StatusChip tone="info" dot={false}>
                <Timer className="size-3" aria-hidden="true" />
                Code rotates every 30s
              </StatusChip>
            </div>
          </div>

          {result && result.outcome !== "valid" ? (
            <Alert>
              <XCircle className="size-4" />
              <AlertTitle>
                {result.outcome === "expired"
                  ? "Code expired"
                  : result.outcome === "session-closed"
                    ? "Session closed"
                    : "Incorrect code"}
              </AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          ) : null}

          {lockedOut ? (
            <Alert>
              <XCircle className="size-4" />
              <AlertTitle>Too many attempts</AlertTitle>
              <AlertDescription>
                Code entry is locked for this session. Ask your teacher to reopen verification for you.
              </AlertDescription>
            </Alert>
          ) : null}

          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={code.length !== 6 || busy || lockedOut}
            onClick={() => void submit()}
          >
            {busy ? <Loader2 className="animate-spin" /> : <KeyRound />}
            Continue to face verification
          </Button>
        </div>
        <SessionFacts />
      </div>
    </SectionCard>
  );
}

function SessionFacts() {
  return (
    <div className="rounded-md border border-border bg-surface-muted/40 px-3">
      <DetailRow label="Subject" value={`${mockSession.subjectCode} · ${mockSession.subject}`} />
      <DetailRow label="Teacher" value={mockSession.teacher} />
      <DetailRow label="Room" value={mockSession.room} />
      <DetailRow label="Window" value={mockSession.window} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Camera state panel                                                  */
/* ------------------------------------------------------------------ */

function CameraStatePanel({
  state,
  onEnable,
}: {
  state: CameraState;
  onEnable: () => void;
}) {
  const copy =
    state === "loading"
      ? cameraCopy.loading
      : state === "denied"
        ? cameraCopy.denied
        : state === "unavailable"
          ? cameraCopy.unavailable
          : state === "disconnected"
            ? cameraCopy.disconnected
            : cameraCopy["permission-required"];

  return (
    <SectionCard bodyClassName="p-6">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
        <span className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-surface-muted text-muted-foreground">
          {state === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : state === "permission-required" ? (
            <Camera className="size-4" />
          ) : (
            <CameraOff className="size-4" />
          )}
        </span>
        <h2 className="text-[15px] font-semibold text-foreground">{copy.title}</h2>
        <p className="text-[13px] text-muted-foreground">{copy.message}</p>
        {state !== "loading" ? (
          <Button className="mt-1" onClick={onEnable}>
            <Camera />
            {state === "permission-required" ? "Enable camera" : "Try again"}
          </Button>
        ) : null}
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2 — camera verification + result                               */
/* ------------------------------------------------------------------ */

function CameraStep({
  flow,
  method,
}: {
  flow: ReturnType<typeof useVerificationFlow>;
  method: "qr" | "code";
}) {
  if (flow.result) return <ResultView result={flow.result} onRetry={flow.reset} />;

  if (flow.cameraState !== "granted") {
    return <CameraStatePanel state={flow.cameraState} onEnable={flow.requestCamera} />;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <SectionCard title="Face verification" description="Keep your face inside the frame" bodyClassName="p-4 sm:p-5">
        <CameraPreview
          active
          label={flow.faceState === "detected" ? "Face detected" : "Position your face in the frame"}
          hint="Only you should be visible. Remove caps, masks and sunglasses."
          status={flow.activeStage ? flow.activeStage.label : "Verifying"}
          statusTone="info"
          className="aspect-[3/4] sm:aspect-[4/3]"
        />
        <FaceGuidance
          className="mt-4"
          faceState={flow.faceState}
          occlusion={flow.occlusion}
          spoof={flow.spoof}
        />
        <LivenessChallengeCard
          className="mt-4"
          challenge={flow.currentChallenge}
          phase={flow.challengePhase}
          index={flow.challengeIndex}
          total={flow.challenges.length}
          timeLeft={flow.challengeTimeLeft}
          onRetry={flow.retryChallenge}
        />
      </SectionCard>

      <div className="space-y-5">
        <SectionCard title="Verification progress" description="What ARGUS is checking right now">
          <VerificationPipeline stages={flow.stages} />
        </SectionCard>
        <SectionCard title="Security status">
          <div className="rounded-md border border-border bg-surface-muted/40 px-3">
            <DetailRow label="Method" value={method === "qr" ? "QR + Face" : "Code + Face"} />
            <DetailRow label="Session" value={`${mockSession.subjectCode} · ${mockSession.room}`} />
            <DetailRow
              label="Connection"
              value={<StatusChip tone={flow.online ? "success" : "danger"}>{flow.online ? "Online" : "Offline"}</StatusChip>}
            />
            <DetailRow
              label="Capture"
              value={
                <StatusChip tone="info" dot={false}>
                  <ShieldCheck className="size-3" aria-hidden="true" />
                  On-device
                </StatusChip>
              }
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function ResultView({
  result,
  onRetry,
}: {
  result: NonNullable<ReturnType<typeof useVerificationFlow>["result"]>;
  onRetry: () => void;
}) {
  const verified = result.outcome === "verified";
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <SectionCard bodyClassName="p-5 sm:p-6">
        <div className="flex flex-col items-start gap-3">
          <span
            className={
              verified
                ? "inline-flex size-11 items-center justify-center rounded-md border border-success/25 bg-success-surface text-success"
                : "inline-flex size-11 items-center justify-center rounded-md border border-danger/25 bg-danger-surface text-danger"
            }
          >
            {verified ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {verified ? "Attendance verified" : "Attendance not recorded"}
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {verified
                ? "Attendance recorded successfully."
                : result.retryAllowed
                  ? "You can try again while the attendance window is open."
                  : "Attendance window has closed. Please contact your teacher."}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-border bg-surface-muted/40 px-3">
          <DetailRow label="Subject" value={`${mockSession.subjectCode} · ${mockSession.subject}`} />
          <DetailRow label="Teacher" value={mockSession.teacher} />
          <DetailRow label="Room" value={mockSession.room} />
          <DetailRow label="Time" value={result.recordedAt} />
          <DetailRow label="Method" value={result.method === "qr" ? "QR + Face" : "Code + Face"} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/student/history">View attendance history</Link>
          </Button>
          {!verified && result.retryAllowed ? (
            <Button variant="outline" onClick={onRetry}>
              <RotateCcw />
              Try again
            </Button>
          ) : null}
          {!verified ? (
            <Button variant="outline" asChild>
              <Link to="/student/appeals">
                <MessageSquare />
                Contact teacher
              </Link>
            </Button>
          ) : null}
        </div>
      </SectionCard>

      <div className="space-y-5">
        <SectionCard title="Verification confidence">
          <ConfidenceReport
            signals={result.signals}
            overallConfidence={result.overallConfidence}
            risk={result.risk}
            riskExplanation={result.riskExplanation}
          />
        </SectionCard>
        {!verified ? <AiExplanationPanel outcome="rejected" reasons={result.reasons} /> : null}
      </div>
    </div>
  );
}
