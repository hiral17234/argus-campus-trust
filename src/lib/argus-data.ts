import type { NotificationKind } from "@/components/argus/notification-card";
import type { StatusTone } from "@/components/argus/status-chip";

export const student = {
  name: "Aarav Sharma",
  rollNumber: "CS22B1043",
  email: "aarav.sharma@college.edu",
  department: "School of Computing",
  branch: "Computer Science & Engineering",
  section: "B",
  semester: "Semester 6",
  batch: "2022 – 2026",
  device: {
    name: "Aarav's Laptop",
    browser: "Chrome 126",
    os: "Windows 11 Pro",
    registeredOn: "12 Feb 2026",
    trusted: true,
  },
  face: {
    status: "Verified",
    enrolledAngles: 7,
    totalAngles: 7,
    lastUpdated: "12 Feb 2026",
  },
};

export type ClassSession = {
  id: string;
  code: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  status: "Completed" | "Live" | "Upcoming";
  attendance?: "Present" | "Absent" | "Pending";
};

export const todayClasses: ClassSession[] = [
  {
    id: "c1",
    code: "CS3021",
    subject: "Operating Systems",
    teacher: "Dr. Meera Iyer",
    time: "09:00 – 09:50",
    room: "Block C · 204",
    status: "Completed",
    attendance: "Present",
  },
  {
    id: "c2",
    code: "CS3044",
    subject: "Computer Networks",
    teacher: "Prof. R. Venkatesh",
    time: "10:00 – 10:50",
    room: "Block C · 208",
    status: "Completed",
    attendance: "Present",
  },
  {
    id: "c3",
    code: "CS3110",
    subject: "Database Systems",
    teacher: "Dr. Anita Rao",
    time: "11:30 – 12:20",
    room: "Block A · 112",
    status: "Live",
    attendance: "Pending",
  },
  {
    id: "c4",
    code: "CS3205",
    subject: "Machine Learning",
    teacher: "Dr. S. Krishnan",
    time: "14:00 – 14:50",
    room: "Lab 3",
    status: "Upcoming",
  },
];

export type AttendanceRecord = {
  id: string;
  date: string;
  day: string;
  subject: string;
  code: string;
  teacher: string;
  time: string;
  method: "Face + QR" | "Attendance Code" | "Face Verification" | "Manual Override";
  confidence: number;
  location: "Verified" | "Out of range" | "Not captured";
  device: "Trusted" | "Untrusted" | "New device";
  risk: "Low" | "Medium" | "High";
  result: "Present" | "Absent" | "Flagged" | "Under review";
  period: "daily" | "weekly" | "monthly" | "semester";
};

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "a1",
    date: "05 Aug 2026",
    day: "Wednesday",
    subject: "Computer Networks",
    code: "CS3044",
    teacher: "Prof. R. Venkatesh",
    time: "10:00 – 10:50",
    method: "Face + QR",
    confidence: 98.4,
    location: "Verified",
    device: "Trusted",
    risk: "Low",
    result: "Present",
    period: "daily",
  },
  {
    id: "a2",
    date: "05 Aug 2026",
    day: "Wednesday",
    subject: "Operating Systems",
    code: "CS3021",
    teacher: "Dr. Meera Iyer",
    time: "09:00 – 09:50",
    method: "Face Verification",
    confidence: 96.1,
    location: "Verified",
    device: "Trusted",
    risk: "Low",
    result: "Present",
    period: "daily",
  },
  {
    id: "a3",
    date: "04 Aug 2026",
    day: "Tuesday",
    subject: "Machine Learning",
    code: "CS3205",
    teacher: "Dr. S. Krishnan",
    time: "14:00 – 14:50",
    method: "Attendance Code",
    confidence: 71.2,
    location: "Out of range",
    device: "New device",
    risk: "Medium",
    result: "Flagged",
    period: "weekly",
  },
  {
    id: "a4",
    date: "03 Aug 2026",
    day: "Monday",
    subject: "Database Systems",
    code: "CS3110",
    teacher: "Dr. Anita Rao",
    time: "11:30 – 12:20",
    method: "Face + QR",
    confidence: 99.1,
    location: "Verified",
    device: "Trusted",
    risk: "Low",
    result: "Present",
    period: "weekly",
  },
  {
    id: "a5",
    date: "31 Jul 2026",
    day: "Friday",
    subject: "Operating Systems",
    code: "CS3021",
    teacher: "Dr. Meera Iyer",
    time: "09:00 – 09:50",
    method: "Manual Override",
    confidence: 0,
    location: "Not captured",
    device: "Untrusted",
    risk: "High",
    result: "Absent",
    period: "monthly",
  },
  {
    id: "a6",
    date: "22 Jul 2026",
    day: "Tuesday",
    subject: "Computer Networks",
    code: "CS3044",
    teacher: "Prof. R. Venkatesh",
    time: "10:00 – 10:50",
    method: "Face Verification",
    confidence: 88.7,
    location: "Verified",
    device: "Trusted",
    risk: "Low",
    result: "Under review",
    period: "monthly",
  },
  {
    id: "a7",
    date: "18 Jun 2026",
    day: "Thursday",
    subject: "Machine Learning",
    code: "CS3205",
    teacher: "Dr. S. Krishnan",
    time: "14:00 – 14:50",
    method: "Face + QR",
    confidence: 97.3,
    location: "Verified",
    device: "Trusted",
    risk: "Low",
    result: "Present",
    period: "semester",
  },
];

export const resultTone: Record<AttendanceRecord["result"], StatusTone> = {
  Present: "success",
  Absent: "danger",
  Flagged: "warning",
  "Under review": "info",
};

export const riskTone: Record<AttendanceRecord["risk"], StatusTone> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

export type Appeal = {
  id: string;
  reference: string;
  subject: string;
  date: string;
  reason: string;
  status: "Submitted" | "Under review" | "Approved" | "Rejected";
  submittedOn: string;
  teacher: string;
  response?: string;
  attachment?: string;
};

export const appeals: Appeal[] = [
  {
    id: "ap1",
    reference: "APL-2026-0418",
    subject: "Machine Learning · CS3205",
    date: "04 Aug 2026",
    reason: "Face verification failed due to poor classroom lighting; marked flagged.",
    status: "Under review",
    submittedOn: "04 Aug 2026, 15:22",
    teacher: "Dr. S. Krishnan",
    attachment: "lighting-issue-photo.jpg",
  },
  {
    id: "ap2",
    reference: "APL-2026-0392",
    subject: "Operating Systems · CS3021",
    date: "31 Jul 2026",
    reason: "Attended lab session but device was not connected to campus network.",
    status: "Approved",
    submittedOn: "31 Jul 2026, 10:04",
    teacher: "Dr. Meera Iyer",
    response: "Verified with lab register. Attendance corrected to Present.",
  },
  {
    id: "ap3",
    reference: "APL-2026-0351",
    subject: "Computer Networks · CS3044",
    date: "12 Jul 2026",
    reason: "Was present but arrived after the attendance window closed.",
    status: "Rejected",
    submittedOn: "12 Jul 2026, 18:41",
    teacher: "Prof. R. Venkatesh",
    response: "Attendance window closed at 10:10. Late entry is not eligible for correction.",
  },
];

export const appealTone: Record<Appeal["status"], StatusTone> = {
  Submitted: "info",
  "Under review": "warning",
  Approved: "success",
  Rejected: "danger",
};

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    kind: "attendance-open",
    title: "Database Systems attendance is open",
    body: "Session CS3110 is accepting verification for the next 4 minutes in Block A · 112.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    kind: "attendance-approved",
    title: "Attendance approved",
    body: "Computer Networks · 05 Aug, 10:00 verified with 98.4% confidence.",
    time: "3h ago",
    unread: true,
  },
  {
    id: "n3",
    kind: "appeal-approved",
    title: "Appeal APL-2026-0392 approved",
    body: "Dr. Meera Iyer corrected your Operating Systems record to Present.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n4",
    kind: "attendance-rejected",
    title: "Attendance rejected",
    body: "Machine Learning · 04 Aug was flagged: location outside the classroom geofence.",
    time: "2d ago",
    unread: false,
  },
  {
    id: "n5",
    kind: "attendance-closed",
    title: "Attendance window closed",
    body: "Operating Systems · 04 Aug closed at 09:12. 58 of 61 students verified.",
    time: "2d ago",
    unread: false,
  },
  {
    id: "n6",
    kind: "appeal-rejected",
    title: "Appeal APL-2026-0351 rejected",
    body: "Late entry is not eligible for attendance correction.",
    time: "24 Jul",
    unread: false,
  },
  {
    id: "n7",
    kind: "announcement",
    title: "Mid-semester examination verification",
    body: "Face re-enrollment is mandatory before 20 Aug for examination hall access.",
    time: "22 Jul",
    unread: false,
  },
];

export const subjectAttendance = [
  { subject: "OS", percentage: 92 },
  { subject: "CN", percentage: 86 },
  { subject: "DBMS", percentage: 78 },
  { subject: "ML", percentage: 64 },
  { subject: "SE", percentage: 71 },
];

export const attendanceTrend = [
  { week: "W1", value: 88 },
  { week: "W2", value: 92 },
  { week: "W3", value: 84 },
  { week: "W4", value: 79 },
  { week: "W5", value: 83 },
  { week: "W6", value: 87 },
];

export const faceAngles = [
  { id: "front", label: "Front face", hint: "Look straight into the camera" },
  { id: "left", label: "Turn left", hint: "Rotate your head 30° to the left" },
  { id: "right", label: "Turn right", hint: "Rotate your head 30° to the right" },
  { id: "up", label: "Look up", hint: "Tilt your chin slightly upward" },
  { id: "down", label: "Look down", hint: "Tilt your chin slightly downward" },
  { id: "smile", label: "Smile", hint: "Hold a natural smile" },
  { id: "blink", label: "Blink", hint: "Blink once when prompted" },
  { id: "neutral", label: "Neutral expression", hint: "Relax your face" },
];

export const faceRules = [
  "Remove spectacles or glasses",
  "Remove caps, hats and hoods",
  "Remove masks and face coverings",
  "Ensure even lighting on your face",
];
