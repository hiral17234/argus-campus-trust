import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  ChevronsLeft,
  ChevronsRight,
  FileWarning,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ArgusLogo, ArgusMark } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusChip } from "./status-chip";
import { Initials } from "./user-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { student } from "@/lib/argus-data";

const navItems = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/student/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/student/history", label: "History", icon: History },
  { to: "/student/appeals", label: "Appeals", icon: FileWarning },
  { to: "/student/notifications", label: "Notifications", icon: Bell, badge: 2 },
  { to: "/student/profile", label: "Profile", icon: User },
  { to: "/student/settings", label: "Settings", icon: Settings },
] as const;

const bottomItems = [
  { to: "/student", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/student/attendance", label: "Attend", icon: CalendarCheck },
  { to: "/student/history", label: "History", icon: History },
  { to: "/student/notifications", label: "Alerts", icon: Bell },
  { to: "/student/profile", label: "Profile", icon: User },
] as const;

function useActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (to: string, exact?: boolean) =>
    exact ? pathname === to || pathname === `${to}/` : pathname.startsWith(to);
}

function NavList({ collapsed, onNavigate }: { collapsed?: boolean | undefined; onNavigate?: (() => void) | undefined }) {
  const isActive = useActive();
  return (
    <nav className="space-y-0.5">
      {navItems.map((item) => {
        const active = isActive(item.to, "exact" in item ? item.exact : undefined);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed ? (
              <>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {"badge" in item && item.badge ? (
                  <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground tabular-nums">
                    {item.badge}
                  </span>
                ) : null}
              </>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ collapsed, onNavigate }: { collapsed?: boolean | undefined; onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col">
      <div className={cn("px-3 py-4", collapsed && "flex justify-center px-0")}>
        {collapsed ? <ArgusMark /> : <ArgusLogo showTagline />}
      </div>
      <div className={cn("px-3", collapsed && "px-2")}>
        {!collapsed ? (
          <p className="px-2.5 pb-2 pt-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Student Portal
          </p>
        ) : null}
        <NavList collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      <div className="mt-auto space-y-3 p-3">
        {!collapsed ? (
          <div className="rounded-md border border-border bg-surface-muted/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                AI Engine
              </span>
              <StatusChip tone="success">Online</StatusChip>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Face matching v2.4 · Liveness enabled · Avg. 340ms
            </p>
          </div>
        ) : null}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md border border-border bg-surface p-2",
            collapsed && "justify-center border-0 bg-transparent p-0",
          )}
        >
          <Initials name={student.name} className="size-8" />
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-foreground">{student.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{student.rollNumber}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string | undefined;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const isActive = useActive();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarBody collapsed={collapsed} />
      </aside>

      <div className={cn("flex min-h-screen flex-col", collapsed ? "lg:pl-16" : "lg:pl-64")}>
        {/* Top navigation */}
        <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Sheet open={mobileNav} onOpenChange={setMobileNav}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Open navigation">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-sidebar p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <SidebarBody onNavigate={() => setMobileNav(false)} />
                </SheetContent>
              </Sheet>

              <Button
                variant="ghost"
                size="icon-sm"
                className="hidden lg:inline-flex"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
              </Button>

              <div className="min-w-0 lg:hidden">
                <p className="truncate text-[13px] font-semibold text-foreground">
                  {title ?? "ARGUS"}
                </p>
              </div>

              <div className="relative hidden min-w-0 flex-1 max-w-sm lg:block">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sessions, subjects, appeals…"
                  className="h-8 pl-8 text-[13px]"
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <StatusChip tone="success" className="hidden md:inline-flex">
                Verification active
              </StatusChip>
              <ThemeToggle />
              <Link to="/student/notifications" aria-label="Notifications">
                <Button variant="ghost" size="icon-sm" className="relative">
                  <Bell />
                  <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-danger" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="ml-0.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    aria-label="Account menu"
                  >
                    <Initials name={student.name} className="size-8" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-[13px] font-semibold text-foreground">{student.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/student/profile">
                      <User className="mr-2 size-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/student/settings">
                      <Settings className="mr-2 size-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth/device-registration">
                      <ShieldCheck className="mr-2 size-4" /> Registered device
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/auth/login">
                      <LogOut className="mr-2 size-4" /> Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-10 sm:pt-6">
          <div className="mx-auto w-full max-w-6xl space-y-5">{children}</div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="grid grid-cols-5">
          {bottomItems.map((item) => {
            const active = isActive(item.to, "exact" in item ? item.exact : undefined);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className="relative">
                    <item.icon className="size-[18px]" />
                    {active ? (
                      <span className="absolute -top-2 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-foreground" />
                    ) : null}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
