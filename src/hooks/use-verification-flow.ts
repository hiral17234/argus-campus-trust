import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  pipelineTemplate,
  verificationService,
  activeSessionId,
} from "@/lib/verification/mock-service";
import type {
  CameraState,
  ChallengePhase,
  FaceDetectionState,
  LivenessChallenge,
  OcclusionKind,
  PipelineStage,
  PipelineStageId,
  SpoofKind,
  VerificationMethod,
  VerificationResult,
} from "@/lib/verification/types";

export type VerificationScenario = "success" | "reject-match" | "reject-gesture" | "spoof";

type Options = {
  method: VerificationMethod;
  scenario: VerificationScenario;
  riskTier?: "standard" | "elevated";
};

/**
 * Drives the on-screen verification experience.
 *
 * Everything here is a *simulation of the UI states* produced by the future
 * verification engine. Swap `verificationService` for the real implementation
 * and the component tree keeps working unchanged.
 */
export function useVerificationFlow({ method, scenario, riskTier = "standard" }: Options) {
  const [cameraState, setCameraState] = useState<CameraState>("permission-required");
  const [faceState, setFaceState] = useState<FaceDetectionState>("searching");
  const [occlusion, setOcclusion] = useState<OcclusionKind | null>(null);
  const [spoof, setSpoof] = useState<SpoofKind | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>(pipelineTemplate);
  const [challenges, setChallenges] = useState<LivenessChallenge[]>([]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengePhase, setChallengePhase] = useState<ChallengePhase>("prompt");
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(0);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [online, setOnline] = useState(true);
  const [paused, setPaused] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const setStage = useCallback((id: PipelineStageId, status: PipelineStage["status"]) => {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }, []);

  const activeStage = useMemo(() => stages.find((s) => s.status === "active") ?? null, [stages]);

  /* ---------------- camera ---------------- */

  const requestCamera = useCallback(() => {
    setCameraState("loading");
    later(() => setCameraState("granted"), 900);
  }, [later]);

  const simulateCamera = useCallback(
    (state: CameraState) => {
      clearTimers();
      setCameraState(state);
    },
    [clearTimers],
  );

  /* ---------------- pre-gesture stages ---------------- */

  useEffect(() => {
    if (cameraState !== "granted" || result || paused) return;
    setStage("face", "active");
    setFaceState("searching");

    later(() => setFaceState("too-far"), 700);
    later(() => setFaceState("poor-lighting"), 1500);
    later(() => {
      setFaceState("detected");
      setStage("face", "passed");
      setStage("quality", "active");
    }, 2400);
    later(() => {
      setStage("quality", "passed");
      setStage("liveness", "active");
    }, 3400);
    later(async () => {
      setStage("liveness", "passed");
      setStage("gesture", "active");
      const list = await verificationService.requestChallenges(activeSessionId, riskTier);
      setChallenges(list);
      setChallengeIndex(0);
      setChallengePhase("prompt");
      setChallengeTimeLeft(list[0]?.timeLimit ?? 10);
    }, 4600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraState, paused]);

  /* ---------------- challenge loop ---------------- */

  const currentChallenge = challenges[challengeIndex] ?? null;

  useEffect(() => {
    if (!currentChallenge || challengePhase !== "prompt" || paused) return;
    const t = setTimeout(() => setChallengePhase("running"), 900);
    return () => clearTimeout(t);
  }, [currentChallenge, challengePhase, paused]);

  useEffect(() => {
    if (challengePhase !== "running" || paused) return;
    if (challengeTimeLeft <= 0) {
      setChallengePhase("failed");
      return;
    }
    const t = setTimeout(() => setChallengeTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [challengePhase, challengeTimeLeft, paused]);

  // Simulated gesture detection.
  useEffect(() => {
    if (challengePhase !== "running" || paused || !currentChallenge) return;
    const willFail = scenario === "reject-gesture" && challengeIndex === 0;
    if (willFail) return;
    const t = setTimeout(() => setChallengePhase("passed"), 2600);
    return () => clearTimeout(t);
  }, [challengePhase, challengeIndex, currentChallenge, paused, scenario]);

  const finish = useCallback(
    async (challengesPassed: number, gesturePassed: boolean) => {
      setStage("gesture", gesturePassed ? "passed" : "failed");
      setStage("match", "active");
      later(() => {
        setStage("match", scenario === "success" || scenario === "reject-gesture" ? "passed" : "failed");
        setStage("device", "active");
      }, 1200);
      later(() => {
        setStage("device", scenario === "success" || scenario === "reject-gesture" ? "passed" : "failed");
        setStage("location", "active");
      }, 2100);
      later(() => {
        setStage("location", scenario === "spoof" ? "failed" : "passed");
        setStage("risk", "active");
        if (scenario === "spoof") setSpoof("phone-screen");
      }, 2900);
      later(async () => {
        const res = await verificationService.submitVerification({
          sessionId: activeSessionId,
          method,
          challengesPassed,
          challengesRequired: challenges.length,
          scenario,
        });
        setStage("risk", res.outcome === "verified" ? "passed" : "failed");
        setResult(res);
      }, 3700);
    },
    [challenges.length, later, method, scenario, setStage],
  );

  useEffect(() => {
    if (challengePhase !== "passed" || !currentChallenge) return;
    const t = setTimeout(() => {
      if (challengeIndex + 1 < challenges.length) {
        setChallengeIndex((i) => i + 1);
        setChallengePhase("prompt");
        setChallengeTimeLeft(challenges[challengeIndex + 1]?.timeLimit ?? 10);
      } else {
        void finish(challenges.length, true);
      }
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengePhase]);

  useEffect(() => {
    if (challengePhase !== "failed") return;
    const t = setTimeout(() => void finish(challengeIndex, false), 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengePhase]);

  /* ---------------- network + controls ---------------- */

  const goOffline = useCallback(() => {
    setOnline(false);
    setPaused(true);
  }, []);

  const goOnline = useCallback(() => {
    setOnline(true);
    setPaused(false);
  }, []);

  const retryChallenge = useCallback(() => {
    if (!currentChallenge) return;
    setChallengeTimeLeft(currentChallenge.timeLimit);
    setChallengePhase("prompt");
  }, [currentChallenge]);

  const reset = useCallback(() => {
    clearTimers();
    setCameraState("permission-required");
    setFaceState("searching");
    setStages(pipelineTemplate);
    setChallenges([]);
    setChallengeIndex(0);
    setChallengePhase("prompt");
    setResult(null);
    setSpoof(null);
    setOcclusion(null);
  }, [clearTimers]);

  return {
    cameraState,
    requestCamera,
    simulateCamera,
    faceState,
    setFaceState,
    occlusion,
    setOcclusion,
    spoof,
    stages,
    activeStage,
    challenges,
    challengeIndex,
    currentChallenge,
    challengePhase,
    challengeTimeLeft,
    retryChallenge,
    result,
    online,
    paused,
    goOffline,
    goOnline,
    reset,
  };
}
