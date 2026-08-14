import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

/** SLA status bucket derived from a TicketSLAStatus-like object. */
export type SlaBucket = "on_track" | "at_risk" | "breached";

export interface SlaIndicatorProps {
  /** True when the SLA deadline has passed. */
  isBreached?: boolean;
  /** True when the SLA is at risk of breaching soon. */
  isAtRisk?: boolean;
  /** Remaining time label, e.g. "4h 12m". */
  label?: string;
  /** Compact dot-only variant for dense tables. */
  compact?: boolean;
  className?: string;
}

function resolveBucket(isBreached?: boolean, isAtRisk?: boolean): SlaBucket {
  if (isBreached) return "breached";
  if (isAtRisk) return "at_risk";
  return "on_track";
}

const BUCKET_CONFIG: Record<
  SlaBucket,
  { dot: string; text: string; ring: string; label: string }
> = {
  on_track: {
    dot: "bg-[oklch(var(--sla-on-track))]",
    text: "text-[oklch(var(--sla-on-track))]",
    ring: "sla-dot-on-track",
    label: "On track",
  },
  at_risk: {
    dot: "bg-[oklch(var(--sla-at-risk))]",
    text: "text-[oklch(var(--sla-at-risk))]",
    ring: "sla-dot-at-risk",
    label: "At risk",
  },
  breached: {
    dot: "bg-[oklch(var(--sla-breached))]",
    text: "text-[oklch(var(--sla-breached))]",
    ring: "sla-dot-breached",
    label: "Breached",
  },
};

/**
 * SlaIndicator — colored dot + optional label showing SLA health.
 * Used in ticket tables and detail views.
 */
export function SlaIndicator({
  isBreached,
  isAtRisk,
  label,
  compact = false,
  className,
}: SlaIndicatorProps) {
  const bucket = resolveBucket(isBreached, isAtRisk);
  const cfg = BUCKET_CONFIG[bucket];

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex h-2.5 w-2.5 rounded-full",
          cfg.dot,
          cfg.ring,
          bucket === "at_risk" && "animate-sla-pulse",
          className,
        )}
        role="img"
        aria-label={`SLA ${cfg.label}${label ? `: ${label}` : ""}`}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        cfg.text,
        className,
      )}
      data-ocid="sla_indicator"
    >
      <Clock className="h-3.5 w-3.5 shrink-0" />
      <span
        className={cn(
          "inline-flex h-2 w-2 rounded-full",
          cfg.dot,
          cfg.ring,
          bucket === "at_risk" && "animate-sla-pulse",
        )}
      />
      <span>{label ?? cfg.label}</span>
    </span>
  );
}

export default SlaIndicator;
