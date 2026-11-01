
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import {
  PageHeader,
  SectionCard,
  DetailRow,
} from "@/components/argus/section";
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

import {
  attendanceRecords,
  resultTone,
  riskTone,
  type AttendanceRecord,
} from "@/lib/argus-data";

export const Route = createFileRoute("/student/history")({
  head: () => ({
    meta: [
      { title: "Attendance History | ARGUS" },
      {
        name: "description",
        content:
          "View, filter and export your attendance records and verification details.",
      },
    ],
  }),
  component: HistoryPage,
});

const periods = ["daily", "weekly", "monthly", "semester"] as const;

type Period = (typeof periods)[number];

function escapeCSV(value: string | number) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function exportAttendance(records: AttendanceRecord[]) {
  if (records.length === 0) {
    toast.error("No attendance records to export.");
    return;
  }

  const headers = [
    "Record ID",
    "Date",
    "Day",
    "Time",
    "Subject",
    "Subject Code",
    "Teacher",
    "Attendance Method",
    "Confidence",
    "Risk",
    "Result",
    "Location Status",
    "Device Status",
  ];

  const rows = records.map((record) => [
    record.id,
    record.date,
    record.day,
    record.time,
    record.subject,
    record.code,
    record.teacher,
    record.method,
    record.confidence > 0 ? `${record.confidence}%` : "Not captured",
    record.risk,
    record.result,
    record.location,
    record.device,
  ]);

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "argus-attendance-history.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);

  toast.success("Attendance history exported.", {
    description: `${records.length} records downloaded as CSV.`,
  });
}

function HistoryPage() {
  const [period, setPeriod] = useState<Period>("semester");
  const [query, setQuery] = useState("");
  const [selected, setSelected] =
    useState<AttendanceRecord | null>(null);

  const rows = useMemo(() => {
    const selectedPeriodIndex = periods.indexOf(period);

    return attendanceRecords.filter((record) => {
      const recordPeriodIndex = periods.indexOf(
        record.period as Period,
      );

      const withinPeriod =
        recordPeriodIndex !== -1 &&
        recordPeriodIndex <= selectedPeriodIndex;

      const searchText = [
        record.subject,
        record.code,
        record.teacher,
        record.date,
        record.method,
        record.result,
        record.risk,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        query.trim().toLowerCase(),
      );

      return withinPeriod && matchesSearch;
    });
  }, [period, query]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Student dashboard
        </Link>

        <PageHeader
          title="Attendance history"
          description="Review your attendance records and the verification evidence associated with each session."
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportAttendance(rows)}
            >
              <Download className="size-4" />
              Export CSV
            </Button>
          }
        />
      </div>

      {/* Filters */}
      <SectionCard bodyClassName="p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <Tabs
            value={period}
            onValueChange={(value) => setPeriod(value as Period)}
          >
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              {periods.map((item) => (
                <TabsTrigger
                  key={item}
                  value={item}
                  className="capitalize"
                >
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by subject, code, teacher, date or result"
              className="pl-9 rounded-none"
            />
          </div>
        </div>
      </SectionCard>

      {/* Attendance records */}
      {rows.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No attendance records found"
          description="Try selecting a wider period or clearing your search query."
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
            title={`${rows.length} attendance records`}
            description="Select a record to inspect its verification details."
            bodyClassName="p-0"
            className="hidden md:block"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="pl-5">Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">
                    Confidence
                  </TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="pr-5 text-right">
                    Result
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((record) => (
                  <TableRow
                    key={record.id}
                    className="cursor-pointer border-border"
                    onClick={() => setSelected(record)}
                  >
                    <TableCell className="pl-5">
                      <span className="block text-[13px] font-medium text-foreground">
                        {record.date}
                      </span>

                      <span className="block text-[11px] text-muted-foreground">
                        {record.time}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="block text-[13px] text-foreground">
                        {record.subject}
                      </span>

                      <span className="block font-mono text-[11px] text-muted-foreground">
                        {record.code} · {record.teacher}
                      </span>
                    </TableCell>

                    <TableCell className="text-[13px] text-muted-foreground">
                      {record.method}
                    </TableCell>

                    <TableCell className="text-right font-mono text-[13px] tabular-nums text-foreground">
                      {record.confidence > 0
                        ? `${record.confidence}%`
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <StatusChip tone={riskTone[record.risk]}>
                        {record.risk}
                      </StatusChip>
                    </TableCell>

                    <TableCell className="pr-5 text-right">
                      <StatusChip tone={resultTone[record.result]}>
                        {record.result}
                      </StatusChip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          {/* Mobile records */}
          <div className="space-y-2.5 md:hidden">
            {rows.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => setSelected(record)}
                className="w-full border border-border bg-card p-3.5 text-left transition-colors hover:bg-muted/20"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-foreground">
                      {record.subject}
                    </p>

                    <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                      {record.date} · {record.time}
                    </p>

                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {record.code}
                    </p>
                  </div>

                  <StatusChip tone={resultTone[record.result]}>
                    {record.result}
                  </StatusChip>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatusChip tone="neutral" dot={false}>
                    {record.method}
                  </StatusChip>

                  <StatusChip
                    tone={riskTone[record.risk]}
                    dot={false}
                  >
                    Risk: {record.risk}
                  </StatusChip>

                  {record.confidence > 0 && (
                    <StatusChip tone="neutral" dot={false}>
                      {record.confidence}%
                    </StatusChip>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Record detail dialog */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Attendance details</DialogTitle>

            <DialogDescription>
              {selected
                ? `${selected.subject} · ${selected.code}`
                : "Verification record information"}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="max-h-[60vh] overflow-y-auto">
              <DetailRow
                label="Record ID"
                value={
                  <span className="font-mono text-xs">
                    {selected.id}
                  </span>
                }
              />

              <DetailRow
                label="Date"
                value={`${selected.date} · ${selected.day}`}
              />

              <DetailRow
                label="Subject"
                value={selected.subject}
              />

              <DetailRow
                label="Subject code"
                value={selected.code}
              />

              <DetailRow
                label="Teacher"
                value={selected.teacher}
              />

              <DetailRow
                label="Time"
                value={selected.time}
              />

              <DetailRow
                label="Attendance method"
                value={selected.method}
              />

              <DetailRow
                label="Confidence score"
                value={
                  <span className="font-mono">
                    {selected.confidence > 0
                      ? `${selected.confidence}%`
                      : "Not captured"}
                  </span>
                }
              />

              <DetailRow
                label="Location status"
                value={
                  <StatusChip
                    tone={
                      selected.location === "Verified"
                        ? "success"
                        : "warning"
                    }
                  >
                    {selected.location}
                  </StatusChip>
                }
              />

              <DetailRow
                label="Device status"
                value={
                  <StatusChip
                    tone={
                      selected.device === "Trusted"
                        ? "success"
                        : "warning"
                    }
                  >
                    {selected.device}
                  </StatusChip>
                }
              />

              <DetailRow
                label="Risk status"
                value={
                  <StatusChip tone={riskTone[selected.risk]}>
                    {selected.risk}
                  </StatusChip>
                }
              />

              <DetailRow
                label="Verification result"
                value={
                  <StatusChip tone={resultTone[selected.result]}>
                    {selected.result}
                  </StatusChip>
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>

            <Button asChild>
              <Link to="/student/appeals">
                Raise appeal
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Attendance history currently uses the frontend demonstration
        dataset. Live records, verification evidence and export
        authorization will be connected to the ARGUS backend.
      </p>
    </div>
  );
}
