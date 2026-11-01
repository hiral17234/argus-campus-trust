
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  Fingerprint,
  Laptop,
  MapPin,
  MonitorSmartphone,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/verification-details")({
  head: () => ({
    meta: [
      { title: "Verification Details | ARGUS" },
      {
        name: "description",
        content: "Review your identity, device and location verification status.",
      },
    ],
  }),
  component: VerificationDetailsPage,
});

type VerificationStatus = "Verified" | "Pending" | "Not configured";

const verificationItems: {
  title: string;
  description: string;
  status: VerificationStatus;
  icon: typeof Shield;
  details: { label: string; value: string }[];
}[] = [
  {
    title: "Face verification",
    description: "Biometric enrollment and face verification status.",
    status: "Pending",
    icon: Camera,
    details: [
      { label: "Enrollment", value: "Backend confirmation pending" },
      { label: "Liveness detection", value: "Not connected" },
      { label: "Last verification", value: "Not available" },
      { label: "Template status", value: "Not confirmed" },
    ],
  },
  {
    title: "Device verification",
    description: "Registered device and device trust information.",
    status: "Pending",
    icon: Laptop,
    details: [
      { label: "Device registration", value: "Backend confirmation pending" },
      { label: "Device trust", value: "Not confirmed" },
      { label: "Last device check", value: "Not available" },
      { label: "Device fingerprint", value: "Not available" },
    ],
  },
  {
    title: "Location verification",
    description: "Location permission and attendance-location checks.",
    status: "Not configured",
    icon: MapPin,
    details: [
      { label: "Location permission", value: "Not checked" },
      { label: "Location accuracy", value: "Not available" },
      { label: "Geofence validation", value: "Not connected" },
      { label: "Last location check", value: "Not available" },
    ],
  },
];

function getStatusTone(status: VerificationStatus) {
  if (status === "Verified") return "success" as const;
  if (status === "Pending") return "warning" as const;
  return "neutral" as const;
}

function VerificationDetailsPage() {
  const verifiedCount = verificationItems.filter(
    (item) => item.status === "Verified",
  ).length;

  const pendingCount = verificationItems.filter(
    (item) => item.status === "Pending",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to dashboard
        </Link>

        <PageHeader
          title="Verification Details"
          description="Review the verification components associated with your ARGUS account."
        />
      </div>

      {/* Overall status */}
      <SectionCard
        title="Verification overview"
        description="Current status of your verification components."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center border border-border bg-muted/30">
              <Shield className="size-5 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Verification setup
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Backend verification is not connected yet.
              </p>
            </div>
          </div>

          <StatusChip tone="warning">
            Setup incomplete
          </StatusChip>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <SummaryMetric
            label="Verified"
            value={String(verifiedCount)}
          />

          <SummaryMetric
            label="Pending"
            value={String(pendingCount)}
          />

          <SummaryMetric
            label="Total components"
            value={String(verificationItems.length)}
          />
        </div>
      </SectionCard>

      {/* Verification components */}
      <div className="space-y-4">
        {verificationItems.map((item) => {
          const Icon = item.icon;

          return (
            <SectionCard
              key={item.title}
              title={item.title}
              description={item.description}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/30">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Verification component
                    </p>
                  </div>
                </div>

                <StatusChip tone={getStatusTone(item.status)}>
                  {item.status}
                </StatusChip>
              </div>

              <div className="mt-4 space-y-1 border-t border-border pt-3">
                {item.details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex flex-wrap items-start justify-between gap-2 py-2"
                  >
                    <span className="text-[11px] text-muted-foreground">
                      {detail.label}
                    </span>

                    <span className="max-w-[60%] break-words text-right text-[11px] font-medium text-foreground">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>

              {item.title === "Face verification" && (
                <div className="mt-3 border-t border-border pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-none"
                  >
                    <Link to="/student/face-profile">
                      <Fingerprint className="size-4" />
                      Manage face profile
                    </Link>
                  </Button>
                </div>
              )}

              {item.title === "Device verification" && (
                <div className="mt-3 border-t border-border pt-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-none"
                  >
                    <Link to="/student/devices">
                      <MonitorSmartphone className="size-4" />
                      Manage devices
                    </Link>
                  </Button>
                </div>
              )}
            </SectionCard>
          );
        })}
      </div>

      {/* Security information */}
      <SectionCard
        title="Security information"
        description="Important information about the verification workflow."
      >
        <div className="space-y-4">
          <SecurityNote
            icon={ShieldCheck}
            title="Risk-adaptive verification"
            description="ARGUS is designed to use verification checks based on the risk associated with an attendance attempt. Actual risk evaluation requires backend integration."
          />

          <SecurityNote
            icon={Clock3}
            title="Verification timestamps"
            description="Verification timestamps will appear here after the backend starts recording successful and unsuccessful verification attempts."
          />

          <SecurityNote
            icon={ShieldAlert}
            title="Unverified components"
            description="A pending or unconfigured status does not confirm that a security check has passed. Complete the required setup and wait for backend confirmation."
          />
        </div>
      </SectionCard>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/student/face-profile">
            <Camera className="size-4" />
            Face profile
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/student/devices">
            <Laptop className="size-4" />
            Registered devices
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/student/help">
            Get help
          </Link>
        </Button>
      </div>

      <p className="border border-border bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">
          Prototype status:
        </span>{" "}
        Verification statuses and detail values are placeholders. ARGUS
        must retrieve actual enrollment, liveness, device and location
        results from authenticated backend APIs before displaying them
        as verified.
      </p>
    </div>
  );
}

function SummaryMetric({
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

      <p className="mt-1 font-mono text-xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function SecurityNote({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Shield;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

      <div>
        <p className="text-xs font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
