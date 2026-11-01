
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Laptop,
  Monitor,
  MoreHorizontal,
  ShieldCheck,
  Smartphone,
  Trash2,
  Wifi,
} from "lucide-react";

import { PageHeader } from "@/components/argus/page-header";
import { SectionCard } from "@/components/argus/section-card";
import { StatusChip } from "@/components/argus/status-chip";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/student/devices")({
  head: () => ({
    meta: [
      { title: "Registered Devices | ARGUS" },
      {
        name: "description",
        content:
          "View and manage trusted devices connected to your ARGUS account.",
      },
    ],
  }),
  component: StudentDevicesPage,
});

type DeviceStatus = "Trusted" | "Pending" | "Revoked";

type Device = {
  id: string;
  name: string;
  type: "Laptop" | "Desktop" | "Mobile";
  browser: string;
  operatingSystem: string;
  location: string;
  lastActive: string;
  registeredOn: string;
  status: DeviceStatus;
  current: boolean;
};

const initialDevices: Device[] = [
  {
    id: "DEV-001",
    name: "Windows Laptop",
    type: "Laptop",
    browser: "Chrome",
    operatingSystem: "Windows 11",
    location: "Gwalior, India",
    lastActive: "Currently active",
    registeredOn: "20 October 2026",
    status: "Trusted",
    current: true,
  },
  {
    id: "DEV-002",
    name: "Android Phone",
    type: "Mobile",
    browser: "Chrome Mobile",
    operatingSystem: "Android 15",
    location: "Gwalior, India",
    lastActive: "29 October 2026",
    registeredOn: "15 October 2026",
    status: "Trusted",
    current: false,
  },
  {
    id: "DEV-003",
    name: "Personal Laptop",
    type: "Laptop",
    browser: "Firefox",
    operatingSystem: "Windows 10",
    location: "Gwalior, India",
    lastActive: "25 October 2026",
    registeredOn: "10 October 2026",
    status: "Pending",
    current: false,
  },
];

function getDeviceIcon(type: Device["type"]) {
  switch (type) {
    case "Laptop":
      return Laptop;
    case "Desktop":
      return Monitor;
    case "Mobile":
      return Smartphone;
  }
}

function getDeviceTone(status: DeviceStatus) {
  switch (status) {
    case "Trusted":
      return "success" as const;
    case "Pending":
      return "warning" as const;
    case "Revoked":
      return "danger" as const;
  }
}

function StudentDevicesPage() {
  const [devices, setDevices] = useState(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(
    null,
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");

  const trustedCount = devices.filter(
    (device) => device.status === "Trusted",
  ).length;

  const pendingCount = devices.filter(
    (device) => device.status === "Pending",
  ).length;

  const currentDevice = devices.find((device) => device.current);

  function requestRemoval(deviceId: string) {
    const device = devices.find((item) => item.id === deviceId);

    if (!device) return;

    if (device.current) {
      setMessage("You cannot revoke the device currently in use.");
      return;
    }

    setSelectedDevice(deviceId);
    setShowConfirmation(true);
    setMessage("");
  }

  function confirmRemoval() {
    if (!selectedDevice) return;

    // Frontend prototype only.
    // Replace this operation with the backend device-revocation API.
    setDevices((current) =>
      current.map((device) =>
        device.id === selectedDevice
          ? { ...device, status: "Revoked" }
          : device,
      ),
    );

    setMessage(
      "Device marked as revoked in this frontend demonstration. Server-side revocation is not yet implemented.",
    );

    setSelectedDevice(null);
    setShowConfirmation(false);
  }

  function cancelRemoval() {
    setSelectedDevice(null);
    setShowConfirmation(false);
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
          title="Registered devices"
          description="Review the devices associated with your institutional identity and manage their trust status."
          action={
            <Link to="/auth/device-registration">
              <Button size="sm">
                <Smartphone className="size-4" />
                Register device
              </Button>
            </Link>
          }
        />
      </div>

      {/* Device summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Total devices
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {devices.length}
          </p>
        </div>

        <div className="border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Trusted devices
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {trustedCount}
          </p>
        </div>

        <div className="col-span-2 border border-border bg-card p-4 sm:col-span-1">
          <p className="text-xs text-muted-foreground">
            Pending devices
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 border border-border bg-card p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <div>
          <p className="text-xs font-medium text-foreground">
            Device security
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Only register devices that you personally control. Revoke
            access to devices that are lost, shared or no longer in use.
          </p>
        </div>
      </div>

      {/* Current device */}
      {currentDevice && (
        <SectionCard
          title="Current device"
          description="The device currently associated with this browser session."
        >
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-background">
              {(() => {
                const Icon = getDeviceIcon(currentDevice.type);
                return <Icon className="size-5 text-muted-foreground" />;
              })()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {currentDevice.name}
                </h3>

                <StatusChip tone="success" dot={false}>
                  Current device
                </StatusChip>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {currentDevice.operatingSystem} · {currentDevice.browser}
              </p>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wifi className="size-3.5" />
                {currentDevice.location}
              </p>
            </div>

            <StatusChip tone={getDeviceTone(currentDevice.status)} dot={false}>
              {currentDevice.status}
            </StatusChip>
          </div>
        </SectionCard>
      )}

      {/* All devices */}
      <SectionCard
        title="All registered devices"
        description="Review the registration and trust status of each device."
      >
        <div className="divide-y divide-border">
          {devices.map((device) => {
            const Icon = getDeviceIcon(device.type);
            const revoked = device.status === "Revoked";

            return (
              <article
                key={device.id}
                className="py-4 first:pt-1 last:pb-1"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-background">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {device.name}
                      </h3>

                      {device.current && (
                        <StatusChip tone="success" dot={false}>
                          Current
                        </StatusChip>
                      )}

                      <StatusChip
                        tone={getDeviceTone(device.status)}
                        dot={false}
                      >
                        {device.status}
                      </StatusChip>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {device.operatingSystem} · {device.browser}
                    </p>

                    <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Device ID
                        </p>
                        <p className="mt-1 font-mono text-xs text-foreground">
                          {device.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Last active
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground">
                          <Clock3 className="size-3 text-muted-foreground" />
                          {device.lastActive}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Registered on
                        </p>
                        <p className="mt-1 text-xs text-foreground">
                          {device.registeredOn}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Location
                        </p>
                        <p className="mt-1 text-xs text-foreground">
                          {device.location}
                        </p>
                      </div>
                    </div>

                    {!device.current && !revoked && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => requestRemoval(device.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-destructive hover:underline"
                        >
                          <Trash2 className="size-3.5" />
                          Revoke device
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>

      {/* Removal confirmation */}
      {showConfirmation && (
        <div className="border border-destructive/40 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground">
                Revoke device access?
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                This will mark the selected device as revoked in the
                frontend demonstration. Actual access revocation requires
                server-side implementation.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={confirmRemoval}
                >
                  <Trash2 className="size-3.5" />
                  Confirm revocation
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelRemoval}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {message && (
        <div
          role="status"
          className="flex items-start gap-2 border border-border bg-muted/20 p-3"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-foreground">
            {message}
          </p>
        </div>
      )}

      {/* Device registration information */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-xs font-medium text-foreground">
              Registering a new device
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              A new device must complete the institutional device
              registration process before it can be considered trusted
              for attendance verification.
            </p>

            <Link
              to="/auth/device-registration"
              className="mt-3 inline-block text-xs font-medium text-foreground hover:underline"
            >
              Go to device registration →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

