
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  LockKeyhole,
  Pencil,
  Save,
  X,
  KeyRound,
  CalendarDays,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/argus/section";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/profile")({
  component: AdminProfile,
});

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
};

const initialProfile: ProfileData = {
  name: "Administrator",
  email: "admin@argus.edu",
  phone: "+91 98765 43210",
  designation: "System Administrator",
  department: "Administration",
};

function AdminProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileChange = (
    field: keyof ProfileData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) return;
    if (!formData.phone.trim()) return;
    if (!formData.designation.trim()) return;

    setProfile(formData);
    setEditing(false);
    setSaved(true);
  };

  const cancelEditing = () => {
    setFormData(profile);
    setEditing(false);
    setSaved(false);
  };

  const changePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Complete all password fields.");
      return;
    }

    if (newPassword.length < 12) {
      setPasswordError(
        "The new password must contain at least 12 characters.",
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setPasswordError(
        "Include at least one uppercase and one lowercase letter.",
      );
      return;
    }

    if (!/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordError(
        "Include at least one number and one special character.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("The new passwords do not match.");
      return;
    }

    setPasswordMessage(
      "Password validation passed. Connect the password update API to complete this action.",
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrator Profile"
        description="Manage administrator account information and review account security details."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Administrator account
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Profile changes are stored in local page state only.
              Production updates require an authenticated backend API.
            </p>
          </div>
        </div>
        <StatusChip status="Demo data" />
      </div>

      {/* Profile overview */}
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="border border-border bg-card p-5">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center border border-border bg-muted">
              <UserRound className="h-9 w-9 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              {profile.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.designation}
            </p>

            <div className="mt-3">
              <StatusChip status="Administrator" />
            </div>

            <div className="mt-5 w-full border-t border-border pt-4 text-left">
              <ProfileInfo
                icon={Mail}
                label="Email"
                value={profile.email}
              />
              <ProfileInfo
                icon={Building2}
                label="Department"
                value={profile.department}
              />
              <ProfileInfo
                icon={ShieldCheck}
                label="Access role"
                value="Administrator"
              />
            </div>
          </div>
        </div>

        {/* Personal information */}
        <SectionCard
          title="Personal information"
          description="Review and update your administrator profile details."
          action={
            !editing ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData(profile);
                  setEditing(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={cancelEditing}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )
          }
        >
          <form onSubmit={saveProfile}>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Full name">
                <Input
                  value={formData.name}
                  onChange={(event) =>
                    handleProfileChange("name", event.target.value)
                  }
                  disabled={!editing}
                  required
                />
              </FormField>

              <FormField label="Email address">
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  readOnly
                />
              </FormField>

              <FormField label="Phone number">
                <Input
                  value={formData.phone}
                  onChange={(event) =>
                    handleProfileChange("phone", event.target.value)
                  }
                  disabled={!editing}
                  required
                />
              </FormField>

              <FormField label="Designation">
                <Input
                  value={formData.designation}
                  onChange={(event) =>
                    handleProfileChange("designation", event.target.value)
                  }
                  disabled={!editing}
                  required
                />
              </FormField>

              <FormField label="Department">
                <Input
                  value={formData.department}
                  disabled
                  readOnly
                />
              </FormField>

              <FormField label="Account role">
                <Input
                  value="Administrator"
                  disabled
                  readOnly
                />
              </FormField>
            </div>

            {editing && (
              <div className="mt-5 flex justify-end border-t border-border pt-4">
                <Button type="submit" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </Button>
              </div>
            )}

            {saved && (
              <p className="mt-4 text-xs text-muted-foreground">
                Profile changes were updated in this demonstration page.
              </p>
            )}
          </form>
        </SectionCard>
      </div>

      {/* Password management */}
      <SectionCard
        title="Change password"
        description="Validate a new password before connecting this form to the authentication service."
      >
        <form onSubmit={changePassword} className="max-w-2xl space-y-4">
          <FormField label="Current password">
            <Input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter current password"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="New password">
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Enter new password"
              />
            </FormField>

            <FormField label="Confirm new password">
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
            </FormField>
          </div>

          <div className="border border-border bg-muted/20 p-3">
            <p className="text-xs font-medium">Password requirements</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>At least 12 characters</li>
              <li>At least one uppercase and one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>

          {passwordError && (
            <p role="alert" className="text-sm text-destructive">
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p role="status" className="text-sm text-muted-foreground">
              {passwordMessage}
            </p>
          )}

          <Button type="submit" size="sm">
            <KeyRound className="mr-2 h-4 w-4" />
            Validate password change
          </Button>
        </form>
      </SectionCard>

      {/* Account security */}
      <SectionCard
        title="Account security"
        description="Illustrative account security information."
      >
        <div className="divide-y divide-border">
          <SecurityRow
            icon={ShieldCheck}
            title="Account role"
            description="Administrator"
            status="Active"
          />
          <SecurityRow
            icon={LockKeyhole}
            title="Authentication"
            description="Backend authentication integration pending"
            status="Pending"
          />
          <SecurityRow
            icon={CalendarDays}
            title="Last password update"
            description="Not available in demonstration mode"
            status="Unavailable"
          />
        </div>
      </SectionCard>
    </div>
  );
}

function ProfileInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function SecurityRow({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <StatusChip status={status} />
    </div>
  );
}
