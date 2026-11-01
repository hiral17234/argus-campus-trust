import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { HeatmapCell } from "@/lib/analytics-data";

/** Shared enterprise colour ramp — light: teal scale from the ARGUS token set. */
function cellClass(value: number | null) {
  if (value === null) return "bg-surface-muted text-muted-foreground/50";
  if (value >= 90) return "bg-success-surface text-success";
  if (value >= 80) return "bg-success-surface/60 text-success/80";
  if (value >= 70) return "bg-warning-surface/70 text-warning";
  return "bg-danger-surface text-danger";
}

export function AttendanceHeatmap({
  data,
  className,
}: {
  data: { rows: string[]; cols: string[]; cells: HeatmapCell[] };
  className?: string;
}) {
  const lookup = useMemo(
    () => new Map(data.cells.map((c) => [`${c.row}__${c.col}`, c])),
    [data],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-16" aria-label="Row label" />
              {data.cols.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="pb-1 text-center text-[10px] font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row}>
                <th
                  scope="row"
                  className="pr-2 text-right text-[11px] font-medium text-muted-foreground"
                >
                  {row}
                </th>
                {data.cols.map((col) => {
                  const cell = lookup.get(`${row}__${col}`);
                  const value = cell?.value ?? null;
                  return (
                    <td key={col}>
                      <div
                        title={cell?.label ?? `${row} · ${col}: no session`}
                        className={cn(
                          "flex h-9 items-center justify-center rounded-sm border border-border/60 text-[11px] font-semibold tabular-nums",
                          cellClass(value),
                        )}
                      >
                        {value === null ? "—" : value}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="font-medium">Legend:</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-success-surface" /> 90%+
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-success-surface/60" /> 80–89%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-warning-surface/70" /> 70–79%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-danger-surface" /> Below 70%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-border bg-surface-muted" /> No session
        </span>
      </div>
    </div>
  );
}
