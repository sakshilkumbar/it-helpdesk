import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/types";

/**
 * Extended status set — the backend TicketStatus enum covers open/in_progress/
 * pending/resolved/closed. The UI also surfaces "new" (freshly created, not yet
 * triaged) and "escalated" (flagged via escalateTicket). Both map to dedicated
 * design tokens (--badge-new, --badge-escalated).
 */
export type UiTicketStatus = TicketStatus | "new" | "escalated";

interface StatusConfig {
  label: string;
  /** Tailwind classes referencing the badge-* design tokens. */
  className: string;
  /** Dot color for inline indicators. */
  dot: string;
}

const STATUS_CONFIG: Record<UiTicketStatus, StatusConfig> = {
  new: {
    label: "New",
    className:
      "border-badge-new/30 bg-badge-new/10 text-[oklch(var(--badge-new))]",
    dot: "bg-badge-new",
  },
  open: {
    label: "Open",
    className:
      "border-badge-open/30 bg-badge-open/10 text-[oklch(var(--badge-open))]",
    dot: "bg-badge-open",
  },
  in_progress: {
    label: "In Progress",
    className:
      "border-badge-progress/30 bg-badge-progress/10 text-[oklch(var(--badge-progress))]",
    dot: "bg-badge-progress",
  },
  pending: {
    label: "Pending",
    className:
      "border-badge-pending/30 bg-badge-pending/10 text-[oklch(var(--badge-pending))]",
    dot: "bg-badge-pending",
  },
  resolved: {
    label: "Resolved",
    className:
      "border-badge-resolved/30 bg-badge-resolved/10 text-[oklch(var(--badge-resolved))]",
    dot: "bg-badge-resolved",
  },
  closed: {
    label: "Closed",
    className:
      "border-badge-closed/30 bg-badge-closed/10 text-[oklch(var(--badge-closed))]",
    dot: "bg-badge-closed",
  },
  escalated: {
    label: "Escalated",
    className:
      "border-badge-escalated/30 bg-badge-escalated/10 text-[oklch(var(--badge-escalated))]",
    dot: "bg-badge-escalated",
  },
};

export interface StatusBadgeProps {
  status: UiTicketStatus;
  className?: string;
  /** Show a leading colored dot. */
  withDot?: boolean;
}

export function StatusBadge({
  status,
  className,
  withDot = false,
}: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: String(status),
    className: "",
    dot: "bg-muted-foreground",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border font-medium capitalize",
        cfg.className,
        className,
      )}
      data-ocid={`status_badge.${status}`}
    >
      {withDot && <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />}
      {cfg.label}
    </Badge>
  );
}

export function statusLabel(status: UiTicketStatus): string {
  return STATUS_CONFIG[status]?.label ?? String(status);
}

/** Status filter options for DataTable columns. */
export const STATUS_FILTER_OPTIONS = (
  Object.keys(STATUS_CONFIG) as UiTicketStatus[]
).map((s) => ({ label: STATUS_CONFIG[s].label, value: s }));
