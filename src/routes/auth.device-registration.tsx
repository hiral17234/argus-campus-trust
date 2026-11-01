
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Chrome,
  Cpu,
  Fingerprint,
  Laptop,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { AuthLayout } from "@/components/argus/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { StatusChip } from "@/components/argus/status-chip";
import { DetailRow } from "@/components/argus/section";

export const Route = createFileRoute("/auth/device-registration")({
  head: () => ({
    meta: [
      { title: "Device registration — ARGUS" },
      {
        name: "description",
        content:
          "Bind a trusted device to your ARGUS identity for secure verification.",
      },
      { property: "og:title", content: "Device registration — ARGUS" },
      {
        property: "og:description",
        content:
          "Register and trust the device you use for campus verification.",
      },
    ],
  }),
  component: DeviceRegistrationPage,
});

type DeviceInfo = {
  browser: string;
  os: string;
  platform: string;
};

function detectDevice(): DeviceInfo {
  if (typeof navigator === "undefined") {
    return {
      browser: "Unknown browser",
      os: "Unknown OS",
      platform: "Unknown",
    };
  }

  const ua = navigator.userAgent;

  const browser = /Edg\//.test(ua)
    ? "Microsoft Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Mozilla Firefox"
        : /CriOS\//.test(ua)
          ? "Chrome (iOS)"
          : /Chrome\//.test(ua)
            ? "Google Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Unknown browser";

  const os = /Windows/.test(ua)
    ? "Windows"
    : /Mac OS X/.test(ua)
      ? "macOS"
      : /Android/.test(ua)
        ? "Android"
        : /iPhone|iPad|iPod/.test(ua)
          ? "iOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown OS";

  const platform =
    /Mobi|Android|iPhone|iPad|iPod/.test(ua) ? "Mobile" : "Desktop";

  return { browser, os, platform };
}

function DeviceRegistrationPage() {
  const navigate = useNavigate();

  const [device, setDevice] = useState<DeviceInfo>({
    browser: "Detecting…",
    os: "Detecting…",
    platform: "Detecting…",
  });

  const [deviceName, setDeviceName] = useState("My primary device");
  const [trusted, setTrusted] = useState(true);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setDevice(detectDevice());
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Frontend prototype only.
    // Device registration and preference persistence must be
    // implemented through the backend API.

    console.log("Device registration preferences:", {
      deviceName,
      device,
      trusted,
      remember,
    });

    navigate({ to: "/student" });
  }

  return (
    <AuthLayout
      eyebrow="Trusted device"
      title="Register this device"
      description="ARGUS binds verification sessions to registered devices. Unrecognised devices are flagged for review."
      step={{ current: 3, total: 3 }}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="device-name">Device name</Label>
          <Input
            id="device-name"
            value={deviceName}
            onChange={(event) => setDeviceName(event.target.value)}
            placeholder="e.g. My Laptop"
            required
            maxLength={50}
          />
        </div>

        <div className="border border-border bg-card p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="inline-flex size-8 shrink-0 items-center justify-center border border-border bg-surface-muted text-muted-foreground">
                <Laptop className="size-4" />
              </span>

              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">
                  {deviceName}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Detected automatically from this session
                </p>
              </div>
            </div>

            <StatusChip tone="info">Current device</StatusChip>
          </div>

          <div className="pt-1">
            <DetailRow
              label="Browser"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Chrome className="size-3.5 text-muted-foreground" />
                  {device.browser}
                </span>
              }
            />

            <DetailRow
              label="Operating system"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Cpu className="size-3.5 text-muted-foreground" />
                  {device.os}
                </span>
              }
            />

            <DetailRow label="Form factor" value={device.platform} />

            <DetailRow
              label="Network location"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  Not verified
                </span>
              }
            />

            <DetailRow
              label="Device fingerprint"
              value={
                <span className="font-mono text-[12px]">
                  Pending backend registration
                </span>
              }
            />
          </div>
        </div>

        <div className="space-y-3 border border-border bg-surface-muted/40 p-3.5">
          <label className="flex items-start gap-2.5">
            <Checkbox
              checked={trusted}
              onCheckedChange={(value) => setTrusted(value === true)}
              className="mt-0.5"
            />

            <span>
              <span className="block text-[13px] font-medium text-foreground">
                Trust this device
              </span>
              <span className="block text-[12px] text-muted-foreground">
                Allows face verification without additional OTP challenges,
                subject to institutional security policy.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-2.5">
            <Checkbox
              checked={remember}
              onCheckedChange={(value) => setRemember(value === true)}
              className="mt-0.5"
            />

            <span>
              <span className="block text-[13px] font-medium text-foreground">
                Remember device
              </span>
              <span className="block text-[12px] text-muted-foreground">
                Requests a persistent device session for up to 30 days,
                subject to backend policy.
              </span>
            </span>
          </label>
        </div>

        <Alert>
          <ShieldCheck className="size-4" />
          <AlertTitle>Device policy</AlertTitle>
          <AlertDescription>
            Students may register up to two devices. Administrators can revoke
            any device at any time from the identity console.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button type="submit" size="xl" className="w-full">
            <Fingerprint />
            Complete setup
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="xl"
            className="w-full"
            onClick={() => navigate({ to: "/student" })}
          >
            Skip for now
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
