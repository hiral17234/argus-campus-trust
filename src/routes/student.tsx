import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/argus/app-shell";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
