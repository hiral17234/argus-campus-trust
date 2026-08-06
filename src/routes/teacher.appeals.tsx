import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageSquare, X } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { teacherAppeals, teacherAppealTone, type TeacherAppeal } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/appeals")({
  head: () => ({
    meta: [
      { title: "Appeals — ARGUS Faculty" },
      { name: "description", content: "Approve, reject and comment on student attendance appeals with full history." },
      { property: "og:title", content: "Appeals — ARGUS Faculty" },
      { property: "og:description", content: "Approve, reject and comment on student attendance appeals with full history." },
    ],
  }),
  component: TeacherAppealsPage,
});

const tabs = ["Pending", "Approved", "Rejected"] as const;

function TeacherAppealsPage() {
  const [tab, setTab] = useState<string>("Pending");
  const [selected, setSelected] = useState<TeacherAppeal | null>(null);
  const [comment, setComment] = useState("");

  const rows = teacherAppeals.filter((a) => a.status === tab);

  const decide = (verdict: "approved" | "rejected") => {
    toast.success(`Appeal ${verdict}`, { description: selected?.reference });
    setSelected(null);
    setComment("");
  };

  return (
    <>
      <PageHeader title="Appeals" description="Student requests to correct an attendance record." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {rows.map((a) => (
          <SectionCard key={a.id} bodyClassName="p-3.5 sm:p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">
                  {a.student} · {a.roll}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.reference} · {a.subject} · {a.date}
                </p>
                <p className="mt-2 text-[13px] text-muted-foreground">{a.reason}</p>
              </div>
              <StatusChip tone={teacherAppealTone[a.status]}>{a.status}</StatusChip>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelected(a)}>
                <MessageSquare /> Review
              </Button>
              {a.status === "Pending" ? (
                <>
                  <Button size="sm" onClick={() => toast.success("Appeal approved", { description: a.reference })}>
                    <Check /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Appeal rejected", { description: a.reference })}>
                    <X /> Reject
                  </Button>
                </>
              ) : null}
            </div>
          </SectionCard>
        ))}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.reference}</DialogTitle>
                <DialogDescription>
                  {selected.student} · {selected.subject}
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-md border border-border bg-surface-muted/50 px-3">
                <DetailRow label="Session date" value={selected.date} />
                <DetailRow label="Submitted on" value={selected.submittedOn} />
                <DetailRow label="Evidence" value={selected.evidence ?? "None attached"} />
                <DetailRow label="Status" value={<StatusChip tone={teacherAppealTone[selected.status]}>{selected.status}</StatusChip>} />
                {selected.comment ? <DetailRow label="Your comment" value={selected.comment} /> : null}
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment for the student and the audit trail"
                rows={3}
              />
              <DialogFooter>
                <Button size="sm" variant="outline" onClick={() => decide("rejected")}>
                  Reject
                </Button>
                <Button size="sm" onClick={() => decide("approved")}>
                  Approve
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
