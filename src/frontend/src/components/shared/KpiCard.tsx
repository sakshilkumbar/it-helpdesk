import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Trend direction shown beside the KPI value. `null` renders a neutral dash.
 */
export type KpiTrend = "up" | "down" | "neutral" | null;

export interface KpiCardProps {
  /** Short label, e.g. "Open Tickets". */
  label: string;
  /** Numeric or string value to display prominently. */
  value: number | string;
  /** Icon component from lucide-react. */
  icon: LucideIcon;
  /** Optional helper text under the value. */
  hint?: string;
  /** Optional trend indicator. */
  trend?: KpiTrend;
  /** Optional trend caption, e.g. "+12% vs last week". */
  trendLabel?: string;
  /**
   * Tone of the icon chip. Maps to semantic palette tokens.
   * - primary  -> petrol-teal
   * - accent   -> amber
   * - info     -> blue
   * - success  -> emerald/green
   * - warning  -> amber/orange
   * - danger   -> red
   * - neutral  -> muted
   */
  tone?:
    | "primary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "neutral";
  /** Optional click handler — makes the card an interactive summary tile. */
  onClick?: () => void;
  className?: string;
}

const TONE_CHIP: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary",
  accent:
    "bg-accent/15 text-accent-foreground dark:bg-accent/20 dark:text-accent-foreground",
  info: "bg-info/10 text-info dark:bg-info/15 dark:text-info",
  success:
    "bg-[oklch(var(--sla-on-track)/0.12)] text-[oklch(var(--sla-on-track))] dark:bg-[oklch(var(--sla-on-track)/0.18)]",
  warning:
    "bg-[oklch(var(--sla-at-risk)/0.14)] text-[oklch(var(--sla-at-risk))] dark:bg-[oklch(var(--sla-at-risk)/0.2)]",
  danger:
    "bg-[oklch(var(--sla-breached)/0.12)] text-[oklch(var(--sla-breached))] dark:bg-[oklch(var(--sla-breached)/0.18)]",
  neutral: "bg-muted text-muted-foreground",
};

const TREND_CFG: Record<
  NonNullable<KpiTrend>,
  { icon: LucideIcon; className: string }
> = {
  up: { icon: ArrowUpRight, className: "text-[oklch(var(--sla-on-track))]" },
  down: {
    icon: ArrowDownRight,
    className: "text-[oklch(var(--sla-breached))]",
  },
  neutral: { icon: Minus, className: "text-muted-foreground" },
};

/**
 * KpiCard — consistent summary tile with icon chip, value, label, hint, and
 * optional trend indicator. Used across all role dashboards so the card grid
 * reflows identically and reads as one design system.
 */
export function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  trendLabel,
  tone = "neutral",
  onClick,
  className,
}: KpiCardProps) {
  const trendCfg = trend ? TREND_CFG[trend] : null;
  const TrendIcon = trendCfg?.icon;

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-subtle transition-smooth",
        onClick &&
          "cursor-pointer hover:border-primary/40 hover:shadow-elevated",
        className,
      )}
      onClick={onClick}
      data-ocid="kpi_card"
      data-ocid-label={label}
    >
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold tracking-tight tabular-nums text-foreground">
              {value}
            </span>
            {trendCfg && TrendIcon && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  trendCfg.className,
                )}
                aria-label={
                  trend === "up"
                    ? `Trending up${trendLabel ? `: ${trendLabel}` : ""}`
                    : trend === "down"
                      ? `Trending down${trendLabel ? `: ${trendLabel}` : ""}`
                      : `No change${trendLabel ? `: ${trendLabel}` : ""}`
                }
              >
                <TrendIcon className="h-3.5 w-3.5" aria-hidden />
                {trendLabel && <span>{trendLabel}</span>}
              </span>
            )}
          </div>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            TONE_CHIP[tone],
          )}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default KpiCard;
