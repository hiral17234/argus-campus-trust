
import { useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  GraduationCap,
  ShieldCheck,
  User,
} from "lucide-react";

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
        content:
          "Register for ARGUS using your official college email address.",
      },
      { property: "og:title", content: "Create account — ARGUS" },
      {
        property: "og:description",
        content:
          "Institutional registration for students, teachers and administrators.",
      },
    ],
  }),
  component: RegisterPage,
});

const roles = [
  {
    id: "student",
    label: "Student",
    icon: User,
    hint: "Roll number required",
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: GraduationCap,
    hint: "Faculty ID required",
  },
  {
    id: "admin",
    label: "Administrator",
    icon: ShieldCheck,
    hint: "Approval required",
  },
] as const;

type Role = (typeof roles)[number]["id"];

const departments = [
  { value: "cse", label: "Computer Science & Engineering" },
  { value: "ece", label: "Electronics & Communication" },
  { value: "mech", label: "Mechanical Engineering" },
  { value: "civil", label: "Civil Engineering" },
  { value: "mgmt", label: "School of Management" },
];

function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const normalizedEmail = email.trim().toLowerCase();

  const emailInvalid =
    email.length > 0 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  const passwordChecks = [
    {
      label: "At least 12 characters",
      valid: password.length >= 12,
    },
    {
      label: "One uppercase and one lowercase letter",
      valid: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    {
      label: "One number and one symbol",
      valid: /\d/.test(password) && /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passwordValid = passwordChecks.every((rule) => rule.valid);

  const identifierLabel =
    role === "student"
      ? "Roll number"
      : role === "teacher"
        ? "Faculty ID"
        : "Staff ID";

  const identifierPlaceholder =
    role === "student" ? "CS22B1043" : "FAC-2291";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (emailInvalid || !normalizedEmail) {
      setError("Enter a valid institutional email address.");
      return;
    }

    if (!passwordValid) {
      setError("Your password does not meet all security requirements.");
      return;
    }

    if (!department) {
      setError("Select your department.");
      return;
    }

    if (!termsAccepted) {
      setError("You must provide consent to continue.");
      return;
    }

    const registrationData = {
      role,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      identifier: identifier.trim(),
      department,
      termsAccepted,
    };

    // Frontend prototype only.
    // The password must be sent directly to the backend over HTTPS.
    // Do not store it in URL search parameters or browser logs.

    console.log("Registration details:", registrationData);

    navigate({
      to: "/auth/face-registration",
      search: {
        email: normalizedEmail,
        role,
      },
    });
  }

  return (
    <AuthLayout
      eyebrow="Institutional registration"
      title="Create your ARGUS account"
      description="Only official college email addresses are accepted. Your identity is verified against the institutional directory."
      step={{ current: 1, total: 3 }}
      footer={
        <>
          Already registered?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label>Account type</Label>

          <div className="grid gap-1.5 sm:grid-cols-3">
            {roles.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                aria-pressed={role === item.id}
                className={cn(
                  "border px-3 py-2.5 text-left transition-colors",
                  role === item.id
                    ? "border-secondary bg-surface-muted"
                    : "border-border bg-surface hover:bg-accent/60"
                )}
              >
                <item.icon className="size-4 text-muted-foreground" />

                <span className="mt-1.5 block text-[13px] font-medium text-foreground">
                  {item.label}
                </span>

                <span className="block text-[11px] text-muted-foreground">
                  {item.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input
              id="first"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First name"
              autoComplete="given-name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input
              id="last"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Last name"
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-email">Official college email</Label>

          <Input
            id="reg-email"
            type="email"
            placeholder="name@college.edu"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={emailInvalid}
            autoComplete="email"
            required
          />

          {emailInvalid ? (
            <p className="flex items-center gap-1.5 text-[12px] text-destructive">
              <AlertCircle className="size-3.5" />
              Enter a valid email address.
            </p>
          ) : (
            <p className="text-[12px] text-muted-foreground">
              Use your official institutional email address.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="identifier">{identifierLabel}</Label>

            <Input
              id="identifier"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={identifierPlaceholder}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>

            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>

              <SelectContent>
                {departments.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password">Password</Label>

          <Input
            id="reg-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
          />

          <ul className="mt-2 space-y-1">
            {passwordChecks.map((rule) => (
              <li
                key={rule.label}
                className={cn(
                  "flex items-center gap-1.5 text-[12px]",
                  rule.valid
                    ? "text-success"
                    : "text-muted-foreground"
                )}
              >
                <Check className="size-3.5 shrink-0" />
                {rule.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            className="mt-0.5"
            checked={termsAccepted}
            onCheckedChange={(value) =>
              setTermsAccepted(value === true)
            }
          />

          <Label
            htmlFor="terms"
            className="text-[12px] font-normal leading-relaxed text-muted-foreground"
          >
            I consent to biometric face enrollment and device binding
            as described in the institutional identity policy.
          </Label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Registration incomplete</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert>
          <ShieldCheck className="size-4" />
          <AlertTitle>Next: face enrollment</AlertTitle>
          <AlertDescription>
            After registration you will complete multi-angle face
            enrollment and register a trusted device.
          </AlertDescription>
        </Alert>

        <Button type="submit" size="xl" className="w-full">
          Create account and continue
        </Button>
      </form>
    </AuthLayout>
  );
}
