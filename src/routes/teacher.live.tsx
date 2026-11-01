import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  Monitor,
  Search,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/teacher/live")({
  component: TeacherLive,
});

type AttendanceStatus = "Present" | "Late" | "Absent" | "Pending";

type StudentRecord = {
  id: string;
  name: string;
  rollNumber: string;
  verificationMethod: string;
  verificationTime: string;
  status: AttendanceStatus;
  risk: "Low" | "Medium" | "High";
};

const initialStudents: StudentRecord[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    rollNumber: "MITS23CS041",
    verificationMethod: "Face verification",
    verificationTime: "09:02 AM",
    status: "Present",
    risk: "Low",
  },
  {
    id: "2",
    name: "Priya Verma",
    rollNumber: "MITS23CS056",
    verificationMethod: "QR verification",
    verificationTime: "09:04 AM",
    status: "Present",
    risk: "Low",
  },
  {
    id: "3",
    name: "Rohan Gupta",
    rollNumber: "MITS23CS063",
    verificationMethod: "Attendance code",
    verificationTime: "09:12 AM",
    status: "Late",
    risk: "Medium",
  },
  {
    id: "4",
    name: "Ananya Singh",
    rollNumber: "MITS23CS072",
    verificationMethod: "Face verification",
    verificationTime: "09:05 AM",
    status: "Present",
    risk: "Low",
  },
  {
    id: "5",
    name: "Karan Patel",
    rollNumber: "MITS23CS084",
    verificationMethod: "Not verified",
    verificationTime: "—",
    status: "Pending",
    risk: "—" as "Low",
  },
  {
    id: "6",
    name: "Meera Joshi",
    rollNumber: "MITS23CS091",
    verificationMethod: "Not verified",
    verificationTime: "—",
    status: "Pending",
    risk: "—" as "Low",
  },
  {
    id: "7",
    name: "Dev Malhotra",
    rollNumber: "MITS23CS102",
    verificationMethod: "Face verification",
    verificationTime: "09:03 AM",
    status: "Present",
    risk: "High",
  },
  {
    id: "8",
    name: "Ishita Rao",
    rollNumber: "MITS23CS118",
    verificationMethod: "QR verification",
    verificationTime: "09:15 AM",
    status: "Late",
    risk: "Medium",
  },
];

const filters = ["All", "Present", "Late", "Absent", "Pending"] as const;

function TeacherLive() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All");

  const [sessionActive, setSessionActive] = useState(true);

  const presentCount = students.filter(
    (student) => student.status === "Present",
  ).length;

  const lateCount = students.filter(
    (student) => student.status === "Late",
  ).length;

  const absentCount = students.filter(
    (student) => student.status === "Absent",
  ).length;

  const pendingCount = students.filter(
    (student) => student.status === "Pending",
  ).length;

  const attendancePercentage =
    students.length > 0
      ? Math.round(
          ((presentCount + lateCount) / students.length) * 100,
        )
      : 0;

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.rollNumber.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || student.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter]);

  const updateStudentStatus = (
    studentId: string,
    status: AttendanceStatus,
  ) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId
          ? { ...student, status }
          : student,
      ),
    );
  };

  const exportRecords = () => {
    const headers = [
      "Student Name",
      "Roll Number",
      "Verification Method",
      "Verification Time",
      "Attendance Status",
      "Risk Level",
    ];

    const rows = filteredStudents.map((student) => [
      student.name,
      student.rollNumber,
      student.verificationMethod,
      student.verificationTime,
      student.status,
      student.risk,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "argus-live-attendance-demo.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Attendance"
        description="Monitor an active attendance session and review student verification activity."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/teacher">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        <StatusChip status="Demo session" />
      </div>

      {/* Session details */}
      <SectionCard
        title="Session information"
        description="Current demonstration attendance session."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Subject</p>
            <p className="mt-1 text-sm font-semibold">
              Data Structures and Algorithms
            </p>
            <p className="mt-1 text-xs text-muted-foreground">CS301</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Session ID</p>
            <p className="mt-1 text-sm font-semibold">
              SES-2026-1105-001
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Schedule</p>
            <p className="mt-1 text-sm font-semibold">
              09:00 AM – 10:00 AM
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Lecture Hall 204
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Session status</p>
            <div className="mt-2">
              <StatusChip status={sessionActive ? "Active demo" : "Ended demo"} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Demo notice */}
      <div className="flex items-start gap-3 border border-border bg-muted/20 p-4">
        <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            Demonstration mode
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Attendance records and session controls on this page are local
            frontend demonstrations. They do not update the institutional
            attendance database or communicate with student devices.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold">Attendance overview</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Based on the demonstration student list.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Present",
              value: presentCount,
              icon: CheckCircle2,
            },
            {
              label: "Late",
              value: lateCount,
              icon: Clock3,
            },
            {
              label: "Absent",
              value: absentCount,
              icon: XCircle,
            },
            {
              label: "Pending",
              value: pendingCount,
              icon: Users,
            },
          ].map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-3 text-2xl font-semibold tabular-nums">
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Attendance progress */}
      <SectionCard
        title="Attendance progress"
        description="Percentage of students marked present or late."
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-semibold tabular-nums">
              {attendancePercentage}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {presentCount + lateCount} of {students.length} students
              recorded
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            {pendingCount} students awaiting a status
          </p>
        </div>

        <div className="mt-4 h-2 w-full bg-muted">
          <div
            className="h-2 bg-foreground transition-all"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </SectionCard>

      {/* Student attendance list */}
      <SectionCard
        title="Student attendance records"
        description="Search, filter, and review the demonstration records."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={exportRecords}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student or roll number"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {filters.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={filter === item ? "default" : "outline"}
                onClick={() => setFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Verification</th>
                <th className="px-3 py-3 font-medium">Time</th>
                <th className="px-3 py-3 font-medium">Risk</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Demo action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium">{student.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {student.rollNumber}
                    </p>
                  </td>

                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {student.verificationMethod}
                  </td>

                  <td className="px-3 py-3 text-xs tabular-nums text-muted-foreground">
                    {student.verificationTime}
                  </td>

                  <td className="px-3 py-3">
                    {student.risk === "—" ? (
                      <span className="text-xs text-muted-foreground">
                        Not assessed
                      </span>
                    ) : (
                      <StatusChip status={`${student.risk} risk`} />
                    )}
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={student.status} />
                  </td>

                  <td className="px-3 py-3">
                    {student.status === "Pending" ? (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateStudentStatus(student.id, "Present")
                          }
                        >
                          Mark present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateStudentStatus(student.id, "Absent")
                          }
                        >
                          Absent
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No action
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No student records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          Showing {filteredStudents.length} of {students.length} demonstration
          records.
        </div>
      </SectionCard>

      {/* Session controls */}
      <SectionCard
        title="Session controls"
        description="Local demonstration controls only."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">
              {sessionActive ? "Attendance session is active" : "Attendance session ended"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ending the demo session only changes this page's local state.
            </p>
          </div>

          <Button
            variant={sessionActive ? "destructive" : "outline"}
            onClick={() => setSessionActive((current) => !current)}
          >
            {sessionActive ? "End demo session" : "Reopen demo session"}
          </Button>
        </div>
      </SectionCard>

      {/* Risk notice */}
      <div className="flex items-start gap-3 border border-border p-4">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Risk assessment is illustrative</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Risk labels are sample values. ARGUS must receive risk scores and
            verification decisions from the backend risk engine. A teacher
            should not treat these labels as verified fraud findings.
          </p>
        </div>
      </div>
    </div>
  );
}
