import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  FileClock,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import { ArgusLogo } from "@/components/argus/argus-logo";
import { ThemeToggle } from "@/components/argus/theme-toggle";

export const Route = createFileRoute("/teacher")({
  component: TeacherLayout,
});

const navigation = [
  {
    label: "Workspace",
    items: [
      {
        title: "Dashboard",
        to: "/teacher/",
        icon: LayoutDashboard,
      },
      {
        title: "My Classes",
        to: "/teacher/classes",
        icon: BookOpen,
      },
      {
        title: "Sessions",
        to: "/teacher/session",
        icon: CalendarDays,
      },
      {
        title: "Live Attendance",
        to: "/teacher/live",
        icon: Activity,
      },
    ],
  },
  {
    label: "Attendance & Reports",
    items: [
      {
        title: "Attendance History",
        to: "/teacher/history",
        icon: FileClock,
      },
      {
        title: "Analytics",
        to: "/teacher/analytics",
        icon: BarChart3,
      },
      {
        title: "Reports",
        to: "/teacher/reports",
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    label: "Student Management",
    items: [
      {
        title: "Appeals",
        to: "/teacher/appeals",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Notifications",
        to: "/teacher/notifications",
        icon: Bell,
      },
      {
        title: "My Profile",
        to: "/teacher/profile",
        icon: UserRound,
      },
      {
        title: "Settings",
        to: "/teacher/settings",
        icon: Settings,
      },
    ],
  },
] as const;

function TeacherLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isActive = (to: string) => {
    if (to === "/teacher/") {
      return pathname === "/teacher" || pathname === "/teacher/";
    }

    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b border-border px-5">
            <Link to="/teacher/" className="flex items-center">
              <ArgusLogo />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <div className="mb-5 border border-border bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center border border-border">
                  <GraduationCap className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">Teacher Portal</p>
                  <p className="text-xs text-muted-foreground">
                    Faculty workspace
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-6">
              {navigation.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.to);

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors ${
                            active
                              ? "border-foreground bg-muted font-medium text-foreground"
                              : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-xs text-muted-foreground">
                Appearance
              </span>
              <ThemeToggle />
            </div>

            <Link
              to="/auth/login"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top navigation */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Link to="/teacher/">
                  <ArgusLogo />
                </Link>
              </div>

              <div className="hidden text-sm text-muted-foreground lg:block">
                Faculty Portal
                <span className="mx-2">/</span>
                <span className="text-foreground">ARGUS</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/teacher/notifications"
                aria-label="Notifications"
                className="flex h-9 w-9 items-center justify-center border border-border hover:bg-muted/50"
              >
                <Bell className="h-4 w-4" />
              </Link>

              <Link
                to="/teacher/profile"
                className="flex h-9 w-9 items-center justify-center border border-border hover:bg-muted/50"
                aria-label="Teacher profile"
              >
                <UserRound className="h-4 w-4" />
              </Link>

              <div className="lg:hidden">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Mobile navigation */}
          <div className="border-b border-border bg-background px-3 py-2 lg:hidden">
            <nav className="flex gap-1 overflow-x-auto">
              {navigation.flatMap((group) =>
                group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex shrink-0 items-center gap-2 border px-3 py-2 text-xs ${
                        active
                          ? "border-foreground bg-muted font-medium"
                          : "border-transparent text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.title}
                    </Link>
                  );
                }),
              )}
            </nav>
          </div>

          <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1440px]">
              <Outlet />
            </div>
          </main>

          <footer className="border-t border-border px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
              <span>ARGUS · Teacher Workspace</span>
              <span>Identity Verification & Smart Attendance</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
