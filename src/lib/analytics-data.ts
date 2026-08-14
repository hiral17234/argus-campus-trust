import type { StatusTone } from "@/components/argus/status-chip";

/**
 * DEMO DATA ONLY.
 * Every value in this module is mock frontend data used while the analytics
 * backend is being built. Confidence scores, verification counts and insights
 * are NOT produced by a real model or pipeline and must be replaced by
 * server-provided data before production use.
 */
export const DEMO_DATA_NOTICE =
  "Demo data — figures are simulated for interface development and are not produced by the live verification pipeline.";

export const ATTENDANCE_THRESHOLD = 75;

export type DateRangeKey = "today" | "week" | "month" | "semester" | "custom";

export const dateRanges: { key: DateRangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "semester", label: "Current semester" },
  { key: "custom", label: "Custom range" },
];

export const departmentOptions = ["All departments", "CSE", "ECE", "MECH", "CIVIL", "IT"];
export const yearOptions = ["All years", "1st", "2nd", "3rd", "4th"];
export const semesterOptions = ["All semesters", "Semester 4", "Semester 5", "Semester 6"];
export const branchOptions = ["All branches", "CSE", "ECE", "MECH", "CIVIL", "IT"];
export const sectionOptions = ["All sections", "A", "B", "C"];

/** Deterministic pseudo-variation so filter changes visibly and consistently update figures. */
export function seedFrom(...parts: string[]) {
  const s = parts.join("|");
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 100000;
  return h;
}

export function scaleBy(base: number, seed: number, spread = 0.12, min?: number, max?: number) {
  const factor = 1 + (((seed % 200) / 100) - 1) * spread;
  const value = base * factor;
  const clamped = Math.min(max ?? Number.MAX_SAFE_INTEGER, Math.max(min ?? 0, value));
  return clamped;
}

export function scaleInt(base: number, seed: number, spread = 0.2) {
  return Math.max(0, Math.round(scaleBy(base, seed, spread)));
}

export function scalePercent(base: number, seed: number, spread = 0.06) {
  return Number(scaleBy(base, seed, spread, 0, 100).toFixed(1));
}

/* ---------------------------------- Heatmap --------------------------------- */

export type HeatmapCell = {
  row: string;
  col: string;
  value: number | null;
  label: string;
};

export const heatmapSlots = ["09:00", "10:00", "11:30", "14:00", "15:00"];
export const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const heatmapWeeks = ["W1", "W2", "W3", "W4", "W5", "W6"];
export const heatmapMonths = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

function buildGrid(rows: string[], cols: string[], seed: number): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  rows.forEach((row, r) => {
    cols.forEach((col, c) => {
      const raw = (seed + r * 37 + c * 53) % 100;
      // last slot of the day is consistently lower — mirrors the insight below
      const penalty = r === rows.length - 1 ? 18 : 0;
      const value = raw < 6 ? null : Math.max(38, Math.min(99, 96 - (raw % 34) - penalty));
      cells.push({
        row,
        col,
        value,
        label: value === null ? `${row} · ${col}: no session` : `${row} · ${col}: ${value}% attendance`,
      });
    });
  });
  return cells;
}

export function heatmapData(view: "day" | "week" | "month" | "session", seed = 17) {
  if (view === "day") return { rows: heatmapSlots, cols: heatmapDays, cells: buildGrid(heatmapSlots, heatmapDays, seed) };
  if (view === "week") return { rows: heatmapSlots, cols: heatmapWeeks, cells: buildGrid(heatmapSlots, heatmapWeeks, seed + 5) };
  if (view === "month") return { rows: heatmapDays, cols: heatmapMonths, cells: buildGrid(heatmapDays, heatmapMonths, seed + 11) };
  const sessions = ["CS3021", "CS3110", "CS3044", "CS3402", "EC3201"];
  return { rows: sessions, cols: heatmapWeeks, cells: buildGrid(sessions, heatmapWeeks, seed + 23) };
}

/* --------------------------------- Insights --------------------------------- */

export type InsightSource = "data" | "ai" | "recommendation";

export type Insight = {
  id: string;
  source: InsightSource;
  title: string;
  detail: string;
  basis: string;
  tone?: StatusTone;
};

export const insightSourceLabel: Record<InsightSource, string> = {
  data: "Data-derived",
  ai: "AI-generated",
  recommendation: "Recommendation",
};

export const institutionInsights: Insight[] = [
  {
    id: "i1",
    source: "data",
    title: "Average attendance decreased across the last three weeks",
    detail: "Institution average moved from 93% (W4) to 90% (W6).",
    basis: "Computed from session records W4–W6.",
    tone: "warning",
  },
  {
    id: "i2",
    source: "data",
    title: "128 students are below the configured 75% threshold",
    detail: "Highest concentration in MECH (41) and CIVIL (32).",
    basis: "Computed from current semester attendance ledger.",
    tone: "danger",
  },
  {
    id: "i3",
    source: "data",
    title: "Attendance is lowest in the final session of the day",
    detail: "14:00–15:00 slots average 78% against a 90% daily average.",
    basis: "Computed from slot-level session aggregates.",
  },
  {
    id: "i4",
    source: "recommendation",
    title: "Review geofence radius for Block C",
    detail: "Location verification failures in Block C are 3.1x the campus median.",
    basis: "Suggested action based on verification failure counts. Not a prediction.",
  },
];

export const teacherInsights: Insight[] = [
  {
    id: "ti1",
    source: "data",
    title: "Section B averages 6 points below Section A",
    detail: "CS3110: Section A 92%, Section B 86% this month.",
    basis: "Computed from your session records.",
  },
  {
    id: "ti2",
    source: "data",
    title: "9 students in your subjects are below 75%",
    detail: "4 of them are within 3 points of detention review.",
    basis: "Computed from the current semester ledger for your subjects.",
    tone: "warning",
  },
  {
    id: "ti3",
    source: "recommendation",
    title: "Consider extending the verification window for Lab 3",
    detail: "Lab 3 sessions show the highest rate of late verification attempts.",
    basis: "Suggested action based on timing data. Not a prediction.",
  },
];

export const studentInsights: Insight[] = [
  {
    id: "si1",
    source: "data",
    title: "Machine Learning attendance is below the 75% threshold",
    detail: "Currently 64%. You need 6 consecutive present sessions to reach 75%.",
    basis: "Computed from your attendance records.",
    tone: "danger",
  },
  {
    id: "si2",
    source: "data",
    title: "Your attendance improved over the last two weeks",
    detail: "83% (W5) to 87% (W6) across all subjects.",
    basis: "Computed from your attendance records.",
    tone: "success",
  },
];

/* ------------------------------ Risk indicator ------------------------------ */

export type RiskLevel = "Normal" | "Attention" | "High Risk";

export function riskFor(attendance: number, threshold = ATTENDANCE_THRESHOLD): RiskLevel {
  if (attendance < threshold) return "High Risk";
  if (attendance < threshold + 8) return "Attention";
  return "Normal";
}

export const riskLevelTone: Record<RiskLevel, StatusTone> = {
  Normal: "success",
  Attention: "warning",
  "High Risk": "danger",
};

/* --------------------------- Verification analytics -------------------------- */

export type VerificationMetricKind = "failure" | "risk";

export type VerificationMetric = {
  id: string;
  label: string;
  count: number;
  kind: VerificationMetricKind;
  description: string;
};

export const verificationMetrics: VerificationMetric[] = [
  { id: "v1", label: "Successful face verification", count: 12841, kind: "failure", description: "Identity matched and liveness passed." },
  { id: "v2", label: "Failed face verification", count: 412, kind: "failure", description: "Match score below the configured threshold." },
  { id: "v3", label: "Liveness failures", count: 168, kind: "failure", description: "No liveness signal captured within the window." },
  { id: "v4", label: "Gesture failures", count: 121, kind: "failure", description: "Requested gesture not completed in time." },
  { id: "v5", label: "Multiple-face detections", count: 74, kind: "failure", description: "More than one face in frame during capture." },
  { id: "v6", label: "Poor lighting / quality", count: 233, kind: "failure", description: "Frame quality below the capture threshold." },
  { id: "v7", label: "Location verification failures", count: 96, kind: "risk", description: "Verified outside the mapped classroom geofence." },
  { id: "v8", label: "Device trust warnings", count: 58, kind: "risk", description: "Attempt from an unregistered or untrusted device." },
  { id: "v9", label: "Suspicious attempts", count: 21, kind: "risk", description: "Replay, print or synthetic media signals detected." },
];

export const confidenceBuckets = [
  { subject: "0–20", percentage: 1 },
  { subject: "20–40", percentage: 2 },
  { subject: "40–60", percentage: 4 },
  { subject: "60–80", percentage: 11 },
  { subject: "80–90", percentage: 24 },
  { subject: "90–100", percentage: 58 },
];

export const confidenceSummary = {
  average: 94.8,
  success: 97.2,
  failed: 61.4,
  sampled: 13284,
};

export type VerificationRecord = {
  id: string;
  student: string;
  roll: string;
  subject: string;
  timestamp: string;
  identityMatch: number;
  liveness: "Passed" | "Failed";
  gesture: "Passed" | "Failed";
  location: "Verified" | "Out of range";
  device: "Trusted" | "Untrusted";
  overall: number;
  outcome: "Verified" | "Rejected" | "Flagged";
};

export const verificationRecords: VerificationRecord[] = [
  { id: "vr1", student: "Aarav Sharma", roll: "CS22B1043", subject: "CS3110", timestamp: "06 Aug, 11:32", identityMatch: 97, liveness: "Passed", gesture: "Passed", location: "Verified", device: "Trusted", overall: 96, outcome: "Verified" },
  { id: "vr2", student: "Diya Nair", roll: "CS22B1009", subject: "CS3110", timestamp: "06 Aug, 11:32", identityMatch: 95, liveness: "Passed", gesture: "Passed", location: "Verified", device: "Trusted", overall: 94, outcome: "Verified" },
  { id: "vr3", student: "Rohit Menon", roll: "CS22B1027", subject: "CS3110", timestamp: "06 Aug, 11:32", identityMatch: 88, liveness: "Passed", gesture: "Failed", location: "Out of range", device: "Untrusted", overall: 62, outcome: "Rejected" },
  { id: "vr4", student: "Ishita Verma", roll: "CS22B1055", subject: "CS3110", timestamp: "06 Aug, 11:33", identityMatch: 44, liveness: "Failed", gesture: "Failed", location: "Verified", device: "Untrusted", overall: 31, outcome: "Flagged" },
  { id: "vr5", student: "Kabir Anand", roll: "EC22B2011", subject: "EC3201", timestamp: "06 Aug, 10:12", identityMatch: 96, liveness: "Passed", gesture: "Passed", location: "Verified", device: "Trusted", overall: 95, outcome: "Verified" },
  { id: "vr6", student: "Ananya Rao", roll: "CV22B4022", subject: "CS3044", timestamp: "05 Aug, 14:22", identityMatch: 91, liveness: "Passed", gesture: "Passed", location: "Out of range", device: "Trusted", overall: 74, outcome: "Rejected" },
];

export const verificationOutcomeTone: Record<VerificationRecord["outcome"], StatusTone> = {
  Verified: "success",
  Rejected: "warning",
  Flagged: "danger",
};

/* --------------------------------- Reports ---------------------------------- */

export type ReportKind =
  | "daily"
  | "subject"
  | "student"
  | "section"
  | "department"
  | "semester"
  | "verification"
  | "rejected"
  | "appeal";

export const reportKinds: { key: ReportKind; label: string; description: string; scope: ("admin" | "teacher")[] }[] = [
  { key: "daily", label: "Daily attendance report", description: "Session-level attendance for a single day", scope: ["admin", "teacher"] },
  { key: "subject", label: "Subject attendance report", description: "Attendance percentage per subject", scope: ["admin", "teacher"] },
  { key: "student", label: "Student attendance report", description: "Per-student ledger with totals", scope: ["admin", "teacher"] },
  { key: "section", label: "Section report", description: "Section-wise comparison and totals", scope: ["admin", "teacher"] },
  { key: "department", label: "Department report", description: "Department roll-up across subjects", scope: ["admin"] },
  { key: "semester", label: "Semester report", description: "Full semester attendance summary", scope: ["admin", "teacher"] },
  { key: "verification", label: "Verification report", description: "Verification outcomes and confidence", scope: ["admin", "teacher"] },
  { key: "rejected", label: "Rejected attendance report", description: "Rejected and flagged attempts with reasons", scope: ["admin", "teacher"] },
  { key: "appeal", label: "Appeal report", description: "Appeals raised, resolved and pending", scope: ["admin", "teacher"] },
];

export type ReportRow = {
  id: string;
  student: string;
  roll: string;
  subject: string;
  section: string;
  department: string;
  sessions: number;
  present: number;
  late: number;
  absent: number;
  attendance: number;
};

const names: [string, string, string, string][] = [
  ["Aarav Sharma", "CS22B1043", "CSE", "B"],
  ["Diya Nair", "CS22B1009", "CSE", "B"],
  ["Rohit Menon", "CS22B1027", "CSE", "A"],
  ["Ishita Verma", "CS22B1055", "CSE", "B"],
  ["Kabir Anand", "EC22B2011", "ECE", "A"],
  ["Sneha Pillai", "ME21B3007", "MECH", "B"],
  ["Vivaan Joshi", "CS21B1034", "CSE", "A"],
  ["Ananya Rao", "CV22B4022", "CIVIL", "A"],
  ["Meher Kapoor", "IT22B5013", "IT", "A"],
  ["Yash Deshpande", "CS22B1071", "CSE", "C"],
  ["Nikita Shetty", "EC22B2044", "ECE", "B"],
  ["Arjun Prabhu", "ME22B3021", "MECH", "A"],
  ["Tara Bhatt", "IT22B5029", "IT", "B"],
  ["Farhan Qureshi", "CV22B4008", "CIVIL", "B"],
  ["Riya Chandran", "CS22B1088", "CSE", "C"],
  ["Devansh Gupta", "EC21B2003", "ECE", "A"],
  ["Aisha Khan", "IT21B5002", "IT", "A"],
  ["Manav Sinha", "ME22B3044", "MECH", "B"],
];

const subjectByBranch: Record<string, string> = {
  CSE: "CS3110 Database Systems",
  ECE: "EC3201 Digital Signal Processing",
  MECH: "ME3105 Thermodynamics",
  CIVIL: "CV3011 Structural Analysis",
  IT: "IT3105 Web Systems",
};

export const reportRows: ReportRow[] = names.map(([name, roll, dept, section], i) => {
  const sessions = 40 + (i % 5);
  const attendance = Math.max(48, Math.min(98, 92 - ((i * 13) % 46)));
  const present = Math.round((sessions * attendance) / 100);
  const late = i % 4;
  return {
    id: `rr${i + 1}`,
    student: name,
    roll,
    subject: subjectByBranch[dept] ?? "CS3110 Database Systems",
    section,
    department: dept,
    sessions,
    present,
    late,
    absent: sessions - present,
    attendance,
  };
});

/* ------------------------------- Comparisons -------------------------------- */

export const comparisonSets: Record<string, { label: string; series: { name: string; value: number }[] }> = {
  subjects: {
    label: "Subject A vs Subject B",
    series: [
      { name: "CS3021 Operating Systems", value: 92 },
      { name: "CS3110 Database Systems", value: 86 },
    ],
  },
  sections: {
    label: "Section A vs Section B",
    series: [
      { name: "Section A", value: 91 },
      { name: "Section B", value: 85 },
    ],
  },
  departments: {
    label: "Department comparison",
    series: [
      { name: "CSE", value: 92 },
      { name: "ECE", value: 88 },
      { name: "MECH", value: 81 },
    ],
  },
  periods: {
    label: "Current month vs previous month",
    series: [
      { name: "July 2026", value: 88 },
      { name: "August 2026", value: 91 },
    ],
  },
};

/* -------------------------- Student analytics data --------------------------- */

export const studentAnalytics = {
  overall: 82,
  present: 148,
  absent: 26,
  late: 7,
  rejected: 4,
  manualApproved: 3,
  appeals: 3,
  sessions: 181,
  semester: "Semester 6",
};

export const studentSubjectBreakdown = [
  { subject: "OS", name: "Operating Systems", percentage: 92, present: 46, total: 50 },
  { subject: "CN", name: "Computer Networks", percentage: 86, present: 43, total: 50 },
  { subject: "DBMS", name: "Database Systems", percentage: 78, present: 35, total: 45 },
  { subject: "ML", name: "Machine Learning", percentage: 64, present: 23, total: 36 },
  { subject: "SE", name: "Software Engineering", percentage: 71, present: 27, total: 38 },
];

/* -------------------------- Teacher analytics data --------------------------- */

export const teacherAnalyticsSummary = {
  todayAttendance: 88.2,
  averageAttendance: 89.4,
  belowThreshold: 9,
  lateCount: 14,
  rejected: 12,
  suspicious: 4,
  pendingAppeals: 2,
  sessionsConducted: 214,
};

export const teacherSubjectOptions = [
  "All subjects",
  "CS3021 Operating Systems",
  "CS3110 Database Systems",
  "CS3402 Compiler Design",
];

/* --------------------------- Admin analytics data ---------------------------- */

export const adminAnalyticsSummary = {
  students: 4218,
  teachers: 286,
  departments: 9,
  subjects: 412,
  classesConducted: 1284,
  sessionsCompleted: 1251,
  averageAttendance: 90.6,
  belowThreshold: 128,
  verificationAttempts: 13284,
  rejectedAttempts: 412,
  suspiciousAttempts: 21,
  appealsPending: 27,
  appealsResolved: 194,
};
