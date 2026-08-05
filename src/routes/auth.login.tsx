import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, GraduationCap, ShieldCheck, User } from "lucide-react";
import { AuthLayout } from "@/components/argus/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ARGUS Identity Platform" },
      { name: "description", content: "Sign in to ARGUS with your official college email address." },
      { property: "og:title", content: "Sign in — ARGUS Identity Platform" },
      { property: "og:description", content: "Secure role-based access to the ARGUS platform." },
    ],
  }),
  component: LoginPage,
});

const roles = [
  { id: "student", label: "Student", icon: User },
  { id: "teacher", label: "Teacher", icon: GraduationCap },
  { id: "admin", label: "Administrator", icon: ShieldCheck },
] as const;

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith(".edu") && !email.includes("@college.edu")) {
      setError("Use your official college email address (example: name@college.edu).");
      return;
    }
    setError(null);
    navigate({ to: "/auth/otp" });
  };

  return (
    <AuthLayout
      eyebrow="Secure access"
      title="Sign in to ARGUS"
      description="Authenticate with your institutional credentials. Verification is bound to your registered device."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/auth/register" className="font-medium text-foreground underline underline-offset-4">
            Register with college email
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label>Role</Label>
          <div className="grid grid-cols-3 gap-1.5 rounded-md border border-border bg-surface-muted p-1">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex h-9 items-center justify-center gap-1.5 rounded-sm px-1 text-[12px] font-medium transition-colors",
                  role === r.id
                    ? "bg-surface text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <r.icon className="size-3.5 shrink-0" />
                <span className="truncate">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Sign in failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">College email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/auth/forgot-password"
              className="text-[12px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="text-[13px] font-normal text-muted-foreground">
            Keep me signed in on this trusted device
          </Label>
        </div>

        <Button type="submit" size="xl">
          Continue
        </Button>

        <p className="text-center text-[12px] leading-relaxed text-muted-foreground">
          Continuing sends a one-time verification code to your college email.
        </p>
      </form>
    </AuthLayout>
  );
}
