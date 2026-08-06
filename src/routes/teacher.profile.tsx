import { createFileRoute } from "@tanstack/react-router";
import { ScanFace, Smartphone } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Initials } from "@/components/argus/user-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { teacher } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/profile")({
  head: () => ({
    meta: [
      { title: "Faculty Profile — ARGUS Faculty" },
      { name: "description", content: "Department, subjects taught, registered biometric profile and trusted devices." },
      { property: "og:title", content: "Faculty Profile — ARGUS Faculty" },
      { property: "og:description", content: "Department, subjects taught, registered biometric profile and trusted devices." },
    ],
  }),
  component: TeacherProfile,
});

function TeacherProfile() {
  return (
    <>
      <PageHeader title="Profile" description="Your institutional identity and registered verification factors." />

      <SectionCard bodyClassName="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Initials name={teacher.name} className="size-14 text-base" />
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground">{teacher.name}</p>
            <p className="text-[13px] text-muted-foreground">
              {teacher.designation} · {teacher.department}
            </p>
          </div>
          <StatusChip tone="success" className="ml-auto">Verified faculty</StatusChip>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Teacher information">
          <div className="px-1">
            <DetailRow label="Employee ID" value={teacher.employeeId} />
            <DetailRow label="Email" value={teacher.email} />
            <DetailRow label="Phone" value={teacher.phone} />
            <DetailRow label="Department" value={teacher.department} />
            <DetailRow label="Cabin" value={teacher.cabin} />
          </div>
        </SectionCard>

        <SectionCard title="Subjects assigned" description="Current academic session">
          <ul className="space-y-2">
            {teacher.subjects.map((s) => (
              <li key={s} className="rounded-md border border-border bg-surface-muted/50 px-3 py-2 text-[13px] text-foreground">
                {s}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Registered face"
        description="Biometric template used for faculty verification"
        action={
          <Button size="sm" variant="outline" onClick={() => toast.info("Re-enrollment scheduled")}>
            <ScanFace /> Re-enroll
          </Button>
        }
      >
        <div className="px-1">
          <DetailRow label="Status" value={<StatusChip tone="success">{teacher.face.status}</StatusChip>} />
          <DetailRow label="Angles enrolled" value={`${teacher.face.enrolledAngles} of ${teacher.face.totalAngles}`} />
          <DetailRow label="Last updated" value={teacher.face.lastUpdated} />
        </div>
      </SectionCard>

      <SectionCard title="Trusted devices" description="Devices allowed to open attendance sessions" bodyClassName="p-3 sm:p-4">
        <ul className="space-y-2">
          {teacher.devices.map((d) => (
            <li key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-surface p-3">
              <div className="flex min-w-0 items-center gap-3">
                <Smartphone className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{d.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{d.os} · {d.browser} · {d.last}</p>
                </div>
              </div>
              <StatusChip tone={d.trusted ? "success" : "warning"}>{d.trusted ? "Trusted" : "Review"}</StatusChip>
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}
