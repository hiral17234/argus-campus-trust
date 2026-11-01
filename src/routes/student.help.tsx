
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  LifeBuoy,
  LockKeyhole,
  Mail,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { PageHeader } from "@/components/argus/page-header";
import { SectionCard } from "@/components/argus/section-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/help")({
  head: () => ({
    meta: [
      { title: "Help and Support | ARGUS" },
      {
        name: "description",
        content:
          "Find answers, troubleshoot verification issues and contact ARGUS student support.",
      },
    ],
  }),
  component: StudentHelpPage,
});

type HelpCategory =
  | "Account"
  | "Attendance"
  | "Verification"
  | "Devices"
  | "Security";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: HelpCategory;
};

const faqs: FAQ[] = [
  {
    id: "FAQ-001",
    question: "How do I mark my attendance?",
    answer:
      "Open the Attendance section from your student dashboard. Select the active class session, choose QR scanning or attendance code verification, and complete the required face verification steps.",
    category: "Attendance",
  },
  {
    id: "FAQ-002",
    question: "Why is my attendance not being recorded?",
    answer:
      "Possible reasons include an expired session, unsuccessful face verification, an untrusted device, network issues or location restrictions. Check the session status and verification details before trying again.",
    category: "Attendance",
  },
  {
    id: "FAQ-003",
    question: "How can I correct an incorrect attendance record?",
    answer:
      "Open the Appeals section, select the subject and attendance session, explain the issue and submit your request. The concerned faculty member will review the appeal.",
    category: "Attendance",
  },
  {
    id: "FAQ-004",
    question: "How do I register my face?",
    answer:
      "Open Face Registration and follow the camera instructions. Complete the requested face capture steps. Actual enrollment and biometric processing depend on the institutional verification service.",
    category: "Verification",
  },
  {
    id: "FAQ-005",
    question: "Why is face verification failing?",
    answer:
      "Ensure that your face is clearly visible, lighting is adequate, the camera is functioning and camera permission is enabled. Remove obstructions and follow the on-screen instructions.",
    category: "Verification",
  },
  {
    id: "FAQ-006",
    question: "What is an additional security challenge?",
    answer:
      "ARGUS may request an additional verification step when an authentication attempt requires stronger identity assurance. Complete the requested challenge using the instructions displayed on screen.",
    category: "Security",
  },
  {
    id: "FAQ-007",
    question: "How do I register a new device?",
    answer:
      "Open Device Registration, review the detected device information and complete the registration process. A device must be authorized before it can be treated as trusted.",
    category: "Devices",
  },
  {
    id: "FAQ-008",
    question: "Can I remove an old registered device?",
    answer:
      "Open Registered Devices and select the device you no longer use. Use the revoke option if available. Your currently active device may not be eligible for revocation.",
    category: "Devices",
  },
  {
    id: "FAQ-009",
    question: "What should I do if I forget my password?",
    answer:
      "Use the Forgot Password option on the login page. Follow the password recovery instructions provided by your institution.",
    category: "Account",
  },
  {
    id: "FAQ-010",
    question: "Is my biometric information visible to other students?",
    answer:
      "Biometric templates should be protected and accessible only to authorized verification services. They should not be exposed through ordinary student profile information.",
    category: "Security",
  },
];

const categories: {
  name: HelpCategory;
  description: string;
  icon: typeof CircleHelp;
}[] = [
  {
    name: "Account",
    description: "Login and account access",
    icon: LockKeyhole,
  },
  {
    name: "Attendance",
    description: "Sessions and attendance records",
    icon: BookOpen,
  },
  {
    name: "Verification",
    description: "Face verification and challenges",
    icon: ShieldCheck,
  },
  {
    name: "Devices",
    description: "Device registration and trust",
    icon: Smartphone,
  },
  {
    name: "Security",
    description: "Privacy and account protection",
    icon: LockKeyhole,
  },
];

const quickLinks = [
  {
    title: "Attendance",
    description: "View attendance records and sessions.",
    to: "/student/attendance",
    icon: BookOpen,
  },
  {
    title: "Face profile",
    description: "Review your face enrollment status.",
    to: "/student/face-profile",
    icon: Camera,
  },
  {
    title: "Registered devices",
    description: "Review your trusted devices.",
    to: "/student/devices",
    icon: Smartphone,
  },
  {
    title: "Appeal history",
    description: "Track submitted attendance appeals.",
    to: "/student/appeal-history",
    icon: FileText,
  },
];

function StudentHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<HelpCategory | "All">("All");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueCategory, setIssueCategory] =
    useState<HelpCategory>("Attendance");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const filteredFAQs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" ||
        faq.category === activeCategory;

      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  function handleSupportSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !description.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (description.trim().length < 20) {
      setError(
        "Please provide more details about your issue (at least 20 characters).",
      );
      return;
    }

    setSubmitting(true);

    // Frontend prototype only.
    // Connect this payload to the backend support-ticket API later.
    const supportRequest = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: issueCategory,
      subject: subject.trim(),
      description: description.trim(),
      submittedAt: new Date().toISOString(),
    };

    console.log("Support request prepared:", supportRequest);

    setSubmitting(false);
    setSubmitted(true);
  }

  function resetSupportForm() {
    setName("");
    setEmail("");
    setIssueCategory("Attendance");
    setSubject("");
    setDescription("");
    setError("");
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/student"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Student dashboard
        </Link>

        <PageHeader
          title="Help and support"
          description="Find answers to common questions or submit a support request."
        />
      </div>

      {/* Search */}
      <div className="border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <LifeBuoy className="size-5 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            How can we help?
          </h2>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search questions, attendance, verification..."
            className="h-11 w-full border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
      </div>

      {/* Help categories */}
      <SectionCard
        title="Browse help topics"
        description="Select a category to find relevant support information."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const selected = activeCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => {
                  setActiveCategory(
                    selected ? "All" : category.name,
                  );
                  setExpandedFAQ(null);
                }}
                className={`flex items-start gap-3 border p-4 text-left transition-colors ${
                  selected
                    ? "border-foreground bg-muted/30"
                    : "border-border bg-background hover:bg-muted/20"
                }`}
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {category.name}
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {activeCategory !== "All" && (
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className="mt-4 text-xs font-medium text-foreground hover:underline"
          >
            Clear category filter
          </button>
        )}
      </SectionCard>

      {/* FAQs */}
      <SectionCard
        title="Frequently asked questions"
        description={`${filteredFAQs.length} relevant answers found.`}
      >
        <div className="divide-y divide-border">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const expanded = expandedFAQ === faq.id;

              return (
                <div key={faq.id} className="py-4 first:pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedFAQ(expanded ? null : faq.id)
                    }
                    aria-expanded={expanded}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {faq.question}
                      </p>

                      <div className="mt-2">
                        <StatusChip tone="neutral" dot={false}>
                          {faq.category}
                        </StatusChip>
                      </div>
                    </div>

                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expanded && (
                    <p className="mt-3 max-w-3xl border-l-2 border-border pl-3 text-[13px] leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center">
              <CircleHelp className="mx-auto size-7 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium text-foreground">
                No matching questions
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try another search term or category.
              </p>

              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Quick links */}
      <SectionCard
        title="Quick access"
        description="Open commonly used student portal sections."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="flex items-center justify-between gap-3 border border-border bg-background p-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </SectionCard>

      {/* Support request */}
      <SectionCard
        title="Contact support"
        description="Submit an issue that requires assistance from your institution."
      >
        {submitted ? (
          <div className="border border-border bg-muted/20 p-5">
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Support request prepared
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Your request has been prepared in this frontend
                  demonstration. It has not been transmitted to the
                  institutional support server.
                </p>

                <StatusChip tone="warning" dot={false}>
                  Backend submission pending
                </StatusChip>

                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetSupportForm}
                  >
                    Submit another request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSupportSubmit}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="support-name"
                  className="text-xs font-medium text-foreground"
                >
                  Full name *
                </label>

                <input
                  id="support-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  maxLength={100}
                  required
                  className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="support-email"
                  className="text-xs font-medium text-foreground"
                >
                  Institutional email *
                </label>

                <input
                  id="support-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@college.edu"
                  maxLength={254}
                  required
                  className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="support-category"
                className="text-xs font-medium text-foreground"
              >
                Issue category *
              </label>

              <select
                id="support-category"
                value={issueCategory}
                onChange={(event) =>
                  setIssueCategory(event.target.value as HelpCategory)
                }
                className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ring"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="support-subject"
                className="text-xs font-medium text-foreground"
              >
                Subject *
              </label>

              <input
                id="support-subject"
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Briefly describe your issue"
                maxLength={150}
                required
                className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="support-description"
                className="text-xs font-medium text-foreground"
              >
                Issue description *
              </label>

              <textarea
                id="support-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Explain the issue, what you were trying to do and any error message you encountered."
                rows={5}
                maxLength={1500}
                required
                className="w-full resize-y border border-border bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
              />

              <div className="flex justify-between gap-3">
                <p className="text-[11px] text-muted-foreground">
                  Minimum 20 characters.
                </p>

                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {description.length}/1500
                </span>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="border border-destructive/40 bg-destructive/5 p-3 text-xs text-foreground"
              >
                {error}
              </div>
            )}

            <div className="flex justify-end border-t border-border pt-4">
              <Button
                type="submit"
                disabled={submitting}
              >
                <Send className="size-4" />
                {submitting ? "Submitting..." : "Submit support request"}
              </Button>
            </div>
          </form>
        )}
      </SectionCard>

      {/* Contact information */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-xs font-medium text-foreground">
              Institutional support
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              For urgent account access or attendance issues, contact
              your institution's designated ARGUS administrator or
              department coordinator.
            </p>

            <p className="mt-2 text-[11px] text-muted-foreground">
              Official support email and contact details will be
              configured by the institution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

