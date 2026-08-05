import { createFileRoute, Link } from "@tanstack/react-router";
import { IdCard, Laptop, ScanFace, ShieldCheck } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Initials } from "@/components/argus/user-card";
import { AttendanceTrendChart } from "@/components/argus/charts";
import { attendanceTrend, student } from "@/lib/argus-data";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [
      { title: "Student Profile — ARGUS" },
      {
        name: "description",
        content: "Your ARGUS student record, registered device and face enrollment status.",
      },
      { property: "og:title", content: "Student Profile — ARGUS" },
      {
        property: "og:description",
        content: "Digital student identity, device binding and biometric enrollment status.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="Your institutional identity as recorded in the ARGUS directory."
        actions={
          <Button variant="outline" size="sm">
            <IdCard />
            Digital ID
          </Button>
        }
      />

      <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <Initials name={student.name} className="size-14 rounded-lg text-lg" />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-foreground">{student.name}</h2>
              <p className="truncate text-[13px] text-muted-foreground">
                {student.rollNumber} · {student.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusChip tone="success">Identity verified</StatusChip>
                <StatusChip tone="neutral" dot={false}>
                  Student
                </StatusChip>
                <StatusChip tone="neutral" dot={false}>
                  {student.batch}
                </StatusChip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Student information">
          <DetailRow label="Full name" value={student.name} />
          <DetailRow label="Roll number" value={<span className="font-mono">{student.rollNumber}</span>} />
          <DetailRow label="Department" value={student.department} />
          <DetailRow label="Branch" value={student.branch} />
          <DetailRow label="Section" value={student.section} />
          <DetailRow label="Semester" value={student.semester} />
          <DetailRow label="College email" value={student.email} />
        </SectionCard>

        <div className="space-y-5">
          <SectionCard
            title="Registered device"
            action={<StatusChip tone="success">Trusted</StatusChip>}
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-muted text-muted-foreground">
                <Laptop className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-foreground">
                  {student.device.name}
                </p>
                <div className="mt-2">
                  <DetailRow label="Browser" value={student.device.browser} />
                  <DetailRow label="Operating system" value={student.device.os} />
                  <DetailRow label="Registered on" value={student.device.registeredOn} />
                </div>
                <Link to="/auth/device-registration" className="mt-3 inline-block">
                  <Button variant="outline" size="sm">
                    <ShieldCheck />
                    Manage devices
                  </Button>
                </Link>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Face enrollment"
            action={<StatusChip tone="success">{student.face.status}</StatusChip>}
          >
            <DetailRow
              label="Angles enrolled"
              value={`${student.face.enrolledAngles} of ${student.face.totalAngles}`}
            />
            <DetailRow label="Liveness" value="Enabled" />
            <DetailRow label="Last updated" value={student.face.lastUpdated} />
            <Link to="/auth/face-registration" className="mt-3 inline-block">
              <Button variant="outline" size="sm">
                <ScanFace />
                Re-enroll face
              </Button>
            </Link>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Attendance trend" description="Last six weeks">
        <AttendanceTrendChart data={attendanceTrend} />
      </SectionCard>
    </>
  );
}
