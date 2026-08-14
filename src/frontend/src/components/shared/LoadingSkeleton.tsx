import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Table-shaped skeleton — header row + N body rows matching column count.
 */
export function TableSkeleton({
  rows = 6,
  cols = 5,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  const colKeys = Array.from({ length: cols }, (_, i) => `col-${i}`);
  const rowKeys = Array.from({ length: rows }, (_, i) => `row-${i}`);
  return (
    <output
      className={cn(
        "overflow-hidden rounded-lg border bg-card shadow-subtle",
        className,
      )}
      data-ocid="loading_state"
      aria-label="Loading table"
    >
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex gap-3">
          {colKeys.map((ck) => (
            <Skeleton key={ck} className="h-3.5 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {rowKeys.map((rk, r) => (
          <div key={rk} className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              {colKeys.map((ck, c) => {
                const maxW = `${60 + ((r + c) % 5) * 8}%`;
                return (
                  <Skeleton
                    key={`${rk}-${ck}`}
                    className="h-4 flex-1"
                    style={{ maxWidth: maxW }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </output>
  );
}

/**
 * Dashboard KPI card grid skeleton — matches the stat-card layout used on
 * employee/agent/admin dashboards (label, big number, sub-label).
 */
export function CardGridSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <output
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
      data-ocid="loading_state"
      aria-label="Loading dashboard"
    >
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
        <div key={i} className="rounded-lg border bg-card p-5 shadow-subtle">
          <Skeleton className="mb-3 h-3.5 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="mt-3 h-3 w-32" />
        </div>
      ))}
    </output>
  );
}

/**
 * Single content card skeleton — title bar + several text lines.
 * Matches the detail-panel / summary-card shape.
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <output
      className={cn("rounded-lg border bg-card p-6 shadow-subtle", className)}
      data-ocid="loading_state"
      aria-label="Loading content"
    >
      <Skeleton className="mb-4 h-5 w-1/3" />
      <Skeleton className="mb-2.5 h-4 w-full" />
      <Skeleton className="mb-2.5 h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </output>
  );
}

/**
 * Dashboard card with a chart area — label, number, then a sparkline block.
 */
export function ChartCardSkeleton({ className }: { className?: string }) {
  return (
    <output
      className={cn("rounded-lg border bg-card p-5 shadow-subtle", className)}
      data-ocid="loading_state"
      aria-label="Loading chart"
    >
      <Skeleton className="mb-3 h-3.5 w-28" />
      <Skeleton className="mb-4 h-8 w-24" />
      <Skeleton className="h-24 w-full rounded-md" />
    </output>
  );
}

/**
 * List row skeleton — avatar/icon + two lines. Matches ticket-list and
 * activity-feed item shapes.
 */
export function ListRowSkeleton({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <output
      className={cn(
        "divide-y divide-border rounded-lg border bg-card",
        className,
      )}
      data-ocid="loading_state"
      aria-label="Loading list"
    >
      {Array.from({ length: rows }).map((_, r) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
        <div key={r} className="flex items-center gap-3 px-4 py-3.5">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
        </div>
      ))}
    </output>
  );
}

/** Single full-width line — generic placeholder. */
export function LineSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

/** Backwards-compat alias. */
export { LineSkeleton as LoadingSkeleton };
