import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Search, SlidersHorizontal } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { EmptyState } from "@/components/argus/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import {
  attendanceRecords,
  resultTone,
  riskTone,
  type AttendanceRecord,
} from "@/lib/argus-data";

export const Route = createFileRoute("/student/history")({
  head: () => ({
    meta: [
      { title: "Attendance History — ARGUS" },
      {
        name: "description",
        content: "Filter, search and export your verified attendance records in ARGUS.",
      },
      { property: "og:title", content: "Attendance History — ARGUS" },
      {
        property: "og:description",
        content: "Daily, weekly, monthly and semester attendance with full verification detail.",
      },
    ],
  }),
  component: HistoryPage,
});

const periods = ["daily", "weekly", "monthly", "semester"] as const;

function HistoryPage() {
  const [period, setPeriod] = useState<string>("semester");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AttendanceRecord | null>(null);

  const rows = useMemo(() => {
    const order = periods.indexOf(period as (typeof periods)[number]);
    return attendanceRecords.filter((r) => {
      const withinPeriod = periods.indexOf(r.period) <= order;
      const matches =
        query.trim().length === 0 ||
        `${r.subject} ${r.code} ${r.teacher} ${r.date}`.toLowerCase().includes(query.toLowerCase());
      return withinPeriod && matches;
    });
  }, [period, query]);

  return (
    <>
      <PageHeader
        title="Attendance history"
        description="Every record includes the verification evidence used to accept or reject it."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Export requested", {
                description: "A signed PDF will be emailed to your college address.",
              })
            }
          >
            <Download />
            Request export
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
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by subject, code, teacher or date"
              className="pl-9"
            />
          </div>
        </div>
      </SectionCard>

      {rows.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No attendance records match your filters"
          description="Try a wider period or clear the search query to see more records."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setPeriod("semester");
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <SectionCard
            title={`${rows.length} records`}
            description="Select a record to view full verification detail"
            bodyClassName="p-0"
            className="hidden md:block"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="pl-5">Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="pr-5 text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer border-border"
                    onClick={() => setSelected(r)}
                  >
                    <TableCell className="pl-5">
                      <span className="block text-[13px] font-medium text-foreground">{r.date}</span>
                      <span className="block text-[11px] text-muted-foreground">{r.time}</span>
                    </TableCell>
                    <TableCell>
                      <span className="block text-[13px] text-foreground">{r.subject}</span>
                      <span className="block font-mono text-[11px] text-muted-foreground">
                        {r.code} · {r.teacher}
                      </span>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">{r.method}</TableCell>
                    <TableCell className="text-right font-mono text-[13px] tabular-nums text-foreground">
                      {r.confidence > 0 ? `${r.confidence}%` : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusChip tone={riskTone[r.risk]}>{r.risk}</StatusChip>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <StatusChip tone={resultTone[r.result]}>{r.result}</StatusChip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          {/* Mobile list */}
          <div className="space-y-2.5 md:hidden">
            {rows.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="w-full rounded-md border border-border bg-card p-3.5 text-left shadow-xs active:bg-accent"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-foreground">{r.subject}</p>
                    <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                      {r.date} · {r.time}
                    </p>
                  </div>
                  <StatusChip tone={resultTone[r.result]}>{r.result}</StatusChip>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <StatusChip tone="neutral" dot={false}>
                    {r.method}
                  </StatusChip>
                  <StatusChip tone={riskTone[r.risk]} dot={false}>
                    Risk {r.risk}
                  </StatusChip>
                  {r.confidence > 0 ? (
                    <StatusChip tone="neutral" dot={false}>
                      {r.confidence}%
                    </StatusChip>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Attendance detail</DialogTitle>
            <DialogDescription>
              {selected ? `${selected.subject} · ${selected.code}` : ""}
            </DialogDescription>
          </DialogHeader>
          {selected ? (
            <div className="max-h-[60vh] overflow-y-auto">
              <DetailRow label="Date" value={`${selected.date} · ${selected.day}`} />
              <DetailRow label="Subject" value={selected.subject} />
              <DetailRow label="Teacher" value={selected.teacher} />
              <DetailRow label="Time" value={selected.time} />
              <DetailRow label="Attendance method" value={selected.method} />
              <DetailRow
                label="Confidence score"
                value={
                  <span className="font-mono">
                    {selected.confidence > 0 ? `${selected.confidence}%` : "Not captured"}
                  </span>
                }
              />
              <DetailRow
                label="Location status"
                value={
                  <StatusChip tone={selected.location === "Verified" ? "success" : "warning"}>
                    {selected.location}
                  </StatusChip>
                }
              />
              <DetailRow
                label="Device status"
                value={
                  <StatusChip tone={selected.device === "Trusted" ? "success" : "warning"}>
                    {selected.device}
                  </StatusChip>
                }
              />
              <DetailRow
                label="Risk status"
                value={<StatusChip tone={riskTone[selected.risk]}>{selected.risk}</StatusChip>}
              />
              <DetailRow
                label="Verification result"
                value={<StatusChip tone={resultTone[selected.result]}>{selected.result}</StatusChip>}
              />
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setSelected(null);
                toast.info("Appeal draft created", {
                  description: "Complete the appeal form to submit it for review.",
                });
              }}
            >
              Raise appeal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
