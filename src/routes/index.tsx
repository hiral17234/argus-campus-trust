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
          "ARGUS verifies one campus identity across attendance, examinations, library, hostel, laboratory, visitor management and digital student ID.",
      },
      { property: "og:title", content: "ARGUS — AI-Powered Identity Verification Platform" },
      {
        property: "og:description",
        content:
          "Enterprise identity verification for universities and institutions. Face enrollment, trusted devices and auditable verification.",
      },
    ],
  }),
  component: Welcome,
});

const modules = [
  { icon: CalendarCheck, label: "Attendance", state: "Active" },
  { icon: GraduationCap, label: "Examination Verification", state: "Active" },
  { icon: BookOpen, label: "Library Access", state: "Configured" },
  { icon: Building2, label: "Hostel Entry", state: "Configured" },
  { icon: FlaskConical, label: "Laboratory Access", state: "Pilot" },
  { icon: UserCheck, label: "Visitor Management", state: "Pilot" },
  { icon: IdCard, label: "Digital Student ID", state: "Active" },
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
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
            <div className="min-w-0">
              <StatusChip tone="neutral" dot={false}>
                Institutional deployment · v2.4
              </StatusChip>
              <h1 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
                One verified identity for every campus system.
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                ARGUS is an enterprise identity verification platform. Students, teachers and
                administrators authenticate once with face verification and a trusted device — then
                every module inherits that verified identity with a full audit trail.
              </p>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <Link to="/auth/register" className="sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create institutional account
                    <ArrowRight />
                  </Button>
                </Link>
                <Link to="/auth/login" className="sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Sign in to ARGUS
                  </Button>
                </Link>
              </div>

              <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
                {[
                  { k: "Verification accuracy", v: "99.2%" },
                  { k: "Median match time", v: "340ms" },
                  { k: "Modules supported", v: "7" },
                  { k: "Audit retention", v: "5 yrs" },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      {s.k}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Platform modules
                </span>
                <ShieldCheck className="size-4 text-muted-foreground" />
              </div>
              <ul className="mt-1 divide-y divide-border">
                {modules.map((m) => (
                  <li
                    key={m.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <m.icon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-[13px] text-foreground">{m.label}</span>
                    </span>
                    <StatusChip
                      tone={m.state === "Active" ? "success" : m.state === "Pilot" ? "warning" : "neutral"}
                      dot={false}
                    >
                      {m.state}
                    </StatusChip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Choose how you sign in
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Access is granted by role. Registration requires an official college email address.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                role: "Student",
                icon: ScanFace,
                desc: "Mark attendance, track records, raise appeals and carry a digital ID.",
                to: "/auth/login" as const,
                cta: "Student sign in",
              },
              {
                role: "Teacher",
                icon: GraduationCap,
                desc: "Open verification sessions, review flagged records and resolve appeals.",
                to: "/auth/login" as const,
                cta: "Teacher sign in",
              },
              {
                role: "Administrator",
                icon: ShieldCheck,
                desc: "Manage identities, devices, modules, policies and institutional audits.",
                to: "/auth/login" as const,
                cta: "Administrator sign in",
              },
            ].map((r) => (
              <div key={r.role} className="rounded-lg border border-border bg-card p-5 shadow-xs">
                <r.icon className="size-5 text-muted-foreground" />
                <h3 className="mt-3 text-sm font-semibold text-foreground">{r.role}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{r.desc}</p>
                <Link to={r.to} className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    {r.cta}
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
          <p>© 2026 ARGUS Identity Platform. Deployed for institutional use.</p>
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
