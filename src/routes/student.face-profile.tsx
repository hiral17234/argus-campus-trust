
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  Fingerprint,
  Info,
  LockKeyhole,
  RefreshCw,
  ScanFace,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { PageHeader } from "@/components/argus/page-header";
import { SectionCard } from "@/components/argus/section-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/face-profile")({
  head: () => ({
    meta: [
      { title: "Face Profile | ARGUS" },
      {
        name: "description",
        content:
          "View your registered face verification profile and enrollment status.",
      },
    ],
  }),
  component: StudentFaceProfilePage,
});

type EnrollmentStatus = "Enrolled" | "Pending" | "Not Enrolled";

type FaceProfile = {
  status: EnrollmentStatus;
  registeredOn: string;
  lastVerified: string;
  verificationMethod: string;
  templateVersion: string;
};

const mockProfile: FaceProfile = {
  status: "Enrolled",
  registeredOn: "20 October 2026",
  lastVerified: "31 October 2026",
  verificationMethod: "Face recognition",
  templateVersion: "Demo profile",
};

function StudentFaceProfilePage() {
  const [profile, setProfile] = useState(mockProfile);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");

  const enrolled = profile.status === "Enrolled";

  function requestReEnrollment() {
    setShowConfirmation(true);
    setMessage("");
  }

  function confirmReEnrollment() {
    // Frontend prototype only.
    // Actual re-enrollment must be initiated through the backend API.
    setProfile((current) => ({
      ...current,
      status: "Pending",
      lastVerified: "Not available",
    }));

    setShowConfirmation(false);

    setMessage(
      "Your profile has been marked as pending in this demonstration. Actual re-enrollment has not started.",
    );
  }

  function cancelReEnrollment() {
    setShowConfirmation(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Student dashboard
        </Link>

        <PageHeader
          title="Face verification profile"
          description="Review your registered identity profile and face enrollment status."
          action={
            <Link to="/auth/face-registration">
              <Button size="sm" variant="outline">
                <RefreshCw className="size-4" />
                Re-enroll face
              </Button>
            </Link>
          }
        />
      </div>

      {/* Profile overview */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <SectionCard
          title="Enrollment overview"
          description="Current face registration information."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex size-16 shrink-0 items-center justify-center border border-border bg-muted/20">
              <ScanFace className="size-8 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">
                  Face identity profile
                </h2>

                <StatusChip
                  tone={enrolled ? "success" : "warning"}
                  dot={false}
                >
                  {profile.status}
                </StatusChip>
              </div>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Your face profile is used as one of the identity factors
                during attendance and institutional verification.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusChip tone="neutral" dot={false}>
                  {profile.verificationMethod}
                </StatusChip>

                <StatusChip tone="neutral" dot={false}>
                  {profile.templateVersion}
                </StatusChip>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Enrollment status */}
        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Enrollment status
            </span>

            <ShieldCheck className="size-4 text-muted-foreground" />
          </div>

          <p className="mt-3 text-xl font-semibold text-foreground">
            {profile.status}
          </p>

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {enrolled
              ? "Your demonstration profile is marked as enrolled."
              : "Your face profile requires enrollment or backend confirmation."}
          </p>
        </div>
      </div>

      {/* Profile information */}
      <SectionCard
        title="Registration information"
        description="Details associated with your face verification profile."
      >
        <div className="border border-border bg-background px-3">
          <DetailItem
            icon={UserRound}
            label="Profile type"
            value="Student identity"
          />

          <DetailItem
            icon={CalendarDaysIcon}
            label="Registered on"
            value={profile.registeredOn}
          />

          <DetailItem
            icon={Clock3}
            label="Last verified"
            value={profile.lastVerified}
          />

          <DetailItem
            icon={Fingerprint}
            label="Template reference"
            value="Not exposed"
          />

          <DetailItem
            icon={ShieldCheck}
            label="Enrollment status"
            value={profile.status}
          />
        </div>
      </SectionCard>

      {/* Verification process */}
      <SectionCard
        title="Face verification requirements"
        description="Conditions for a reliable face verification session."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Adequate lighting",
              description:
                "Ensure your face is clearly visible and evenly illuminated.",
            },
            {
              title: "Single person in frame",
              description:
                "Only your face should be visible during verification.",
            },
            {
              title: "Camera access",
              description:
                "Allow camera permission before starting verification.",
            },
            {
              title: "Live verification",
              description:
                "Follow the requested instructions during the liveness check.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 border border-border p-3"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs font-medium text-foreground">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Security information */}
      <SectionCard
        title="Privacy and security"
        description="How your face verification information should be protected."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-medium text-foreground">
                Protected biometric information
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Face templates should be securely stored and accessible
                only to authorized verification services.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-medium text-foreground">
                Restricted access
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Your biometric information should not be exposed through
                ordinary profile responses, logs or client-side storage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-medium text-foreground">
                Re-enrollment
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                If your face profile is inaccurate or verification
                repeatedly fails, request re-enrollment through the
                institutional verification process.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Re-enrollment confirmation */}
      {showConfirmation && (
        <div className="border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Request face re-enrollment?
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Your current demonstration profile will be marked as pending.
            This action does not delete an existing biometric template or
            initiate actual enrollment.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={confirmReEnrollment}>
              Confirm request
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={cancelReEnrollment}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="flex items-start gap-2 border border-border bg-muted/20 p-3"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <p className="text-xs leading-relaxed text-foreground">
            {message}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Link to="/auth/face-registration">
          <Button>
            <Camera className="size-4" />
            Start face enrollment
          </Button>
        </Link>

        <Link to="/student/verification-details">
          <Button variant="outline">
            View verification details
          </Button>
        </Link>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />

        <span className="text-xs text-muted-foreground">
          {label}
        </span>
      </div>

      <span className="text-right text-xs font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function CalendarDaysIcon() {
  return <Clock3 className="size-3.5" />;
}

