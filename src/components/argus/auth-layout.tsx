import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Lock, Fingerprint } from "lucide-react";
import { ArgusLogo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
  step,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  step?: { current: number; total: number };
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
      {/* Enterprise panel — desktop only */}
      <aside className="relative hidden flex-col justify-between border-r border-border bg-surface p-10 lg:flex">
        <div className="absolute inset-0 argus-grid-lines opacity-[0.35]" aria-hidden="true" />
        <div className="relative">
          <Link to="/">
            <ArgusLogo showTagline />
          </Link>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-2xl font-semibold leading-snug tracking-tight text-foreground">
            AI-powered identity verification for the entire campus.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            One verified identity across attendance, examinations, library access, hostel entry,
            laboratories, visitor management and digital student ID.
          </p>
          <dl className="mt-8 space-y-4">
            {[
              { icon: Fingerprint, t: "Multi-angle face enrollment", d: "Liveness and spoof checks on device." },
              { icon: ShieldCheck, t: "Trusted device binding", d: "Every session is tied to a registered device." },
              { icon: Lock, t: "Institution-grade privacy", d: "Biometric templates never leave your institution." },
            ].map((item) => (
              <div key={item.t} className="flex gap-3">
                <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <dt className="text-[13px] font-medium text-foreground">{item.t}</dt>
                  <dd className="text-[13px] text-muted-foreground">{item.d}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
        <p className="relative font-mono text-[11px] tracking-wide text-muted-foreground">
          ARGUS Platform · v2.4 · Secure Access
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 lg:justify-end lg:border-0 lg:px-8">
          <Link to="/" className="lg:hidden">
            <ArgusLogo size="sm" />
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-[400px]">
            {step ? (
              <div className="mb-6">
                <div className="flex items-center justify-between text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  <span>
                    Step {step.current} of {step.total}
                  </span>
                  <span>{Math.round((step.current / step.total) * 100)}%</span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {Array.from({ length: step.total }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < step.current ? "bg-secondary" : "bg-surface-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {eyebrow ? (
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
            ) : null}

            <div className="mt-7">{children}</div>
          </div>
        </div>

        {footer ? (
          <div className="border-t border-border px-5 py-4 text-center text-[13px] text-muted-foreground sm:px-8">
            {footer}
          </div>
        ) : null}
      </main>
    </div>
  );
}
