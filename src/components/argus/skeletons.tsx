import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
      <Skeleton className="h-3 w-24 rounded-sm" />
      <Skeleton className="mt-3 h-7 w-32 rounded-sm" />
      <Skeleton className="mt-4 h-2 w-full rounded-sm" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-3 w-40 rounded-sm" />
            <Skeleton className="h-2.5 w-24 rounded-sm" />
          </div>
          <Skeleton className="h-5 w-16 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2 rounded-sm" />
            <Skeleton className="h-2.5 w-1/3 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
