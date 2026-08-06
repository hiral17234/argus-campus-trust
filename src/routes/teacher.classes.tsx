import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, PlayCircle, Users } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { classStatusTone, teacherClasses, type TeacherClass } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/classes")({
  head: () => ({
    meta: [
      { title: "Today's Classes — ARGUS Faculty" },
      {
        name: "description",
        content: "Every scheduled class with year, branch, section, room and live session status.",
      },
      { property: "og:title", content: "Today's Classes — ARGUS Faculty" },
      {
        property: "og:description",
        content: "Open a class to review its roster, room and verification status.",
      },
    ],
  }),
  component: ClassesPage,
});

function ClassesPage() {
  const [selected, setSelected] = useState<TeacherClass | null>(null);

  return (
    <>
      <PageHeader
        title="Today's classes"
        description="Thursday, 06 August 2026 · School of Computing"
        actions={
          <Button size="sm" variant="outline" asChild>
            <Link to="/teacher/session">
              <PlayCircle />
              New session
            </Link>
          </Button>
        }
      />

      <SectionCard
        title={`${teacherClasses.length} scheduled classes`}
        description="Select a class to open its details"
        bodyClassName="p-0"
        className="hidden md:block"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherClasses.map((c) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                <TableCell>
                  <p className="text-[13px] font-medium text-foreground">{c.subject}</p>
                  <p className="text-xs text-muted-foreground">{c.code}</p>
                </TableCell>
                <TableCell className="text-[13px]">{c.year}</TableCell>
                <TableCell className="text-[13px]">{c.branch}</TableCell>
                <TableCell className="text-[13px]">{c.section}</TableCell>
                <TableCell className="text-[13px]">{c.room}</TableCell>
                <TableCell className="text-[13px] tabular-nums">{c.time}</TableCell>
                <TableCell className="text-right">
                  <StatusChip tone={classStatusTone[c.status]}>{c.status}</StatusChip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="space-y-2 md:hidden">
        {teacherClasses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="w-full rounded-md border border-border bg-card p-3.5 text-left shadow-xs transition-colors hover:bg-accent/40"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">{c.subject}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.code} · {c.year} {c.branch}-{c.section}
                </p>
              </div>
              <StatusChip tone={classStatusTone[c.status]}>{c.status}</StatusChip>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {c.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {c.room}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" />
                {c.strength}
              </span>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
                <DialogDescription>
                  {selected.code} · {selected.year} {selected.branch}-{selected.section}
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-md border border-border bg-surface-muted/50 px-3">
                <DetailRow label="Topic" value={selected.topic} />
                <DetailRow label="Room" value={selected.room} />
                <DetailRow label="Scheduled time" value={selected.time} />
                <DetailRow label="Class strength" value={selected.strength} />
                <DetailRow label="Marked present" value={`${selected.marked} students`} />
                <DetailRow
                  label="Status"
                  value={<StatusChip tone={classStatusTone[selected.status]}>{selected.status}</StatusChip>}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
                  Close
                </Button>
                <Button size="sm" asChild>
                  <Link to="/teacher/session">Configure session</Link>
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
