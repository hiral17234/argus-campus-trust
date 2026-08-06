import type { StatusTone } from "@/components/argus/status-chip";
import type { NotificationKind } from "@/components/argus/notification-card";

export const admin = {
  name: "Rajeev Kulkarni",
  employeeId: "ADM-2016-0004",
  email: "rajeev.kulkarni@college.edu",
  role: "Institution Administrator",
  scope: "All departments · All campuses",
  lastLogin: "06 Aug 2026, 08:41 · Chrome 126 · 10.42.8.19",
  permissions: [
    "Manage students, teachers and departments",
    "Configure attendance and security policies",
    "Approve manual attendance corrections",
    "Access audit logs and export institution data",
    "Broadcast institution-wide notifications",
  ],
  devices: [
    { id: "ad1", name: "Admin Workstation", os: "Windows 11 Enterprise", browser: "Chrome 126", last: "Today, 08:41", trusted: true },
    { id: "ad2", name: "iPhone 15 Pro", os: "iOS 18.2", browser: "Safari", last: "Yesterday, 21:12", trusted: true },
  ],
};

export const institution = {
  name: "Sardar Institute of Technology",
  code: "SIT-KA-014",
  campuses: 2,
  students: 4218,
  teachers: 286,
  departments: 9,
  subjects: 412,
  activeSessions: 34,
  todayAttendance: 91.4,
  pendingAppeals: 27,
  securityAlerts: 6,
  uptime: 99.98,
};

export type AdminStudent = {
  id: string;
  name: string;
  roll: string;
  year: string;
  branch: string;
  section: string;
  email: string;
  attendance: number;
  face: "Enrolled" | "Pending" | "Re-enroll";
  status: "Active" | "Suspended" | "Blocked";
};

export const adminStudents: AdminStudent[] = [
  { id: "as1", name: "Aarav Sharma", roll: "CS22B1043", year: "3rd", branch: "CSE", section: "B", email: "aarav.sharma@college.edu", attendance: 92, face: "Enrolled", status: "Active" },
  { id: "as2", name: "Diya Nair", roll: "CS22B1009", year: "3rd", branch: "CSE", section: "B", email: "diya.nair@college.edu", attendance: 96, face: "Enrolled", status: "Active" },
  { id: "as3", name: "Rohit Menon", roll: "CS22B1027", year: "3rd", branch: "CSE", section: "A", email: "rohit.menon@college.edu", attendance: 61, face: "Re-enroll", status: "Active" },
  { id: "as4", name: "Ishita Verma", roll: "CS22B1055", year: "3rd", branch: "CSE", section: "B", email: "ishita.verma@college.edu", attendance: 54, face: "Pending", status: "Suspended" },
  { id: "as5", name: "Kabir Anand", roll: "EC22B2011", year: "3rd", branch: "ECE", section: "A", email: "kabir.anand@college.edu", attendance: 88, face: "Enrolled", status: "Active" },
  { id: "as6", name: "Sneha Pillai", roll: "ME21B3007", year: "4th", branch: "MECH", section: "B", email: "sneha.pillai@college.edu", attendance: 64, face: "Enrolled", status: "Active" },
  { id: "as7", name: "Vivaan Joshi", roll: "CS21B1034", year: "4th", branch: "CSE", section: "A", email: "vivaan.joshi@college.edu", attendance: 79, face: "Enrolled", status: "Blocked" },
  { id: "as8", name: "Ananya Rao", roll: "CV22B4022", year: "3rd", branch: "CIVIL", section: "A", email: "ananya.rao@college.edu", attendance: 68, face: "Enrolled", status: "Active" },
];

export const studentStatusTone: Record<AdminStudent["status"], StatusTone> = {
  Active: "success",
  Suspended: "warning",
  Blocked: "danger",
};

export type AdminTeacher = {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  subjects: string[];
  sessions: number;
  status: "Active" | "On leave" | "Suspended";
};

export const adminTeachers: AdminTeacher[] = [
  { id: "at1", name: "Dr. Meera Iyer", employeeId: "FAC-2019-0187", department: "Computer Science", designation: "Associate Professor", subjects: ["CS3021", "CS3110", "CS3402"], sessions: 214, status: "Active" },
  { id: "at2", name: "Prof. R. Venkatesh", employeeId: "FAC-2014-0061", department: "Computer Science", designation: "Professor", subjects: ["CS3044", "CS4102"], sessions: 188, status: "Active" },
  { id: "at3", name: "Dr. Anita Rao", employeeId: "FAC-2020-0233", department: "Computer Science", designation: "Assistant Professor", subjects: ["CS3110"], sessions: 132, status: "On leave" },
  { id: "at4", name: "Dr. S. Krishnan", employeeId: "FAC-2012-0018", department: "Electronics", designation: "Professor & HOD", subjects: ["EC3201", "EC3310"], sessions: 240, status: "Active" },
  { id: "at5", name: "Prof. Leela Fernandes", employeeId: "FAC-2018-0140", department: "Mechanical", designation: "Associate Professor", subjects: ["ME3105"], sessions: 96, status: "Suspended" },
];

export const teacherStatusTone: Record<AdminTeacher["status"], StatusTone> = {
  Active: "success",
  "On leave": "info",
  Suspended: "danger",
};

export type Department = {
  id: string;
  name: string;
  code: string;
  hod: string;
  students: number;
  teachers: number;
  subjects: number;
  attendance: number;
};

export const departments: Department[] = [
  { id: "d1", name: "Computer Science & Engineering", code: "CSE", hod: "Dr. Meera Iyer", students: 986, teachers: 62, subjects: 74, attendance: 92 },
  { id: "d2", name: "Electronics & Communication", code: "ECE", hod: "Dr. S. Krishnan", students: 742, teachers: 48, subjects: 66, attendance: 88 },
  { id: "d3", name: "Mechanical Engineering", code: "MECH", hod: "Prof. Leela Fernandes", students: 610, teachers: 41, subjects: 58, attendance: 81 },
  { id: "d4", name: "Civil Engineering", code: "CIVIL", hod: "Dr. P. Ramesh", students: 528, teachers: 36, subjects: 52, attendance: 84 },
  { id: "d5", name: "Information Technology", code: "IT", hod: "Dr. Nandita Bose", students: 704, teachers: 45, subjects: 61, attendance: 90 },
];

export type Subject = {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  section: string;
  teacher: string;
  credits: number;
};

export const subjects: Subject[] = [
  { id: "sb1", code: "CS3021", name: "Operating Systems", department: "CSE", semester: "Semester 6", section: "B", teacher: "Dr. Meera Iyer", credits: 4 },
  { id: "sb2", code: "CS3110", name: "Database Systems", department: "CSE", semester: "Semester 6", section: "A", teacher: "Dr. Anita Rao", credits: 4 },
  { id: "sb3", code: "CS3044", name: "Computer Networks", department: "CSE", semester: "Semester 6", section: "B", teacher: "Prof. R. Venkatesh", credits: 3 },
  { id: "sb4", code: "EC3201", name: "Digital Signal Processing", department: "ECE", semester: "Semester 5", section: "A", teacher: "Dr. S. Krishnan", credits: 4 },
  { id: "sb5", code: "ME3105", name: "Thermodynamics", department: "MECH", semester: "Semester 4", section: "A", teacher: "Prof. Leela Fernandes", credits: 3 },
];

export const academicSessions = [
  { id: "ac1", name: "2026 – 2027 Odd", start: "01 Jul 2026", end: "30 Nov 2026", status: "Active" as const },
  { id: "ac2", name: "2025 – 2026 Even", start: "02 Jan 2026", end: "15 May 2026", status: "Closed" as const },
  { id: "ac3", name: "2025 – 2026 Odd", start: "01 Jul 2025", end: "28 Nov 2025", status: "Archived" as const },
];

export const rooms = [
  { id: "r1", name: "Block A · 112", capacity: 70, type: "Lecture hall", geofence: "25 m" },
  { id: "r2", name: "Block C · 204", capacity: 65, type: "Lecture hall", geofence: "25 m" },
  { id: "r3", name: "Block C · 301", capacity: 60, type: "Lecture hall", geofence: "20 m" },
  { id: "r4", name: "Lab 3", capacity: 32, type: "Laboratory", geofence: "15 m" },
  { id: "r5", name: "Seminar Hall", capacity: 220, type: "Auditorium", geofence: "40 m" },
];

export const timetable = [
  { id: "tt1", slot: "09:00 – 09:50", mon: "CS3021 · C204", tue: "CS3044 · C208", wed: "CS3021 · C204", thu: "CS3110 · A112", fri: "CS3402 · C301" },
  { id: "tt2", slot: "10:00 – 10:50", mon: "CS3044 · C208", tue: "CS3110 · A112", wed: "CS3044 · C208", thu: "CS3021 · C204", fri: "CS3110 · A112" },
  { id: "tt3", slot: "11:30 – 12:20", mon: "CS3110 · A112", tue: "CS3402 · C301", wed: "CS3110 · A112", thu: "CS3044 · C208", fri: "CS3021 · C204" },
  { id: "tt4", slot: "14:00 – 14:50", mon: "CS3402 · C301", tue: "Lab 3", wed: "CS3402 · C301", thu: "Lab 3", fri: "Mentoring" },
];

export type SecurityEvent = {
  id: string;
  type: "Spoof attempt" | "Unknown device" | "Multiple logins" | "Location violation" | "Blocked account";
  user: string;
  role: "Student" | "Teacher" | "Admin";
  detail: string;
  time: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Investigating" | "Resolved";
};

export const securityEvents: SecurityEvent[] = [
  { id: "se1", type: "Spoof attempt", user: "Ishita Verma · CS22B1055", role: "Student", detail: "Static photo replay during CS3110 verification", time: "06 Aug, 11:33", severity: "Critical", status: "Open" },
  { id: "se2", type: "Unknown device", user: "Rohit Menon · CS22B1027", role: "Student", detail: "Sign-in from unregistered Android device", time: "06 Aug, 09:14", severity: "High", status: "Investigating" },
  { id: "se3", type: "Multiple logins", user: "Vivaan Joshi · CS21B1034", role: "Student", detail: "4 concurrent sessions across 3 IP ranges", time: "05 Aug, 18:02", severity: "High", status: "Open" },
  { id: "se4", type: "Location violation", user: "Ananya Rao · CV22B4022", role: "Student", detail: "Verified 480 m outside the classroom geofence", time: "05 Aug, 14:21", severity: "Medium", status: "Resolved" },
  { id: "se5", type: "Blocked account", user: "Prof. Leela Fernandes", role: "Teacher", detail: "Account suspended after 6 failed OTP attempts", time: "04 Aug, 10:47", severity: "Medium", status: "Resolved" },
  { id: "se6", type: "Spoof attempt", user: "Unknown", role: "Student", detail: "Video loop detected on CS3021 session camera", time: "04 Aug, 09:41", severity: "Critical", status: "Investigating" },
];

export const severityTone: Record<SecurityEvent["severity"], StatusTone> = {
  Low: "neutral",
  Medium: "warning",
  High: "danger",
  Critical: "danger",
};

export const securityStatusTone: Record<SecurityEvent["status"], StatusTone> = {
  Open: "danger",
  Investigating: "warning",
  Resolved: "success",
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  role: "Student" | "Teacher" | "Admin" | "System";
  action: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
};

export const auditLogs: AuditEntry[] = [
  { id: "au1", timestamp: "06 Aug 2026, 11:32:04", user: "Dr. Meera Iyer", role: "Teacher", action: "Opened attendance session CS3110", device: "Faculty Laptop", browser: "Edge 128", ip: "10.42.8.44", location: "Block A · Campus 1" },
  { id: "au2", timestamp: "06 Aug 2026, 11:33:20", user: "System", role: "System", action: "Blocked spoof attempt for CS22B1055", device: "Session camera", browser: "—", ip: "10.42.8.201", location: "Block A · 112" },
  { id: "au3", timestamp: "06 Aug 2026, 09:41:11", user: "Rajeev Kulkarni", role: "Admin", action: "Updated attendance policy: minimum 75%", device: "Admin Workstation", browser: "Chrome 126", ip: "10.42.8.19", location: "Admin Block" },
  { id: "au4", timestamp: "05 Aug 2026, 18:02:47", user: "Vivaan Joshi", role: "Student", action: "Sign-in rejected — concurrent session limit", device: "Pixel 8", browser: "Chrome 126", ip: "49.204.12.88", location: "Off campus" },
  { id: "au5", timestamp: "05 Aug 2026, 15:22:03", user: "Rohit Menon", role: "Student", action: "Submitted appeal APL-2026-0418", device: "iPhone 14", browser: "Safari", ip: "10.42.9.77", location: "Block C · Campus 1" },
  { id: "au6", timestamp: "04 Aug 2026, 10:47:39", user: "System", role: "System", action: "Suspended account FAC-2018-0140", device: "—", browser: "—", ip: "—", location: "—" },
];

export const roleTone: Record<AuditEntry["role"], StatusTone> = {
  Student: "info",
  Teacher: "success",
  Admin: "warning",
  System: "neutral",
};

export const adminNotifications: {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}[] = [
  { id: "an1", kind: "attendance-rejected", title: "Critical: 2 spoof attempts today", body: "CS3110 and CS3021 sessions blocked replay attacks. Review the security centre.", time: "8m ago", unread: true },
  { id: "an2", kind: "attendance-open", title: "34 attendance sessions active", body: "Peak load across 5 departments. Median verification latency 320 ms.", time: "20m ago", unread: true },
  { id: "an3", kind: "appeal-rejected", title: "27 appeals awaiting faculty action", body: "9 appeals have crossed the 48-hour institutional SLA.", time: "2h ago", unread: false },
  { id: "an4", kind: "announcement", title: "Semester 6 examination notice published", body: "Broadcast delivered to 4,218 students and 286 faculty members.", time: "Yesterday", unread: false },
  { id: "an5", kind: "attendance-closed", title: "Nightly attendance reconciliation complete", body: "1,284 sessions reconciled. 3 manual corrections queued for approval.", time: "2d ago", unread: false },
];

export const institutionTrend = [
  { week: "W1", value: 89 },
  { week: "W2", value: 91 },
  { week: "W3", value: 87 },
  { week: "W4", value: 92 },
  { week: "W5", value: 90 },
  { week: "W6", value: 93 },
];

export const departmentComparison = [
  { subject: "CSE", percentage: 92 },
  { subject: "IT", percentage: 90 },
  { subject: "ECE", percentage: 88 },
  { subject: "CIVIL", percentage: 84 },
  { subject: "MECH", percentage: 81 },
];

export const securityTrend = [
  { week: "W1", value: 12 },
  { week: "W2", value: 9 },
  { week: "W3", value: 15 },
  { week: "W4", value: 7 },
  { week: "W5", value: 10 },
  { week: "W6", value: 6 },
];

export const attendancePolicies = [
  { id: "p1", label: "Minimum attendance", value: "75%", hint: "Below this students are flagged for detention review" },
  { id: "p2", label: "Attendance window", value: "10 minutes", hint: "Default duration a session stays open" },
  { id: "p3", label: "Late entry grace", value: "5 minutes", hint: "Marked Late instead of Absent within this window" },
  { id: "p4", label: "Location radius", value: "25 metres", hint: "Geofence around the mapped classroom" },
  { id: "p5", label: "Allowed devices", value: "2 per student", hint: "Additional devices require admin approval" },
  { id: "p6", label: "QR rotation", value: "15 seconds", hint: "Dynamic QR refresh interval" },
  { id: "p7", label: "Attendance code length", value: "6 digits", hint: "Alphanumeric, single-use per session" },
];

export const holidays = [
  { id: "h1", name: "Independence Day", date: "15 Aug 2026", type: "National" },
  { id: "h2", name: "Ganesh Chaturthi", date: "14 Sep 2026", type: "Regional" },
  { id: "h3", name: "Institution Foundation Day", date: "02 Oct 2026", type: "Institutional" },
  { id: "h4", name: "Mid-semester break", date: "19 – 24 Oct 2026", type: "Academic" },
];

export const manualCorrections = [
  { id: "mc1", student: "Aarav Sharma · CS22B1043", subject: "CS3021", date: "31 Jul 2026", requestedBy: "Dr. Meera Iyer", reason: "Lab register verified", status: "Pending" as const },
  { id: "mc2", student: "Diya Nair · CS22B1009", subject: "CS3110", date: "29 Jul 2026", requestedBy: "Dr. Anita Rao", reason: "Camera outage in Block A", status: "Approved" as const },
  { id: "mc3", student: "Kabir Anand · EC22B2011", subject: "EC3201", date: "24 Jul 2026", requestedBy: "Dr. S. Krishnan", reason: "Medical leave documentation", status: "Rejected" as const },
];

export const correctionTone: Record<"Pending" | "Approved" | "Rejected", StatusTone> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};
