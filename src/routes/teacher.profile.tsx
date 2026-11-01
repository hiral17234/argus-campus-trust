import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Activity,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  PageHeader,
  SectionCard,
} from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/teacher/profile")({
  component: TeacherProfile,
});

type TeacherProfileData = {
  fullName: string;
  employeeId: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  alternateEmail: string;
  office: string;
  specialization: string;
};

const initialProfile: TeacherProfileData = {
  fullName: "Dr. Ananya Sharma",
  employeeId: "MITS-FAC-0241",
  designation: "Assistant Professor",
  department: "Computer Science and Engineering",
  email: "ananya.sharma@mitsgwl.ac.in",
  phone: "",
  alternateEmail: "",
  office: "Academic Block A",
  specialization: "Data Structures and Algorithms",
};

function TeacherProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (
    field: keyof TeacherProfileData,
    value: string,
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
        setPhotoName(file.name);
        setSaved(false);
      }
    };

    reader.onerror = () => {
      alert("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSave = () => {
    if (!profile.fullName.trim()) {
      alert("Full name is required.");
      return;
    }

    if (!profile.email.trim()) {
      alert("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (
      profile.phone &&
      !/^[0-9+\-\s()]{7,20}$/.test(profile.phone)
    ) {
      alert("Please enter a valid phone number.");
      return;
    }

    setEditing(false);
    setSaved(true);

    console.info("Teacher profile update demo:", {
      employeeId: profile.employeeId,
      updatedFields: [
        "fullName",
        "phone",
        "alternateEmail",
        "office",
        "specialization",
      ],
      photoSelected: Boolean(photo),
    });
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setPhoto(null);
    setPhotoName("");
    setEditing(false);
    setSaved(false);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoName("");
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your faculty account information."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/teacher">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        <StatusChip status="Demo profile" />
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-3 border border-border bg-muted/20 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            Faculty account information
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            This profile uses sample information. Changes made here are held
            in local page state and are not saved to the institutional
            database.
          </p>
        </div>
      </div>

      {/* Profile header */}
      <SectionCard>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center border border-border bg-muted/30">
            {photo ? (
              <img
                src={photo}
                alt="Teacher profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-10 w-10 text-muted-foreground" />
            )}

            {editing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center border border-border bg-background"
                aria-label="Upload profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{profile.fullName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.designation}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile.department}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusChip status="Faculty" />
              <StatusChip status="Active demo account" />
            </div>

            {photoName && (
              <p className="mt-2 text-xs text-muted-foreground">
                Selected image: {photoName}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {editing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  Save changes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            )}
          </div>
        </div>

        {editing && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Profile image must be an image file of 5 MB or less.
            </p>

            {photo && (
              <Button
                size="sm"
                variant="ghost"
                onClick={removePhoto}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Remove photo
              </Button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </SectionCard>

      {saved && (
        <div className="flex items-center gap-2 border border-border p-3 text-sm">
          <CheckCircle2 className="h-4 w-4" />
          Changes applied locally. Backend saving is not connected.
        </div>
      )}

      {/* Personal information */}
      <SectionCard
        title="Personal information"
        description="Your basic faculty account details."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileField
            label="Full name"
            value={profile.fullName}
            editing={editing}
            onChange={(value) => updateField("fullName", value)}
          />

          <ProfileField
            label="Employee ID"
            value={profile.employeeId}
            editing={false}
            disabled
          />

          <ProfileField
            label="Official email"
            value={profile.email}
            editing={false}
            disabled
            icon={<Mail className="h-4 w-4" />}
          />

          <ProfileField
            label="Phone number"
            value={profile.phone}
            editing={editing}
            onChange={(value) => updateField("phone", value)}
            placeholder="Add phone number"
            icon={<Phone className="h-4 w-4" />}
          />

          <ProfileField
            label="Alternate email"
            value={profile.alternateEmail}
            editing={editing}
            onChange={(value) =>
              updateField("alternateEmail", value)
            }
            placeholder="Add alternate email"
            icon={<Mail className="h-4 w-4" />}
          />

          <ProfileField
            label="Office location"
            value={profile.office}
            editing={editing}
            onChange={(value) => updateField("office", value)}
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>
      </SectionCard>

      {/* Professional information */}
      <SectionCard
        title="Professional information"
        description="Faculty designation and academic affiliation."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileField
            label="Designation"
            value={profile.designation}
            editing={false}
            disabled
          />

          <ProfileField
            label="Department"
            value={profile.department}
            editing={false}
            disabled
          />

          <ProfileField
            label="Specialization"
            value={profile.specialization}
            editing={editing}
            onChange={(value) =>
              updateField("specialization", value)
            }
            icon={<GraduationCap className="h-4 w-4" />}
          />
        </div>
      </SectionCard>

      {/* Account and security */}
      <SectionCard
        title="Account and security"
        description="Authentication and account access information."
      >
        <div className="divide-y divide-border">
          <AccountRow
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Account status"
            description="Sample faculty account status."
            value="Active demo"
          />

          <AccountRow
            icon={<Mail className="h-4 w-4" />}
            title="Email verification"
            description="Actual verification status must come from the authentication service."
            value="Backend pending"
          />

          <AccountRow
            icon={<Clock3 className="h-4 w-4" />}
            title="Last login"
            description="Actual login timestamp is not connected."
            value="Not available"
          />

          <AccountRow
            icon={<Activity className="h-4 w-4" />}
            title="Account activity"
            description="Authentication and security logs."
            value="Backend pending"
          />
        </div>
      </SectionCard>

      {/* Shortcuts */}
      <SectionCard
        title="Profile-related settings"
        description="Access other account management pages."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/teacher/notifications"
            className="flex items-center justify-between border border-border p-4 hover:bg-muted/30"
          >
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Review faculty notifications.
              </p>
            </div>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/teacher/analytics"
            className="flex items-center justify-between border border-border p-4 hover:bg-muted/30"
          >
            <div>
              <p className="text-sm font-medium">Teaching analytics</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Review attendance and class trends.
              </p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </SectionCard>

      <p className="text-xs text-muted-foreground">
        Faculty identity, employee ID, official email, designation, and
        department should be controlled by the institutional administrator.
        Profile edits must be validated and persisted through authenticated
        backend APIs.
      </p>
    </div>
  );
}

type ProfileFieldProps = {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

function ProfileField({
  label,
  value,
  editing,
  onChange,
  placeholder,
  disabled = false,
  icon,
}: ProfileFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {editing && !disabled ? (
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
        />
      ) : (
        <div className="flex min-h-10 items-center gap-2 border border-border bg-muted/20 px-3 py-2">
          {icon && (
            <span className="shrink-0 text-muted-foreground">
              {icon}
            </span>
          )}
          <span className="break-words text-sm">
            {value || "Not provided"}
          </span>
        </div>
      )}
    </div>
  );
}

type AccountRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string;
};

function AccountRow({
  icon,
  title,
  description,
  value,
}: AccountRowProps) {
  return (
    <div className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <span className="pl-7 text-xs text-muted-foreground sm:pl-0">
        {value}
      </span>
    </div>
  );
}
