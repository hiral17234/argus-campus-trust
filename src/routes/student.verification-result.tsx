
import { useMemo } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Fingerprint,
  MapPin,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

type VerificationScenario = "success" | "failed" | "pending";
type VerificationMethod = "face" | "qr" | "code";

type VerificationSearch = {
  scenario?: VerificationScenario;
  method?: VerificationMethod;
};

export const Route = createFileRoute("/student/verification-result")({
  validateSearch: (search: Record<string, unknown>): VerificationSearch => {
    const validScenarios: VerificationScenario[] = [
      "success",
      "failed",
      "pending",
    ];

    const validMethods: VerificationMethod[] = [
      "face",
      "qr",
      "code",
    ];

    return {
      scenario: validScenarios.includes(
        search.scenario as VerificationScenario,
      )
        ? (search.scenario as VerificationScenario)
        : "success",

      method: validMethods.includes(
        search.method as VerificationMethod,
      )
        ? (search.method as VerificationMethod)
        : "face",
    };
  },

  head: () => ({
    meta: [
      { title: "Verification Result | ARGUS" },
      {
        name: "description",
        content: "View the result of your attendance verification attempt.",
      },
    ],
  }),

  component: VerificationResultPage,
});

const verificationMethods: Record<
  VerificationMethod,
  { label: string; description: string }
> = {
  face: {
    label: "Face verification",
    description: "Facial identity verification",
  },
  qr: {
    label: "QR verification",
    description: "Session QR code verification",
  },
  code: {
    label: "Attendance code",
    description: "Session-specific attendance code",
  },
};

const resultContent = {
  success: {
    title: "Verification successful",
    description:
      "The demonstration flow has completed successfully. Actual attendance confirmation requires a backend response.",
    status: "Success",
    tone: "success" as const,
  },
  failed: {
    title: "Verification unsuccessful",
    description:
      "The demonstration flow could not complete verification. Review the information and try again if the session is still active.",
    status: "Failed",
    tone: "danger" as const,
  },
  pending: {
    title: "Verification pending",
    description:
      "Your verification attempt is awaiting confirmation. Attendance should not be considered recorded until the backend confirms it.",
    status: "Pending",
    tone: "warning" as const,
  },
};

function VerificationResultPage() {
  const navigate = useNavigate();
  const { scenario, method } = Route.useSearch();

  const result = resultContent[scenario];
  const methodInfo = verificationMethods[method];

  const resultIcon = useMemo(() => {
    switch (scenario) {
      case "success":
        return CheckCircle2;
      case "failed":
        return XCircle;
      case "pending":
        return Clock3;
      default:
        return AlertTriangle;
    }
  }, [scenario]);

  const ResultIcon = resultIcon;

  const demoTimestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleRetry = () => {
    navigate({
      to: "/student/verify",
      search: {
        method,
        scenario: "success",
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to dashboard
        </Link>

        <PageHeader
          title="Verification Result"
          description="Review the outcome of your attendance verification attempt."
        />
      </div>

      {/* Result status */}
      <SectionCard>
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex size-16 items-center justify-center border border-border bg-muted/20">
            <ResultIcon
              className={`size-8 ${
                scenario === "success"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
              strokeWidth={1.5}
            />
          </div>

          <div className="mt-5">
            <StatusChip tone={result.tone}>
              {result.status}
            </StatusChip>
          </div>

          <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            {result.title}
          </h2>

          <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
            {result.description}
          </p>
        </div>

        <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <ResultDetail
            label="Verification method"
            value={methodInfo.label}
          />

          <ResultDetail
            label="Attempt timestamp"
            value={demoTimestamp}
          />

          <ResultDetail
            label="Session ID"
            value="SES-2026-1105-001"
          />

          <ResultDetail
            label="Verification reference"
            value="DEMO-ARGUS-001"
          />
        </div>
      </SectionCard>

      {/* Verification checks */}
      <SectionCard
        title="Verification checks"
        description="Illustrative verification stages. Actual check results must be supplied by the backend."
      >
        <div className="space-y-0">
          <VerificationCheck
            icon={Fingerprint}
            title="Identity verification"
            description="Identity check through the selected verification method."
            status={scenario === "success" ? "Demo passed" : "Not confirmed"}
            tone={scenario === "success" ? "success" : "neutral"}
          />

          <VerificationCheck
            icon={ShieldCheck}
            title="Risk assessment"
            description="Risk evaluation based on available verification signals."
            status="Backend pending"
            tone="warning"
          />

          <VerificationCheck
            icon={MapPin}
            title="Location validation"
            description="Attendance location and geofence validation."
            status="Not connected"
            tone="neutral"
          />
        </div>
      </SectionCard>

      {/* Outcome-specific information */}
      {scenario === "success" && (
        <div className="border border-border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-semibold text-foreground">
                Demonstration completed
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                This is a frontend demonstration result. It does not
                confirm that an attendance record has been created or
                accepted by the institution.
              </p>
            </div>
          </div>
        </div>
      )}

      {scenario === "failed" && (
        <div className="border border-border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-semibold text-foreground">
                What you can do
              </p>

              <ul className="mt-2 list-inside list-disc space-y-1 text-[11px] leading-relaxed text-muted-foreground">
                <li>Check that you selected the correct session.</li>
                <li>Confirm that the attendance window is still open.</li>
                <li>Check your device and camera permissions if required.</li>
                <li>Contact your faculty if the problem continues.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {scenario === "pending" && (
        <div className="border border-border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-semibold text-foreground">
                Confirmation awaited
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Do not assume attendance has been recorded. Check the
                verification status again after the backend returns
                its final decision.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <SectionCard
        title="Next actions"
        description="Continue to the relevant student portal section."
      >
        <div className="flex flex-wrap gap-2">
          {scenario === "failed" && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-none"
              onClick={handleRetry}
            >
              <RefreshCw className="size-4" />
              Retry verification
            </Button>
          )}

          <Button asChild size="sm" variant="outline">
            <Link to="/student/attendance">
              Attendance
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button asChild size="sm" variant="outline">
            <Link to="/student/history">
              Attendance history
            </Link>
          </Button>

          <Button asChild size="sm" variant="outline">
            <Link to="/student/help">
              Get support
            </Link>
          </Button>
        </div>
      </SectionCard>

      <p className="border border-border bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">
          Prototype notice:
        </span>{" "}
        This page currently uses demonstration scenarios. In production,
        the result, verification reference, timestamps, risk decision
        and attendance status must come from the backend verification
        response. The frontend must never independently mark attendance
        as successful.
      </p>
    </div>
  );
}

function ResultDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function VerificationCheck({
  icon: Icon,
  title,
  description,
  status,
  tone,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  status: string;
  tone: "success" | "warning" | "neutral";
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-4 last:border-b-0">
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">
            {title}
          </p>

          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <StatusChip tone={tone}>
        {status}
      </StatusChip>
    </div>
  );
}

