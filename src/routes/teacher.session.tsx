import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Monitor,
  Plus,
  Search,
  Users,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/teacher/session")({
  component: TeacherSessions,
});

type SessionStatus = "Live" | "Upcoming" | "Completed" | "Cancelled";

type TeachingSession = {
  id: string;
  subject: string;
  code: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  enrolled: number;
  present: number;
  absent: number;
  status: SessionStatus;
  methods: string[];
};

const initialSessions: TeachingSession[] = [
  {
    id: "SES-2026-1105-001",
    subject: "Data Structures and Algorithms",
    code: "CS301",
    date: "2026-11-05",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    room: "Lecture Hall 204",
    enrolled: 48,
    present: 32,
    absent: 0,
    status: "Live",
    methods: ["Face", "QR", "Code"],
  },
  {
    id: "SES-2026-1105-002",
    subject: "Database Management Systems",
    code: "CS302",
    date: "2026-11-05",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    room: "Lab 03",
    enrolled: 42,
    present: 0,
    absent: 0,
    status: "Upcoming",
    methods: ["Face", "QR", "Code"],
  },
  {
    id: "SES-2026-1105-003",
    subject: "Operating Systems",
    code: "CS303",
    date: "2026-11-05",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    room: "Lecture Hall 105",
    enrolled: 45,
    present: 0,
    absent: 0,
    status: "Upcoming",
    methods: ["Face", "QR"],
  },
  {
    id: "SES-2026-1104-001",
    subject: "Data Structures and Algorithms",
    code: "CS301",
    date: "2026-11-04",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    room: "Lecture Hall 204",
    enrolled: 48,
    present: 44,
    absent: 4,
    status: "Completed",
    methods: ["Face", "QR", "Code"],
  },
  {
    id: "SES-2026-1104-002",
    subject: "Database Management Systems",
    code: "CS302",
    date: "2026-11-04",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    room: "Lab 03",
    enrolled: 42,
    present: 38,
    absent: 4,
    status: "Completed",
    methods: ["Face", "QR"],
  },
  {
    id: "SES-2026-1103-001",
    subject: "Computer Networks",
    code: "CS304",
    date: "2026-11-03",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    room: "Lecture Hall 301",
    enrolled: 40,
    present: 36,
    absent: 4,
    status: "Completed",
    methods: ["Face", "Code"],
  },
  {
    id: "SES-2026-1103-002",
    subject: "Operating Systems",
    code: "CS303",
    date: "2026-11-03",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    room: "Lecture Hall 105",
    enrolled: 45,
    present: 0,
    absent: 0,
    status: "Cancelled",
    methods: ["Face", "QR"],
  },
];

const statusFilters = [
  "All",
  "Live",
  "Upcoming",
  "Completed",
  "Cancelled",
] as const;

type StatusFilter = (typeof statusFilters)[number];

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TeacherSessions() {
  const [sessions, setSessions] = useState(initialSessions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");
  const [selectedSession, setSelectedSession] =
    useState<string | null>(null);

  const liveCount = sessions.filter(
    (session) => session.status === "Live",
  ).length;

  const upcomingCount = sessions.filter(
    (session) => session.status === "Upcoming",
  ).length;

  const completedCount = sessions.filter(
    (session) => session.status === "Completed",
  ).length;

  const totalStudents = sessions
    .filter((session) => session.status !== "Cancelled")
    .reduce((sum, session) => sum + session.enrolled, 0);

  const filteredSessions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return sessions.filter((session) => {
      const matchesSearch =
        session.subject.toLowerCase().includes(query) ||
        session.code.toLowerCase().includes(query) ||
        session.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, search, statusFilter]);

  const selected = sessions.find(
    (session) => session.id === selectedSession,
  );

  const handleEndSession = (sessionId: string) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? { ...session, status: "Completed" }
          : session,
      ),
    );

    setSelectedSession(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Session Management"
        description="Manage attendance sessions, monitor active classes, and review completed sessions."
      />

      {/* Demo notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Demonstration session records
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Session data and status changes are local. No institutional
              attendance session is created or modified.
            </p>
          </div>
        </div>

        <StatusChip status="Demo data" />
      </div>

      {/* Summary */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold">Session overview</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Summary of the demonstration session list.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Live sessions",
              value: liveCount,
              icon: Activity,
            },
            {
              label: "Upcoming sessions",
              value: upcomingCount,
              icon: CalendarDays,
            },
            {
              label: "Completed sessions",
              value: completedCount,
              icon: CheckCircle2,
            },
            {
              label: "Enrolled seats",
              value: totalStudents,
              icon: Users,
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

      {/* Active sessions */}
      <SectionCard
        title="Active attendance sessions"
        description="Sessions currently accepting attendance in the demonstration environment."
      >
        {sessions.filter((session) => session.status === "Live").length >
        0 ? (
          sessions
            .filter((session) => session.status === "Live")
            .map((session) => (
              <div
                key={session.id}
                className="border border-border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">
                        {session.subject}
                      </h3>
                      <StatusChip status="Live demo" />
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {session.code} · {session.id}
                    </p>
                  </div>

                  <Button size="sm" asChild>
                    <Link to="/teacher/live">
                      <Activity className="mr-2 h-4 w-4" />
                      Monitor attendance
                    </Link>
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-3.5 w-3.5" />
                    {session.startTime} – {session.endTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {session.room}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    {session.present} / {session.enrolled} recorded
                  </span>
                </div>
              </div>
            ))
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No active sessions in the demonstration list.
          </p>
        )}
      </SectionCard>

      {/* Session list */}
      <SectionCard
        title="All sessions"
        description="Search and filter your scheduled and previous sessions."
      >
        <div className="space-y-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search subject, code or session ID"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {statusFilters.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={
                  statusFilter === status ? "default" : "outline"
                }
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 divide-y divide-border">
          {filteredSessions.map((session) => {
            const attendancePercentage =
              session.enrolled > 0
                ? Math.round(
                    (session.present / session.enrolled) * 100,
                  )
                : 0;

            const isExpanded = selectedSession === session.id;

            return (
              <div key={session.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">
                        {session.subject}
                      </p>
                      <StatusChip status={session.status} />
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {session.code} · {session.id}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(session.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-3 w-3" />
                        {session.startTime} – {session.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.room}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setSelectedSession(
                          isExpanded ? null : session.id,
                        )
                      }
                    >
                      {isExpanded ? "Hide details" : "View details"}
                    </Button>

                    {session.status === "Live" && (
                      <Button size="sm" asChild>
                        <Link to="/teacher/live">
                          Monitor
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Enrolled students
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {session.enrolled}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Present
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {session.present}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Absent
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {session.absent}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Recorded attendance
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {attendancePercentage}%
                      </p>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4">
                      <p className="text-xs text-muted-foreground">
                        Supported verification methods
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {session.methods.map((method) => (
                          <StatusChip
                            key={method}
                            status={method}
                          />
                        ))}
                      </div>
                    </div>

                    {session.status === "Live" && (
                      <div className="sm:col-span-2 lg:col-span-4">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleEndSession(session.id)}
                        >
                          End demo session
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">
                          This only changes the local demonstration status.
                        </p>
                      </div>
                    )}

                    {session.status === "Completed" && (
                      <div className="sm:col-span-2 lg:col-span-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/teacher/history">
                            View attendance history
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className="py-10 text-center">
              <CalendarDays className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">
                No sessions found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Change the search term or selected status.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Showing {filteredSessions.length} of {sessions.length} demonstration
          sessions.
        </div>
      </SectionCard>

      {/* Session creation placeholder */}
      <SectionCard
        title="Create a new session"
        description="Session scheduling will be connected to the backend."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">
              Schedule an attendance session
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Session creation requires an assigned subject, schedule,
              classroom, and enrolled student list.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled
          >
            <Plus className="mr-2 h-4 w-4" />
            Create session
          </Button>
        </div>
      </SectionCard>

      <div className="border border-border p-4">
        <p className="text-sm font-medium">
          Backend integration requirements
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
          <li>
            Fetch sessions belonging only to the authenticated teacher.
          </li>
          <li>
            Create sessions using an assigned subject and authorized schedule.
          </li>
          <li>
            Receive live attendance events from the verification service.
          </li>
          <li>
            End sessions through an authorized API and preserve audit logs.
          </li>
          <li>
            Load historical attendance from the institutional database.
          </li>
        </ul>
      </div>
    </div>
  );
}
