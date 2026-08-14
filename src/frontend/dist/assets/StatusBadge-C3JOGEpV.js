import { j as jsxRuntimeExports, F as Badge, g as cn } from "./index-y0UiSxHL.js";
const STATUS_CONFIG = {
  new: {
    label: "New",
    className: "border-badge-new/30 bg-badge-new/10 text-[oklch(var(--badge-new))]",
    dot: "bg-badge-new"
  },
  open: {
    label: "Open",
    className: "border-badge-open/30 bg-badge-open/10 text-[oklch(var(--badge-open))]",
    dot: "bg-badge-open"
  },
  in_progress: {
    label: "In Progress",
    className: "border-badge-progress/30 bg-badge-progress/10 text-[oklch(var(--badge-progress))]",
    dot: "bg-badge-progress"
  },
  pending: {
    label: "Pending",
    className: "border-badge-pending/30 bg-badge-pending/10 text-[oklch(var(--badge-pending))]",
    dot: "bg-badge-pending"
  },
  resolved: {
    label: "Resolved",
    className: "border-badge-resolved/30 bg-badge-resolved/10 text-[oklch(var(--badge-resolved))]",
    dot: "bg-badge-resolved"
  },
  closed: {
    label: "Closed",
    className: "border-badge-closed/30 bg-badge-closed/10 text-[oklch(var(--badge-closed))]",
    dot: "bg-badge-closed"
  },
  escalated: {
    label: "Escalated",
    className: "border-badge-escalated/30 bg-badge-escalated/10 text-[oklch(var(--badge-escalated))]",
    dot: "bg-badge-escalated"
  }
};
function StatusBadge({
  status,
  className,
  withDot = false
}) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: String(status),
    className: "",
    dot: "bg-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: cn(
        "gap-1.5 border font-medium capitalize",
        cfg.className,
        className
      ),
      "data-ocid": `status_badge.${status}`,
      children: [
        withDot && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", cfg.dot) }),
        cfg.label
      ]
    }
  );
}
function statusLabel(status) {
  var _a;
  return ((_a = STATUS_CONFIG[status]) == null ? void 0 : _a.label) ?? String(status);
}
Object.keys(STATUS_CONFIG).map((s) => ({ label: STATUS_CONFIG[s].label, value: s }));
export {
  StatusBadge as S,
  statusLabel as s
};
