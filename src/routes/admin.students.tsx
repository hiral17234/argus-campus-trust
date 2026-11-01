
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  GraduationCap,
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Eye,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

type StudentStatus = "Active" | "Inactive" | "Suspended";

type Student = {
  id: string;
  name: string;
  enrollment: string;
  email: string;
  department: string;
  semester: number;
  status: StudentStatus;
};

const initialStudents: Student[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    enrollment: "MITS23CS041",
    email: "aarav.sharma@example.com",
    department: "Computer Science",
    semester: 5,
    status: "Active",
  },
  {
    id: "2",
    name: "Priya Verma",
    enrollment: "MITS23CS056",
    email: "priya.verma@example.com",
    department: "Computer Science",
    semester: 5,
    status: "Active",
  },
  {
    id: "3",
    name: "Rohan Gupta",
    enrollment: "MITS23CS063",
    email: "rohan.gupta@example.com",
    department: "Computer Science",
    semester: 5,
    status: "Inactive",
  },
  {
    id: "4",
    name: "Ananya Singh",
    enrollment: "MITS23EC072",
    email: "ananya.singh@example.com",
    department: "Electronics",
    semester: 3,
    status: "Active",
  },
  {
    id: "5",
    name: "Karan Patel",
    enrollment: "MITS23ME084",
    email: "karan.patel@example.com",
    department: "Mechanical",
    semester: 5,
    status: "Suspended",
  },
  {
    id: "6",
    name: "Meera Joshi",
    enrollment: "MITS23IT091",
    email: "meera.joshi@example.com",
    department: "Information Technology",
    semester: 3,
    status: "Active",
  },
  {
    id: "7",
    name: "Dev Malhotra",
    enrollment: "MITS23CS102",
    email: "dev.malhotra@example.com",
    department: "Computer Science",
    semester: 5,
    status: "Active",
  },
  {
    id: "8",
    name: "Ishita Rao",
    enrollment: "MITS23EC118",
    email: "ishita.rao@example.com",
    department: "Electronics",
    semester: 3,
    status: "Inactive",
  },
];

const departments = [
  "All departments",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Information Technology",
];

const statuses = [
  "All",
  "Active",
  "Inactive",
  "Suspended",
] as const;

function AdminStudents() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] =
    useState<(typeof statuses)[number]>("All");
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const activeCount = students.filter(
    (student) => student.status === "Active",
  ).length;

  const inactiveCount = students.filter(
    (student) => student.status === "Inactive",
  ).length;

  const suspendedCount = students.filter(
    (student) => student.status === "Suspended",
  ).length;

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.enrollment.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All departments" ||
        student.department === department;

      const matchesStatus =
        status === "All" || student.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [students, search, department, status]);

  const toggleStatus = (id: string) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === id
          ? {
              ...student,
              status:
                student.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : student,
      ),
    );

    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        description="Manage student accounts, enrollment information, departments, and access status."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <GraduationCap className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Student directory</p>
            <p className="mt-1 text-xs text-muted-foreground">
              These are sample records. Connect the admin API before
              using this page for institutional data.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Summary */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Student overview
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total students",
              value: students.length,
              icon: Users,
            },
            {
              label: "Active accounts",
              value: activeCount,
              icon: UserCheck,
            },
            {
              label: "Inactive accounts",
              value: inactiveCount,
              icon: UserX,
            },
            {
              label: "Suspended accounts",
              value: suspendedCount,
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

      {/* Filters */}
      <SectionCard
        title="Student directory"
        description="Search and filter registered student accounts."
      >
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, enrollment or email"
              className="pl-9"
            />
          </div>

          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="h-10 border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as (typeof statuses)[number])
            }
            className="h-10 border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All statuses" : item}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Enrollment</th>
                <th className="px-3 py-3 font-medium">Department</th>
                <th className="px-3 py-3 font-medium">Semester</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium">{student.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {student.email}
                    </p>
                  </td>

                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {student.enrollment}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {student.department}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {student.semester}
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={student.status} />
                  </td>

                  <td className="px-3 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" />
                      Details
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No students match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Showing {filteredStudents.length} of {students.length} students.
        </div>
      </SectionCard>

      {/* Student details */}
      {selectedStudent && (
        <SectionCard
          title="Student details"
          description="Demonstration student account information."
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Detail label="Full name" value={selectedStudent.name} />
            <Detail label="Enrollment number" value={selectedStudent.enrollment} />
            <Detail label="Email" value={selectedStudent.email} />
            <Detail label="Department" value={selectedStudent.department} />
            <Detail label="Semester" value={String(selectedStudent.semester)} />
            <Detail label="Account status" value={selectedStudent.status} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button
              size="sm"
              variant={
                selectedStudent.status === "Active"
                  ? "destructive"
                  : "default"
              }
              onClick={() => toggleStatus(selectedStudent.id)}
              disabled={selectedStudent.status === "Suspended"}
            >
              {selectedStudent.status === "Active"
                ? "Deactivate account"
                : "Activate account"}
            </Button>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            This action changes only local demonstration state. Account
            status changes must be authorized and audited by the backend.
          </p>
        </SectionCard>
      )}
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
