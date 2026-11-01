import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldAlert,
  User,
  Users,
} from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/argus/portal-shell";
import { admin, securityEvents } from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const openSecurityCount = securityEvents.filter((e) => e.status !== "Resolved").length;

const navItems: PortalNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/admin/departments", label: "Departments", icon: Building2 },
  { to: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { to: "/admin/security", label: "Security centre", icon: ShieldAlert, badge: openSecurityCount },
  { to: "/admin/audit", label: "Audit logs", icon: ScrollText },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, badge: 2 },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const bottomItems: PortalNavItem[] = [
  { to: "/admin", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/security", label: "Security", icon: ShieldAlert },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/profile", label: "Profile", icon: User },
];

function AdminLayout() {
  return (
    <PortalShell
      portalLabel="Institution Admin"
      navItems={navItems}
      bottomItems={bottomItems}
      user={{ name: admin.name, subtitle: admin.role, email: admin.email }}
      profileTo="/admin/profile"
      settingsTo="/admin/settings"
      notificationsTo="/admin/notifications"
      headerStatus={`${institution_activeSessions()} sessions live`}
      searchPlaceholder="Search students, teachers, policies, logs…"
      panel={{
        label: "Verification service",
        tone: "success",
        status: "Operational",
        description: "Face matching v2.4 · Liveness enabled · Uptime 99.98%",
      }}
    >
      <Outlet />
    </PortalShell>
  );
}

function institution_activeSessions() {
  return 34;
}
