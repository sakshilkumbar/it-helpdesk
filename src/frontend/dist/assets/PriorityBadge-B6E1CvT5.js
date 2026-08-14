import { j as jsxRuntimeExports, F as Badge, g as cn } from "./index-y0UiSxHL.js";
const LEVEL_CONFIG = {
  1: {
    label: "Critical",
    className: "border-destructive/30 bg-destructive/10 text-destructive font-semibold",
    bar: "priority-bar-critical",
    weight: "font-semibold",
    dot: "bg-destructive"
  },
  2: {
    label: "High",
    className: "border-accent/40 bg-accent/15 text-[oklch(var(--accent-foreground))] font-medium",
    bar: "priority-bar-high",
    weight: "font-medium",
    dot: "bg-accent"
  },
  3: {
    label: "Medium",
    className: "border-primary/30 bg-primary/10 text-primary font-medium",
    bar: "priority-bar-medium",
    weight: "font-medium",
    dot: "bg-primary"
  },
  4: {
    label: "Low",
    className: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
    bar: "priority-bar-low",
    weight: "font-normal",
    dot: "bg-muted-foreground"
  }
};
function resolveConfig(p) {
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
    dot: "bg-muted-foreground"
  };
}
function PriorityBadge({
  priority,
  className,
  withDot = false
}) {
  const cfg = resolveConfig(priority);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: cn("gap-1.5 border", cfg.className, className),
      "data-ocid": `priority_badge.${cfg.label.toLowerCase()}`,
      children: [
        withDot && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", cfg.dot) }),
        cfg.label
      ]
    }
  );
}
export {
  PriorityBadge as P
};
