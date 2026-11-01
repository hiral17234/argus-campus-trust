
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  MapPin,
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
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/teacher/classes")({
  head: () => ({
    meta: [
      { title: "My Classes | ARGUS" },
      {
        name: "description",
        content: "Manage assigned classes and monitor student attendance.",
      },
    ],
  }),
  component: TeacherClassesPage,
});

type ClassStatus = "Active" | "Upcoming" | "Completed";

type ClassItem = {
  id: string;
  subject: string;
  code: string;
  department: string;
  semester: string;
  section: string;
  students: number;
  attendance: number;
  schedule: string;
  room: string;
  nextClass: string;
  status: ClassStatus;
};

type ClassFilter = "All" | ClassStatus;

const classes: ClassItem[] = [
  {
    id: "CLS-001",
    subject: "Data Structures and Algorithms",
    code: "CS301",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    section: "Section A",
    students: 42,
    attendance: 88,
    schedule: "Monday, Wednesday, Friday",
    room: "Lecture Hall 204",
    nextClass: "02 Nov 2026 · 09:00 AM",
    status: "Active",
  },
  {
    id: "CLS-002",
    subject: "Database Management Systems",
    code: "CS302",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    section: "Section A",
    students: 40,
    attendance: 92,
    schedule: "Tuesday, Thursday, Saturday",
    room: "Lecture Hall 102",
    nextClass: "03 Nov 2026 · 09:00 AM",
    status: "Active",
  },
  {
    id: "CLS-003",
    subject: "Computer Networks",
    code: "CS303",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    section: "Section A",
    students: 38,
    attendance: 71,
    schedule: "Monday, Wednesday",
    room: "Lab 301",
    nextClass: "02 Nov 2026 · 10:15 AM",
    status: "Active",
  },
  {
    id: "CLS-004",
    subject: "Operating Systems",
    code: "CS304",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    section: "Section B",
    students: 45,
    attendance: 84,
    schedule: "Tuesday, Thursday, Friday",
    room: "Lecture Hall 205",
    nextClass: "03 Nov 2026 · 10:15 AM",
    status: "Active",
  },
  {
    id: "CLS-005",
    subject: "Artificial Intelligence",
    code: "CS305",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    section: "Section A",
    students: 36,
    attendance: 95,
    schedule: "Monday, Thursday",
    room: "Lab 201",
    nextClass: "05 Nov 2026 · 10:15 AM",
    status: "Upcoming",
  },
  {
    id: "CLS-006",
    subject: "Engineering Mathematics",
    code: "MA301",
    department: "Mathematics",
    semester: "Semester 5",
    section: "Section A",
    students: 44,
    attendance: 78,
    schedule: "Wednesday, Friday, Saturday",
    room: "Lecture Hall 103",
    nextClass: "04 Nov 2026 · 10:15 AM",
    status: "Active",
  },
];

const filters: ClassFilter[] = [
  "All",
  "Active",
  "Upcoming",
  "Completed",
];

function getAttendanceTone(percentage: number) {
  if (percentage >= 85) return "success" as const;
  if (percentage >= 75) return "warning" as const;
  return "danger" as const;
}

function TeacherClassesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ClassFilter>("All");

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return classes.filter((item) => {
      const matchesSearch =
        !query ||
        item.subject.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query) ||
        item.semester.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const totalStudents = classes.reduce(
    (total, item) => total + item.students,
    0,
  );

  const averageAttendance = Math.round(
    classes.reduce(
      (total, item) => total + item.attendance,
      0,
    ) / Math.max(classes.length, 1),
  );

  const lowAttendanceClasses = classes.filter(
    (item) => item.attendance < 75,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        description="View assigned subjects, class schedules and student attendance performance."
      />

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Assigned classes"
          value={String(classes.length)}
          description="Total class sections"
          icon={BookOpen}
        />

        <SummaryCard
          label="Total enrolments"
          value={String(totalStudents)}
          description="Across assigned sections"
          icon={Users}
        />

        <SummaryCard
          label="Average attendance"
          value={`${averageAttendance}%`}
          description="Across assigned classes"
          icon={GraduationCap}
        />

        <SummaryCard
          label="Low attendance"
          value={String(lowAttendanceClasses)}
          description="Classes below 75%"
          icon={CalendarDays}
        />
      </div>

      {/* Class directory */}
      <SectionCard
        title="Class directory"
        description={`${filteredClasses.length} of ${classes.length} assigned classes displayed.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by subject, code, section or department..."
              className="h-10 rounded-none pl-9"
            />
          </div>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as ClassFilter)
            }
            aria-label="Filter classes by status"
            className="h-10 min-w-40 border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
          >
            {filters.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All classes" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 space-y-0">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 border-b border-border py-5 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_190px_130px]"
              >
                {/* Class information */}
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/30">
                      <BookOpen className="size-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {item.subject}
                        </p>

                        <StatusChip
                          tone={
                            item.status === "Active"
                              ? "success"
                              : item.status === "Upcoming"
                                ? "info"
                                : "neutral"
                          }
                        >
                          {item.status}
                        </StatusChip>
                      </div>

                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {item.code} · {item.id}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="size-3" />
                          {item.students} students
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <GraduationCap className="size-3" />
                          {item.semester} · {item.section}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3" />
                          {item.room}
                        </span>
                      </div>

                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {item.department}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div className="flex flex-col justify-center">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Attendance
                    </span>

                    <span className="font-mono text-xs font-semibold text-foreground">
                      {item.attendance}%
                    </span>
                  </div>

                  <Progress
                    value={item.attendance}
                    className="h-1.5 rounded-none"
                  />

                  <div className="mt-2">
                    <StatusChip
                      tone={getAttendanceTone(item.attendance)}
                    >
                      {item.attendance >= 85
                        ? "Good standing"
                        : item.attendance >= 75
                          ? "Near threshold"
                          : "Below requirement"}
                    </StatusChip>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center lg:justify-end">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full rounded-none lg:w-auto"
                  >
                    <Link to="/teacher/history">
                      View records
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Search className="mx-auto size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium text-foreground">
                No classes found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try changing your search or status filter.
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-none"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Class schedule */}
      <SectionCard
        title="Teaching schedule"
        description="Weekly schedule across your assigned classes."
      >
        <div className="space-y-0">
          {[
            {
              day: "Monday",
              time: "09:00 AM – 10:00 AM",
              subject: "Data Structures and Algorithms",
              room: "Lecture Hall 204",
            },
            {
              day: "Tuesday",
              time: "09:00 AM – 10:00 AM",
              subject: "Database Management Systems",
              room: "Lecture Hall 102",
            },
            {
              day: "Wednesday",
              time: "10:15 AM – 11:15 AM",
              subject: "Engineering Mathematics",
              room: "Lecture Hall 103",
            },
            {
              day: "Thursday",
              time: "10:15 AM – 11:15 AM",
              subject: "Artificial Intelligence",
              room: "Lab 201",
            },
            {
              day: "Friday",
              time: "10:15 AM – 11:15 AM",
              subject: "Operating Systems",
              room: "Lecture Hall 205",
            },
            {
              day: "Saturday",
              time: "09:00 AM – 10:00 AM",
              subject: "Engineering Mathematics",
              room: "Lecture Hall 103",
            },
          ].map((item) => (
            <div
              key={item.day}
              className="grid gap-2 border-b border-border py-3 last:border-b-0 sm:grid-cols-[100px_170px_minmax(0,1fr)_160px]"
            >
              <p className="text-xs font-medium text-foreground">
                {item.day}
              </p>

              <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock3 className="size-3" />
                {item.time}
              </p>

              <p className="text-xs text-foreground">
                {item.subject}
              </p>

              <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="size-3" />
                {item.room}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/teacher/analytics">
            View analytics
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/teacher/history">
            Attendance history
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/teacher/live">
            Live attendance
          </Link>
        </Button>
      </div>

      <div className="border border-border bg-muted/20 p-4">
        <p className="text-xs font-semibold text-foreground">
          Class assignment information
        </p>

        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Class details, enrolment counts, attendance percentages and
          schedules are demonstration data. In production, ARGUS must
          retrieve only the classes assigned to the authenticated teacher.
          Class assignments and student enrolments should be managed
          through authorized institutional APIs.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Users;
}) {
  return (
    <div className="border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-muted-foreground">
          {label}
        </p>

        <Icon className="size-4 text-muted-foreground" />
      </div>

      <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
