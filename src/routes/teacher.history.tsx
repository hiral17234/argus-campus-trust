import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { sessionHistory, type SessionRecord } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/history")({
  head: () => ({
    meta: [
      { title: "Attendance History — ARGUS Faculty" },
      { name: "description", content: "Filter, search and export every attendance session you have conducted." },
      { property: "og:title", content: "Attendance History — ARGUS Faculty" },
      { property: "og:description", content: "Filter, search and export every attendance session you have conducted." },
    ],
  }),
  component: TeacherHistory,
});

const periods = ["daily", "weekly", "monthly", "semester"] as const;

function TeacherHistory() {
  const [period, setPeriod] = useState<string>("semester");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SessionRecord | null>(null);

  const rows = useMemo(() => {
    const order = periods.indexOf(period as (typeof periods)[number]);
    return sessionHistory.filter(
      (s) =>
        periods.indexOf(s.period) <= order &&
        (query.trim() === "" ||
          `${s.subject} ${s.code} ${s.section} ${s.date}`.toLowerCase().includes(query.toLowerCase())),
    );
  }, [period, query]);

  return (
    <>
      <PageHeader
        title="Attendance history"
        description="Every session you conducted, with the verification outcome for each."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.success("Export queued", { description: "A signed report will be emailed to you." })}>
            <Download /> Export
          </Button>
        }
      />

      <SectionCard bodyClassName="p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              {periods.map((p) => (
                <TabsTrigger key={p} value={p} className="capitalize">
                  {p}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by subject, code, section or date" className="pl-9" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title={`${rows.length} sessions`} bodyClassName="p-0" className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Present</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelected(s)}>
                <TableCell className="text-[13px] tabular-nums">{s.date}</TableCell>
                <TableCell>
                  <p className="text-[13px] font-medium text-foreground">{s.subject}</p>
                  <p className="text-xs text-muted-foreground">{s.code}</p>
                </TableCell>
                <TableCell className="text-[13px]">{s.section}</TableCell>
                <TableCell className="text-[13px]">{s.mode}</TableCell>
                <TableCell className="text-[13px] tabular-nums">{s.present}/{s.strength}</TableCell>
                <TableCell className="text-right">
                  <StatusChip tone={s.spoof > 0 ? "danger" : "success"}>{s.spoof > 0 ? `${s.spoof} spoof` : "Clean"}</StatusChip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="space-y-2 md:hidden">
        {rows.map((s) => (
          <button key={s.id} onClick={() => setSelected(s)} className="w-full rounded-md border border-border bg-card p-3.5 text-left shadow-xs">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">{s.subject}</p>
                <p className="truncate text-xs text-muted-foreground">{s.date} · {s.section} · {s.mode}</p>
              </div>
              <span className="text-[13px] font-semibold tabular-nums text-foreground">{s.present}/{s.strength}</span>
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
                <DialogDescription>{selected.code} · {selected.date}</DialogDescription>
              </DialogHeader>
              <div className="rounded-md border border-border bg-surface-muted/50 px-3">
                <DetailRow label="Section" value={selected.section} />
                <DetailRow label="Time" value={selected.time} />
                <DetailRow label="Mode" value={selected.mode} />
                <DetailRow label="Present" value={`${selected.present} of ${selected.strength}`} />
                <DetailRow label="Rejected attempts" value={selected.rejected} />
                <DetailRow label="Spoof attempts" value={selected.spoof} />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
