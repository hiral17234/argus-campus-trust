
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  MapPin,
  Plus,
} from "lucide-react";

import { PageHeader } from "@/components/argus/page-header";
import { SectionCard } from "@/components/argus/section-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/calendar")({
  head: () => ({
    meta: [
      { title: "Academic Calendar | ARGUS" },
      {
        name: "description",
        content:
          "View your academic timetable, examinations, deadlines and institutional events.",
      },
    ],
  }),
  component: StudentCalendarPage,
});

type EventCategory =
  | "Lecture"
  | "Practical"
  | "Examination"
  | "Assignment"
  | "Holiday"
  | "Event";

type CalendarEvent = {
  id: string;
  title: string;
  subject?: string;
  category: EventCategory;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description: string;
};

const initialEvents: CalendarEvent[] = [
  {
    id: "EVT-001",
    title: "Computer Networks Lecture",
    subject: "Computer Networks",
    category: "Lecture",
    date: "2026-11-02",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    location: "Room 204",
    description: "Regular lecture on network layer protocols.",
  },
  {
    id: "EVT-002",
    title: "Data Science Practical",
    subject: "Data Science",
    category: "Practical",
    date: "2026-11-03",
    startTime: "11:00 AM",
    endTime: "01:00 PM",
    location: "Computer Lab 2",
    description: "Practical session on data preprocessing and visualization.",
  },
  {
    id: "EVT-003",
    title: "Assignment Submission",
    subject: "Operating Systems",
    category: "Assignment",
    date: "2026-11-05",
    startTime: "11:59 PM",
    description: "Last date to submit the Operating Systems assignment.",
  },
  {
    id: "EVT-004",
    title: "Mathematics Mid-Semester Examination",
    subject: "Mathematics",
    category: "Examination",
    date: "2026-11-09",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    location: "Examination Hall",
    description: "Scheduled mid-semester examination.",
  },
  {
    id: "EVT-005",
    title: "Computer Networks Lecture",
    subject: "Computer Networks",
    category: "Lecture",
    date: "2026-11-10",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    location: "Room 204",
    description: "Regular lecture.",
  },
  {
    id: "EVT-006",
    title: "Institutional Holiday",
    category: "Holiday",
    date: "2026-11-14",
    description: "Institutional holiday. Academic activities suspended.",
  },
  {
    id: "EVT-007",
    title: "Database Management Systems Practical",
    subject: "DBMS",
    category: "Practical",
    date: "2026-11-17",
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    location: "Computer Lab 1",
    description: "SQL queries and database implementation practical.",
  },
  {
    id: "EVT-008",
    title: "Data Science Examination",
    subject: "Data Science",
    category: "Examination",
    date: "2026-11-20",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    location: "Examination Hall",
    description: "Scheduled examination.",
  },
  {
    id: "EVT-009",
    title: "Heritage Club Activity",
    category: "Event",
    date: "2026-11-24",
    startTime: "03:00 PM",
    endTime: "05:00 PM",
    location: "College Auditorium",
    description: "Institutional extracurricular activity.",
  },
];

const categoryStyles: Record<
  EventCategory,
  { label: string; className: string }
> = {
  Lecture: {
    label: "Lecture",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  Practical: {
    label: "Practical",
    className: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400",
  },
  Examination: {
    label: "Examination",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  Assignment: {
    label: "Assignment",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  Holiday: {
    label: "Holiday",
    className: "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400",
  },
  Event: {
    label: "Event",
    className: "border-border bg-muted text-muted-foreground",
  },
};

const categoryFilters = [
  "All",
  "Lecture",
  "Practical",
  "Examination",
  "Assignment",
  "Holiday",
  "Event",
] as const;

type CategoryFilter = (typeof categoryFilters)[number];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function StudentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 10, 1),
  );
  const [activeFilter, setActiveFilter] =
    useState<CategoryFilter>("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(
    null,
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthEvents = useMemo(
    () =>
      initialEvents.filter((event) => {
        const eventDate = new Date(`${event.date}T00:00:00`);
        return (
          eventDate.getFullYear() === year &&
          eventDate.getMonth() === month
        );
      }),
    [year, month],
  );

  const filteredEvents = useMemo(
    () =>
      monthEvents.filter(
        (event) =>
          activeFilter === "All" ||
          event.category === activeFilter,
      ),
    [monthEvents, activeFilter],
  );

  const selectedEvents = useMemo(
    () =>
      filteredEvents.filter(
        (event) => event.date === selectedDate,
      ),
    [filteredEvents, selectedDate],
  );

  const upcomingEvents = useMemo(
    () =>
      [...filteredEvents].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    [filteredEvents],
  );

  function changeMonth(offset: number) {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDate(null);
  }

  function getEventsForDate(day: number) {
    const dateKey = getDateKey(year, month, day);

    return filteredEvents.filter(
      (event) => event.date === dateKey,
    );
  }

  const totalEvents = monthEvents.length;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Student dashboard
        </Link>

        <PageHeader
          title="Academic calendar"
          description="View lectures, practicals, examinations, assignment deadlines and institutional events."
        />
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total events",
            value: totalEvents,
          },
          {
            label: "Examinations",
            value: monthEvents.filter(
              (event) => event.category === "Examination",
            ).length,
          },
          {
            label: "Assignments",
            value: monthEvents.filter(
              (event) => event.category === "Assignment",
            ).length,
          },
          {
            label: "Lectures",
            value: monthEvents.filter(
              (event) => event.category === "Lecture",
            ).length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <SectionCard
        title="Monthly schedule"
        description="Select a date to view its scheduled activities."
      >
        <div className="space-y-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground">
              {monthName}
            </h3>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous month"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentDate(new Date(2026, 10, 1));
                  setSelectedDate(null);
                }}
              >
                Reset
              </Button>

              <Button
                variant="outline"
                size="icon"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {categoryFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter);
                  setSelectedDate(null);
                }}
                className={`border px-3 py-1.5 text-xs transition-colors ${
                  activeFilter === filter
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="border-b border-border px-1 py-3 text-center text-[11px] font-medium text-muted-foreground sm:text-xs"
                >
                  {day}
                </div>
              ),
            )}

            {Array.from({ length: firstDay }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="min-h-[76px] border-b border-r border-border bg-muted/10 sm:min-h-[100px]"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dateKey = getDateKey(year, month, day);
              const dayEvents = getEventsForDate(day);
              const selected = selectedDate === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() =>
                    setSelectedDate(selected ? null : dateKey)
                  }
                  aria-label={`${day} ${monthName}, ${dayEvents.length} events`}
                  aria-pressed={selected}
                  className={`flex min-h-[76px] flex-col items-start border-b border-r border-border p-2 text-left transition-colors hover:bg-muted/40 sm:min-h-[100px] ${
                    selected
                      ? "bg-muted ring-1 ring-inset ring-foreground"
                      : "bg-background"
                  }`}
                >
                  <span className="text-xs font-medium tabular-nums text-foreground">
                    {day}
                  </span>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={`size-1.5 ${
                          event.category === "Examination"
                            ? "bg-destructive"
                            : event.category === "Assignment"
                              ? "bg-amber-500"
                              : event.category === "Lecture"
                                ? "bg-blue-500"
                                : event.category === "Practical"
                                  ? "bg-purple-500"
                                  : event.category === "Holiday"
                                    ? "bg-green-500"
                                    : "bg-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>

                  {dayEvents.length > 0 && (
                    <span className="mt-auto text-[10px] text-muted-foreground">
                      {dayEvents.length} event
                      {dayEvents.length > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4">
            {Object.entries(categoryStyles).map(([category, style]) => (
              <div
                key={category}
                className="flex items-center gap-2"
              >
                <span
                  className={`size-2 ${style.className.split(" ")[0]}`}
                />
                <span className="text-[11px] text-muted-foreground">
                  {category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Selected date events */}
      {selectedDate && (
        <SectionCard
          title={`Events on ${formatDate(selectedDate)}`}
          description="Activities scheduled for the selected date."
        >
          {selectedEvents.length > 0 ? (
            <div className="divide-y divide-border">
              {selectedEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No events scheduled for this date.
            </p>
          )}
        </SectionCard>
      )}

      {/* Upcoming events */}
      <SectionCard
        title="Monthly events"
        description={`${upcomingEvents.length} scheduled activities in ${monthName}.`}
      >
        {upcomingEvents.length > 0 ? (
          <div className="divide-y divide-border">
            {upcomingEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border px-4 py-10 text-center">
            <CalendarDays className="mx-auto size-7 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">
              No events scheduled
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              No events match the selected month and category.
            </p>
          </div>
        )}
      </SectionCard>

      {/* Information */}
      <div className="flex items-start gap-3 border border-border bg-card p-4">
        <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-xs font-medium text-foreground">
            Calendar information
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            This calendar currently uses sample academic events. Official
            examination dates, timetable changes and institutional holidays
            will be synchronized with the institution's academic calendar
            after backend integration.
          </p>
        </div>
      </div>
    </div>
  );
}

function EventItem({ event }: { event: CalendarEvent }) {
  const style = categoryStyles[event.category];

  return (
    <article className="flex flex-col gap-3 py-4 first:pt-1 sm:flex-row sm:items-start">
      <div className="flex size-10 shrink-0 flex-col items-center justify-center border border-border bg-background">
        <CalendarDays className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">
            {event.title}
          </h3>

          <span
            className={`border px-2 py-0.5 text-[10px] ${style.className}`}
          >
            {style.label}
          </span>
        </div>

        {event.subject && (
          <p className="mt-1 text-xs text-muted-foreground">
            {event.subject}
          </p>
        )}

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {formatDate(event.date)}
          </span>

          {event.startTime && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock3 className="size-3.5" />
              {event.startTime}
              {event.endTime ? ` – ${event.endTime}` : ""}
            </span>
          )}

          {event.location && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3.5" />
              {event.location}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

