import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileWarning, MessageSquare, Paperclip, Plus } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { EmptyState } from "@/components/argus/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { appeals as seedAppeals, appealTone, attendanceRecords } from "@/lib/argus-data";

export const Route = createFileRoute("/student/appeals")({
  head: () => ({
    meta: [
      { title: "Attendance Appeals — ARGUS" },
      {
        name: "description",
        content: "Raise attendance appeals, attach supporting reasons and track teacher responses.",
      },
      { property: "og:title", content: "Attendance Appeals — ARGUS" },
      {
        property: "og:description",
        content: "Transparent appeal workflow with status tracking and teacher responses.",
      },
    ],
  }),
  component: AppealsPage,
});

function AppealsPage() {
  const [appeals, setAppeals] = useState(seedAppeals);
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const reason = String(form.get("reason") ?? "");
    setAppeals((prev) => [
      {
        id: `ap-${Date.now()}`,
        reference: `APL-2026-0${430 + prev.length}`,
        subject: String(form.get("session") ?? "Selected session"),
        date: "05 Aug 2026",
        reason,
        status: "Submitted",
        submittedOn: "05 Aug 2026, 11:48",
        teacher: "Pending assignment",
      },
      ...prev,
    ]);
    setOpen(false);
    toast.success("Appeal submitted", {
      description: "Your teacher has 3 working days to respond.",
    });
  };

  return (
    <>
      <PageHeader
        title="Appeals"
        description="Contest a flagged, rejected or missing attendance record with supporting evidence."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus />
                New appeal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={submit}>
                <DialogHeader>
                  <DialogTitle>Create appeal</DialogTitle>
                  <DialogDescription>
                    Appeals are reviewed by the subject teacher and audited by the department.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session">Attendance record</Label>
                    <Select name="session" defaultValue={attendanceRecords[0]!.subject}>
                      <SelectTrigger id="session">
                        <SelectValue placeholder="Select a record" />
                      </SelectTrigger>
                      <SelectContent>
                        {attendanceRecords.map((r) => (
                          <SelectItem key={r.id} value={`${r.subject} · ${r.code}`}>
                            {r.date} · {r.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Reason category</Label>
                    <Select defaultValue="technical">
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical / verification failure</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="official">Official college duty</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Supporting reason</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      rows={4}
                      required
                      placeholder="Describe what happened, including time, location and any error shown."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Supporting document</Label>
                    <div className="flex items-center gap-2 rounded-md border border-dashed border-border-strong bg-surface-muted/60 px-3 py-3">
                      <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                      <Input id="file" type="file" className="h-auto border-0 bg-transparent p-0 shadow-none" />
                    </div>
                    <p className="text-[12px] text-muted-foreground">
                      PDF, JPG or PNG up to 5 MB.
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit appeal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total appeals", value: appeals.length },
          { label: "Under review", value: appeals.filter((a) => a.status !== "Approved" && a.status !== "Rejected").length },
          { label: "Approved", value: appeals.filter((a) => a.status === "Approved").length },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{s.label}</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {appeals.length === 0 ? (
        <EmptyState
          icon={FileWarning}
          title="No appeals raised"
          description="If an attendance record looks wrong, raise an appeal with supporting evidence."
        />
      ) : (
        <div className="space-y-4">
          {appeals.map((a) => (
            <SectionCard
              key={a.id}
              title={a.subject}
              description={`${a.reference} · submitted ${a.submittedOn}`}
              action={<StatusChip tone={appealTone[a.status]}>{a.status}</StatusChip>}
            >
              <p className="text-[13px] leading-relaxed text-foreground">{a.reason}</p>

              <div className="mt-3">
                <DetailRow label="Session date" value={a.date} />
                <DetailRow label="Reviewing teacher" value={a.teacher} />
                {a.attachment ? (
                  <DetailRow
                    label="Attachment"
                    value={
                      <span className="inline-flex items-center gap-1.5 font-mono text-[12px]">
                        <Paperclip className="size-3" />
                        {a.attachment}
                      </span>
                    }
                  />
                ) : null}
              </div>

              {a.response ? (
                <div className="mt-4 rounded-md border border-border bg-surface-muted/70 p-3">
                  <p className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
                    <MessageSquare className="size-3.5" />
                    Teacher response
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {a.response}
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  <StatusChip tone="warning">Awaiting teacher response</StatusChip>
                  <span className="text-[12px] text-muted-foreground">
                    Typical response time: 2 working days
                  </span>
                </div>
              )}
            </SectionCard>
          ))}
        </div>
      )}
    </>
  );
}
