import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Check, GraduationCap, ShieldCheck, User } from "lucide-react";
import { AuthLayout } from "@/components/argus/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Create account — ARGUS" },
      {
        name: "description",
        content: "Register for ARGUS using your official college email address.",
      },
      { property: "og:title", content: "Create account — ARGUS" },
      {
        property: "og:description",
        content: "Institutional registration for students, teachers and administrators.",
      },
    ],
  }),
  component: RegisterPage,
});

const roles = [
  { id: "student", label: "Student", icon: User, hint: "Roll number required" },
  { id: "teacher", label: "Teacher", icon: GraduationCap, hint: "Faculty ID required" },
  { id: "admin", label: "Administrator", icon: ShieldCheck, hint: "Approval required" },
] as const;

const passwordRules = [
  "At least 12 characters",
  "One uppercase and one lowercase letter",
  "One number and one symbol",
];

function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("student");
  const [email, setEmail] = useState("");
  const emailInvalid = email.length > 0 && !/@([a-z0-9-]+\.)?college\.edu$/i.test(email);

  return (
    <AuthLayout
      eyebrow="Institutional registration"
      title="Create your ARGUS account"
      description="Only official college email addresses are accepted. Your identity is verified against the institutional directory."
      step={{ current: 1, total: 3 }}
      footer={
        <>
          Already registered?{" "}
          <Link to="/auth/login" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (emailInvalid) return;
          navigate({ to: "/auth/face-registration" });
        }}
      >
        <div className="space-y-2">
          <Label>Account type</Label>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "rounded-md border px-3 py-2.5 text-left transition-colors",
                  role === r.id
                    ? "border-secondary bg-surface-muted"
                    : "border-border bg-surface hover:bg-accent/60",
                )}
              >
                <r.icon className="size-4 text-muted-foreground" />
                <span className="mt-1.5 block text-[13px] font-medium text-foreground">
                  {r.label}
                </span>
                <span className="block text-[11px] text-muted-foreground">{r.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input id="first" placeholder="Aarav" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" placeholder="Sharma" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-email">Official college email</Label>
          <Input
            id="reg-email"
            type="email"
            placeholder="name@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={emailInvalid}
            required
          />
          {emailInvalid ? (
            <p className="flex items-center gap-1.5 text-[12px] text-danger">
              <AlertCircle className="size-3.5" />
              Registration is restricted to @college.edu addresses.
            </p>
          ) : (
            <p className="text-[12px] text-muted-foreground">
              Personal domains such as gmail.com are rejected by institutional policy.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="identifier">
              {role === "student" ? "Roll number" : role === "teacher" ? "Faculty ID" : "Staff ID"}
            </Label>
            <Input id="identifier" placeholder={role === "student" ? "CS22B1043" : "FAC-2291"} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select defaultValue="cse">
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                <SelectItem value="ece">Electronics & Communication</SelectItem>
                <SelectItem value="mech">Mechanical Engineering</SelectItem>
                <SelectItem value="civil">Civil Engineering</SelectItem>
                <SelectItem value="mgmt">School of Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password">Password</Label>
          <Input id="reg-password" type="password" placeholder="Create a strong password" required />
          <ul className="mt-2 space-y-1">
            {passwordRules.map((rule) => (
              <li key={rule} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Check className="size-3.5 shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="terms" className="mt-0.5" required />
          <Label htmlFor="terms" className="text-[12px] font-normal leading-relaxed text-muted-foreground">
            I consent to biometric face enrollment and device binding as described in the
            institutional identity policy.
          </Label>
        </div>

        <Alert>
          <ShieldCheck className="size-4" />
          <AlertTitle>Next: face enrollment</AlertTitle>
          <AlertDescription>
            After registration you will complete multi-angle face enrollment and register a trusted
            device.
          </AlertDescription>
        </Alert>

        <Button type="submit" size="xl">
          Create account and continue
        </Button>
      </form>
    </AuthLayout>
  );
}
