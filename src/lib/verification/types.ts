/**
 * ARGUS verification domain types.
 *
 * These types describe the *frontend contract* for the identity verification
 * engine. No AI, biometric or backend logic lives in the UI layer — the real
 * implementation will satisfy `AttendanceVerificationService` later.
 */

export type VerificationMethod = "qr" | "code";

/* ------------------------------------------------------------------ */
/* Eligibility                                                         */
/* ------------------------------------------------------------------ */

export type EligibilityCode =
  | "eligible"
  | "session-closed"
  | "detained"
  | "already-marked"
  | "outside-window"
  | "session-unavailable";

export type Eligibility = {
  code: EligibilityCode;
  title: string;
  message: string;
  /** Seconds left in the attendance window, when a window is open. */
  secondsRemaining: number;
};

export type SessionSummary = {
  subject: string;
  subjectCode: string;
  teacher: string;
  room: string;
  window: string;
};

/* ------------------------------------------------------------------ */
/* QR + code entry                                                     */
/* ------------------------------------------------------------------ */

export type QrOutcome = "valid" | "invalid" | "expired" | "already-used" | "session-closed";

export type QrValidation = {
  outcome: QrOutcome;
  message: string;
};

export type CodeOutcome = "valid" | "invalid" | "expired" | "too-many-attempts" | "session-closed";

export type CodeValidation = {
  outcome: CodeOutcome;
  message: string;
  attemptsRemaining: number;
};

/* ------------------------------------------------------------------ */
/* Camera + face                                                       */
/* ------------------------------------------------------------------ */

export type CameraState =
  | "idle"
  | "loading"
  | "permission-required"
  | "granted"
  | "denied"
  | "unavailable"
  | "disconnected";

export type FaceDetectionState =
  | "searching"
  | "detected"
  | "no-face"
  | "multiple-faces"
  | "partial"
  | "too-far"
  | "too-close"
  | "poor-lighting"
  | "bad-angle";

export type OcclusionKind = "sunglasses" | "mask" | "helmet" | "scarf" | "hidden";

export type SpoofKind =
  | "phone-screen"
  | "tablet-screen"
  | "laptop-screen"
  | "printed-image"
  | "replay-video"
  | "multiple-faces"
  | "obstruction"
  | "reflection"
  | "synthetic";

/* ------------------------------------------------------------------ */
/* Liveness challenges                                                 */
/* ------------------------------------------------------------------ */

export type ChallengeKind =
  | "turn-left"
  | "turn-right"
  | "look-up"
  | "look-down"
  | "blink-twice"
  | "smile"
  | "raise-thumb"
  | "raise-two-fingers"
  | "open-mouth"
  | "close-eyes"
  | "tilt-head";

export type LivenessChallenge = {
  id: string;
  kind: ChallengeKind;
  /** Student-facing instruction. Never reveal the full challenge set upfront. */
  instruction: string;
  /** Seconds allowed to complete this challenge. */
  timeLimit: number;
};

export type ChallengePhase = "prompt" | "running" | "passed" | "failed";

/* ------------------------------------------------------------------ */
/* Verification pipeline                                               */
/* ------------------------------------------------------------------ */

export type PipelineStageId =
  | "face"
  | "quality"
  | "liveness"
  | "gesture"
  | "match"
  | "device"
  | "location"
  | "risk";

export type StageStatus = "pending" | "active" | "passed" | "failed";

export type PipelineStage = {
  id: PipelineStageId;
  /** Short label used in the stepper. */
  label: string;
  /** Plain-language sentence shown while the stage runs. */
  activeMessage: string;
  status: StageStatus;
};

/* ------------------------------------------------------------------ */
/* Result                                                              */
/* ------------------------------------------------------------------ */

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SignalStatus = "pass" | "warn" | "fail" | "info";

export type VerificationSignal = {
  id: string;
  label: string;
  value: string;
  status: SignalStatus;
};

export type VerificationResult = {
  outcome: "verified" | "rejected";
  method: VerificationMethod;
  /** Indicative confidence, not a legal probability. */
  overallConfidence: number;
  risk: RiskLevel;
  riskExplanation: string;
  signals: VerificationSignal[];
  /** Reasons derived only from recorded signals — never invented in the UI. */
  reasons: string[];
  retryAllowed: boolean;
  recordedAt: string;
};

/* ------------------------------------------------------------------ */
/* Service contract                                                    */
/* ------------------------------------------------------------------ */

export type VerificationRequest = {
  sessionId: string;
  method: VerificationMethod;
  challengesPassed: number;
  challengesRequired: number;
  /** Scenario switch used only by the mock implementation. */
  scenario?: "success" | "reject-match" | "reject-gesture" | "spoof";
};

export interface AttendanceVerificationService {
  getSession(sessionId: string): Promise<SessionSummary>;
  getEligibility(sessionId: string): Promise<Eligibility>;
  validateQr(sessionId: string, payload: string): Promise<QrValidation>;
  validateCode(sessionId: string, code: string): Promise<CodeValidation>;
  /** Challenges are selected server-side; the client only renders them. */
  requestChallenges(sessionId: string, riskTier: "standard" | "elevated"): Promise<LivenessChallenge[]>;
  submitVerification(request: VerificationRequest): Promise<VerificationResult>;
}
