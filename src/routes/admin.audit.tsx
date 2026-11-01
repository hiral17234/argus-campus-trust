
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileClock,
  Download,
  Eye,
  X,
  UserRound,
  Clock3,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/audit")({
  component: AdminAudit,
});

type AuditStatus = "Success" | "Failed" | "Blocked";

type AuditSeverity = "Low" | "Medium" | "High" | "Critical";

type AuditCategory =
  | "Authentication"
  | "Student Management"
  | "Faculty Management"
  | "Academic Management"
  | "Security"
  | "Attendance"
  | "System";

type AuditRecord = {
  id: string;
  actor: string;
  role: string;
  action: string;
  category: AuditCategory;
  resource: string;
  timestamp: string;
  status: AuditStatus;
  severity: AuditSeverity;
  ipAddress: string;
  description: string;
};

const initialRecords: AuditRecord[] = [
  {
    id: "AUD-2026-001",
    actor: "Admin User",
    role: "Administrator",
    action: "LOGIN",
    category: "Authentication",
    resource: "Admin Portal",
    timestamp: "2026-11-05T09:02:00",
    status: "Success",
    severity: "Low",
    ipAddress: "192.0.2.10",
    description: "Administrator successfully signed in to the portal.",
  },
  {
    id: "AUD-2026-002",
    actor: "Admin User",
    role: "Administrator",
    action: "STUDENT_STATUS_UPDATED",
    category: "Student Management",
    resource: "MITS23CS063",
    timestamp: "2026-11-05T09:15:00",
    status: "Success",
    severity: "Medium",
    ipAddress: "192.0.2.10",
    description: "Student account status was updated.",
  },
  {
    id: "AUD-2026-003",
    actor: "Admin User",
    role: "Administrator",
    action: "FACULTY_CREATED",
    category: "Faculty Management",
    resource: "MITS-FAC-0249",
    timestamp: "2026-11-05T09:24:00",
    status: "Success",
    severity: "Medium",
    ipAddress: "192.0.2.10",
    description: "A new faculty account was created.",
  },
  {
    id: "AUD-2026-004",
    actor: "Dr. Ananya Sharma",
    role: "Teacher",
    action: "SESSION_STARTED",
    category: "Attendance",
    resource: "SES-2026-1105-001",
    timestamp: "2026-11-05T09:30:00",
    status: "Success",
    severity: "Low",
    ipAddress: "192.0.2.21",
    description: "An attendance session was started.",
  },
  {
    id: "AUD-2026-005",
    actor: "Unknown Actor",
    role: "Unauthenticated",
    action: "LOGIN_FAILED",
    category: "Authentication",
    resource: "Admin Portal",
    timestamp: "2026-11-05T09:36:00",
    status: "Failed",
    severity: "High",
    ipAddress: "192.0.2.99",
    description: "An unsuccessful authentication attempt was recorded.",
  },
  {
    id: "AUD-2026-006",
    actor: "Security Service",
    role: "System",
    action: "VERIFICATION_FLAGGED",
    category: "Security",
    resource: "VER-003",
    timestamp: "2026-11-05T09:42:00",
    status: "Success",
    severity: "High",
    ipAddress: "192.0.2.30",
    description: "A verification attempt was flagged for additional review.",
  },
  {
    id: "AUD-2026-007",
    actor: "Admin User",
    role: "Administrator",
    action: "SUBJECT_CREATED",
    category: "Academic Management",
    resource: "CS305",
    timestamp: "2026-11-05T10:05:00",
    status: "Success",
    severity: "Medium",
    ipAddress: "192.0.2.10",
    description: "A new academic subject was created.",
  },
  {
    id: "AUD-2026-008",
    actor: "Unknown Actor",
    role: "Unauthenticated",
    action: "UNAUTHORIZED_ACCESS",
    category: "Security",
    resource: "Admin API",
    timestamp: "2026-11-05T10:12:00",
    status: "Blocked",
    severity: "Critical",
    ipAddress: "192.0.2.99",
    description: "An unauthorized request to a protected resource was blocked.",
  },
  {
    id: "AUD-2026-009",
    actor: "Admin User",
    role: "Administrator",
    action: "DEPARTMENT_UPDATED",
    category: "Academic Management",
    resource: "CSE",
    timestamp: "2026-11-05T10:25:00",
    status: "Success",
    severity: "Medium",
    ipAddress: "192.0.2.10",
    description: "Department information was updated.",
  },
  {
    id: "AUD-2026-010",
    actor: "System",
    role: "System",
    action: "BACKUP_COMPLETED",
    category: "System",
    resource: "Database",
    timestamp: "2026-11-05T11:00:00",
    status: "Success",
    severity: "Low",
    ipAddress: "192.0.2.1",
    description: "A demonstration database backup event was recorded.",
  },
];

const categories = [
  "All",
  "Authentication",
  "Student Management",
  "Faculty Management",
  "Academic Management",
  "Security",
  "Attendance",
  "System",
] as const;

const statuses = ["All", "Success", "Failed", "Blocked"] as const;

const severities = [
  "All",
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function AdminAudit() {
  const [records] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("All");
  const [status, setStatus] =
    useState<(typeof statuses)[number]>("All");
  const [severity, setSeverity] =
    useState<(typeof severities)[number]>("All");
  const [selectedRecord, setSelectedRecord] =
    useState<AuditRecord | null>(null);

  const successCount = records.filter(
    (record) => record.status === "Success",
  ).length;

  const failedCount = records.filter(
    (record) => record.status === "Failed",
  ).length;

  const blockedCount = records.filter(
    (record) => record.status === "Blocked",
  ).length;

  const securityCount = records.filter(
    (record) => record.category === "Security",
  ).length;

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    return records.filter((record) => {
      const matchesSearch =
        record.id.toLowerCase().includes(query) ||
        record.actor.toLowerCase().includes(query) ||
        record.action.toLowerCase().includes(query) ||
        record.resource.toLowerCase().includes(query) ||
        record.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || record.category === category;

      const matchesStatus =
        status === "All" || record.status === status;

      const matchesSeverity =
        severity === "All" || record.severity === severity;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesSeverity
      );
    });
  }, [records, search, category, status, severity]);

  const exportCSV = () => {
    const headers = [
      "Event ID",
      "Actor",
      "Role",
      "Action",
      "Category",
      "Resource",
      "Timestamp",
      "Status",
      "Severity",
      "IP Address",
      "Description",
    ];

    const rows = filteredRecords.map((record) => [
      record.id,
      record.actor,
      record.role,
      record.action,
      record.category,
      record.resource,
      record.timestamp,
      record.status,
      record.severity,
      record.ipAddress,
      record.description,
    ]);

    const escapeCSV = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "argus-audit-logs-demo.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Review administrative actions, authentication events, system activity, and security-related records."
      />

      {/* Demo notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <FileClock className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Administrative activity log
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              These records are illustrative. Production audit events
              must be generated and stored by the backend.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Summary */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Activity overview
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total events",
              value: records.length,
              icon: Activity,
            },
            {
              label: "Successful actions",
              value: successCount,
              icon: ShieldCheck,
            },
            {
              label: "Failed actions",
              value: failedCount,
              icon: ShieldAlert,
            },
            {
              label: "Security events",
              value: securityCount,
              icon: AlertTriangle,
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

      {/* Status overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-border p-4">
          <p className="text-xs text-muted-foreground">
            Successful events
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {successCount}
          </p>
        </div>

        <div className="border border-border p-4">
          <p className="text-xs text-muted-foreground">
            Failed events
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {failedCount}
          </p>
        </div>

        <div className="border border-border p-4">
          <p className="text-xs text-muted-foreground">
            Blocked events
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {blockedCount}
          </p>
        </div>
      </div>

      {/* Audit table */}
      <SectionCard
        title="Activity records"
        description="Search and filter the recorded administrative and system events."
        action={
          <Button size="sm" variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search event, actor or resource"
              className="pl-9"
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as (typeof categories)[number])
            }
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All categories" : item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as (typeof statuses)[number])
            }
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All statuses" : item}
              </option>
            ))}
          </select>

          <select
            value={severity}
            onChange={(event) =>
              setSeverity(event.target.value as (typeof severities)[number])
            }
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            {severities.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All severities" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Event</th>
                <th className="px-3 py-3 font-medium">Actor</th>
                <th className="px-3 py-3 font-medium">Action</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Timestamp</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Severity</th>
                <th className="px-3 py-3 font-medium">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-3 py-3 text-xs font-medium">
                    {record.id}
                  </td>

                  <td className="px-3 py-3">
                    <p className="text-sm font-medium">{record.actor}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {record.role}
                    </p>
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {record.action}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {record.category}
                  </td>

                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {formatTimestamp(record.timestamp)}
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={record.status} />
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={record.severity} />
                  </td>

                  <td className="px-3 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No audit events match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Showing {filteredRecords.length} of {records.length} demonstration events.
        </div>
      </SectionCard>

      {/* Audit details */}
      {selectedRecord && (
        <SectionCard
          title="Audit event details"
          description={`Event ${selectedRecord.id}`}
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
            <Detail label="Event ID" value={selectedRecord.id} />
            <Detail label="Actor" value={selectedRecord.actor} />
            <Detail label="Role" value={selectedRecord.role} />
            <Detail label="Action" value={selectedRecord.action} />
            <Detail label="Category" value={selectedRecord.category} />
            <Detail label="Resource" value={selectedRecord.resource} />
            <Detail
              label="Timestamp"
              value={formatTimestamp(selectedRecord.timestamp)}
            />
            <Detail label="Status" value={selectedRecord.status} />
            <Detail label="Severity" value={selectedRecord.severity} />
            <Detail label="IP address" value={selectedRecord.ipAddress} />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Event description
            </p>
            <p className="mt-2 text-sm">
              {selectedRecord.description}
            </p>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            This is an illustrative audit record. Real records should
            include server-generated timestamps, authenticated actor IDs,
            request correlation IDs, and immutable event history.
          </p>
        </SectionCard>
      )}

      {/* Audit architecture */}
      <SectionCard
        title="Audit system requirements"
        description="Recommended production controls for the ARGUS audit service."
      >
        <div className="divide-y divide-border">
          <RequirementRow
            icon={UserRound}
            title="Actor attribution"
            description="Record the authenticated user or system service responsible for each action."
          />
          <RequirementRow
            icon={Clock3}
            title="Server-side timestamps"
            description="Generate timestamps on the backend using a consistent timezone strategy."
          />
          <RequirementRow
            icon={ShieldCheck}
            title="Immutable audit records"
            description="Prevent ordinary users and administrators from editing or deleting audit events."
          />
          <RequirementRow
            icon={ShieldAlert}
            title="Security event tracking"
            description="Record authentication failures, permission denials, and verification anomalies."
          />
        </div>
      </SectionCard>
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

function RequirementRow({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Activity;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
