
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Activity,
  Search,
  Fingerprint,
  Smartphone,
  MapPin,
  Eye,
  AlertTriangle,
  Clock3,
  X,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/security")({
  component: AdminSecurity,
});

type VerificationStatus =
  | "Successful"
  | "Failed"
  | "Flagged"
  | "Pending";

type RiskLevel = "Low" | "Medium" | "High";

type VerificationRecord = {
  id: string;
  student: string;
  enrollment: string;
  sessionId: string;
  method: string;
  date: string;
  time: string;
  status: VerificationStatus;
  risk: RiskLevel;
  faceMatch: string;
  liveness: string;
  device: string;
  location: string;
  reason: string;
};

const initialRecords: VerificationRecord[] = [
  {
    id: "VER-001",
    student: "Aarav Sharma",
    enrollment: "MITS23CS041",
    sessionId: "SES-2026-1105-001",
    method: "Face",
    date: "2026-11-05",
    time: "09:05 AM",
    status: "Successful",
    risk: "Low",
    faceMatch: "98.4%",
    liveness: "Passed",
    device: "Registered device",
    location: "Campus network",
    reason: "No risk indicators detected",
  },
  {
    id: "VER-002",
    student: "Priya Verma",
    enrollment: "MITS23CS056",
    sessionId: "SES-2026-1105-001",
    method: "Face",
    date: "2026-11-05",
    time: "09:07 AM",
    status: "Successful",
    risk: "Low",
    faceMatch: "97.1%",
    liveness: "Passed",
    device: "Registered device",
    location: "Campus network",
    reason: "No risk indicators detected",
  },
  {
    id: "VER-003",
    student: "Rohan Gupta",
    enrollment: "MITS23CS063",
    sessionId: "SES-2026-1105-001",
    method: "Face",
    date: "2026-11-05",
    time: "09:09 AM",
    status: "Flagged",
    risk: "High",
    faceMatch: "62.3%",
    liveness: "Review required",
    device: "Unrecognized device",
    location: "Location mismatch",
    reason: "Low face-match score and device mismatch",
  },
  {
    id: "VER-004",
    student: "Ananya Singh",
    enrollment: "MITS23EC072",
    sessionId: "SES-2026-1105-002",
    method: "QR",
    date: "2026-11-05",
    time: "11:03 AM",
    status: "Successful",
    risk: "Low",
    faceMatch: "Not applicable",
    liveness: "Not applicable",
    device: "Registered device",
    location: "Campus network",
    reason: "QR verification accepted in demo data",
  },
  {
    id: "VER-005",
    student: "Karan Patel",
    enrollment: "MITS23ME084",
    sessionId: "SES-2026-1105-002",
    method: "Code",
    date: "2026-11-05",
    time: "11:06 AM",
    status: "Failed",
    risk: "Medium",
    faceMatch: "Not applicable",
    liveness: "Not applicable",
    device: "Registered device",
    location: "Campus network",
    reason: "Incorrect attendance challenge",
  },
  {
    id: "VER-006",
    student: "Meera Joshi",
    enrollment: "MITS23IT091",
    sessionId: "SES-2026-1105-002",
    method: "Face",
    date: "2026-11-05",
    time: "11:08 AM",
    status: "Pending",
    risk: "Medium",
    faceMatch: "Pending",
    liveness: "Pending",
    device: "Unverified device",
    location: "Not confirmed",
    reason: "Additional verification required",
  },
  {
    id: "VER-007",
    student: "Dev Malhotra",
    enrollment: "MITS23CS102",
    sessionId: "SES-2026-1105-001",
    method: "Face",
    date: "2026-11-05",
    time: "09:12 AM",
    status: "Flagged",
    risk: "High",
    faceMatch: "71.5%",
    liveness: "Failed",
    device: "Registered device",
    location: "Campus network",
    reason: "Liveness check failed",
  },
  {
    id: "VER-008",
    student: "Ishita Rao",
    enrollment: "MITS23EC118",
    sessionId: "SES-2026-1104-001",
    method: "QR",
    date: "2026-11-04",
    time: "09:04 AM",
    status: "Successful",
    risk: "Low",
    faceMatch: "Not applicable",
    liveness: "Not applicable",
    device: "Registered device",
    location: "Campus network",
    reason: "No risk indicators detected",
  },
];

const statusFilters = [
  "All",
  "Successful",
  "Failed",
  "Flagged",
  "Pending",
] as const;

const riskFilters = ["All", "Low", "Medium", "High"] as const;

function AdminSecurity() {
  const [records] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilters)[number]>("All");
  const [riskFilter, setRiskFilter] =
    useState<(typeof riskFilters)[number]>("All");
  const [selectedRecord, setSelectedRecord] =
    useState<VerificationRecord | null>(null);

  const successfulCount = records.filter(
    (record) => record.status === "Successful",
  ).length;

  const failedCount = records.filter(
    (record) => record.status === "Failed",
  ).length;

  const flaggedCount = records.filter(
    (record) => record.status === "Flagged",
  ).length;

  const pendingCount = records.filter(
    (record) => record.status === "Pending",
  ).length;

  const highRiskCount = records.filter(
    (record) => record.risk === "High",
  ).length;

  const mediumRiskCount = records.filter(
    (record) => record.risk === "Medium",
  ).length;

  const lowRiskCount = records.filter(
    (record) => record.risk === "Low",
  ).length;

  const completedCount = successfulCount + failedCount + flaggedCount;

  const successRate =
    completedCount > 0
      ? Math.round((successfulCount / completedCount) * 100)
      : 0;

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    return records.filter((record) => {
      const matchesSearch =
        record.student.toLowerCase().includes(query) ||
        record.enrollment.toLowerCase().includes(query) ||
        record.id.toLowerCase().includes(query) ||
        record.sessionId.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      const matchesRisk =
        riskFilter === "All" || record.risk === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [records, search, statusFilter, riskFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Verification"
        description="Monitor identity-verification activity, risk indicators, and security events across ARGUS."
      />

      {/* Demo notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Security monitoring dashboard
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              All displayed verification records and risk indicators
              are illustrative. No real biometric or security checks
              are being performed by this page.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Overview */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Verification overview
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total attempts",
              value: records.length,
              icon: Activity,
            },
            {
              label: "Successful",
              value: successfulCount,
              icon: ShieldCheck,
            },
            {
              label: "Failed",
              value: failedCount,
              icon: ShieldX,
            },
            {
              label: "Flagged",
              value: flaggedCount,
              icon: ShieldAlert,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-3 text-2xl font-semibold tabular-nums">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verification and risk statistics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Verification success rate"
          description="Calculated from completed demonstration attempts."
        >
          <div className="flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold tabular-nums">
              {successRate}%
            </p>
            <p className="text-xs text-muted-foreground">
              {successfulCount} successful / {completedCount} completed
            </p>
          </div>

          <div className="mt-4 h-2 w-full bg-muted">
            <div
              className="h-full bg-foreground transition-all"
              style={{ width: `${successRate}%` }}
            />
          </div>

          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>Pending attempts: {pendingCount}</span>
            <span>Total: {records.length}</span>
          </div>
        </SectionCard>

        <SectionCard
          title="Risk distribution"
          description="Risk levels assigned to the sample verification records."
        >
          {[
            {
              label: "Low risk",
              count: lowRiskCount,
              color: "bg-foreground",
            },
            {
              label: "Medium risk",
              count: mediumRiskCount,
              color: "bg-muted-foreground",
            },
            {
              label: "High risk",
              count: highRiskCount,
              color: "bg-destructive",
            },
          ].map((item) => (
            <div key={item.label} className="mb-4 last:mb-0">
              <div className="mb-2 flex justify-between text-sm">
                <span>{item.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {item.count}
                </span>
              </div>
              <div className="h-2 bg-muted">
                <div
                  className={`h-full ${item.color}`}
                  style={{
                    width: `${records.length ? (item.count / records.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Security indicators */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Security indicators
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "High-risk attempts",
              value: highRiskCount,
              icon: AlertTriangle,
            },
            {
              label: "Medium-risk attempts",
              value: mediumRiskCount,
              icon: ShieldAlert,
            },
            {
              label: "Pending reviews",
              value: pendingCount,
              icon: Clock3,
            },
            {
              label: "Failed liveness checks",
              value: records.filter(
                (record) => record.liveness === "Failed",
              ).length,
              icon: Fingerprint,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="border border-border bg-card p-4"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="mt-3 text-2xl font-semibold tabular-nums">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verification records */}
      <SectionCard
        title="Verification activity"
        description="Review identity-verification attempts and associated risk indicators."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, ID or session"
              className="pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as (typeof statusFilters)[number],
              )
            }
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            {statusFilters.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All statuses" : item}
              </option>
            ))}
          </select>

          <select
            value={riskFilter}
            onChange={(event) =>
              setRiskFilter(
                event.target.value as (typeof riskFilters)[number],
              )
            }
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            {riskFilters.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All risk levels" : `${item} risk`}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Session ID</th>
                <th className="px-3 py-3 font-medium">Method</th>
                <th className="px-3 py-3 font-medium">Time</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Risk</th>
                <th className="px-3 py-3 font-medium">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium">{record.student}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {record.enrollment}
                    </p>
                  </td>

                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {record.sessionId}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {record.method}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    <p>{record.date}</p>
                    <p className="mt-1 text-muted-foreground">
                      {record.time}
                    </p>
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={record.status} />
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={`${record.risk} risk`} />
                  </td>

                  <td className="px-3 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" />
                      Review
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No verification records match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Showing {filteredRecords.length} of {records.length} demonstration records.
        </div>
      </SectionCard>

      {/* Verification detail */}
      {selectedRecord && (
        <SectionCard
          title="Verification review"
          description={`Record ${selectedRecord.id}`}
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedRecord(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Student" value={selectedRecord.student} />
            <Detail label="Enrollment" value={selectedRecord.enrollment} />
            <Detail label="Verification ID" value={selectedRecord.id} />
            <Detail label="Session ID" value={selectedRecord.sessionId} />
            <Detail label="Method" value={selectedRecord.method} />
            <Detail label="Date and time" value={`${selectedRecord.date}, ${selectedRecord.time}`} />
            <Detail label="Status" value={selectedRecord.status} />
            <Detail label="Risk level" value={selectedRecord.risk} />
            <Detail label="Face-match score" value={selectedRecord.faceMatch} />
            <Detail label="Liveness result" value={selectedRecord.liveness} />
            <Detail label="Device" value={selectedRecord.device} />
            <Detail label="Location" value={selectedRecord.location} />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Recorded risk explanation
            </p>
            <p className="mt-2 text-sm font-medium">
              {selectedRecord.reason}
            </p>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            This is an illustrative record. Real security investigations
            require backend evidence, authorization checks, and audit logging.
          </p>
        </SectionCard>
      )}

      {/* Device and biometric controls */}
      <SectionCard
        title="Verification infrastructure"
        description="Integration status of the security subsystems."
      >
        <div className="divide-y divide-border">
          <InfrastructureRow
            icon={Fingerprint}
            title="Biometric verification"
            description="Face matching, liveness detection and biometric template validation."
            status="Backend pending"
          />

          <InfrastructureRow
            icon={Smartphone}
            title="Device verification"
            description="Registered device checks and device trust evaluation."
            status="Backend pending"
          />

          <InfrastructureRow
            icon={MapPin}
            title="Location verification"
            description="Location consistency checks and authorized campus boundaries."
            status="Backend pending"
          />

          <InfrastructureRow
            icon={ShieldCheck}
            title="Risk assessment engine"
            description="Risk scoring and adaptive verification decisions."
            status="Backend pending"
          />
        </div>
      </SectionCard>

      {/* Integration requirements */}
      <div className="border border-border p-4">
        <p className="text-sm font-medium">
          Backend integration requirements
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
          <li>Retrieve verification events from authenticated admin APIs.</li>
          <li>Calculate risk scores on the server, not in the browser.</li>
          <li>Protect biometric templates and sensitive verification evidence.</li>
          <li>Apply role-based authorization to security records.</li>
          <li>Maintain tamper-resistant audit logs for security events.</li>
          <li>Never expose raw biometric data or sensitive device identifiers in the admin UI.</li>
        </ul>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

function InfrastructureRow({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <StatusChip status={status} />
    </div>
  );
}
