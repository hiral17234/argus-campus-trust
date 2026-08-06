import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Bell,
  BarChart3,
  CalendarDays,
  FileWarning,
  History,
  LayoutDashboard,
  MonitorPlay,
  PlayCircle,
  FileBarChart,
  Settings,
  User,
} from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/argus/portal-shell";
import { teacher } from "@/lib/teacher-data";

export const Route = createFileRoute("/teacher")({
  component: TeacherLayout,
});

const navItems: PortalNavItem[] = [
  { to: "/teacher", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/teacher/classes", label: "Today's classes", icon: CalendarDays },
  { to: "/teacher/session", label: "Attendance session", icon: PlayCircle },
  { to: "/teacher/live", label: "Live monitoring", icon: MonitorPlay },
  { to: "/teacher/history", label: "Attendance history", icon: History },
  { to: "/teacher/appeals", label: "Appeals", icon: FileWarning, badge: 2 },
  { to: "/teacher/reports", label: "Reports", icon: FileBarChart },
  { to: "/teacher/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/teacher/notifications", label: "Notifications", icon: Bell, badge: 2 },
  { to: "/teacher/profile", label: "Profile", icon: User },
  { to: "/teacher/settings", label: "Settings", icon: Settings },
];

const bottomItems: PortalNavItem[] = [
  { to: "/teacher", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/teacher/classes", label: "Classes", icon: CalendarDays },
  { to: "/teacher/session", label: "Session", icon: PlayCircle },
  { to: "/teacher/appeals", label: "Appeals", icon: FileWarning },
  { to: "/teacher/profile", label: "Profile", icon: User },
];

function TeacherLayout() {
  return (
    <PortalShell
      portalLabel="Faculty Portal"
      navItems={navItems}
      bottomItems={bottomItems}
      user={{ name: teacher.name, subtitle: teacher.employeeId, email: teacher.email }}
      profileTo="/teacher/profile"
      settingsTo="/teacher/settings"
      notificationsTo="/teacher/notifications"
      headerStatus="Session live"
      searchPlaceholder="Search students, sessions, appeals…"
      panel={{
        label: "AI Engine",
        tone: "success",
        status: "Online",
        description: "Face matching v2.4 · Liveness enabled · Avg. 340ms",
      }}
    >
      <Outlet />
    </PortalShell>
  );
}
