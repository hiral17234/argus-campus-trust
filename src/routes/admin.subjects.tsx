
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  BookOpen,
  Search,
  GraduationCap,
  Users,
  UserCheck,
  Plus,
  Pencil,
  Eye,
  X,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/subjects")({
  component: AdminSubjects,
});

type SubjectStatus = "Active" | "Inactive";

type Subject = {
  id: string;
  name: string;
  code: string;
  department: string;
  semester: number;
  credits: number;
  faculty: string;
  enrolledStudents: number;
  status: SubjectStatus;
};

const initialSubjects: Subject[] = [
  {
    id: "1",
    name: "Data Structures and Algorithms",
    code: "CS301",
    department: "Computer Science",
    semester: 5,
    credits: 4,
    faculty: "Dr. Ananya Sharma",
    enrolledStudents: 48,
    status: "Active",
  },
  {
    id: "2",
    name: "Database Management Systems",
    code: "CS302",
    department: "Computer Science",
    semester: 5,
    credits: 4,
    faculty: "Prof. Rajesh Verma",
    enrolledStudents: 42,
    status: "Active",
  },
  {
    id: "3",
    name: "Operating Systems",
    code: "CS303",
    department: "Computer Science",
    semester: 5,
    credits: 3,
    faculty: "Dr. Rahul Singh",
    enrolledStudents: 45,
    status: "Active",
  },
  {
    id: "4",
    name: "Computer Networks",
    code: "CS304",
    department: "Computer Science",
    semester: 5,
    credits: 3,
    faculty: "Dr. Kavita Joshi",
    enrolledStudents: 40,
    status: "Active",
  },
  {
    id: "5",
    name: "Digital Electronics",
    code: "EC201",
    department: "Electronics",
    semester: 3,
    credits: 4,
    faculty: "Dr. Neha Gupta",
    enrolledStudents: 38,
    status: "Active",
  },
  {
    id: "6",
    name: "Microprocessors",
    code: "EC202",
    department: "Electronics",
    semester: 3,
    credits: 3,
    faculty: "Prof. Sneha Rao",
    enrolledStudents: 36,
    status: "Active",
  },
  {
    id: "7",
    name: "Thermodynamics",
    code: "ME301",
    department: "Mechanical",
    semester: 5,
    credits: 4,
    faculty: "Prof. Amit Patel",
    enrolledStudents: 35,
    status: "Inactive",
  },
  {
    id: "8",
    name: "Computer Architecture",
    code: "CS401",
    department: "Computer Science",
    semester: 7,
    credits: 3,
    faculty: "Dr. Rahul Singh",
    enrolledStudents: 32,
    status: "Active",
  },
];

const departments = [
  "All departments",
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Information Technology",
];

const emptySubject: Omit<Subject, "id"> = {
  name: "",
  code: "",
  department: "Computer Science",
  semester: 1,
  credits: 3,
  faculty: "",
  enrolledStudents: 0,
  status: "Active",
};

function AdminSubjects() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All departments");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] =
    useState<Subject | null>(null);

  const [form, setForm] = useState(emptySubject);
  const [error, setError] = useState("");

  const activeCount = subjects.filter(
    (subject) => subject.status === "Active",
  ).length;

  const inactiveCount = subjects.filter(
    (subject) => subject.status === "Inactive",
  ).length;

  const totalStudents = subjects.reduce(
    (sum, subject) => sum + subject.enrolledStudents,
    0,
  );

  const assignedFaculty = new Set(
    subjects
      .filter((subject) => subject.status === "Active")
      .map((subject) => subject.faculty)
      .filter(Boolean),
  ).size;

  const filteredSubjects = useMemo(() => {
    const query = search.toLowerCase().trim();

    return subjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query) ||
        subject.faculty.toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === "All departments" ||
        subject.department === departmentFilter;

      const matchesSemester =
        semesterFilter === "All" ||
        subject.semester === Number(semesterFilter);

      const matchesStatus =
        statusFilter === "All" ||
        subject.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSemester &&
        matchesStatus
      );
    });
  }, [
    subjects,
    search,
    departmentFilter,
    semesterFilter,
    statusFilter,
  ]);

  const updateForm = (
    field: keyof Omit<Subject, "id">,
    value: string | number,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const openAddForm = () => {
    setForm(emptySubject);
    setEditingId(null);
    setSelectedSubject(null);
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (subject: Subject) => {
    const { id, ...subjectData } = subject;
    setForm(subjectData);
    setEditingId(id);
    setSelectedSubject(null);
    setError("");
    setFormOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.code.trim() ||
      !form.faculty.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      subjects.some(
        (subject) =>
          subject.code.toLowerCase() === form.code.trim().toLowerCase() &&
          subject.id !== editingId,
      )
    ) {
      setError("A subject with this code already exists.");
      return;
    }

    if (form.semester < 1 || form.semester > 8) {
      setError("Semester must be between 1 and 8.");
      return;
    }

    if (form.credits < 1 || form.credits > 10) {
      setError("Credits must be between 1 and 10.");
      return;
    }

    if (form.enrolledStudents < 0) {
      setError("Student count cannot be negative.");
      return;
    }

    if (editingId) {
      setSubjects((current) =>
        current.map((subject) =>
          subject.id === editingId
            ? { ...form, id: editingId }
            : subject,
        ),
      );
    } else {
      setSubjects((current) => [
        ...current,
        {
          ...form,
          id: `SUB-${Date.now()}`,
        },
      ]);
    }

    setFormOpen(false);
    setEditingId(null);
    setError("");
  };

  const toggleStatus = (id: string) => {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === id
          ? {
              ...subject,
              status:
                subject.status === "Active" ? "Inactive" : "Active",
            }
          : subject,
      ),
    );

    setSelectedSubject(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subject Management"
        description="Manage academic subjects, department associations, semester allocation, and faculty assignments."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Academic subject directory</p>
            <p className="mt-1 text-xs text-muted-foreground">
              These are sample records. Changes are stored in local
              frontend state only.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Summary */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Subject overview
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total subjects",
              value: subjects.length,
              icon: BookOpen,
            },
            {
              label: "Active subjects",
              value: activeCount,
              icon: GraduationCap,
            },
            {
              label: "Inactive subjects",
              value: inactiveCount,
              icon: UserCheck,
            },
            {
              label: "Assigned faculty",
              value: assignedFaculty,
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

      {/* Subject directory */}
      <SectionCard
        title="Subject directory"
        description="Search and filter academic subjects."
        action={
          <Button size="sm" onClick={openAddForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add subject
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, code or faculty"
              className="pl-9"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(event.target.value)
            }
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={semesterFilter}
            onChange={(event) => setSemesterFilter(event.target.value)}
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            <option value="All">All semesters</option>
            {Array.from({ length: 8 }, (_, index) => index + 1).map(
              (semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ),
            )}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Subject</th>
                <th className="px-3 py-3 font-medium">Code</th>
                <th className="px-3 py-3 font-medium">Department</th>
                <th className="px-3 py-3 font-medium">Semester</th>
                <th className="px-3 py-3 font-medium">Faculty</th>
                <th className="px-3 py-3 font-medium">Students</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-3 py-3 font-medium">
                    {subject.name}
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {subject.code}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {subject.department}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {subject.semester}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {subject.faculty}
                  </td>
                  <td className="px-3 py-3 tabular-nums">
                    {subject.enrolledStudents}
                  </td>
                  <td className="px-3 py-3">
                    <StatusChip status={subject.status} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditForm(subject)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSubjects.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No subjects match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Showing {filteredSubjects.length} of {subjects.length} subjects.
        </div>
      </SectionCard>

      {/* Add/Edit form */}
      {formOpen && (
        <SectionCard
          title={editingId ? "Edit subject" : "Add subject"}
          description="Enter the academic subject information."
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setFormOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Subject name"
                value={form.name}
                onChange={(value) => updateForm("name", value)}
                placeholder="Subject name"
              />

              <FormField
                label="Subject code"
                value={form.code}
                onChange={(value) =>
                  updateForm("code", value.toUpperCase())
                }
                placeholder="e.g. CS301"
              />

              <div className="space-y-2">
                <Label>Department</Label>
                <select
                  value={form.department}
                  onChange={(event) =>
                    updateForm("department", event.target.value)
                  }
                  className="h-10 w-full border border-input bg-background px-3 text-sm"
                >
                  {departments
                    .filter((item) => item !== "All departments")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>

              <FormField
                label="Assigned faculty"
                value={form.faculty}
                onChange={(value) => updateForm("faculty", value)}
                placeholder="Faculty name"
              />

              <FormField
                label="Semester"
                type="number"
                value={String(form.semester)}
                onChange={(value) =>
                  updateForm("semester", Number(value))
                }
              />

              <FormField
                label="Credits"
                type="number"
                value={String(form.credits)}
                onChange={(value) =>
                  updateForm("credits", Number(value))
                }
              />

              <FormField
                label="Enrolled students"
                type="number"
                value={String(form.enrolledStudents)}
                onChange={(value) =>
                  updateForm("enrolledStudents", Number(value))
                }
              />

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as SubjectStatus,
                    )
                  }
                  className="h-10 w-full border border-input bg-background px-3 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="border border-destructive/40 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <Button type="submit" size="sm">
                {editingId ? "Save changes" : "Create subject"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              This form modifies local demonstration state only.
            </p>
          </form>
        </SectionCard>
      )}

      {/* Subject details */}
      {selectedSubject && (
        <SectionCard
          title="Subject details"
          description="Academic information and faculty assignment."
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedSubject(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Subject name" value={selectedSubject.name} />
            <Detail label="Subject code" value={selectedSubject.code} />
            <Detail label="Department" value={selectedSubject.department} />
            <Detail
              label="Semester"
              value={String(selectedSubject.semester)}
            />
            <Detail
              label="Credits"
              value={String(selectedSubject.credits)}
            />
            <Detail label="Faculty" value={selectedSubject.faculty} />
            <Detail
              label="Enrolled students"
              value={String(selectedSubject.enrolledStudents)}
            />
            <Detail label="Status" value={selectedSubject.status} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEditForm(selectedSubject)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit subject
            </Button>

            <Button
              size="sm"
              variant={
                selectedSubject.status === "Active"
                  ? "destructive"
                  : "default"
              }
              onClick={() => toggleStatus(selectedSubject.id)}
            >
              {selectedSubject.status === "Active"
                ? "Deactivate subject"
                : "Activate subject"}
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Integration notice */}
      <div className="border border-border p-4">
        <p className="text-sm font-medium">
          Backend integration requirements
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
          <li>Fetch subjects from the institutional database.</li>
          <li>Validate unique subject codes on the server.</li>
          <li>Associate each subject with a valid department.</li>
          <li>Assign faculty through authorized faculty records, not arbitrary names.</li>
          <li>Synchronize student enrollment with academic records.</li>
          <li>Maintain audit logs for subject creation and modification.</li>
        </ul>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        min={type === "number" ? 0 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
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
