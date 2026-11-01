
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarCheck,
  FlaskConical,
  GraduationCap,
  IdCard,
  ScanFace,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { ArgusLogo } from "@/components/argus/logo";
import { ThemeToggle } from "@/components/argus/theme-toggle";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/argus/status-chip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARGUS — AI-Powered Identity Verification Platform" },
      {
        name: "description",
        content:
          "ARGUS is an identity verification and smart attendance platform for educational institutions.",
      },
      {
        property: "og:title",
        content: "ARGUS — AI-Powered Identity Verification Platform",
      },
      {
        property: "og:description",
        content:
          "Identity verification, smart attendance and access management for educational institutions.",
      },
    ],
  }),
  component: Welcome,
});

const modules = [
  { icon: CalendarCheck, label: "Attendance", state: "Planned" },
  { icon: GraduationCap, label: "Examination Verification", state: "Planned" },
  { icon: BookOpen, label: "Library Access", state: "Planned" },
  { icon: Building2, label: "Hostel Entry", state: "Planned" },
  { icon: FlaskConical, label: "Laboratory Access", state: "Planned" },
  { icon: UserCheck, label: "Visitor Management", state: "Planned" },
  { icon: IdCard, label: "Digital Student ID", state: "Planned" },
];

const roles = [
  {
    role: "Student",
    icon: ScanFace,
    desc: "Mark attendance, track records, raise appeals and access your digital identity.",
    cta: "Student sign in",
  },
  {
    role: "Teacher",
    icon: GraduationCap,
    desc: "Manage attendance sessions, review flagged records and resolve student appeals.",
    cta: "Teacher sign in",
  },
  {
    role: "Administrator",
    icon: ShieldCheck,
    desc: "Manage identities, devices, access policies and institutional security.",
    cta: "Administrator sign in",
  },
];

function Welcome() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:px-6">
          <ArgusLogo showTagline />

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />

            <Link to="/auth/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
            <div className="min-w-0">
              <StatusChip tone="neutral" dot={false}>
                Identity verification · Smart attendance
              </StatusChip>

              <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
                One verified identity for every campus system.
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                ARGUS is an identity verification and smart attendance platform
                designed for educational institutions. It combines face
                verification, trusted-device checks and risk-based authentication
                to help institutions manage identity and access securely.
              </p>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <Link to="/auth/register" className="sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create institutional account
                    <ArrowRight />
                  </Button>
                </Link>

                <Link to="/auth/login" className="sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Sign in to ARGUS
                  </Button>
                </Link>
              </div>

              <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
                {[
                  { k: "Core focus", v: "Identity" },
                  { k: "Authentication", v: "Adaptive" },
                  { k: "Platform", v: "Multi-role" },
                  { k: "Architecture", v: "Modular" },
                ].map((item) => (
                  <div key={item.k}>
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {item.k}
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-foreground">
                      {item.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Platform modules */}
            <div className="border border-border bg-card p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Platform modules
                </span>

                <ShieldCheck className="size-4 text-muted-foreground" />
              </div>

              <ul className="mt-1 divide-y divide-border">
                {modules.map((module) => (
                  <li
                    key={module.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <module.icon className="size-4 shrink-0 text-muted-foreground" />

                      <span className="truncate text-[13px] text-foreground">
                        {module.label}
                      </span>
                    </span>

                    <StatusChip tone="neutral" dot={false}>
                      {module.state}
                    </StatusChip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Role selection */}
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Choose your portal
          </h2>

          <p className="mt-1 text-[13px] text-muted-foreground">
            Sign in using your institutional account. Your access will depend
            on your assigned role and permissions.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {roles.map((item) => (
              <div
                key={item.role}
                className="flex flex-col border border-border bg-card p-5"
              >
                <item.icon className="size-5 text-muted-foreground" />

                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {item.role}
                </h3>

                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>

                <Link to="/auth/login" className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    {item.cta}
                    <ArrowRight />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 ARGUS Identity Platform.</p>

          <div className="flex flex-wrap gap-4">
            <Link to="/design-system" className="hover:text-foreground">
              Design system
            </Link>

            <Link to="/student" className="hover:text-foreground">
              Student portal
            </Link>

            <span>Privacy</span>
            <span>Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
