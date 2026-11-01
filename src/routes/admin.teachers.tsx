
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
  BookOpen,
  Mail,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/teachers")({
  component: AdminTeachers,
});

type FacultyStatus = "Active" | "Inactive" | "Suspended";

type Teacher = {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  department: string;
  designation: string;
  subjects: string[];
  status: FacultyStatus;
};

const initialTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dr. Ananya Sharma",
    employeeId: "MITS-FAC-0241",
    email: "ananya.sharma@example.com",
    department: "Computer Science",
    designation: "Assistant Professor",
    subjects: ["Data Structures", "Algorithms"],
    status: "Active",
  },
  {
    id: "2",
    name: "Prof. Rajesh Verma",
    employeeId: "MITS-FAC-0242",
    email: "rajesh.verma@example.com",
    department: "Computer Science",
    designation: "Associate Professor",
    subjects: ["Database Management Systems", "SQL"],
    status: "Active",
  },
  {
    id: "3",
    name: "Dr. Neha Gupta",
    employeeId: "MITS-FAC-0243",
    email: "neha.gupta@example.com",
    department: "Electronics",
    designation: "Assistant Professor",
    subjects: ["Digital Electronics", "Microprocessors"],
    status: "Active",
  },
  {
    id: "4",
    name: "Prof. Amit Patel",
    employeeId: "MITS-FAC-0244",
    email: "amit.patel@example.com",
    department: "Mechanical",
    designation: "Professor",
    subjects: ["Thermodynamics", "Fluid Mechanics"],
    status: "Inactive",
  },
  {
    id: "5",
    name: "Dr. Kavita Joshi",
    employeeId: "MITS-FAC-0245",
    email: "kavita.joshi@example.com",
    department: "Information Technology",
    designation: "Assistant Professor",
    subjects: ["Computer Networks", "Cyber Security"],
    status: "Active",
  },
  {
    id: "6",
    name: "Dr. Rahul Singh",
    employeeId: "MITS-FAC-0246",
    email: "rahul.singh@example.com",
    department: "Computer Science",
    designation: "Professor",
    subjects: ["Operating Systems", "Computer Architecture"],
    status: "Suspended",
  },
  {
    id: "7",
    name: "Prof. Sneha Rao",
    employeeId: "MITS-FAC-0247",
    email: "sneha.rao@example.com",
    department: "Electronics",
    designation: "Associate Professor",
    subjects: ["Signals and Systems", "Communication Systems"],
    status: "Active",
  },
  {
    id: "8",
    name: "Dr. Vikram Mehta",
    employeeId: "MITS-FAC-0248",
    email: "vikram.mehta@example.com",
    department: "Mechanical",
    designation: "Assistant Professor",
    subjects: ["Manufacturing Technology"],
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

const designations = [
  "All designations",
  "Professor",
  "Associate Professor",
  "Assistant Professor",
];

const statuses = [
  "All",
  "Active",
  "Inactive",
  "Suspended",
] as const;

function AdminTeachers() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [designation, setDesignation] = useState("All designations");
  const [status, setStatus] =
    useState<(typeof statuses)[number]>("All");
  const [selectedTeacher, setSelectedTeacher] =
    useState<Teacher | null>(null);

  const activeCount = teachers.filter(
    (teacher) => teacher.status === "Active",
  ).length;

  const inactiveCount = teachers.filter(
    (teacher) => teacher.status === "Inactive",
  ).length;

  const suspendedCount = teachers.filter(
    (teacher) => teacher.status === "Suspended",
  ).length;

  const filteredTeachers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(query) ||
        teacher.employeeId.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.subjects.some((subject) =>
          subject.toLowerCase().includes(query),
        );

      const matchesDepartment =
        department === "All departments" ||
        teacher.department === department;

      const matchesDesignation =
        designation === "All designations" ||
        teacher.designation === designation;

      const matchesStatus =
        status === "All" || teacher.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesStatus
      );
    });
  }, [teachers, search, department, designation, status]);

  const toggleStatus = (id: string) => {
    setTeachers((current) =>
      current.map((teacher) =>
        teacher.id === id
          ? {
              ...teacher,
              status:
                teacher.status === "Active" ? "Inactive" : "Active",
            }
          : teacher,
      ),
    );

    setSelectedTeacher(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Management"
        description="Manage faculty accounts, academic affiliations, designations, and access status."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <GraduationCap className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Faculty directory</p>
            <p className="mt-1 text-xs text-muted-foreground">
              These are sample faculty records. Connect the admin API
              before using this page for institutional data.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Overview */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">Faculty overview</h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total faculty",
              value: teachers.length,
              icon: Users,
            },
            {
              label: "Active faculty",
              value: activeCount,
              icon: UserCheck,
            },
            {
              label: "Inactive faculty",
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

      {/* Filters and faculty list */}
      <SectionCard
        title="Faculty directory"
        description="Search and filter registered faculty accounts."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, ID, email or subject"
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
            value={designation}
            onChange={(event) => setDesignation(event.target.value)}
            className="h-10 border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          >
            {designations.map((item) => (
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

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Faculty member</th>
                <th className="px-3 py-3 font-medium">Employee ID</th>
                <th className="px-3 py-3 font-medium">Department</th>
                <th className="px-3 py-3 font-medium">Designation</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium">{teacher.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {teacher.email}
                    </p>
                  </td>

                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {teacher.employeeId}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {teacher.department}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {teacher.designation}
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={teacher.status} />
                  </td>

                  <td className="px-3 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" />
                      Details
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredTeachers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No faculty members match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Showing {filteredTeachers.length} of {teachers.length} faculty
          members.
        </div>
      </SectionCard>

      {/* Faculty details */}
      {selectedTeacher && (
        <SectionCard
          title="Faculty details"
          description="Demonstration faculty account information."
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedTeacher(null)}
            >
              Close
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Detail label="Full name" value={selectedTeacher.name} />
            <Detail label="Employee ID" value={selectedTeacher.employeeId} />
            <Detail label="Email" value={selectedTeacher.email} />
            <Detail label="Department" value={selectedTeacher.department} />
            <Detail label="Designation" value={selectedTeacher.designation} />
            <Detail label="Account status" value={selectedTeacher.status} />
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Assigned subjects</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTeacher.subjects.map((subject) => (
                <StatusChip key={subject} status={subject} />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button
              size="sm"
              variant={
                selectedTeacher.status === "Active"
                  ? "destructive"
                  : "default"
              }
              onClick={() => toggleStatus(selectedTeacher.id)}
              disabled={selectedTeacher.status === "Suspended"}
            >
              {selectedTeacher.status === "Active"
                ? "Deactivate account"
                : "Activate account"}
            </Button>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            This action changes only local demonstration state. Faculty
            account changes must be authorized and audited by the backend.
          </p>
        </SectionCard>
      )}

      {/* Integration notice */}
      <div className="border border-border p-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Faculty management integration</p>
        </div>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
          <li>Fetch faculty accounts from the institutional database.</li>
          <li>Associate faculty with departments and assigned subjects.</li>
          <li>Implement authorized faculty activation and suspension.</li>
          <li>Maintain an audit trail for administrative changes.</li>
          <li>Restrict faculty records to authorized administrators.</li>
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
