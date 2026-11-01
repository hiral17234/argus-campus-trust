
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/timetable")({
  head: () => ({
    meta: [
      { title: "Timetable | ARGUS" },
      {
        name: "description",
        content: "View your weekly academic timetable.",
      },
    ],
  }),
  component: StudentTimetablePage,
});

type ClassSession = {
  id: string;
  subject: string;
  code: string;
  faculty: string;
  startTime: string;
  endTime: string;
  room: string;
  type: "Lecture" | "Practical" | "Tutorial";
};

type DaySchedule = {
  day: string;
  short: string;
  date: string;
  classes: ClassSession[];
};

const timetable: DaySchedule[] = [
  {
    day: "Monday",
    short: "Mon",
    date: "02 Nov",
    classes: [
      {
        id: "MON-01",
        subject: "Data Structures and Algorithms",
        code: "CS301",
        faculty: "Dr. Ananya Sharma",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        room: "Lecture Hall 204",
        type: "Lecture",
      },
      {
        id: "MON-02",
        subject: "Computer Networks",
        code: "CS303",
        faculty: "Dr. Neha Gupta",
        startTime: "10:15 AM",
        endTime: "11:15 AM",
        room: "Lecture Hall 102",
        type: "Lecture",
      },
      {
        id: "MON-03",
        subject: "Artificial Intelligence",
        code: "CS305",
        faculty: "Dr. Priya Singh",
        startTime: "12:00 PM",
        endTime: "01:00 PM",
        room: "Lab 201",
        type: "Practical",
      },
    ],
  },
  {
    day: "Tuesday",
    short: "Tue",
    date: "03 Nov",
    classes: [
      {
        id: "TUE-01",
        subject: "Database Management Systems",
        code: "CS302",
        faculty: "Prof. Rahul Verma",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        room: "Lecture Hall 102",
        type: "Lecture",
      },
      {
        id: "TUE-02",
        subject: "Operating Systems",
        code: "CS304",
        faculty: "Prof. Amit Sharma",
        startTime: "10:15 AM",
        endTime: "11:15 AM",
        room: "Lecture Hall 205",
        type: "Lecture",
      },
      {
        id: "TUE-03",
        subject: "Database Management Systems",
        code: "CS302",
        faculty: "Prof. Rahul Verma",
        startTime: "02:00 PM",
        endTime: "04:00 PM",
        room: "Lab 302",
        type: "Practical",
      },
    ],
  },
  {
    day: "Wednesday",
    short: "Wed",
    date: "04 Nov",
    classes: [
      {
        id: "WED-01",
        subject: "Data Structures and Algorithms",
        code: "CS301",
        faculty: "Dr. Ananya Sharma",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        room: "Lecture Hall 204",
        type: "Lecture",
      },
      {
        id: "WED-02",
        subject: "Engineering Mathematics",
        code: "MA301",
        faculty: "Prof. Rakesh Jain",
        startTime: "10:15 AM",
        endTime: "11:15 AM",
        room: "Lecture Hall 103",
        type: "Lecture",
      },
      {
        id: "WED-03",
        subject: "Computer Networks",
        code: "CS303",
        faculty: "Dr. Neha Gupta",
        startTime: "12:00 PM",
        endTime: "02:00 PM",
        room: "Lab 301",
        type: "Practical",
      },
    ],
  },
  {
    day: "Thursday",
    short: "Thu",
    date: "05 Nov",
    classes: [
      {
        id: "THU-01",
        subject: "Database Management Systems",
        code: "CS302",
        faculty: "Prof. Rahul Verma",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        room: "Lecture Hall 102",
        type: "Lecture",
      },
      {
        id: "THU-02",
        subject: "Artificial Intelligence",
        code: "CS305",
        faculty: "Dr. Priya Singh",
        startTime: "10:15 AM",
        endTime: "11:15 AM",
        room: "Lecture Hall 201",
        type: "Lecture",
      },
      {
        id: "THU-03",
        subject: "Operating Systems",
        code: "CS304",
        faculty: "Prof. Amit Sharma",
        startTime: "12:00 PM",
        endTime: "01:00 PM",
        room: "Lab 205",
        type: "Tutorial",
      },
    ],
  },
  {
    day: "Friday",
    short: "Fri",
    date: "06 Nov",
    classes: [
      {
        id: "FRI-01",
        subject: "Data Structures and Algorithms",
        code: "CS301",
        faculty: "Dr. Ananya Sharma",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        room: "Lecture Hall 204",
        type: "Lecture",
      },
      {
        id: "FRI-02",
        subject: "Operating Systems",
        code: "CS304",
        faculty: "Prof. Amit Sharma",
        startTime: "10:15 AM",
        endTime: "11:15 AM",
        room: "Lecture Hall 205",
        type: "Lecture",
      },
      {
        id: "FRI-03",
        subject: "Engineering Mathematics",
        code: "MA301",
        faculty: "Prof. Rakesh Jain",
        startTime: "12:00 PM",
        endTime: "01:00 PM",
        room: "Lecture Hall 103",
        type: "Tutorial",
      },
    ],
  },
  {
    day: "Saturday",
    short: "Sat",
    date: "07 Nov",
    classes: [
      {
        id: "SAT-01",
        subject: "Engineering Mathematics",
        code: "MA301",
        faculty: "Prof. Rakesh Jain",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        room: "Lecture Hall 103",
        type: "Lecture",
      },
      {
        id: "SAT-02",
        subject: "Database Management Systems",
        code: "CS302",
        faculty: "Prof. Rahul Verma",
        startTime: "10:15 AM",
        endTime: "11:15 AM",
        room: "Lecture Hall 102",
        type: "Tutorial",
      },
    ],
  },
];

function StudentTimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const currentDaySchedule =
    timetable.find((item) => item.day === selectedDay) ?? timetable[0];

  const totalClasses = useMemo(
    () =>
      timetable.reduce(
        (total, day) => total + day.classes.length,
        0,
      ),
    [],
  );

  const daysWithClasses = timetable.filter(
    (day) => day.classes.length > 0,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Timetable"
        description="Your weekly academic schedule and classroom information."
      />

      {/* Weekly summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Weekly classes"
          value={String(totalClasses)}
          description="Scheduled sessions"
        />

        <SummaryCard
          label="Active days"
          value={String(daysWithClasses)}
          description="Days with scheduled classes"
        />

        <SummaryCard
          label="Selected day"
          value={String(currentDaySchedule.classes.length)}
          description={`${currentDaySchedule.day} classes`}
        />
      </div>

      {/* Day selector */}
      <SectionCard
        title="Weekly schedule"
        description="Select a day to view its classes."
      >
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {timetable.map((day) => {
            const isSelected = selectedDay === day.day;

            return (
              <button
                key={day.day}
                type="button"
                onClick={() => setSelectedDay(day.day)}
                className={`border px-2 py-3 text-center transition-colors ${
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                <span className="block text-xs font-semibold">
                  {day.short}
                </span>

                <span
                  className={`mt-1 block text-[10px] ${
                    isSelected
                      ? "text-background/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {day.date}
                </span>

                <span
                  className={`mt-2 block font-mono text-xs ${
                    isSelected
                      ? "text-background"
                      : "text-muted-foreground"
                  }`}
                >
                  {day.classes.length} classes
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected day heading */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {currentDaySchedule.day}
            </h3>

            <p className="mt-1 text-[11px] text-muted-foreground">
              {currentDaySchedule.date} November 2026
            </p>
          </div>

          <StatusChip tone="info">
            {currentDaySchedule.classes.length} scheduled classes
          </StatusChip>
        </div>

        {/* Daily class list */}
        {currentDaySchedule.classes.length > 0 ? (
          <div className="space-y-0">
            {currentDaySchedule.classes.map((session, index) => (
              <div
                key={session.id}
                className="grid gap-3 border-b border-border py-5 last:border-b-0 sm:grid-cols-[100px_minmax(0,1fr)_auto]"
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-foreground">
                    {session.startTime}
                  </p>

                  <p className="mt-1 text-[10px] text-muted-foreground">
                    to {session.endTime}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {session.subject}
                    </p>

                    <StatusChip tone="neutral">
                      {session.type}
                    </StatusChip>
                  </div>

                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {session.code}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="size-3" />
                      {session.faculty}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3" />
                      {session.room}
                    </span>
                  </div>
                </div>

                <div className="flex items-center sm:justify-end">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {session.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <CalendarDays className="mx-auto size-6 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium text-foreground">
              No classes scheduled
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              There are no classes scheduled for this day.
            </p>
          </div>
        )}
      </SectionCard>

      {/* Weekly overview */}
      <SectionCard
        title="Weekly overview"
        description="A quick view of your class distribution."
      >
        <div className="space-y-4">
          {timetable.map((day) => {
            const maxClasses = Math.max(
              ...timetable.map((item) => item.classes.length),
              1,
            );

            const percentage =
              (day.classes.length / maxClasses) * 100;

            return (
              <button
                key={day.day}
                type="button"
                onClick={() => setSelectedDay(day.day)}
                className="w-full text-left"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    {day.day}
                  </span>

                  <span className="font-mono text-[11px] text-muted-foreground">
                    {day.classes.length} classes
                  </span>
                </div>

                <div className="h-2 w-full bg-muted">
                  <div
                    className="h-full bg-foreground transition-[width]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/student/calendar">
            <CalendarDays className="size-4" />
            Academic calendar
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link to="/student/subjects">
            <ArrowLeft className="size-4" />
            My subjects
          </Link>
        </Button>
      </div>

      <div className="border border-border bg-muted/20 p-4">
        <div className="flex items-center gap-2">
          <Clock3 className="size-4 text-muted-foreground" />

          <p className="text-xs font-semibold text-foreground">
            Timetable information
          </p>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          This timetable contains sample academic data for the
          ARGUS frontend. Actual class schedules, faculty assignments,
          room allocations and timetable changes must be retrieved
          from the institutional backend.
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
