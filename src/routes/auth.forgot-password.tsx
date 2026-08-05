import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/argus/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — ARGUS" },
      { name: "description", content: "Request a password reset link for your ARGUS account." },
      { property: "og:title", content: "Reset password — ARGUS" },
      { property: "og:description", content: "Recover access to your ARGUS institutional account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

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
            <AlertTitle>Recovery code sent</AlertTitle>
            <AlertDescription>
              If an ARGUS account exists for that address, a 6-digit code is on its way. Check your
              institutional inbox and spam folder.
            </AlertDescription>
          </Alert>
          <Button size="xl" onClick={() => navigate({ to: "/auth/otp" })}>
            Enter recovery code
          </Button>
          <Button variant="ghost" size="xl" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="recovery-email">College email</Label>
            <Input
              id="recovery-email"
              type="email"
              placeholder="name@college.edu"
              autoComplete="email"
              required
            />
            <p className="text-[12px] text-muted-foreground">
              Personal email domains are not accepted for institutional recovery.
            </p>
          </div>
          <Button type="submit" size="xl">
            Send recovery code
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
