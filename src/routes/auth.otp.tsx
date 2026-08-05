import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/argus/auth-layout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { StatusChip } from "@/components/argus/status-chip";

export const Route = createFileRoute("/auth/otp")({
  head: () => ({
    meta: [
      { title: "OTP verification — ARGUS" },
      { name: "description", content: "Enter the one-time verification code sent to your college email." },
      { property: "og:title", content: "OTP verification — ARGUS" },
      { property: "og:description", content: "Two-step verification for ARGUS institutional accounts." },
    ],
  }),
  component: OtpPage,
});

function OtpPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(42);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  return (
    <AuthLayout
      eyebrow="Two-step verification"
      title="Enter verification code"
      description="A 6-digit code was sent to a•••••@college.edu. The code expires in 10 minutes."
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
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/auth/device-registration" });
        }}
      >
        <div className="space-y-3">
          <Label>Verification code</Label>
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
          <div className="flex items-center justify-between">
            <StatusChip tone={seconds > 0 ? "neutral" : "info"}>
              {seconds > 0 ? `Resend in ${seconds}s` : "You can resend the code"}
            </StatusChip>
            <button
              type="button"
              disabled={seconds > 0}
              onClick={() => setSeconds(42)}
              className="text-[12px] font-medium text-foreground underline underline-offset-4 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              Resend code
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface-muted/70 p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            ARGUS never asks for your verification code over phone, chat or email. Codes are valid
            for one sign-in attempt on one device.
          </p>
        </div>

        <Button type="submit" size="xl" disabled={code.length !== 6}>
          Verify and continue
        </Button>
      </form>
    </AuthLayout>
  );
}
