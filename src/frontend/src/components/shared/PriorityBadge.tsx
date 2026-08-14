import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PriorityInfo {
  id?: bigint;
  name: string;
  level: number;
}

interface PriorityConfig {
  label: string;
  /** Token-driven badge classes. */
  className: string;
  /** Left-bar accent utility (matches .priority-bar-* in index.css). */
  bar: string;
  /** Font weight — higher urgency gets heavier weight. */
  weight: string;
  /** Dot color for inline indicators. */
  dot: string;
}

const LEVEL_CONFIG: Record<number, PriorityConfig> = {
  1: {
    label: "Critical",
    className:
      "border-destructive/30 bg-destructive/10 text-destructive font-semibold",
    bar: "priority-bar-critical",
    weight: "font-semibold",
    dot: "bg-destructive",
  },
  2: {
    label: "High",
    className:
      "border-accent/40 bg-accent/15 text-[oklch(var(--accent-foreground))] font-medium",
    bar: "priority-bar-high",
    weight: "font-medium",
    dot: "bg-accent",
  },
  3: {
    label: "Medium",
    className: "border-primary/30 bg-primary/10 text-primary font-medium",
    bar: "priority-bar-medium",
    weight: "font-medium",
    dot: "bg-primary",
  },
  4: {
    label: "Low",
    className: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
    bar: "priority-bar-low",
    weight: "font-normal",
    dot: "bg-muted-foreground",
  },
};

function resolveConfig(p: PriorityInfo): PriorityConfig {
  const byLevel = LEVEL_CONFIG[p.level];
  if (byLevel) return byLevel;
  const name = p.name.toLowerCase();
  if (name.includes("critical")) return LEVEL_CONFIG[1];
  if (name.includes("high")) return LEVEL_CONFIG[2];
  if (name.includes("medium")) return LEVEL_CONFIG[3];
  if (name.includes("low")) return LEVEL_CONFIG[4];
  return {
    label: p.name,
    className: "border-border bg-muted text-foreground",
    bar: "",
    weight: "font-normal",
    dot: "bg-muted-foreground",
  };
}

export interface PriorityBadgeProps {
  priority: PriorityInfo;
  className?: string;
  /** Show a leading colored dot. */
  withDot?: boolean;
}

export function PriorityBadge({
  priority,
  className,
  withDot = false,
}: PriorityBadgeProps) {
  const cfg = resolveConfig(priority);
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border", cfg.className, className)}
      data-ocid={`priority_badge.${cfg.label.toLowerCase()}`}
    >
      {withDot && <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />}
      {cfg.label}
    </Badge>
  );
}

/** Priority filter options for DataTable columns. */
export const PRIORITY_FILTER_OPTIONS = [
  { label: "Critical", value: "Critical" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];
