import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Copy,
  Download,
  Expand,
  Maximize2,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  StopCircle,
  Timer,
} from "lucide-react";
import { PageHeader, SectionCard } from "@/components/argus/section";
import { MetricCard } from "@/components/argus/metric-card";
import { StatusChip, type StatusTone } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { attendanceModes, teacherClasses } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher/session")({
  head: () => ({
    meta: [
      { title: "Attendance Session — ARGUS Faculty" },
      {
        name: "description",
        content:
          "Configure the subject, room, window and verification mode, then open, pause, extend or close the attendance session.",
      },
      { property: "og:title", content: "Attendance Session — ARGUS Faculty" },
      {
        property: "og:description",
        content: "Dynamic QR, secure attendance codes and live verification controls.",
      },
    ],
  }),
  component: SessionPage,
});

type SessionState = "Idle" | "Live" | "Paused" | "Closed";

const stateTone: Record<SessionState, StatusTone> = {
  Idle: "neutral",
  Live: "success",
  Paused: "warning",
  Closed: "danger",
};

function QrPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "argus-scan-frame grid aspect-square w-full place-items-center rounded-md border border-border bg-surface-muted",
        className,
      )}
    >
      <div className="grid grid-cols-8 gap-1 p-4">
        {Array.from({ length: 64 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "size-2.5 rounded-[2px] sm:size-3",
              (i * 7 + (i % 5)) % 3 === 0 ? "bg-foreground" : "bg-transparent",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function SessionPage() {
  const [state, setState] = useState<SessionState>("Live");
  const [mode, setMode] = useState<string>("qr");
  const [code, setCode] = useState("7K4M2Q");
  const [qrFull, setQrFull] = useState(false);
  const [codeFull, setCodeFull] = useState(false);

  const live = teacherClasses.find((c) => c.status === "Live") ?? teacherClasses[0]!;

  const setSession = (next: SessionState, message: string) => {
    setState(next);
    toast.info(message, { description: `${live.code} · ${live.room}` });
  };

  return (
    <>
      <PageHeader
        title="Attendance session"
        description="Configure verification requirements before opening the window to students."
        actions={<StatusChip tone={stateTone[state]}>{state}</StatusChip>}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <SectionCard title="Session configuration" description="Applies to the current class only">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Select defaultValue={live.code}>
                <SelectTrigger id="subject">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map((c) => (
                    <SelectItem key={c.id} value={c.code}>
                      {c.code} · {c.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room">Room</Label>
              <Select defaultValue={live.room}>
                <SelectTrigger id="room">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Block A · 112", "Block C · 204", "Block C · 301", "Lab 3"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="topic">Topic of today's lecture</Label>
              <Input id="topic" defaultValue={live.topic} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="window">Attendance window</Label>
              <Select defaultValue="10">
                <SelectTrigger id="window">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["5", "10", "15", "20"].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="strength">Class strength</Label>
              <Input id="strength" defaultValue={String(live.strength)} readOnly />
            </div>
          </div>

          <Separator className="my-4" />

          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Attendance mode
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {attendanceModes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={cn(
                  "rounded-md border border-border bg-surface p-3 text-left transition-colors hover:bg-accent/40",
                  mode === m.id && "border-border-strong bg-accent/50",
                )}
              >
                <p className="text-[13px] font-semibold text-foreground">{m.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.hint}</p>
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Live session status" description={`${live.code} · ${live.time}`}>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Present" value={live.marked} />
              <MetricCard label="Pending" value={live.strength - live.marked - 2} />
              <MetricCard label="Rejected" value={2} />
              <MetricCard label="Spoof alerts" value={1} icon={ShieldAlert} />
            </div>
            <div className="mt-4 rounded-md border border-border bg-surface-muted/60 p-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Timer className="size-4" /> Time remaining
                </span>
                <span className="font-semibold tabular-nums text-foreground">04:12</span>
              </div>
              <Progress value={42} className="mt-2 h-1.5" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Button size="sm" onClick={() => setSession("Live", "Attendance opened")}>
                <PlayCircle /> Open
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSession("Paused", "Attendance paused")}>
                <PauseCircle /> Pause
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSession("Live", "Attendance resumed")}>
                <RotateCcw /> Resume
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSession("Closed", "Attendance closed")}>
                <StopCircle /> Close
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSession("Live", "Attendance reopened")}>
                <RefreshCw /> Reopen
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Window extended by 5 minutes")}
              >
                <Timer /> Extend
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="QR attendance"
          description="Dynamic QR rotates every 15 seconds"
          action={<StatusChip tone="info">Expires in 00:11</StatusChip>}
        >
          <div className="mx-auto max-w-[240px]">
            <QrPlaceholder />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.success("QR regenerated")}>
              <RefreshCw /> Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("QR downloaded as PNG")}>
              <Download /> Download
            </Button>
            <Button size="sm" variant="outline" onClick={() => setQrFull(true)}>
              <Maximize2 /> Project
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Attendance code"
          description="Single-use secure code for this session"
          action={<StatusChip tone="warning">Expires in 04:12</StatusChip>}
        >
          <div className="grid place-items-center rounded-md border border-border bg-surface-muted py-10">
            <p className="font-mono text-4xl font-semibold tracking-[0.35em] text-foreground sm:text-5xl">
              {code}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Read aloud in class · never share online</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Attendance code copied")}
            >
              <Copy /> Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const next = Math.random().toString(36).slice(2, 8).toUpperCase();
                setCode(next);
                toast.success("New code generated");
              }}
            >
              <RefreshCw /> Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCodeFull(true)}>
              <Expand /> Fullscreen
            </Button>
          </div>
        </SectionCard>
      </div>

      <Dialog open={qrFull} onOpenChange={setQrFull}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="text-center">
            {live.code} · {live.room}
          </DialogTitle>
          <div className="mx-auto w-full max-w-md">
            <QrPlaceholder />
          </div>
          <p className="text-center text-[13px] text-muted-foreground">
            Rotating QR · refreshes every 15 seconds
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={codeFull} onOpenChange={setCodeFull}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="text-center">Attendance code</DialogTitle>
          <p className="py-10 text-center font-mono text-6xl font-semibold tracking-[0.3em] text-foreground sm:text-7xl">
            {code}
          </p>
          <p className="text-center text-[13px] text-muted-foreground">Expires in 04:12</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
