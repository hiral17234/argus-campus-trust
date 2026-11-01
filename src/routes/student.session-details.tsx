
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Info,
  KeyRound,
  MapPin,
  QrCode,
  ScanFace,
  ShieldCheck,
  Smartphone,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
  DetailRow,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/session-details")({
  head: () => ({
    meta: [
      { title: "Session Details | ARGUS" },
      {
        name: "description",
        content:
          "Review class session information, attendance requirements and verification eligibility.",
      },
    ],
  }),
  component: SessionDetailsPage,
});

type Requirement = {
  id: string;
  title: string;
  description: string;
  status: "Ready" | "Pending" | "Unavailable";
};

const session = {
  id: "SES-2026-1105-001",
  subject: "Data Structures and Algorithms",
  code: "CS301",
  faculty: "Dr. Ananya Sharma",
  department: "Computer Science and Engineering",
  date: "05 November 2026",
  day: "Thursday",
  startTime: "10:00 AM",
  endTime: "11:00 AM",
  room: "Lecture Hall 204",
  building: "Academic Block A",
  duration: "60 minutes",
  attendanceWindow: "10:00 AM – 10:15 AM",
  sessionStatus: "Upcoming",
  attendanceType: "Regular lecture",
  locationRequired: true,
};

const requirements: Requirement[] = [
  {
    id: "face",
    title: "Face enrollment",
    description: "A registered face profile is required.",
    status: "Pending",
  },
  {
    id: "device",
    title: "Trusted device",
    description: "Use a device registered with your account.",
    status: "Pending",
  },
  {
    id: "location",
    title: "Location eligibility",
    description: "Your location may be checked against the institution's permitted area.",
    status: "Pending",
  },
  {
    id: "account",
    title: "Student account",
    description: "Your institutional account must be active.",
    status: "Ready",
  },
];

const verificationMethods = [
  {
    title: "QR code verification",
    description:
      "Scan the QR code displayed by your faculty during the active attendance window.",
    icon: QrCode,
    method: "qr" as const,
  },
  {
    title: "Attendance code",
    description:
      "Enter the session code provided by your faculty.",
    icon: KeyRound,
    method: "code" as const,
  },
];

function RequirementStatus({
  status,
}: {
  status: Requirement["status"];
}) {
  if (status === "Ready") {
    return (
      <StatusChip tone="success">
        Ready
      </StatusChip>
    );
  }

  if (status === "Unavailable") {
    return (
      <StatusChip tone="danger">
        Unavailable
      </StatusChip>
    );
  }

  return (
    <StatusChip tone="warning">
      Pending
    </StatusChip>
  );
}

function SessionDetailsPage() {
  const [showRequirements, setShowRequirements] = useState(true);

  const canAttemptVerification = session.sessionStatus === "Live";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/student/attendance"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Attendance
        </Link>

        <PageHeader
          title="Session details"
          description="Review the class information and attendance verification requirements."
        />
      </div>

      {/* Session overview */}
      <div className="border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip tone="neutral" dot={false}>
                {session.sessionStatus}
              </StatusChip>

              <StatusChip tone="neutral" dot={false}>
                {session.attendanceType}
              </StatusChip>
            </div>

            <h2 className="mt-3 text-lg font-semibold text-foreground">
              {session.subject}
            </h2>

            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {session.code} · {session.id}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              {session.department}
            </p>
          </div>

          <div className="border border-border p-3 sm:min-w-[150px]">
            <p className="text-[11px] text-muted-foreground">
              Session duration
            </p>

            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
              {session.duration}
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              {session.startTime} – {session.endTime}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-[11px] text-muted-foreground">
                Date
              </p>
              <p className="mt-1 text-xs font-medium text-foreground">
                {session.date}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {session.day}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock3 className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-[11px] text-muted-foreground">
                Attendance window
              </p>
              <p className="mt-1 text-xs font-medium text-foreground">
                {session.attendanceWindow}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-[11px] text-muted-foreground">
                Classroom
              </p>
              <p className="mt-1 text-xs font-medium text-foreground">
                {session.room}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {session.building}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <UserRound className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-[11px] text-muted-foreground">
                Faculty
              </p>
              <p className="mt-1 text-xs font-medium text-foreground">
                {session.faculty}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance window */}
      <SectionCard
        title="Attendance window"
        description="Time during which attendance verification is permitted."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border border-border p-4">
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">
                Session timing
              </p>
            </div>

            <p className="mt-3 text-xl font-semibold tabular-nums text-foreground">
              {session.startTime}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Session starts
            </p>
          </div>

          <div className="border border-border p-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">
                Verification deadline
              </p>
            </div>

            <p className="mt-3 text-xl font-semibold tabular-nums text-foreground">
              10:15 AM
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Attendance window closes
            </p>
          </div>
        </div>

        <div className="mt-4 border border-border bg-muted/20 p-3">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Attendance can only be submitted within the time
              window configured by the faculty. Late attendance
              handling is subject to institutional policy.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Faculty information */}
      <SectionCard
        title="Faculty information"
        description="Details of the faculty conducting this session."
      >
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/20">
            <GraduationCap className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {session.faculty}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {session.department}
            </p>

            <div className="mt-3">
              <DetailRow
                label="Subject"
                value={session.subject}
              />

              <DetailRow
                label="Subject code"
                value={session.code}
              />

              <DetailRow
                label="Classroom"
                value={session.room}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Verification requirements */}
      <SectionCard
        title="Verification eligibility"
        description="Requirements that may be checked before attendance submission."
        action={
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setShowRequirements((value) => !value)
            }
          >
            {showRequirements ? "Collapse" : "Expand"}
          </Button>
        }
      >
        {showRequirements && (
          <div className="divide-y divide-border">
            {requirements.map((requirement) => (
              <div
                key={requirement.id}
                className="flex items-start justify-between gap-3 py-3 first:pt-1 last:pb-1"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {requirement.title}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {requirement.description}
                  </p>
                </div>

                <RequirementStatus status={requirement.status} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-border pt-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            These are demonstration statuses. Actual eligibility
            must be evaluated by the ARGUS backend before an
            attendance attempt is accepted.
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/student/face-profile">
              <ScanFace className="size-4" />
              Face profile
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link to="/student/devices">
              <Smartphone className="size-4" />
              Registered devices
            </Link>
          </Button>
        </div>
      </SectionCard>

      {/* Verification methods */}
      <SectionCard
        title="Attendance verification methods"
        description="Available methods for submitting your attendance."
      >
        <div className="space-y-3">
          {verificationMethods.map((method) => {
            const Icon = method.icon;

            return (
              <div
                key={method.method}
                className="flex flex-col gap-3 border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-muted/20">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {method.title}
                    </p>

                    <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canAttemptVerification}
                  asChild={canAttemptVerification}
                >
                  {canAttemptVerification ? (
                    <Link
                      to="/student/verify"
                      search={{
                        method: method.method,
                        scenario: "success",
                      }}
                    >
                      Select method
                    </Link>
                  ) : (
                    <span>Not available yet</span>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {!canAttemptVerification && (
          <div className="mt-4 border border-border bg-muted/20 p-3">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                This demonstration session is marked as Upcoming.
                Verification methods become available when the
                backend confirms that the attendance window is open.
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Attendance instructions */}
      <SectionCard
        title="Instructions for students"
        description="Follow these instructions before attempting verification."
      >
        <ol className="space-y-3">
          {[
            "Arrive at the assigned classroom before the attendance window opens.",
            "Use your own registered device for identity verification.",
            "Ensure your face is clearly visible and the camera is working.",
            "Enable the required location permissions if the institution requires location validation.",
            "Complete the verification process before the attendance deadline.",
            "Check your attendance history after successful submission.",
          ].map((instruction, index) => (
            <li
              key={instruction}
              className="flex items-start gap-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center border border-border font-mono text-[11px] text-muted-foreground">
                {index + 1}
              </span>

              <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
                {instruction}
              </p>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Footer actions */}
      <div className="flex flex-col gap-3 border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-foreground">
            Need help with this session?
          </p>

          <p className="mt-1 text-[11px] text-muted-foreground">
            Contact support if you encounter an attendance or verification issue.
          </p>

          <Link
            to="/student/help"
            className="mt-2 inline-block text-xs font-medium text-foreground hover:underline"
          >
            Open help centre
          </Link>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link to="/student/attendance">
            <ArrowLeft className="size-4" />
            Back to attendance
          </Link>
        </Button>
      </div>
    </div>
  );
}

