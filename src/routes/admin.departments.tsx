
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Building2,
  GraduationCap,
  Users,
  UserRound,
  Search,
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

export const Route = createFileRoute("/admin/departments")({
  component: AdminDepartments,
});

type DepartmentStatus = "Active" | "Inactive";

type Department = {
  id: string;
  name: string;
  code: string;
  hod: string;
  email: string;
  facultyCount: number;
  studentCount: number;
  established: string;
  status: DepartmentStatus;
};

const initialDepartments: Department[] = [
  {
    id: "1",
    name: "Computer Science and Engineering",
    code: "CSE",
    hod: "Dr. Rajesh Sharma",
    email: "cse@example.com",
    facultyCount: 24,
    studentCount: 420,
    established: "2000",
    status: "Active",
  },
  {
    id: "2",
    name: "Information Technology",
    code: "IT",
    hod: "Dr. Neha Gupta",
    email: "it@example.com",
    facultyCount: 18,
    studentCount: 310,
    established: "2004",
    status: "Active",
  },
  {
    id: "3",
    name: "Electronics and Communication Engineering",
    code: "ECE",
    hod: "Dr. Amit Verma",
    email: "ece@example.com",
    facultyCount: 20,
    studentCount: 350,
    established: "1998",
    status: "Active",
  },
  {
    id: "4",
    name: "Mechanical Engineering",
    code: "ME",
    hod: "Dr. Kavita Joshi",
    email: "me@example.com",
    facultyCount: 22,
    studentCount: 380,
    established: "1985",
    status: "Active",
  },
  {
    id: "5",
    name: "Civil Engineering",
    code: "CE",
    hod: "Dr. Rahul Singh",
    email: "ce@example.com",
    facultyCount: 16,
    studentCount: 260,
    established: "1985",
    status: "Active",
  },
  {
    id: "6",
    name: "Electrical Engineering",
    code: "EE",
    hod: "Dr. Priya Mehta",
    email: "ee@example.com",
    facultyCount: 14,
    studentCount: 230,
    established: "1990",
    status: "Inactive",
  },
];

const emptyDepartment: Omit<Department, "id"> = {
  name: "",
  code: "",
  hod: "",
  email: "",
  facultyCount: 0,
  studentCount: 0,
  established: "",
  status: "Active",
};

function AdminDepartments() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [form, setForm] = useState(emptyDepartment);
  const [error, setError] = useState("");

  const activeCount = departments.filter(
    (department) => department.status === "Active",
  ).length;

  const totalStudents = departments.reduce(
    (sum, department) => sum + department.studentCount,
    0,
  );

  const totalFaculty = departments.reduce(
    (sum, department) => sum + department.facultyCount,
    0,
  );

  const filteredDepartments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return departments.filter((department) => {
      const matchesSearch =
        department.name.toLowerCase().includes(query) ||
        department.code.toLowerCase().includes(query) ||
        department.hod.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        department.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  const updateForm = (
    field: keyof Omit<Department, "id">,
    value: string | number,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const openAddForm = () => {
    setForm(emptyDepartment);
    setEditingId(null);
    setSelectedDepartment(null);
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (department: Department) => {
    const { id, ...departmentData } = department;
    setForm(departmentData);
    setEditingId(id);
    setSelectedDepartment(null);
    setError("");
    setFormOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.code.trim() ||
      !form.hod.trim() ||
      !form.email.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid department email address.");
      return;
    }

    if (
      departments.some(
        (department) =>
          department.code.toLowerCase() === form.code.trim().toLowerCase() &&
          department.id !== editingId,
      )
    ) {
      setError("A department with this code already exists.");
      return;
    }

    if (editingId) {
      setDepartments((current) =>
        current.map((department) =>
          department.id === editingId
            ? { ...form, id: editingId }
            : department,
        ),
      );
    } else {
      const newDepartment: Department = {
        ...form,
        id: `DEPT-${Date.now()}`,
      };

      setDepartments((current) => [...current, newDepartment]);
    }

    setFormOpen(false);
    setEditingId(null);
    setError("");
  };

  const toggleStatus = (id: string) => {
    setDepartments((current) =>
      current.map((department) =>
        department.id === id
          ? {
              ...department,
              status:
                department.status === "Active" ? "Inactive" : "Active",
            }
          : department,
      ),
    );

    setSelectedDepartment(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Management"
        description="Manage academic departments, faculty allocations, student enrollment, and departmental information."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Academic department directory</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Department information is sample data. Changes are local
              and are not saved to the institutional database.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Summary */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">
          Department overview
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total departments",
              value: departments.length,
              icon: Building2,
            },
            {
              label: "Active departments",
              value: activeCount,
              icon: UserRound,
            },
            {
              label: "Total faculty",
              value: totalFaculty,
              icon: Users,
            },
            {
              label: "Total students",
              value: totalStudents,
              icon: GraduationCap,
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

      {/* Department directory */}
      <SectionCard
        title="Department directory"
        description="Search, review, and manage registered departments."
        action={
          <Button size="sm" onClick={openAddForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add department
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search department, code or HOD"
              className="pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3 font-medium">Department</th>
                <th className="px-3 py-3 font-medium">Department code</th>
                <th className="px-3 py-3 font-medium">Head of department</th>
                <th className="px-3 py-3 font-medium">Faculty</th>
                <th className="px-3 py-3 font-medium">Students</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredDepartments.map((department) => (
                <tr key={department.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium">{department.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Established {department.established}
                    </p>
                  </td>

                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {department.code}
                  </td>

                  <td className="px-3 py-3 text-xs">
                    {department.hod}
                  </td>

                  <td className="px-3 py-3 tabular-nums">
                    {department.facultyCount}
                  </td>

                  <td className="px-3 py-3 tabular-nums">
                    {department.studentCount}
                  </td>

                  <td className="px-3 py-3">
                    <StatusChip status={department.status} />
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDepartment(department)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditForm(department)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDepartments.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No departments match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          Showing {filteredDepartments.length} of {departments.length} departments.
        </div>
      </SectionCard>

      {/* Add/Edit form */}
      {formOpen && (
        <SectionCard
          title={editingId ? "Edit department" : "Add department"}
          description="Enter the academic department information."
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
                label="Department name"
                value={form.name}
                onChange={(value) => updateForm("name", value)}
                placeholder="e.g. Computer Science and Engineering"
              />

              <FormField
                label="Department code"
                value={form.code}
                onChange={(value) => updateForm("code", value.toUpperCase())}
                placeholder="e.g. CSE"
              />

              <FormField
                label="Head of department"
                value={form.hod}
                onChange={(value) => updateForm("hod", value)}
                placeholder="HOD name"
              />

              <FormField
                label="Department email"
                value={form.email}
                onChange={(value) => updateForm("email", value)}
                placeholder="department@example.com"
                type="email"
              />

              <FormField
                label="Faculty count"
                value={String(form.facultyCount)}
                onChange={(value) =>
                  updateForm("facultyCount", Math.max(0, Number(value) || 0))
                }
                type="number"
              />

              <FormField
                label="Student count"
                value={String(form.studentCount)}
                onChange={(value) =>
                  updateForm("studentCount", Math.max(0, Number(value) || 0))
                }
                type="number"
              />

              <FormField
                label="Year established"
                value={form.established}
                onChange={(value) => updateForm("established", value)}
                placeholder="e.g. 2000"
              />

              <div className="space-y-2">
                <Label>Department status</Label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as DepartmentStatus,
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
                {editingId ? "Save changes" : "Create department"}
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

      {/* Department details */}
      {selectedDepartment && (
        <SectionCard
          title="Department details"
          description="Department information and account status."
          action={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedDepartment(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Department name" value={selectedDepartment.name} />
            <Detail label="Department code" value={selectedDepartment.code} />
            <Detail label="Head of department" value={selectedDepartment.hod} />
            <Detail label="Email" value={selectedDepartment.email} />
            <Detail
              label="Faculty members"
              value={String(selectedDepartment.facultyCount)}
            />
            <Detail
              label="Enrolled students"
              value={String(selectedDepartment.studentCount)}
            />
            <Detail
              label="Established"
              value={selectedDepartment.established}
            />
            <Detail
              label="Status"
              value={selectedDepartment.status}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEditForm(selectedDepartment)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit department
            </Button>

            <Button
              size="sm"
              variant={
                selectedDepartment.status === "Active"
                  ? "destructive"
                  : "default"
              }
              onClick={() => toggleStatus(selectedDepartment.id)}
            >
              {selectedDepartment.status === "Active"
                ? "Deactivate department"
                : "Activate department"}
            </Button>
          </div>
        </SectionCard>
      )}

      <div className="border border-border p-4">
        <p className="text-sm font-medium">Backend integration requirements</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
          <li>Fetch department records from the institutional database.</li>
          <li>Validate unique department codes on the server.</li>
          <li>Associate departments with faculty and enrolled students.</li>
          <li>Restrict department creation and modification to authorized administrators.</li>
          <li>Preserve audit records for departmental changes.</li>
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
