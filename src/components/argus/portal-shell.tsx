import { useState, type ComponentType, type ReactNode } from "react";
import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
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
import { StatusChip, type StatusTone } from "./status-chip";
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

export type PortalNavItem = {
  to: LinkProps["to"];
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
  exact?: boolean;
};

export type PortalShellProps = {
  children: ReactNode;
  title?: string | undefined;
  portalLabel: string;
  navItems: readonly PortalNavItem[];
  bottomItems: readonly PortalNavItem[];
  user: { name: string; subtitle: string; email: string };
  profileTo: LinkProps["to"];
  settingsTo: LinkProps["to"];
  notificationsTo: LinkProps["to"];
  panel?: { label: string; tone: StatusTone; status: string; description: string };
  headerStatus?: string;
  searchPlaceholder?: string;
};

function useActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (to: string, exact?: boolean) =>
    exact ? pathname === to || pathname === `${to}/` : pathname.startsWith(to);
}

function NavList({
  items,
  collapsed,
  onNavigate,
}: {
  items: readonly PortalNavItem[];
  collapsed?: boolean | undefined;
  onNavigate?: (() => void) | undefined;
}) {
  const isActive = useActive();
  return (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(String(item.to), item.exact);
        return (
          <Link
            key={String(item.to)}
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
                {item.badge ? (
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

function SidebarBody({
  collapsed,
  onNavigate,
  props,
}: {
  collapsed?: boolean | undefined;
  onNavigate?: (() => void) | undefined;
  props: PortalShellProps;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className={cn("px-3 py-4", collapsed && "flex justify-center px-0")}>
        {collapsed ? <ArgusMark /> : <ArgusLogo showTagline />}
      </div>
      <div className={cn("px-3", collapsed && "px-2")}>
        {!collapsed ? (
          <p className="px-2.5 pb-2 pt-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {props.portalLabel}
          </p>
        ) : null}
        <NavList items={props.navItems} collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      <div className="mt-auto space-y-3 p-3">
        {!collapsed && props.panel ? (
          <div className="rounded-md border border-border bg-surface-muted/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                {props.panel.label}
              </span>
              <StatusChip tone={props.panel.tone}>{props.panel.status}</StatusChip>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              {props.panel.description}
            </p>
          </div>
        ) : null}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md border border-border bg-surface p-2",
            collapsed && "justify-center border-0 bg-transparent p-0",
          )}
        >
          <Initials name={props.user.name} className="size-8" />
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-foreground">
                {props.user.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{props.user.subtitle}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PortalShell(props: PortalShellProps) {
  const { children, title, bottomItems, user } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const isActive = useActive();

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarBody collapsed={collapsed} props={props} />
      </aside>

      <div className={cn("flex min-h-screen flex-col", collapsed ? "lg:pl-16" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Sheet open={mobileNav} onOpenChange={setMobileNav}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                    aria-label="Open navigation"
                  >
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-sidebar p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <SidebarBody onNavigate={() => setMobileNav(false)} props={props} />
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
                  placeholder={props.searchPlaceholder ?? "Search…"}
                  className="h-8 pl-8 text-[13px]"
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {props.headerStatus ? (
                <StatusChip tone="success" className="hidden md:inline-flex">
                  {props.headerStatus}
                </StatusChip>
              ) : null}
              <ThemeToggle />
              <Link to={props.notificationsTo} aria-label="Notifications">
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
                    <Initials name={user.name} className="size-8" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-[13px] font-semibold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={props.profileTo}>
                      <User className="mr-2 size-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={props.settingsTo}>
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

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="grid grid-cols-5">
          {bottomItems.map((item) => {
            const active = isActive(String(item.to), item.exact);
            return (
              <li key={String(item.to)}>
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
