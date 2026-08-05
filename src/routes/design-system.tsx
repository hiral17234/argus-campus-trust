import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, CheckCircle2, Info, Inbox, XCircle } from "lucide-react";
import { ArgusLogo } from "@/components/argus/logo";
import { ThemeToggle } from "@/components/argus/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SectionCard, DetailRow, PageHeader } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { EmptyState } from "@/components/argus/empty-state";
import { CardSkeleton, ListSkeleton, TableSkeleton } from "@/components/argus/skeletons";
import { MetricCard } from "@/components/argus/metric-card";
import { NotificationCard } from "@/components/argus/notification-card";
import { UserCard } from "@/components/argus/user-card";
import { CameraPreview } from "@/components/argus/camera-preview";
import { QrScanner } from "@/components/argus/qr-scanner";
import { SubjectAttendanceChart } from "@/components/argus/charts";
import { subjectAttendance } from "@/lib/argus-data";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "ARGUS Design System" },
      {
        name: "description",
        content:
          "Reference implementation of the ARGUS enterprise design system: tokens, components and patterns.",
      },
      { property: "og:title", content: "ARGUS Design System" },
      {
        property: "og:description",
        content: "Enterprise minimalism tokens and components used across the ARGUS platform.",
      },
    ],
  }),
  component: DesignSystemPage,
});

const tokens = [
  { name: "Primary — Deep Graphite", hex: "#1E2329", className: "bg-primary" },
  { name: "Secondary — Slate", hex: "#38424F", className: "bg-secondary" },
  { name: "Background", hex: "#F7F8FA", className: "bg-background border border-border" },
  { name: "Dark surface", hex: "#121417", className: "bg-[#121417]" },
  { name: "Success", hex: "#16A34A", className: "bg-success" },
  { name: "Warning", hex: "#D97706", className: "bg-warning" },
  { name: "Danger", hex: "#DC2626", className: "bg-danger" },
  { name: "Information", hex: "#2563EB", className: "bg-info" },
];

function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:px-6">
          <Link to="/">
            <ArgusLogo showTagline />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link to="/student">
              <Button size="sm" variant="outline">
                Student portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-5 py-8 sm:px-6">
        <PageHeader
          title="ARGUS Design System"
          description="Enterprise minimalism — graphite neutrals, 6px radii, subtle shadows, no gradients."
        />

        <SectionCard title="Color tokens">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tokens.map((t) => (
              <div key={t.name} className="rounded-md border border-border bg-surface p-3">
                <div className={`h-12 w-full rounded-sm ${t.className}`} />
                <p className="mt-2 text-[12px] font-medium text-foreground">{t.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{t.hex}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Typography — Geist">
          <div className="space-y-3">
            <p className="text-3xl font-semibold tracking-tight text-foreground">Display 30 / 600</p>
            <p className="text-xl font-semibold text-foreground">Heading 20 / 600</p>
            <p className="text-sm font-semibold text-foreground">Section title 14 / 600</p>
            <p className="text-[13px] text-muted-foreground">Body 13 / 400 — muted foreground</p>
            <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              Mono label 11 / 400
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Buttons">
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Inputs and forms">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ds-input">Label</Label>
                <Input id="ds-input" placeholder="Placeholder text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-invalid">Invalid state</Label>
                <Input id="ds-invalid" aria-invalid defaultValue="name@gmail.com" />
                <p className="text-[12px] text-danger">Use an official college email address.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-textarea">Textarea</Label>
                <Textarea id="ds-textarea" rows={3} placeholder="Describe the issue" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="ds-check" defaultChecked />
                <Label htmlFor="ds-check" className="font-normal">
                  Trust this device
                </Label>
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-normal">Email notifications</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Badges and status chips">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="solid">Solid</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusChip tone="success">Verified</StatusChip>
              <StatusChip tone="warning">Flagged</StatusChip>
              <StatusChip tone="danger">Rejected</StatusChip>
              <StatusChip tone="info">Window open</StatusChip>
              <StatusChip tone="pending">Pending</StatusChip>
              <StatusChip tone="neutral">Closed</StatusChip>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Alerts">
          <div className="space-y-3">
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Informational</AlertTitle>
              <AlertDescription>Verification window opens 5 minutes before class.</AlertDescription>
            </Alert>
            <Alert>
              <CheckCircle2 className="size-4 text-success" />
              <AlertTitle>Attendance recorded</AlertTitle>
              <AlertDescription>Match confidence 98.6% with liveness passed.</AlertDescription>
            </Alert>
            <Alert>
              <AlertTriangle className="size-4 text-warning" />
              <AlertTitle>Location outside geofence</AlertTitle>
              <AlertDescription>This record will be reviewed by your teacher.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <XCircle className="size-4" />
              <AlertTitle>Verification failed</AlertTitle>
              <AlertDescription>Face template did not match the registered identity.</AlertDescription>
            </Alert>
          </div>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Toasts and dialogs">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => toast.success("Attendance recorded", { description: "CS3110 · 98.6%" })}
              >
                Success toast
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error("Verification failed", { description: "Try again in good lighting." })}
              >
                Error toast
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm action</DialogTitle>
                    <DialogDescription>
                      This will revoke the trusted status of the selected device.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Revoke device</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </SectionCard>

          <SectionCard title="Metric cards">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Attendance" value="82.4" unit="%" progress={82.4} />
              <MetricCard label="Sessions" value="46" icon={Bell} hint="This month" />
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Table" bodyClassName="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Session</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead className="pr-5 text-right">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { s: "Operating Systems", m: "Face + QR", c: "98.4%", r: "Present" },
                { s: "Machine Learning", m: "Attendance Code", c: "71.2%", r: "Flagged" },
                { s: "Database Systems", m: "Face Verification", c: "99.1%", r: "Present" },
              ].map((row) => (
                <TableRow key={row.s}>
                  <TableCell className="pl-5 text-[13px] font-medium">{row.s}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{row.m}</TableCell>
                  <TableCell className="text-right font-mono text-[13px]">{row.c}</TableCell>
                  <TableCell className="pr-5 text-right">
                    <StatusChip tone={row.r === "Present" ? "success" : "warning"}>{row.r}</StatusChip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Notification card">
            <NotificationCard
              kind="attendance-approved"
              title="Attendance approved"
              body="Computer Networks · 05 Aug verified at 98.4% confidence."
              time="3h ago"
              unread
              icon={Bell}
            />
          </SectionCard>
          <SectionCard title="User card">
            <UserCard
              name="Aarav Sharma"
              role="Student"
              meta="CS22B1043"
              trailing={<StatusChip tone="success">Verified</StatusChip>}
            />
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Camera preview">
            <CameraPreview hint="Front face · keep your head steady" />
          </SectionCard>
          <SectionCard title="QR scanner">
            <QrScanner />
          </SectionCard>
        </div>

        <SectionCard title="Charts">
          <SubjectAttendanceChart data={subjectAttendance} />
        </SectionCard>

        <SectionCard title="Empty state">
          <EmptyState
            icon={Inbox}
            title="No records yet"
            description="Verified attendance will appear here once your first session is complete."
            action={<Button size="sm">Mark attendance</Button>}
          />
        </SectionCard>

        <SectionCard title="Loading skeletons">
          <div className="grid gap-4 lg:grid-cols-2">
            <CardSkeleton />
            <ListSkeleton />
          </div>
          <div className="mt-4">
            <TableSkeleton rows={3} />
          </div>
        </SectionCard>

        <SectionCard title="Detail rows">
          <DetailRow label="Attendance method" value="Face + QR" />
          <DetailRow label="Confidence score" value={<span className="font-mono">98.4%</span>} />
          <DetailRow label="Risk status" value={<StatusChip tone="success">Low</StatusChip>} />
        </SectionCard>
      </main>
    </div>
  );
}
