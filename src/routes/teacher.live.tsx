import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PlayCircle, Search, ShieldAlert, SlidersHorizontal, SquarePen } from "lucide-react";
import { PageHeader, SectionCard, DetailRow } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { EmptyState } from "@/components/argus/empty-state";
import { CameraPreview } from "@/components/argus/camera-preview";
import { AiExplanationPanel } from "@/components/argus/verification/explanation-panel";
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
  liveEntries,
  liveStatusTone,
  riskToneMap,
  type LiveEntry,
} from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/live")({
  head: () => ({
    meta: [
      { title: "Live Attendance Monitoring — ARGUS Faculty" },
      {
        name: "description",
        content:
          "Watch verification results arrive in real time with confidence scores, device trust, location and risk level.",
      },
      { property: "og:title", content: "Live Attendance Monitoring — ARGUS Faculty" },
      {
        property: "og:description",
        content: "Replay any verification attempt and review the reason a student was rejected.",
      },
    ],
  }),
  component: LivePage,
});

const filters = ["all", "verified", "pending", "rejected"] as const;

function LivePage() {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LiveEntry | null>(null);
  const [reopenTarget, setReopenTarget] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      liveEntries.filter((e) => {
        const matchesFilter =
          filter === "all" ||
          (filter === "verified" && e.status === "Verified") ||
          (filter === "pending" && e.status === "Pending") ||
          (filter === "rejected" && (e.status === "Rejected" || e.status === "Spoof blocked"));
        const matchesQuery =
          query.trim().length === 0 ||
          `${e.student} ${e.roll}`.toLowerCase().includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
      }),
    [filter, query],
  );

  return (
    <>
      <PageHeader
        title="Live attendance monitoring"
        description="CS3110 · Database Systems · Block A 112 · window closes in 04:12"
        actions={
          <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Manual attendance", { description: "Register mode enabled for this session." })}
          >
            <SquarePen />
            Manual
          </Button>
          <Button size="sm" variant="outline" onClick={() => setReopenTarget("__all__")}>
            Reopen all
          </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <SectionCard bodyClassName="p-3">
          <p className="text-xs text-muted-foreground uppercase">Verified</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            {liveEntries.filter((e) => e.status === "Verified").length}
          </p>
        </SectionCard>
        <SectionCard bodyClassName="p-3">
          <p className="text-xs text-muted-foreground uppercase">Pending</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            {liveEntries.filter((e) => e.status === "Pending").length}
          </p>
        </SectionCard>
        <SectionCard bodyClassName="p-3">
          <p className="text-xs text-muted-foreground uppercase">Rejected</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            {liveEntries.filter((e) => e.status === "Rejected").length}
          </p>
        </SectionCard>
        <SectionCard bodyClassName="p-3">
          <p className="text-xs text-muted-foreground uppercase">Spoof blocked</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-danger">
            {liveEntries.filter((e) => e.status === "Spoof blocked").length}
          </p>
        </SectionCard>
      </div>

      <SectionCard bodyClassName="p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              {filters.map((f) => (
                <TabsTrigger key={f} value={f} className="capitalize">
                  {f}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student name or roll number"
              className="pl-9"
            />
          </div>
        </div>
      </SectionCard>

      {rows.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No verification attempts match your filters"
          description="Clear the search or switch back to all attempts."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <>
          <SectionCard
            title={`${rows.length} verification attempts`}
            description="Select a student to replay their verification"
            bodyClassName="p-0"
            className="hidden md:block"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((e) => (
                  <TableRow key={e.id} className="cursor-pointer" onClick={() => setSelected(e)}>
                    <TableCell>
                      <p className="text-[13px] font-medium text-foreground">{e.student}</p>
                      <p className="text-xs text-muted-foreground">{e.roll}</p>
                    </TableCell>
                    <TableCell className="text-[13px] tabular-nums">{e.time}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">
                      {e.confidence > 0 ? `${e.confidence}%` : "—"}
                    </TableCell>
                    <TableCell className="text-[13px]">{e.device}</TableCell>
                    <TableCell className="text-[13px]">{e.location}</TableCell>
                    <TableCell>
                      <StatusChip tone={riskToneMap[e.risk]}>{e.risk}</StatusChip>
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusChip tone={liveStatusTone[e.status]}>{e.status}</StatusChip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          <div className="space-y-2 md:hidden">
            {rows.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className="w-full rounded-md border border-border bg-card p-3.5 text-left shadow-xs"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-foreground">{e.student}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.roll} · {e.time}
                    </p>
                  </div>
                  <StatusChip tone={liveStatusTone[e.status]}>{e.status}</StatusChip>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <StatusChip tone={riskToneMap[e.risk]}>{e.risk} risk</StatusChip>
                  <StatusChip tone="neutral" dot={false}>
                    {e.confidence > 0 ? `${e.confidence}%` : "No capture"}
                  </StatusChip>
                  <StatusChip tone="neutral" dot={false}>
                    {e.device}
                  </StatusChip>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>Replay verification</DialogTitle>
                <DialogDescription>
                  {selected.student} · {selected.roll}
                </DialogDescription>
              </DialogHeader>

              <CameraPreview
                label="Captured face"
                status={selected.status}
                statusTone={liveStatusTone[selected.status]}
                hint={
                  selected.status === "Verified"
                    ? "Liveness confirmed · frame retained for audit"
                    : "Verification rejected · frame retained for audit"
                }
              />

              <div className="rounded-md border border-border bg-surface-muted/50 px-3">
                <DetailRow
                  label="Verification status"
                  value={<StatusChip tone={liveStatusTone[selected.status]}>{selected.status}</StatusChip>}
                />
                <DetailRow
                  label="Confidence"
                  value={selected.confidence > 0 ? `${selected.confidence}%` : "Not captured"}
                />
                <DetailRow label="Risk score" value={<StatusChip tone={riskToneMap[selected.risk]}>{selected.risk}</StatusChip>} />
                <DetailRow label="Gesture performed" value={selected.gesture} />
                <DetailRow label="Device" value={selected.device} />
                <DetailRow label="Location" value={selected.location} />
                <DetailRow label="Timestamp" value={selected.time} />
                {selected.reason ? <DetailRow label="Reason" value={selected.reason} /> : null}
              </div>

              <AiExplanationPanel
                outcome={selected.status === "Verified" ? "verified" : "rejected"}
                reasons={
                  selected.status === "Verified"
                    ? []
                    : [
                        selected.reason ?? "Identity match below configured threshold",
                        selected.gesture === "None" ? "Required gesture was not completed" : null,
                        selected.device !== "Trusted" ? "Device was not recognised" : null,
                        selected.location !== "Verified" ? "Location outside the permitted range" : null,
                      ].filter((r): r is string => Boolean(r))
                }
              />

              <DialogFooter className="flex-wrap gap-2 sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Replay unavailable", { description: "Recorded frames stream in the production build." })}
                >
                  <PlayCircle /> Replay capture
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Remark added", { description: `Remark recorded for ${selected.student}.` })}
                >
                  Add remark
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReopenTarget(selected.student);
                    setSelected(null);
                  }}
                >
                  Reopen verification
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.error("Verification rejected", { description: `${selected.student} remains unmarked.` });
                    setSelected(null);
                  }}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    toast.success("Approved", { description: `${selected.student} marked present.` });
                    setSelected(null);
                  }}
                >
                  Approve
                </Button>
              </DialogFooter>

            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={reopenTarget !== null} onOpenChange={(open) => !open && setReopenTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reopen verification?</DialogTitle>
            <DialogDescription>
              {reopenTarget === "__all__"
                ? "All students in this session will be able to verify again until the window closes."
                : `${reopenTarget} will be able to attempt verification again until the window closes.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setReopenTarget(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                toast.success("Verification reopened", {
                  description:
                    reopenTarget === "__all__" ? "All students · CS3110" : `${reopenTarget} · CS3110`,
                });
                setReopenTarget(null);
              }}
            >
              Reopen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SectionCard title="Spoof detection" description="Liveness and replay heuristics running on this session">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
          <ShieldAlert className="size-4 text-danger" />
          1 spoof blocked · 2 rejected attempts · 0 duplicate device signatures
        </div>
      </SectionCard>
    </>
  );
}
