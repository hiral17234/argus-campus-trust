
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  KeyRound,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { PageHeader } from "@/components/argus/page-header";
import { SectionCard } from "@/components/argus/section-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/challenge")({
  head: () => ({
    meta: [
      { title: "Security Challenge | ARGUS" },
      {
        name: "description",
        content:
          "Complete an additional identity verification challenge to secure your ARGUS account.",
      },
    ],
  }),
  component: StudentChallengePage,
});

type ChallengeStatus = "pending" | "success" | "failed";

const DEMO_OTP = "482619";
const MAX_ATTEMPTS = 3;

function StudentChallengePage() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<ChallengeStatus>("pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleOtpChange(value: string) {
    if (!/^\d*$/.test(value)) return;

    setOtp(value.slice(0, 6));
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Enter the complete six-digit verification code.");
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setStatus("failed");
      setError("Maximum verification attempts reached.");
      return;
    }

    setLoading(true);
    setError("");

    // Frontend demonstration only.
    // Replace this comparison with the backend challenge verification API.
    const nextAttempt = attempts + 1;
    setAttempts(nextAttempt);

    if (otp === DEMO_OTP) {
      setStatus("success");
    } else if (nextAttempt >= MAX_ATTEMPTS) {
      setStatus("failed");
      setError("Maximum attempts reached. Contact your institution's support team.");
    } else {
      setError(
        `Incorrect verification code. ${MAX_ATTEMPTS - nextAttempt} attempt(s) remaining.`,
      );
    }

    setLoading(false);
    setOtp("");
  }

  function resetChallenge() {
    setOtp("");
    setAttempts(0);
    setError("");
    setStatus("pending");
  }

  const attemptsRemaining = MAX_ATTEMPTS - attempts;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student/verify"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to verification
        </Link>

        <PageHeader
          title="Security verification challenge"
          description="Complete an additional verification step to confirm your identity."
          actions={
            <StatusChip
              tone={
                status === "success"
                  ? "success"
                  : status === "failed"
                    ? "danger"
                    : "warning"
              }
              dot={false}
            >
              {status === "success"
                ? "Verified"
                : status === "failed"
                  ? "Failed"
                  : "Action required"}
            </StatusChip>
          }
        />
      </div>

      {/* Risk information */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-background">
            <ShieldAlert className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                Additional verification required
              </h2>

              <StatusChip tone="warning" dot={false}>
                Elevated risk · Demo
              </StatusChip>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              ARGUS requires an additional verification step before
              proceeding. This challenge is intended to provide an
              additional layer of identity assurance.
            </p>
          </div>
        </div>
      </div>

      {status === "success" ? (
        /* Successful challenge */
        <div className="mx-auto max-w-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="size-10 text-foreground" />

            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Challenge completed
            </h2>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              The demonstration challenge was completed successfully.
              Your response passed the local frontend validation.
            </p>

            <div className="mt-5 w-full border border-border bg-background p-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Challenge status
                </span>
                <StatusChip tone="success" dot={false}>
                  Passed
                </StatusChip>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Attempts used
                </span>
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {attempts}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Verification method
                </span>
                <span className="text-sm font-medium text-foreground">
                  Security code
                </span>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-muted-foreground">
              This is a local demonstration result, not a server-issued
              verification decision.
            </p>

            <Button
              className="mt-6 w-full"
              onClick={() => navigate({ to: "/student/verification-result" })}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : status === "failed" ? (
        /* Failed challenge */
        <div className="mx-auto max-w-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="size-10 text-destructive" />

            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Verification unsuccessful
            </h2>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              The maximum number of attempts has been reached. The
              demonstration challenge cannot be completed further.
            </p>

            <div className="mt-5 w-full border border-border bg-background p-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Attempts used
                </span>
                <span className="text-sm font-medium text-foreground">
                  {attempts}/{MAX_ATTEMPTS}
                </span>
              </div>

              <div className="mt-3">
                <StatusChip tone="danger" dot={false}>
                  Challenge failed
                </StatusChip>
              </div>
            </div>

            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetChallenge}
              >
                Retry demonstration
              </Button>

              <Button
                className="flex-1"
                onClick={() => navigate({ to: "/student" })}
              >
                Return to dashboard
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Challenge form */
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SectionCard
            title="Identity confirmation"
            description="Enter the six-digit demonstration code to complete this challenge."
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-start gap-3 border border-border bg-muted/20 p-4">
                <KeyRound className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-medium text-foreground">
                    Security code verification
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Enter the six-digit code supplied by the verification
                    system. Do not share verification codes with anyone.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="challenge-otp"
                  className="text-xs font-medium text-foreground"
                >
                  Six-digit verification code
                </label>

                <input
                  id="challenge-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    handleOtpChange(event.target.value)
                  }
                  placeholder="000000"
                  disabled={loading}
                  className="h-12 w-full border border-border bg-background px-4 text-center font-mono text-xl tracking-[0.5em] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring disabled:opacity-50"
                />

                <p className="text-[11px] text-muted-foreground">
                  {otp.length}/6 digits entered
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 border border-destructive/40 bg-destructive/5 p-3"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

                  <p className="text-xs text-foreground">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/student" })}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                >
                  <ShieldCheck className="size-4" />
                  {loading ? "Verifying..." : "Verify identity"}
                </Button>
              </div>
            </form>
          </SectionCard>

          {/* Challenge information */}
          <SectionCard
            title="Challenge information"
            description="Additional verification requirements."
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-medium text-foreground">
                    Protected verification
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Additional verification helps protect your institutional
                    identity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Smartphone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-medium text-foreground">
                    Registered device
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Real device trust checks will be performed by the
                    verification service.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-medium text-foreground">
                    Attempt limit
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {attemptsRemaining} of {MAX_ATTEMPTS} attempts remaining.
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium text-foreground">
                  Development test code
                </p>

                <p className="mt-2 font-mono text-lg font-semibold tracking-widest text-foreground">
                  {DEMO_OTP}
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Use this code only to test the frontend prototype.
                  Remove this demonstration code before production.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

