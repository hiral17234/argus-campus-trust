import type { StatusTone } from "@/components/argus/status-chip";
import type { NotificationKind } from "@/components/argus/notification-card";

export const teacher = {
  name: "Dr. Meera Iyer",
  employeeId: "FAC-2019-0187",
  email: "meera.iyer@college.edu",
  department: "School of Computing",
  designation: "Associate Professor",
  cabin: "Block C · Faculty Wing 2",
  phone: "+91 98••• ••241",
  subjects: ["CS3021 Operating Systems", "CS3110 Database Systems", "CS3402 Compiler Design"],
  face: { status: "Verified", enrolledAngles: 7, totalAngles: 7, lastUpdated: "04 Feb 2026" },
  devices: [
    { id: "d1", name: "Faculty Laptop", os: "Windows 11 Pro", browser: "Edge 128", last: "Today, 09:02", trusted: true },
    { id: "d2", name: "iPad Pro 11", os: "iPadOS 18", browser: "Safari", last: "Yesterday, 16:40", trusted: true },
    { id: "d3", name: "Pixel 8", os: "Android 15", browser: "Chrome 126", last: "02 Aug, 08:15", trusted: false },
  ],
};

export type TeacherClass = {
  id: string;
  code: string;
  subject: string;
  year: string;
  branch: string;
  section: string;
  room: string;
  time: string;
  strength: number;
  status: "Completed" | "Live" | "Upcoming";
  marked: number;
  topic: string;
};

export const teacherClasses: TeacherClass[] = [
  {
    id: "t1",
    code: "CS3021",
    subject: "Operating Systems",
    year: "3rd Year",
    branch: "CSE",
    section: "B",
    room: "Block C · 204",
    time: "09:00 – 09:50",
    strength: 61,
    status: "Completed",
    marked: 58,
    topic: "Deadlock detection and recovery",
  },
  {
    id: "t2",
    code: "CS3110",
    subject: "Database Systems",
    year: "3rd Year",
    branch: "CSE",
    section: "A",
    room: "Block A · 112",
    time: "11:30 – 12:20",
    strength: 58,
    status: "Live",
    marked: 41,
    topic: "Normalization: BCNF and 4NF",
  },
  {
    id: "t3",
    code: "CS3402",
    subject: "Compiler Design",
    year: "4th Year",
    branch: "CSE",
    section: "A",
    room: "Block C · 301",
    time: "14:00 – 14:50",
    strength: 54,
    status: "Upcoming",
    marked: 0,
    topic: "Syntax-directed translation",
  },
  {
    id: "t4",
    code: "CS3110",
    subject: "Database Systems Lab",
    year: "3rd Year",
    branch: "CSE",
    section: "B",
    room: "Lab 3",
    time: "15:00 – 16:40",
    strength: 30,
    status: "Upcoming",
    marked: 0,
    topic: "Transaction isolation levels",
  },
];

export const classStatusTone: Record<TeacherClass["status"], StatusTone> = {
  Completed: "neutral",
  Live: "success",
  Upcoming: "info",
};

export type LiveEntry = {
  id: string;
  student: string;
  roll: string;
  time: string;
  confidence: number;
  device: "Trusted" | "New device" | "Untrusted";
  location: "Verified" | "Out of range" | "Not captured";
  risk: "Low" | "Medium" | "High";
  status: "Verified" | "Pending" | "Rejected" | "Spoof blocked";
  gesture: "Blink" | "Turn left" | "Turn right" | "Smile" | "None";
  reason?: string;
};

export const liveEntries: LiveEntry[] = [
  { id: "l1", student: "Aarav Sharma", roll: "CS22B1043", time: "11:32:04", confidence: 98.4, device: "Trusted", location: "Verified", risk: "Low", status: "Verified", gesture: "Blink" },
  { id: "l2", student: "Diya Nair", roll: "CS22B1009", time: "11:32:11", confidence: 97.1, device: "Trusted", location: "Verified", risk: "Low", status: "Verified", gesture: "Turn left" },
  { id: "l3", student: "Rohit Menon", roll: "CS22B1027", time: "11:32:29", confidence: 74.8, device: "New device", location: "Out of range", risk: "Medium", status: "Rejected", gesture: "Smile", reason: "Location outside classroom geofence (48m)" },
  { id: "l4", student: "Ishita Verma", roll: "CS22B1055", time: "11:33:02", confidence: 41.2, device: "Untrusted", location: "Not captured", risk: "High", status: "Spoof blocked", gesture: "None", reason: "Static image replay detected — no liveness signal" },
  { id: "l5", student: "Kabir Anand", roll: "CS22B1018", time: "11:33:20", confidence: 96.6, device: "Trusted", location: "Verified", risk: "Low", status: "Verified", gesture: "Blink" },
  { id: "l6", student: "Sneha Pillai", roll: "CS22B1061", time: "—", confidence: 0, device: "Trusted", location: "Not captured", risk: "Low", status: "Pending", gesture: "None" },
  { id: "l7", student: "Vivaan Joshi", roll: "CS22B1034", time: "11:34:07", confidence: 89.3, device: "Trusted", location: "Verified", risk: "Low", status: "Verified", gesture: "Turn right" },
  { id: "l8", student: "Ananya Rao", roll: "CS22B1002", time: "—", confidence: 0, device: "New device", location: "Not captured", risk: "Medium", status: "Pending", gesture: "None" },
];

export const liveStatusTone: Record<LiveEntry["status"], StatusTone> = {
  Verified: "success",
  Pending: "pending",
  Rejected: "danger",
  "Spoof blocked": "danger",
};

export const riskToneMap: Record<LiveEntry["risk"], StatusTone> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

export type SessionRecord = {
  id: string;
  date: string;
  code: string;
  subject: string;
  section: string;
  time: string;
  mode: "Face Only" | "QR + Face" | "Code + Face" | "Emergency Manual";
  present: number;
  strength: number;
  rejected: number;
  spoof: number;
  period: "daily" | "weekly" | "monthly" | "semester";
};

export const sessionHistory: SessionRecord[] = [
  { id: "s1", date: "06 Aug 2026", code: "CS3021", subject: "Operating Systems", section: "3 CSE B", time: "09:00 – 09:50", mode: "QR + Face", present: 58, strength: 61, rejected: 2, spoof: 1, period: "daily" },
  { id: "s2", date: "05 Aug 2026", code: "CS3110", subject: "Database Systems", section: "3 CSE A", time: "11:30 – 12:20", mode: "Face Only", present: 52, strength: 58, rejected: 3, spoof: 0, period: "daily" },
  { id: "s3", date: "04 Aug 2026", code: "CS3402", subject: "Compiler Design", section: "4 CSE A", time: "14:00 – 14:50", mode: "Code + Face", present: 47, strength: 54, rejected: 4, spoof: 2, period: "weekly" },
  { id: "s4", date: "03 Aug 2026", code: "CS3021", subject: "Operating Systems", section: "3 CSE B", time: "09:00 – 09:50", mode: "QR + Face", present: 60, strength: 61, rejected: 1, spoof: 0, period: "weekly" },
  { id: "s5", date: "24 Jul 2026", code: "CS3110", subject: "Database Systems", section: "3 CSE A", time: "11:30 – 12:20", mode: "Emergency Manual", present: 55, strength: 58, rejected: 0, spoof: 0, period: "monthly" },
  { id: "s6", date: "19 Jun 2026", code: "CS3402", subject: "Compiler Design", section: "4 CSE A", time: "14:00 – 14:50", mode: "QR + Face", present: 50, strength: 54, rejected: 2, spoof: 1, period: "semester" },
];

export type TeacherAppeal = {
  id: string;
  reference: string;
  student: string;
  roll: string;
  subject: string;
  date: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedOn: string;
  evidence?: string;
  comment?: string;
};

export const teacherAppeals: TeacherAppeal[] = [
  { id: "ta1", reference: "APL-2026-0418", student: "Rohit Menon", roll: "CS22B1027", subject: "Database Systems · CS3110", date: "05 Aug 2026", reason: "Verification failed because of poor classroom lighting near the rear rows.", status: "Pending", submittedOn: "05 Aug 2026, 15:22", evidence: "lighting-issue-photo.jpg" },
  { id: "ta2", reference: "APL-2026-0417", student: "Ananya Rao", roll: "CS22B1002", subject: "Operating Systems · CS3021", date: "05 Aug 2026", reason: "Phone battery died during the attendance window; verified with the lab register.", status: "Pending", submittedOn: "05 Aug 2026, 12:10" },
  { id: "ta3", reference: "APL-2026-0392", student: "Aarav Sharma", roll: "CS22B1043", subject: "Operating Systems · CS3021", date: "31 Jul 2026", reason: "Attended the lab but device was not on the campus network.", status: "Approved", submittedOn: "31 Jul 2026, 10:04", comment: "Verified with lab register. Corrected to Present." },
  { id: "ta4", reference: "APL-2026-0351", student: "Vivaan Joshi", roll: "CS22B1034", subject: "Compiler Design · CS3402", date: "12 Jul 2026", reason: "Arrived after the attendance window closed.", status: "Rejected", submittedOn: "12 Jul 2026, 18:41", comment: "Window closed at 14:10. Late entry is not eligible." },
];

export const teacherAppealTone: Record<TeacherAppeal["status"], StatusTone> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

export const lowAttendanceStudents = [
  { id: "la1", name: "Ishita Verma", roll: "CS22B1055", subject: "CS3110", percentage: 54 },
  { id: "la2", name: "Rohit Menon", roll: "CS22B1027", subject: "CS3021", percentage: 61 },
  { id: "la3", name: "Sneha Pillai", roll: "CS22B1061", subject: "CS3402", percentage: 64 },
  { id: "la4", name: "Ananya Rao", roll: "CS22B1002", subject: "CS3110", percentage: 68 },
];

export const spoofAttempts = [
  { id: "sp1", student: "Ishita Verma", roll: "CS22B1055", time: "11:33", type: "Photo replay", subject: "CS3110", severity: "High" as const },
  { id: "sp2", student: "Unknown device", roll: "—", time: "09:41", type: "Video loop", subject: "CS3021", severity: "High" as const },
  { id: "sp3", student: "Rohit Menon", roll: "CS22B1027", time: "09:12", type: "Mask / print", subject: "CS3021", severity: "Medium" as const },
];

export const teacherNotifications: {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}[] = [
  { id: "tn1", kind: "attendance-open", title: "Database Systems session is live", body: "CS3110 · Block A 112 · 41 of 58 students verified so far.", time: "2m ago", unread: true },
  { id: "tn2", kind: "attendance-rejected", title: "Spoof attempt blocked", body: "Ishita Verma · CS3110 · static image replay detected at 11:33.", time: "5m ago", unread: true },
  { id: "tn3", kind: "appeal-approved", title: "Appeal APL-2026-0392 approved", body: "You corrected Aarav Sharma's Operating Systems record to Present.", time: "Yesterday", unread: false },
  { id: "tn4", kind: "attendance-closed", title: "Attendance window closed", body: "Operating Systems · 06 Aug closed at 09:12 with 58 of 61 verified.", time: "3h ago", unread: false },
  { id: "tn5", kind: "announcement", title: "Faculty face re-enrollment", body: "Re-enroll your biometric profile before 20 Aug for exam hall access.", time: "22 Jul", unread: false },
];

export const teacherWeekly = [
  { week: "W1", value: 91 },
  { week: "W2", value: 88 },
  { week: "W3", value: 93 },
  { week: "W4", value: 85 },
  { week: "W5", value: 89 },
  { week: "W6", value: 94 },
];

export const teacherMonthly = [
  { week: "Mar", value: 88 },
  { week: "Apr", value: 90 },
  { week: "May", value: 84 },
  { week: "Jun", value: 87 },
  { week: "Jul", value: 91 },
  { week: "Aug", value: 93 },
];

export const teacherSemester = [
  { week: "Sem 1", value: 86 },
  { week: "Sem 2", value: 89 },
  { week: "Sem 3", value: 84 },
  { week: "Sem 4", value: 90 },
  { week: "Sem 5", value: 88 },
  { week: "Sem 6", value: 92 },
];

export const teacherSubjectAttendance = [
  { subject: "OS-B", percentage: 92 },
  { subject: "DBMS-A", percentage: 86 },
  { subject: "CD-A", percentage: 79 },
  { subject: "DB Lab", percentage: 95 },
];

export const attendanceModes = [
  { id: "face", label: "Face Only", hint: "Liveness + face match, no secondary factor" },
  { id: "qr", label: "QR + Face", hint: "Rotating QR projected in class, then face match" },
  { id: "code", label: "Attendance Code + Face", hint: "6-digit spoken code, then face match" },
  { id: "manual", label: "Emergency Manual", hint: "Teacher marks the register — fully audited" },
] as const;
