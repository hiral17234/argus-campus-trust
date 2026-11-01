
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Info,
  Send,
} from "lucide-react";

import { PageHeader } from "@/components/argus/page-header";
import { SectionCard } from "@/components/argus/section-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/student/appeals")({
  head: () => ({
    meta: [
      { title: "Submit an Appeal | ARGUS" },
      {
        name: "description",
        content: "Submit an attendance correction appeal for faculty review.",
      },
    ],
  }),
  component: StudentAppealsPage,
});

const subjects = [
  "Mathematics",
  "Computer Networks",
  "Data Science",
  "Operating Systems",
  "Database Management Systems",
];

const appealReasons = [
  "Present but marked absent",
  "Face verification failed",
  "Device verification failed",
  "Network or technical issue",
  "Attendance record discrepancy",
  "Other",
];

function StudentAppealsPage() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceReference, setEvidenceReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!subject || !sessionDate || !reason || !description.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (description.trim().length < 20) {
      setError(
        "Please provide a more detailed explanation (at least 20 characters).",
      );
      return;
    }

    if (sessionDate > today) {
      setError("The attendance session date cannot be in the future.");
      return;
    }

    setLoading(true);

    // Frontend prototype only.
    // Replace this section with the backend appeal submission API.
    const appealPayload = {
      subject,
      sessionDate,
      reason,
      description: description.trim(),
      evidenceReference: evidenceReference.trim() || null,
      submittedAt: new Date().toISOString(),
    };

    console.log("Appeal submission prepared:", appealPayload);

    setLoading(false);
    setSubmitted(true);
  }

  function resetForm() {
    setSubject("");
    setSessionDate("");
    setReason("");
    setDescription("");
    setEvidenceReference("");
    setError("");
    setSubmitted(false);
  }

  if (submitted) {
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
            title="Submit an appeal"
            description="Attendance correction request."
          />
        </div>

        <div className="mx-auto max-w-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="size-10 text-foreground" />

            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Appeal prepared successfully
            </h2>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Your appeal has been prepared in this frontend prototype.
              It has not yet been transmitted to the institutional server.
            </p>

            <div className="mt-5 w-full border border-border bg-background p-4 text-left">
              <p className="text-xs text-muted-foreground">
                Subject
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {subject}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Session date
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {sessionDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Appeal reason
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {reason}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <StatusChip tone="warning" dot={false}>
                  Awaiting backend submission
                </StatusChip>
              </div>
            </div>

            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => navigate({ to: "/student/appeal-history" })}
              >
                View appeal history
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={resetForm}
              >
                Submit another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
          title="Submit an appeal"
          description="Request a correction if your attendance record is inaccurate."
          action={
            <Link to="/student/appeal-history">
              <Button size="sm" variant="outline">
                <FileText className="size-4" />
                Appeal history
              </Button>
            </Link>
          }
        />
      </div>

      {/* Instructions */}
      <div className="flex items-start gap-3 border border-border bg-card p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <div>
          <p className="text-xs font-medium text-foreground">
            Before submitting
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Submit an appeal only when you believe an attendance record is
            incorrect. Provide the correct session date and a clear
            explanation. Your request will require faculty review.
          </p>
        </div>
      </div>

      {/* Appeal form */}
      <SectionCard
        title="Appeal details"
        description="Provide the information required to review your request."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </Label>

              <select
                id="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                required
                className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ring"
              >
                <option value="">Select subject</option>
                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionDate">
                Attendance session date{" "}
                <span className="text-destructive">*</span>
              </Label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="sessionDate"
                  type="date"
                  value={sessionDate}
                  onChange={(event) => setSessionDate(event.target.value)}
                  max={today}
                  required
                  className="h-10 w-full border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-ring"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for appeal{" "}
              <span className="text-destructive">*</span>
            </Label>

            <select
              id="reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ring"
            >
              <option value="">Select a reason</option>
              {appealReasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Explanation{" "}
              <span className="text-destructive">*</span>
            </Label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain what happened during the attendance session. Include relevant details that can help the faculty verify your request."
              rows={5}
              maxLength={1000}
              required
              className="w-full resize-y border border-border bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />

            <div className="flex justify-between gap-3">
              <p className="text-[11px] text-muted-foreground">
                Minimum 20 characters. Maximum 1000 characters.
              </p>

              <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                {description.length}/1000
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidenceReference">
              Supporting evidence reference (optional)
            </Label>

            <input
              id="evidenceReference"
              type="text"
              value={evidenceReference}
              onChange={(event) =>
                setEvidenceReference(event.target.value)
              }
              placeholder="Enter an evidence reference or document link"
              maxLength={300}
              className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />

            <p className="text-[11px] text-muted-foreground">
              Actual document uploads will be enabled after backend integration.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 border border-destructive/40 bg-destructive/5 p-3"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-xs text-foreground">{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-5 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/student" })}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              <Send className="size-4" />
              {loading ? "Submitting..." : "Submit appeal"}
            </Button>
          </div>
        </form>
      </SectionCard>

      {/* Review process */}
      <SectionCard
        title="Appeal review process"
        description="What happens after you submit an attendance correction request."
      >
        <div className="space-y-4">
          {[
            {
              number: "01",
              title: "Submission",
              description:
                "Your appeal details are recorded and assigned a reference ID.",
            },
            {
              number: "02",
              title: "Faculty review",
              description:
                "The concerned faculty member examines the attendance session and available verification records.",
            },
            {
              number: "03",
              title: "Decision",
              description:
                "The appeal is approved or rejected with an explanation.",
            },
            {
              number: "04",
              title: "Record update",
              description:
                "If approved, the attendance record is corrected by the authorized system.",
            },
          ].map((step, index) => (
            <div key={step.number} className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center border border-border text-xs font-semibold tabular-nums text-muted-foreground">
                {step.number}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {step.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
