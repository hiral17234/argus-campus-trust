
import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { AuthLayout } from "@/components/argus/auth-layout";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { StatusChip } from "@/components/argus/status-chip";

type OtpSearch = {
  email?: string;
  role?: "student" | "teacher" | "admin";
  remember?: boolean;
  purpose?: "password-reset";
};

export const Route = createFileRoute("/auth/otp")({
  validateSearch: (search): OtpSearch => ({
    email:
      typeof search.email === "string" ? search.email : undefined,
    role:
      search.role === "student" ||
      search.role === "teacher" ||
      search.role === "admin"
        ? search.role
        : undefined,
    remember:
      typeof search.remember === "boolean"
        ? search.remember
        : undefined,
    purpose:
      search.purpose === "password-reset"
        ? "password-reset"
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "OTP verification — ARGUS" },
      {
        name: "description",
        content:
          "Enter the one-time verification code sent to your college email.",
      },
      { property: "og:title", content: "OTP verification — ARGUS" },
      {
        property: "og:description",
        content:
          "Two-step verification for ARGUS institutional accounts.",
      },
    ],
  }),
  component: OtpPage,
});

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return "your registered email";
  }

  const visiblePart = localPart.slice(0, 1);
  const maskedPart = "*".repeat(Math.min(Math.max(localPart.length - 1, 3), 8));

  return `${visiblePart}${maskedPart}@${domain}`;
}

function OtpPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(42);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const email = search.email ?? "";
  const isPasswordReset = search.purpose === "password-reset";

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = window.setTimeout(() => {
      setSeconds((previous) => previous - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [seconds]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (code.length !== 6) {
      setError("Enter the complete 6-digit verification code.");
      return;
    }

    if (!email) {
      setError("Email information is missing. Please start again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Backend integration pending.
      // The backend must validate the OTP, expiry, purpose and
      // associated authentication challenge before proceeding.

      console.log("OTP verification requested:", {
        email,
        purpose: isPasswordReset ? "password-reset" : "login",
        codeProvided: code.length === 6,
      });

      if (isPasswordReset) {
        // Replace this with the actual password-reset route
        // after that route has been implemented.
        setError("Password reset verification API is not connected yet.");
        return;
      }

      if (search.role === "teacher") {
        navigate({ to: "/teacher" });
      } else if (search.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/auth/device-registration" });
      }
    } catch {
      setError("Unable to verify the code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (seconds > 0 || !email) return;

    setResending(true);
    setError("");

    try {
      // Backend integration pending:
      // Request a new OTP for the same email and purpose.

      console.log("OTP resend requested:", {
        email,
        purpose: isPasswordReset ? "password-reset" : "login",
      });

      setCode("");
      setSeconds(42);
    } catch {
      setError("Unable to resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Two-step verification"
      title="Enter verification code"
      description={
        email
          ? `A 6-digit code was requested for ${maskEmail(email)}. The code expires in 10 minutes.`
          : "Enter the verification code sent to your registered college email."
      }
      footer={
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 font-medium text-foreground underline underline-offset-4"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <Label>Verification code</Label>

          <InputOTP
            maxLength={6}
            value={code}
            onChange={(value) => {
              setCode(value);
              setError("");
            }}
          >
            <InputOTPGroup className="w-full justify-between gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-12 w-full border border-input bg-surface text-base font-semibold"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <div className="flex items-center justify-between">
            <StatusChip tone={seconds > 0 ? "neutral" : "info"}>
              {seconds > 0
                ? `Resend in ${seconds}s`
                : "You can resend the code"}
            </StatusChip>

            <button
              type="button"
              disabled={seconds > 0 || resending}
              onClick={handleResend}
              className="text-[12px] font-medium text-foreground underline underline-offset-4 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="border border-destructive/30 bg-destructive/5 p-3 text-[12px] text-destructive"
          >
            {error}
          </p>
        )}

        <div className="flex items-start gap-2.5 border border-border bg-surface-muted/40 p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <p className="text-[12px] leading-relaxed text-muted-foreground">
            ARGUS never asks for your verification code over phone,
            chat or email. Codes are valid for one verification
            attempt and must be validated by the authentication server.
          </p>
        </div>

        <Button
          type="submit"
          size="xl"
          className="w-full"
          disabled={code.length !== 6 || loading || !email}
        >
          {loading ? "Verifying..." : "Verify and continue"}
        </Button>
      </form>
    </AuthLayout>
  );
}
