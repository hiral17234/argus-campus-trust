
import { useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  Fingerprint,
  Info,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

type VerificationMethod = "face" | "qr" | "code";

type VerifySearch = {
  method?: VerificationMethod;
  scenario?: "success" | "failed" | "pending";
};

export const Route = createFileRoute("/student/verify")({
  validateSearch: (search: Record<string, unknown>): VerifySearch => {
    const methods: VerificationMethod[] = ["face", "qr", "code"];
    const scenarios = ["success", "failed", "pending"] as const;

    return {
      method: methods.includes(search.method as VerificationMethod)
        ? (search.method as VerificationMethod)
        : undefined,

      scenario: scenarios.includes(
        search.scenario as (typeof scenarios)[number],
      )
        ? (search.scenario as (typeof scenarios)[number])
        : undefined,
    };
  },

  head: () => ({
    meta: [
      { title: "Attendance Verification | ARGUS" },
      {
        name: "description",
        content: "Complete your attendance verification using ARGUS.",
      },
    ],
  }),

  component: StudentVerifyPage,
});

const methods: {
  id: VerificationMethod;
  title: string;
  description: string;
  icon: typeof Camera;
  availability: string;
}[] = [
  {
    id: "face",
    title: "Face verification",
    description:
      "Use your enrolled face profile to verify your identity.",
    icon: Fingerprint,
    availability: "Backend integration pending",
  },
  {
    id: "qr",
    title: "QR code verification",
    description:
      "Scan the QR code displayed by your faculty for the active session.",
    icon: QrCode,
    availability: "QR scanner integration pending",
  },
  {
    id: "code",
    title: "Attendance code",
    description:
      "Enter the session-specific code provided by your faculty.",
    icon: Smartphone,
    availability: "Demo challenge available",
  },
];

function StudentVerifyPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [selectedMethod, setSelectedMethod] =
    useState<VerificationMethod>(search.method ?? "face");

  const selectedMethodInfo = methods.find(
    (method) => method.id === selectedMethod,
  )!;

  const SelectedIcon = selectedMethodInfo.icon;

  const handleContinue = () => {
    if (selectedMethod === "code") {
      navigate({
        to: "/student/challenge",
      });
      return;
    }

    navigate({
      to: "/student/verification-result",
      search: {
        method: selectedMethod,
        scenario: "pending",
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to dashboard
        </Link>

        <PageHeader
          title="Attendance Verification"
          description="Select a verification method to continue with your attendance attempt."
        />
      </div>

      {/* Session information */}
      <SectionCard
        title="Current session"
        description="Session information for this demonstration."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Data Structures and Algorithms
            </p>

            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              CS301 · SES-2026-1105-001
            </p>
          </div>

          <StatusChip tone="warning">
            Session status not confirmed
          </StatusChip>
        </div>

        <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <SessionDetail
            icon={Clock3}
            label="Scheduled time"
            value="10:00 AM – 11:00 AM"
          />

          <SessionDetail
            icon={Info}
            label="Attendance window"
            value="10:00 AM – 10:15 AM"
          />

          <SessionDetail
            icon={ShieldCheck}
            label="Verification"
            value="Risk-adaptive"
          />
        </div>
      </SectionCard>

      {/* Method selection */}
      <SectionCard
        title="Choose verification method"
        description="Select one of the available attendance verification methods."
      >
        <div className="space-y-3">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                aria-pressed={isSelected}
                className={`flex w-full items-start gap-3 border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-foreground bg-muted/40"
                    : "border-border hover:bg-muted/20"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-background">
                  <Icon className="size-5 text-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">
                      {method.title}
                    </p>

                    {isSelected && (
                      <StatusChip tone="info">
                        Selected
                      </StatusChip>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {method.description}
                  </p>

                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {method.availability}
                  </p>
                </div>

                <div
                  className={`mt-1 flex size-4 shrink-0 items-center justify-center border ${
                    isSelected
                      ? "border-foreground"
                      : "border-muted-foreground"
                  }`}
                >
                  {isSelected && (
                    <div className="size-2 bg-foreground" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Selected method details */}
      <SectionCard
        title="Before you continue"
        description={`Requirements for ${selectedMethodInfo.title.toLowerCase()}.`}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-muted/30">
            <SelectedIcon className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground">
              {selectedMethodInfo.title}
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              {selectedMethodInfo.description}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-border pt-4">
          {selectedMethod === "face" && (
            <>
              <Requirement text="Your face profile should be enrolled." />
              <Requirement text="Camera permission may be required." />
              <Requirement text="Liveness and identity checks require backend integration." />
            </>
          )}

          {selectedMethod === "qr" && (
            <>
              <Requirement text="The faculty must generate an active session QR code." />
              <Requirement text="Camera permission is required to scan the QR code." />
              <Requirement text="QR validation must be performed by the backend." />
            </>
          )}

          {selectedMethod === "code" && (
            <>
              <Requirement text="Obtain the attendance code from your faculty." />
              <Requirement text="Enter the code before the attendance window expires." />
              <Requirement text="The backend must validate the code and session." />
            </>
          )}
        </div>
      </SectionCard>

      {/* Integration notice */}
      <div className="border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-xs font-semibold text-foreground">
              Verification service status
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              The frontend currently provides the method-selection
              interface. Face recognition, QR validation, session
              validation, device checks, location checks and risk
              assessment must be connected to the ARGUS backend.
            </p>
          </div>
        </div>
      </div>

      {/* Continue */}
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-muted-foreground">
          Selected method:{" "}
          <span className="font-medium text-foreground">
            {selectedMethodInfo.title}
          </span>
        </p>

        <Button
          onClick={handleContinue}
          className="rounded-none"
        >
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/student/verification-details">
            Verification details
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/student/help">
            Need help?
          </Link>
        </Button>
      </div>
    </div>
  );
}

function SessionDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

      <div>
        <p className="text-[10px] text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 text-xs font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function Requirement({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
