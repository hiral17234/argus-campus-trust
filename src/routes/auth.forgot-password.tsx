
import { useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft, MailCheck } from "lucide-react";

import { AuthLayout } from "@/components/argus/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — ARGUS" },
      {
        name: "description",
        content:
          "Request a password reset link for your ARGUS account.",
      },
      { property: "og:title", content: "Reset password — ARGUS" },
      {
        property: "og:description",
        content:
          "Recover access to your ARGUS institutional account.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter your institutional email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Frontend prototype:
      // Connect this section to the backend password recovery API.
      // Expected backend responsibility:
      // 1. Validate institutional email.
      // 2. Generate a secure, time-limited recovery OTP.
      // 3. Send the OTP to the registered email.
      // 4. Avoid revealing whether an account exists.

      console.log("Password recovery requested:", normalizedEmail);

      setEmail(normalizedEmail);
      setSent(true);
    } catch {
      setError(
        "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the college email registered with ARGUS. We'll send a recovery code valid for 10 minutes."
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
      {sent ? (
        <div className="space-y-5">
          <Alert>
            <MailCheck className="size-4" />
            <AlertTitle>Recovery request submitted</AlertTitle>
            <AlertDescription>
              If an ARGUS account exists for {email}, a recovery
              code will be sent to its registered email address.
              Check your institutional inbox and spam folder.
            </AlertDescription>
          </Alert>

          <Button
            size="xl"
            className="w-full"
            onClick={() =>
              navigate({
                to: "/verify-otp",
                search: { email, purpose: "password-reset" },
              })
            }
          >
            Enter recovery code
          </Button>

          <Button
            variant="ghost"
            size="xl"
            className="w-full"
            onClick={() => {
              setSent(false);
              setError("");
            }}
          >
            Use a different email
          </Button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="recovery-email">
              College email
            </Label>

            <Input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="name@college.edu"
              autoComplete="email"
              required
            />

            <p className="text-[12px] text-muted-foreground">
              Personal email domains are not accepted for
              institutional recovery.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="border border-destructive/30 bg-destructive/5 p-3 text-[12px] text-destructive"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Send recovery code"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
