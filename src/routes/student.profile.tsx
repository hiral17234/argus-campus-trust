
import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Download,
  FileImage,
  IdCard,
  Laptop,
  Mail,
  Pencil,
  Phone,
  ScanFace,
  ShieldCheck,
  Upload,
  User,
  X,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
  DetailRow,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { AttendanceTrendChart } from "@/components/argus/charts";

import {
  attendanceTrend,
  student,
} from "@/lib/argus-data";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [
      { title: "Student Profile | ARGUS" },
      {
        name: "description",
        content:
          "View your institutional student profile, profile photograph, registered devices and identity verification information.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [phone, setPhone] = useState("");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [address, setAddress] = useState("");

  const [saving, setSaving] = useState(false);

  function handlePhotoUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(reader.result);
        setPhotoName(file.name);
      }
    };

    reader.onerror = () => {
      setPhotoError("Unable to read this image. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setProfilePhoto(null);
    setPhotoName("");
    setPhotoError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSaveProfile() {
    if (!profilePhoto) {
      setPhotoError("A profile photograph is required.");
      return;
    }

    setSaving(true);

    // Frontend demonstration only.
    // Connect this data to the student profile update API.
    const profileData = {
      phone: phone.trim(),
      alternateEmail: alternateEmail.trim(),
      address: address.trim(),
      photoSelected: Boolean(profilePhoto),
      photoName,
    };

    console.log("Profile update prepared:", profileData);

    setSaving(false);
    setIsEditing(false);

    window.alert(
      "Profile information is prepared. Backend profile saving is not connected yet.",
    );
  }

  function downloadPhoto() {
    if (!profilePhoto) return;

    const anchor = document.createElement("a");
    anchor.href = profilePhoto;
    anchor.download = photoName || "argus-profile-photo";
    anchor.click();
  }

  const hasPhoto = Boolean(profilePhoto);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/student"
          className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Student dashboard
        </Link>

        <PageHeader
          title="Student profile"
          description="Your institutional identity and personal information registered with ARGUS."
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing((value) => !value)}
            >
              <Pencil className="size-4" />
              {isEditing ? "Cancel editing" : "Edit profile"}
            </Button>
          }
        />
      </div>

      {/* Main identity card */}
      <div className="border border-border bg-card p-5">
        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          {/* Profile photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex size-28 items-center justify-center overflow-hidden border border-border bg-muted">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={`${student.name} profile`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <User className="size-9" />
                  <span className="text-[10px]">
                    No photograph
                  </span>
                </div>
              )}

              <span className="absolute bottom-0 right-0 border border-background bg-foreground p-1 text-background">
                <Camera className="size-3" />
              </span>
            </div>

            <StatusChip
              tone={hasPhoto ? "success" : "warning"}
              dot={false}
            >
              {hasPhoto ? "Photo uploaded" : "Photo required"}
            </StatusChip>
          </div>

          {/* Student identity */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                {student.name}
              </h2>

              <StatusChip tone="neutral" dot={false}>
                Student
              </StatusChip>
            </div>

            <p className="mt-1 break-all text-[13px] text-muted-foreground">
              {student.email}
            </p>

            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {student.rollNumber}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <StatusChip tone="neutral" dot={false}>
                {student.department}
              </StatusChip>

              <StatusChip tone="neutral" dot={false}>
                {student.batch}
              </StatusChip>

              <StatusChip tone="neutral" dot={false}>
                Semester {student.semester}
              </StatusChip>
            </div>
          </div>

          {/* Identity status */}
          <div className="border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <p className="text-[11px] text-muted-foreground">
              Institutional identity
            </p>

            <div className="mt-2 flex items-center gap-2">
              <ShieldCheck className="size-4 text-muted-foreground" />

              <span className="text-xs font-medium text-foreground">
                {student.rollNumber}
              </span>
            </div>

            <p className="mt-2 text-[11px] text-muted-foreground">
              Verification status must be confirmed by the backend.
            </p>
          </div>
        </div>

        {/* Photo upload */}
        <div className="mt-6 border-t border-border pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileImage className="size-4 text-muted-foreground" />

                <p className="text-xs font-semibold text-foreground">
                  Profile photograph
                  <span className="ml-1 text-destructive">*</span>
                </p>
              </div>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Upload a clear, recent photograph. JPG, PNG or WebP.
                Maximum file size: 5 MB.
              </p>

              {photoName && (
                <p className="mt-2 break-all text-[11px] text-muted-foreground">
                  Selected file: {photoName}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
                aria-label="Upload profile photograph"
              />

              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />
                {hasPhoto ? "Change photo" : "Upload photo"}
              </Button>

              {hasPhoto && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadPhoto}
                  >
                    <Download className="size-4" />
                    Download
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={removePhoto}
                  >
                    <X className="size-4" />
                    Remove
                  </Button>
                </>
              )}
            </div>
          </div>

          {photoError && (
            <p
              role="alert"
              className="mt-3 text-xs text-destructive"
            >
              {photoError}
            </p>
          )}

          {!hasPhoto && (
            <div className="mt-3 border border-dashed border-border bg-muted/20 p-3">
              <p className="text-[11px] text-muted-foreground">
                A profile photograph is required to complete your
                profile. Upload one before submitting profile changes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Personal and academic information */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="Personal information"
          description="Personal details associated with your student account."
        >
          <DetailRow
            label="Full name"
            value={student.name}
          />

          <DetailRow
            label="Institutional email"
            value={student.email}
          />

          <DetailRow
            label="Phone number"
            value={
              isEditing ? (
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter phone number"
                  className="h-9 w-full max-w-[190px] border border-border bg-background px-2 text-xs outline-none focus:border-ring"
                />
              ) : (
                phone || "Not provided"
              )
            }
          />

          <DetailRow
            label="Alternate email"
            value={
              isEditing ? (
                <input
                  type="email"
                  value={alternateEmail}
                  onChange={(event) =>
                    setAlternateEmail(event.target.value)
                  }
                  placeholder="Enter alternate email"
                  className="h-9 w-full max-w-[190px] border border-border bg-background px-2 text-xs outline-none focus:border-ring"
                />
              ) : (
                alternateEmail || "Not provided"
              )
            }
          />

          <DetailRow
            label="Address"
            value={
              isEditing ? (
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Enter residential address"
                  rows={2}
                  className="w-full max-w-[190px] resize-y border border-border bg-background px-2 py-2 text-xs outline-none focus:border-ring"
                />
              ) : (
                address || "Not provided"
              )
            }
          />

          {isEditing && (
            <div className="flex justify-end pt-4">
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Academic information"
          description="Institutional academic identity and enrollment details."
        >
          <DetailRow
            label="Student name"
            value={student.name}
          />

          <DetailRow
            label="Roll number"
            value={
              <span className="font-mono">
                {student.rollNumber}
              </span>
            }
          />

          <DetailRow
            label="Department"
            value={student.department}
          />

          <DetailRow
            label="Branch"
            value={student.branch}
          />

          <DetailRow
            label="Section"
            value={student.section}
          />

          <DetailRow
            label="Current semester"
            value={student.semester}
          />

          <DetailRow
            label="Batch"
            value={student.batch}
          />

          <DetailRow
            label="Institutional email"
            value={student.email}
          />
        </SectionCard>
      </div>

      {/* Device information */}
      <SectionCard
        title="Registered device"
        description="Device information associated with your ARGUS account."
        action={
          <StatusChip tone="neutral" dot={false}>
            Demo information
          </StatusChip>
        }
      >
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/20">
            <Laptop className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-foreground">
              {student.device.name}
            </p>

            <div className="mt-3">
              <DetailRow
                label="Browser"
                value={student.device.browser}
              />

              <DetailRow
                label="Operating system"
                value={student.device.os}
              />

              <DetailRow
                label="Registration date"
                value={student.device.registeredOn}
              />
            </div>

            <Link
              to="/student/devices"
              className="mt-3 inline-block"
            >
              <Button variant="outline" size="sm">
                <ShieldCheck className="size-4" />
                Manage devices
              </Button>
            </Link>
          </div>
        </div>
      </SectionCard>

      {/* Biometric information */}
      <SectionCard
        title="Face enrollment"
        description="Biometric enrollment information associated with your account."
        action={
          <StatusChip tone="neutral" dot={false}>
            {student.face.status}
          </StatusChip>
        }
      >
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/20">
            <ScanFace className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <DetailRow
              label="Enrollment status"
              value={student.face.status}
            />

            <DetailRow
              label="Angles enrolled"
              value={`${student.face.enrolledAngles} of ${student.face.totalAngles}`}
            />

            <DetailRow
              label="Liveness verification"
              value="Backend status pending"
            />

            <DetailRow
              label="Last updated"
              value={student.face.lastUpdated}
            />

            <Link
              to="/student/face-profile"
              className="mt-3 inline-block"
            >
              <Button variant="outline" size="sm">
                <ScanFace className="size-4" />
                View face profile
              </Button>
            </Link>
          </div>
        </div>
      </SectionCard>

      {/* Attendance trend */}
      <SectionCard
        title="Attendance trend"
        description="Your attendance pattern over the last six weeks."
      >
        <AttendanceTrendChart data={attendanceTrend} />
      </SectionCard>

      {/* Profile security */}
      <div className="border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-xs font-semibold text-foreground">
              Profile and identity security
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Changes to institutional identity, academic records
              and biometric enrollment should be verified and
              authorized by the ARGUS backend. Profile photograph
              upload and personal-detail editing currently operate
              locally and are not persisted to the server.
            </p>

            <Link
              to="/student/privacy"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
            >
              Review privacy settings
              <ArrowLeft className="size-3 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
