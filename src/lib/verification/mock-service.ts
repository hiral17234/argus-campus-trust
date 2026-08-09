import type {
  AttendanceVerificationService,
  ChallengeKind,
  CodeValidation,
  Eligibility,
  EligibilityCode,
  FaceDetectionState,
  LivenessChallenge,
  OcclusionKind,
  PipelineStage,
  QrValidation,
  SessionSummary,
  SpoofKind,
  VerificationRequest,
  VerificationResult,
} from "./types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const activeSessionId = "sess-cs3110-0805";

export const mockSession: SessionSummary = {
  subject: "Database Systems",
  subjectCode: "CS3110",
  teacher: "Dr. Anita Rao",
  room: "Block A · 112",
  window: "11:30 – 12:20",
};

export const eligibilityCopy: Record<EligibilityCode, { title: string; message: string }> = {
  eligible: {
    title: "Attendance window open",
    message: "Verify your identity before the window closes to be marked present.",
  },
  "session-closed": {
    title: "Attendance session closed",
    message:
      "Your teacher has closed attendance for this class. Ask them to reopen verification, or raise an appeal.",
  },
  detained: {
    title: "Attendance unavailable",
    message:
      "Your account is currently marked as detained. Please contact the appropriate faculty member.",
  },
  "already-marked": {
    title: "Attendance already recorded",
    message: "You were verified for this session. You can review the record in your history.",
  },
  "outside-window": {
    title: "Outside permitted attendance window",
    message:
      "Verification is only accepted while the window is open. The window for this class has not started yet.",
  },
  "session-unavailable": {
    title: "Session unavailable",
    message:
      "This class has no active attendance session. Check today's schedule or contact your teacher.",
  },
};

/* ------------------------------------------------------------------ */
/* Student-facing copy maps                                            */
/* ------------------------------------------------------------------ */

export const faceDetectionCopy: Record<
  FaceDetectionState,
  { label: string; guidance: string; tone: "neutral" | "info" | "warning" | "success" | "danger" }
> = {
  searching: { label: "Searching for face", guidance: "Hold your device steady at eye level.", tone: "info" },
  detected: { label: "Face detected", guidance: "Stay still while we continue.", tone: "success" },
  "no-face": { label: "No face detected", guidance: "Bring your face into the frame.", tone: "warning" },
  "multiple-faces": {
    label: "Multiple faces detected",
    guidance: "Multiple faces detected. Please ensure that only you are visible.",
    tone: "danger",
  },
  partial: { label: "Face partially visible", guidance: "Centre your whole face inside the frame.", tone: "warning" },
  "too-far": { label: "Face too far", guidance: "Move a little closer to the camera.", tone: "warning" },
  "too-close": { label: "Face too close", guidance: "Move slightly further away.", tone: "warning" },
  "poor-lighting": { label: "Poor lighting", guidance: "Face a light source and avoid backlight.", tone: "warning" },
  "bad-angle": { label: "Face angle incorrect", guidance: "Look straight ahead at the camera.", tone: "warning" },
};

export const occlusionCopy: Record<OcclusionKind, string> = {
  sunglasses: "Please remove your sunglasses so your eyes are visible.",
  mask: "Please remove your mask for this verification.",
  helmet: "Please remove your helmet before continuing.",
  scarf: "Please move your scarf away from your face.",
  hidden: "Please make sure your face is fully visible.",
};

export const spoofCopy: Record<SpoofKind, string> = {
  "phone-screen": "Possible presentation attack detected — the capture resembles a phone screen.",
  "tablet-screen": "Possible presentation attack detected — the capture resembles a tablet screen.",
  "laptop-screen": "Possible presentation attack detected — the capture resembles a laptop screen.",
  "printed-image": "Possible presentation attack detected — the capture resembles a printed image.",
  "replay-video": "Possible replay attempt detected — the capture resembles recorded video.",
  "multiple-faces": "More than one face was visible during verification.",
  obstruction: "Part of the face appeared to be obstructed during verification.",
  reflection: "A suspicious reflection was observed during capture.",
  synthetic: "Signals consistent with a synthetic or manipulated face were observed.",
};

export const cameraCopy = {
  "permission-required": {
    title: "Camera access is required to verify your identity",
    message: "ARGUS only uses the camera during this verification. Nothing is recorded for other purposes.",
  },
  denied: {
    title: "Camera access is blocked",
    message:
      "Open your browser's site settings, allow camera access for ARGUS, then return to this screen and try again.",
  },
  unavailable: {
    title: "No camera available",
    message: "We could not find a camera on this device. Use a device with a front camera to verify attendance.",
  },
  disconnected: {
    title: "Camera disconnected",
    message: "The camera stopped unexpectedly. Reconnect it or reload this screen to continue.",
  },
  loading: { title: "Starting camera", message: "Preparing a secure capture session…" },
} as const;

/* ------------------------------------------------------------------ */
/* Pipeline definition                                                 */
/* ------------------------------------------------------------------ */

export const pipelineTemplate: PipelineStage[] = [
  { id: "face", label: "Face detected", activeMessage: "Looking for your face…", status: "pending" },
  { id: "quality", label: "Face quality", activeMessage: "Checking image quality and lighting…", status: "pending" },
  { id: "liveness", label: "Liveness", activeMessage: "Checking that you are physically present…", status: "pending" },
  { id: "gesture", label: "Gesture", activeMessage: "Waiting for your verification challenge…", status: "pending" },
  { id: "match", label: "Face match", activeMessage: "Verifying your identity…", status: "pending" },
  { id: "device", label: "Device trust", activeMessage: "Checking this device is registered to you…", status: "pending" },
  { id: "location", label: "Location", activeMessage: "Confirming you are on campus…", status: "pending" },
  { id: "risk", label: "Risk analysis", activeMessage: "Finalising the verification review…", status: "pending" },
];

/* ------------------------------------------------------------------ */
/* Challenges                                                          */
/* ------------------------------------------------------------------ */

const challengeInstructions: Record<ChallengeKind, string> = {
  "turn-left": "Turn your head to the left",
  "turn-right": "Turn your head to the right",
  "look-up": "Look up",
  "look-down": "Look down",
  "blink-twice": "Blink twice",
  smile: "Smile",
  "raise-thumb": "Raise your thumb",
  "raise-two-fingers": "Raise two fingers",
  "open-mouth": "Open your mouth",
  "close-eyes": "Close your eyes",
  "tilt-head": "Tilt your head",
};

const challengePool = Object.keys(challengeInstructions) as ChallengeKind[];

function pickChallenges(count: number): LivenessChallenge[] {
  const pool = [...challengePool];
  const picked: LivenessChallenge[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const kind = pool.splice(Math.floor(Math.random() * pool.length), 1)[0] as ChallengeKind;
    picked.push({
      id: `ch-${i}-${kind}`,

      kind,
      instruction: challengeInstructions[kind],
      timeLimit: 10,
    });
  }
  return picked;
}

/* ------------------------------------------------------------------ */
/* Mock service                                                        */
/* ------------------------------------------------------------------ */

export class MockAttendanceVerificationService implements AttendanceVerificationService {
  private eligibility: EligibilityCode = "eligible";

  /** Demo helper only — the production service derives this server-side. */
  setEligibility(code: EligibilityCode) {
    this.eligibility = code;
  }

  async getSession(): Promise<SessionSummary> {
    await delay(120);
    return mockSession;
  }

  async getEligibility(): Promise<Eligibility> {
    await delay(120);
    const copy = eligibilityCopy[this.eligibility];
    return { code: this.eligibility, ...copy, secondsRemaining: this.eligibility === "eligible" ? 252 : 0 };
  }

  async validateQr(_sessionId: string, payload: string): Promise<QrValidation> {
    await delay(700);
    if (payload === "expired") return { outcome: "expired", message: "This QR code has expired. Ask your teacher for the current code." };
    if (payload === "used") return { outcome: "already-used", message: "This QR code has already been used for your attendance." };
    if (payload === "invalid") return { outcome: "invalid", message: "This QR code does not belong to an ARGUS attendance session." };
    if (payload === "closed") return { outcome: "session-closed", message: "The attendance window closed while scanning." };
    return { outcome: "valid", message: "Session QR verified." };
  }

  async validateCode(_sessionId: string, code: string): Promise<CodeValidation> {
    await delay(600);
    if (code === "000000") return { outcome: "expired", message: "That code has expired. Enter the code currently on screen.", attemptsRemaining: 3 };
    if (code === "111111") return { outcome: "session-closed", message: "Attendance is no longer accepting codes for this session.", attemptsRemaining: 0 };
    if (code.endsWith("9")) return { outcome: "invalid", message: "Incorrect attendance code.", attemptsRemaining: 1 };
    return { outcome: "valid", message: "Attendance code accepted.", attemptsRemaining: 3 };
  }

  async requestChallenges(_sessionId: string, riskTier: "standard" | "elevated"): Promise<LivenessChallenge[]> {
    await delay(200);
    return pickChallenges(riskTier === "elevated" ? 3 : Math.random() > 0.5 ? 2 : 1);
  }

  async submitVerification(request: VerificationRequest): Promise<VerificationResult> {
    await delay(500);
    const recordedAt = "05 Aug 2026 · 11:34";
    const scenario = request.scenario ?? "success";

    if (scenario === "success") {
      return {
        outcome: "verified",
        method: request.method,
        overallConfidence: 98.6,
        risk: "LOW",
        riskExplanation:
          "Verification completed using a trusted device and expected campus location.",
        signals: [
          { id: "match", label: "Identity match", value: "98.7%", status: "pass" },
          { id: "liveness", label: "Liveness", value: "99.1%", status: "pass" },
          { id: "gesture", label: "Gesture", value: "Pass", status: "pass" },
          { id: "device", label: "Device trust", value: "Trusted", status: "pass" },
          { id: "location", label: "Location", value: "Verified", status: "pass" },
        ],
        reasons: [],
        retryAllowed: false,
        recordedAt,
      };
    }

    if (scenario === "reject-gesture") {
      return {
        outcome: "rejected",
        method: request.method,
        overallConfidence: 62.4,
        risk: "MEDIUM",
        riskExplanation:
          "The identity signals looked plausible, but the required challenge was not completed in time.",
        signals: [
          { id: "match", label: "Identity match", value: "94.2%", status: "pass" },
          { id: "liveness", label: "Liveness", value: "88.0%", status: "warn" },
          { id: "gesture", label: "Gesture", value: "Not completed", status: "fail" },
          { id: "device", label: "Device trust", value: "Trusted", status: "pass" },
          { id: "location", label: "Location", value: "Verified", status: "pass" },
        ],
        reasons: ["Required gesture was not completed within the challenge time"],
        retryAllowed: true,
        recordedAt,
      };
    }

    if (scenario === "reject-match") {
      return {
        outcome: "rejected",
        method: request.method,
        overallConfidence: 48.1,
        risk: "HIGH",
        riskExplanation:
          "The live capture did not sufficiently match the registered identity, and this device is not recognised.",
        signals: [
          { id: "match", label: "Identity match", value: "61.3%", status: "fail" },
          { id: "liveness", label: "Liveness", value: "95.4%", status: "pass" },
          { id: "gesture", label: "Gesture", value: "Pass", status: "pass" },
          { id: "device", label: "Device trust", value: "Unrecognised", status: "fail" },
          { id: "location", label: "Location", value: "Verified", status: "pass" },
        ],
        reasons: [
          "Identity match below configured threshold",
          "Device was not recognised for this account",
        ],
        retryAllowed: true,
        recordedAt,
      };
    }

    return {
      outcome: "rejected",
      method: request.method,
      overallConfidence: 21.7,
      risk: "CRITICAL",
      riskExplanation:
        "Signals consistent with a presentation attack were observed. This attempt was referred to your teacher for review.",
      signals: [
        { id: "match", label: "Identity match", value: "Not evaluated", status: "info" },
        { id: "liveness", label: "Liveness", value: "18.9%", status: "fail" },
        { id: "gesture", label: "Gesture", value: "Not completed", status: "fail" },
        { id: "device", label: "Device trust", value: "Unrecognised", status: "fail" },
        { id: "location", label: "Location", value: "Outside campus range", status: "fail" },
      ],
      reasons: [
        "Possible presentation attack detected during liveness checks",
        "Location reported outside the permitted campus range",
      ],
      retryAllowed: false,
      recordedAt,
    };
  }
}

export const verificationService: AttendanceVerificationService & {
  setEligibility: (code: EligibilityCode) => void;
} = new MockAttendanceVerificationService();
