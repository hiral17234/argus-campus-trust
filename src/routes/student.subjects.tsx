
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/student/subjects")({
  head: () => ({
    meta: [
      { title: "My Subjects | ARGUS" },
      {
        name: "description",
        content: "View your enrolled subjects and attendance records.",
      },
    ],
  }),
  component: StudentSubjectsPage,
});

type Subject = {
  id: string;
  name: string;
  code: string;
  faculty: string;
  department: string;
  semester: string;
  credits: number;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  schedule: string;
  room: string;
};

const subjects: Subject[] = [
  {
    id: "1",
    name: "Data Structures and Algorithms",
    code: "CS301",
    faculty: "Dr. Ananya Sharma",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    credits: 4,
    totalClasses: 48,
    present: 40,
    absent: 5,
    late: 3,
    schedule: "Mon, Wed, Fri",
    room: "Lecture Hall 204",
  },
  {
    id: "2",
    name: "Database Management Systems",
    code: "CS302",
    faculty: "Prof. Rahul Verma",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    credits: 4,
    totalClasses: 42,
    present: 36,
    absent: 4,
    late: 2,
    schedule: "Tue, Thu, Sat",
    room: "Lecture Hall 102",
  },
  {
    id: "3",
    name: "Computer Networks",
    code: "CS303",
    faculty: "Dr. Neha Gupta",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    credits: 3,
    totalClasses: 40,
    present: 27,
    absent: 10,
    late: 3,
    schedule: "Mon, Wed",
    room: "Lab 301",
  },
  {
    id: "4",
    name: "Operating Systems",
    code: "CS304",
    faculty: "Prof. Amit Sharma",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    credits: 4,
    totalClasses: 44,
    present: 38,
    absent: 4,
    late: 2,
    schedule: "Tue, Thu, Fri",
    room: "Lecture Hall 205",
  },
  {
    id: "5",
    name: "Artificial Intelligence",
    code: "CS305",
    faculty: "Dr. Priya Singh",
    department: "Computer Science and Engineering",
    semester: "Semester 5",
    credits: 3,
    totalClasses: 36,
    present: 32,
    absent: 3,
    late: 1,
    schedule: "Mon, Thu",
    room: "Lab 201",
  },
  {
    id: "6",
    name: "Engineering Mathematics",
    code: "MA301",
    faculty: "Prof. Rakesh Jain",
    department: "Mathematics",
    semester: "Semester 5",
    credits: 4,
    totalClasses: 46,
    present: 31,
    absent: 12,
    late: 3,
    schedule: "Wed, Fri, Sat",
    room: "Lecture Hall 103",
  },
];

type AttendanceFilter = "all" | "safe" | "low" | "critical";

function getAttendance(subject: Subject) {
  if (subject.totalClasses === 0) return 0;

  return Math.round(
    (subject.present / subject.totalClasses) * 100,
  );
}

function getAttendanceStatus(percentage: number) {
  if (percentage >= 85) {
    return {
      label: "Good standing",
      tone: "success" as const,
    };
  }

  if (percentage >= 75) {
    return {
      label: "Near threshold",
      tone: "warning" as const,
    };
  }

  return {
    label: "Below requirement",
    tone: "danger" as const,
  };
}

function StudentSubjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AttendanceFilter>("all");

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !query ||
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query) ||
        subject.faculty.toLowerCase().includes(query);

      const percentage = getAttendance(subject);

      const matchesFilter =
        filter === "all" ||
        (filter === "safe" && percentage >= 85) ||
        (filter === "low" && percentage >= 75 && percentage < 85) ||
        (filter === "critical" && percentage < 75);

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const totalSubjects = subjects.length;

  const averageAttendance = Math.round(
    subjects.reduce(
      (total, subject) => total + getAttendance(subject),
      0,
    ) / Math.max(totalSubjects, 1),
  );

  const belowRequirement = subjects.filter(
    (subject) => getAttendance(subject) < 75,
  ).length;

  const safeSubjects = subjects.filter(
    (subject) => getAttendance(subject) >= 85,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Subjects"
        description="View your enrolled courses, faculty information and attendance standing."
      />

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total subjects"
          value={String(totalSubjects)}
          description="Currently enrolled"
        />

        <SummaryCard
          label="Average attendance"
          value={`${averageAttendance}%`}
          description="Across all subjects"
        />

        <SummaryCard
          label="Good standing"
          value={String(safeSubjects)}
          description="Attendance at least 85%"
        />

        <SummaryCard
          label="Below requirement"
          value={String(belowRequirement)}
          description="Attendance below 75%"
        />
      </div>

      {/* Search and filters */}
      <SectionCard
        title="Subject directory"
        description={`${filteredSubjects.length} of ${totalSubjects} subjects displayed.`}
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by subject, code or faculty..."
              className="h-10 rounded-none pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as AttendanceFilter)
              }
              className="h-10 min-w-44 border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring"
              aria-label="Filter subjects by attendance"
            >
              <option value="all">All subjects</option>
              <option value="safe">Good standing (85%+)</option>
              <option value="low">Near threshold (75–84%)</option>
              <option value="critical">Below 75%</option>
            </select>
          </div>
        </div>

        {/* Subject list */}
        <div className="mt-4 space-y-0">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => {
              const percentage = getAttendance(subject);
              const status = getAttendanceStatus(percentage);

              return (
                <div
                  key={subject.id}
                  className="grid gap-4 border-b border-border py-5 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_220px_150px]"
                >
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/30">
                        <BookOpen className="size-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <Link
                          to="/student/subject-details"
                          className="text-sm font-semibold text-foreground hover:underline"
                        >
                          {subject.name}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {subject.code}
                          </span>

                          <span className="text-[11px] text-muted-foreground">
                            {subject.credits} credits
                          </span>

                          <StatusChip tone={status.tone}>
                            {status.label}
                          </StatusChip>
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground">
                          {subject.faculty}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3" />
                            {subject.schedule}
                          </span>

                          <span>{subject.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Attendance
                      </span>

                      <span className="font-mono text-xs font-semibold text-foreground">
                        {percentage}%
                      </span>
                    </div>

                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-1.5 rounded-none"
                    />

                    <p className="mt-2 text-[10px] text-muted-foreground">
                      {subject.present} present / {subject.totalClasses} total
                    </p>
                  </div>

                  <div className="flex items-center lg:justify-end">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full rounded-none lg:w-auto"
                    >
                      <Link to="/student/subject-details">
                        View details
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-border py-12 text-center">
              <Search className="size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium text-foreground">
                No subjects found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try changing your search or attendance filter.
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-none"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </SectionCard>

      <div className="border border-border bg-muted/20 p-4">
        <p className="text-xs font-semibold text-foreground">
          Attendance requirement
        </p>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          The demonstration uses a 75% minimum attendance threshold.
          Institutional attendance policies may differ. Confirm the
          applicable rules with your academic department.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="border border-border bg-background p-4">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
