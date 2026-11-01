
import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
  DetailRow,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/student/subject-details")({
  head: () => ({
    meta: [
      { title: "Subject Details | ARGUS" },
      {
        name: "description",
        content: "View subject information, attendance and recent sessions.",
      },
    ],
  }),
  component: SubjectDetailsPage,
});

type AttendanceStatus = "Present" | "Absent" | "Late";

type SessionRecord = {
  id: string;
  date: string;
  day: string;
  topic: string;
  time: string;
  room: string;
  status: AttendanceStatus;
  method: string;
};

const subject = {
  id: "CS301",
  name: "Data Structures and Algorithms",
  shortName: "DSA",
  faculty: "Dr. Ananya Sharma",
  facultyEmail: "ananya.sharma@college.edu",
  department: "Computer Science and Engineering",
  semester: "Semester 5",
  section: "Section A",
  credits: 4,
  type: "Theory",
  room: "Lecture Hall 204",
  schedule: "Monday, Wednesday, Friday",
  attendanceRequired: 75,
  totalClasses: 48,
  present: 40,
  absent: 5,
  late: 3,
};

const sessions: SessionRecord[] = [
  {
    id: "SES-048",
    date: "31 Oct 2026",
    day: "Saturday",
    topic: "Graph Traversal Algorithms",
    time: "10:00 AM – 11:00 AM",
    room: "Lecture Hall 204",
    status: "Present",
    method: "Face verification",
  },
  {
    id: "SES-047",
    date: "29 Oct 2026",
    day: "Thursday",
    topic: "Minimum Spanning Trees",
    time: "10:00 AM – 11:00 AM",
    room: "Lecture Hall 204",
    status: "Present",
    method: "QR verification",
  },
  {
    id: "SES-046",
    date: "27 Oct 2026",
    day: "Tuesday",
    topic: "Binary Search Trees",
    time: "11:00 AM – 12:00 PM",
    room: "Lecture Hall 204",
    status: "Absent",
    method: "Not recorded",
  },
  {
    id: "SES-045",
    date: "24 Oct 2026",
    day: "Saturday",
    topic: "Tree Traversal",
    time: "10:00 AM – 11:00 AM",
    room: "Lecture Hall 204",
    status: "Late",
    method: "Face verification",
  },
  {
    id: "SES-044",
    date: "22 Oct 2026",
    day: "Thursday",
    topic: "Hashing and Hash Tables",
    time: "10:00 AM – 11:00 AM",
    room: "Lecture Hall 204",
    status: "Present",
    method: "QR verification",
  },
];

function getAttendanceTone(status: AttendanceStatus) {
  switch (status) {
    case "Present":
      return "success";
    case "Absent":
      return "danger";
    case "Late":
      return "warning";
    default:
      return "neutral";
  }
}

function SubjectDetailsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const attendancePercentage = useMemo(() => {
    if (subject.totalClasses === 0) return 0;
    return Math.round((subject.present / subject.totalClasses) * 100);
  }, []);

  const requiredClasses = Math.ceil(
    (subject.attendanceRequired * subject.totalClasses -
      100 * subject.present) /
      (100 - subject.attendanceRequired),
  );

  const classesToAttend = Math.max(0, requiredClasses);

  const canMeetAttendanceRequirement =
    attendancePercentage >= subject.attendanceRequired ||
    subject.present + classesToAttend <= subject.totalClasses + classesToAttend;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student/subjects"
          className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to subjects
        </Link>

        <PageHeader
          title={subject.name}
          description={`${subject.id} · ${subject.department}`}
        />
      </div>

      {/* Subject overview */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <SectionCard
          title="Subject overview"
          description="Academic and course information."
        >
          <div className="flex items-start gap-3 border-b border-border pb-4">
            <div className="flex size-11 shrink-0 items-center justify-center border border-border bg-muted/30">
              <BookOpen className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {subject.name}
              </p>

              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {subject.id}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <StatusChip tone="info">{subject.type}</StatusChip>
                <StatusChip tone="neutral">
                  {subject.credits} Credits
                </StatusChip>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <DetailRow label="Department" value={subject.department} />
            <DetailRow label="Semester" value={subject.semester} />
            <DetailRow label="Section" value={subject.section} />
            <DetailRow label="Faculty" value={subject.faculty} />
            <DetailRow label="Classroom" value={subject.room} />
            <DetailRow label="Schedule" value={subject.schedule} />
          </div>
        </SectionCard>

        <SectionCard
          title="Faculty information"
          description="Subject instructor."
        >
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/30">
              <GraduationCap className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {subject.faculty}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Course instructor
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <DetailRow
              label="Department"
              value="Computer Science"
            />
            <DetailRow
              label="Email"
              value={
                <span className="break-all text-right text-xs">
                  {subject.facultyEmail}
                </span>
              }
            />
          </div>
        </SectionCard>
      </div>

      {/* Attendance summary */}
      <SectionCard
        title="Attendance summary"
        description="Your recorded attendance for this subject."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AttendanceMetric
            label="Attendance"
            value={`${attendancePercentage}%`}
            description="Overall attendance"
          />

          <AttendanceMetric
            label="Present"
            value={String(subject.present)}
            description="Classes attended"
          />

          <AttendanceMetric
            label="Absent"
            value={String(subject.absent)}
            description="Classes missed"
          />

          <AttendanceMetric
            label="Late"
            value={String(subject.late)}
            description="Late attendance records"
          />
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-foreground">
              Attendance progress
            </span>

            <span className="font-mono text-xs text-muted-foreground">
              {attendancePercentage}% / {subject.attendanceRequired}%
            </span>
          </div>

          <Progress
            value={Math.min(attendancePercentage, 100)}
            className="h-2 rounded-none"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground">
              Minimum required attendance: {subject.attendanceRequired}%
            </p>

            {attendancePercentage >= subject.attendanceRequired ? (
              <StatusChip tone="success">
                Requirement met
              </StatusChip>
            ) : (
              <StatusChip tone="danger">
                Below requirement
              </StatusChip>
            )}
          </div>

          {attendancePercentage < subject.attendanceRequired && (
            <div className="mt-4 border border-border bg-muted/20 p-3">
              <p className="text-xs font-medium text-foreground">
                Attendance improvement required
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Attend the upcoming classes regularly. The exact
                number of classes required depends on the institution's
                attendance calculation policy and future scheduled sessions.
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Subject details tabs */}
      <SectionCard
        title="Subject records"
        description="Review attendance records and course schedule."
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Recent sessions
            </TabsTrigger>

            <TabsTrigger
              value="schedule"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="space-y-0">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid gap-3 border-b border-border py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold text-foreground">
                        {session.topic}
                      </p>

                      <StatusChip tone={getAttendanceTone(session.status)}>
                        {session.status}
                      </StatusChip>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3" />
                        {session.date}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="size-3" />
                        {session.time}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3" />
                        {session.room}
                      </span>
                    </div>

                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Verification method: {session.method}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {session.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-border pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate({
                    to: "/student/history",
                  })
                }
              >
                View complete attendance history
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <div className="space-y-3">
              {[
                {
                  day: "Monday",
                  time: "10:00 AM – 11:00 AM",
                  room: "Lecture Hall 204",
                },
                {
                  day: "Wednesday",
                  time: "10:00 AM – 11:00 AM",
                  room: "Lecture Hall 204",
                },
                {
                  day: "Friday",
                  time: "10:00 AM – 11:00 AM",
                  room: "Lecture Hall 204",
                },
              ].map((item) => (
                <div
                  key={item.day}
                  className="grid gap-2 border-b border-border pb-3 last:border-0 sm:grid-cols-3"
                >
                  <p className="text-xs font-medium text-foreground">
                    {item.day}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {item.time}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {item.room}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SectionCard>

      {/* Actions */}
      <SectionCard
        title="Subject actions"
        description="Access related academic and attendance features."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link to="/student/attendance">
              <CheckCircle2 className="size-4" />
              Attendance
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link to="/student/calendar">
              <CalendarDays className="size-4" />
              Academic calendar
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link to="/student/help">
              <Users className="size-4" />
              Get support
            </Link>
          </Button>
        </div>
      </SectionCard>

      <p className="border border-border bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">
          Demonstration data:
        </span>{" "}
        Subject details, attendance figures, faculty information and
        session records are sample frontend data. Actual subject
        information and attendance calculations must come from the
        ARGUS backend.
      </p>
    </div>
  );
}

function AttendanceMetric({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="border border-border p-4">
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

