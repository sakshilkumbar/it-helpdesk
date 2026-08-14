import { c as createLucideIcon, ac as useSLAStatuses, q as usePriorities, r as reactExports, j as jsxRuntimeExports, s as Clock, F as Badge } from "./index-y0UiSxHL.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-xP9BGQcP.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DZqbOTYv.js";
import { C as CircleCheck } from "./circle-check-_t8Qr5P9.js";
import { T as TriangleAlert } from "./triangle-alert-DxxnH3Y-.js";
import "./index-BDSHvDZP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function priorityBadge(p) {
  switch (p) {
    case "urgent":
    case "critical":
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
    case "high":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    case "medium":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900";
    case "low":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
}
function stateBadgeClass(s) {
  switch (s) {
    case "on_track":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
    case "at_risk":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    case "breached":
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
  }
}
function stateLabel(s) {
  switch (s) {
    case "on_track":
      return "On track";
    case "at_risk":
      return "At risk";
    case "breached":
      return "Breached";
  }
}
function formatDeadline(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(void 0, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatRemaining(ms) {
  if (ms <= 0) return "Breached";
  const totalMinutes = Math.floor(ms / 6e4);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor(totalMinutes % 1440 / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}
function AdminSLAPage() {
  const { data: tickets, isLoading, isError, error } = useSLAStatuses();
  const { data: priorities } = usePriorities();
  const [filter, setFilter] = reactExports.useState("all");
  const priorityName = (id) => {
    var _a;
    return ((_a = priorities == null ? void 0 : priorities.find((p) => p.id === id)) == null ? void 0 : _a.name) ?? String(id);
  };
  const enriched = reactExports.useMemo(() => {
    if (!tickets) return [];
    return tickets.map((t) => {
      const deadlineMs = t.slaDeadline ? new Date(Number(t.slaDeadline) / 1e6).getTime() : 0;
      const remainingMs = deadlineMs ? deadlineMs - Date.now() : 0;
      const state = t.isBreached ? "breached" : t.isAtRisk ? "at_risk" : remainingMs <= 0 ? "breached" : "on_track";
      return {
        ...t,
        _state: state,
        _remainingMs: remainingMs,
        _deadlineMs: deadlineMs
      };
    });
  }, [tickets]);
  const filtered = reactExports.useMemo(() => {
    if (filter === "all") return enriched;
    return enriched.filter((t) => t._state === filter);
  }, [enriched, filter]);
  const sorted = reactExports.useMemo(() => {
    return [...filtered].sort((a, b) => {
      const order = {
        breached: 0,
        at_risk: 1,
        on_track: 2
      };
      if (order[a._state] !== order[b._state])
        return order[a._state] - order[b._state];
      return a._deadlineMs - b._deadlineMs;
    });
  }, [filtered]);
  const stats = reactExports.useMemo(() => {
    const total = enriched.length;
    const atRisk = enriched.filter((t) => t._state === "at_risk").length;
    const breached = enriched.filter((t) => t._state === "breached").length;
    const onTrack = enriched.filter((t) => t._state === "on_track").length;
    return { total, atRisk, breached, onTrack };
  }, [enriched]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "SLA Monitoring" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Track tickets against their target resolution times. Act before SLAs breach." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total Tickets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.total }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "On Track" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-600" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold text-emerald-600 dark:text-emerald-400", children: stats.onTrack }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "At Risk" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4 text-amber-600" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold text-amber-600 dark:text-amber-400", children: stats.atRisk }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Breached" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-rose-600" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold text-rose-600 dark:text-rose-400", children: stats.breached }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Tickets by SLA Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filter, onValueChange: (v) => setFilter(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by SLA status" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "on_track", children: "On track" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "at_risk", children: "At risk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "breached", children: "Breached" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[100px]", children: "Ticket" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Priority" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "SLA Deadline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Time Remaining" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 6,
            className: "h-24 text-center text-muted-foreground",
            children: "Loading SLA data…"
          }
        ) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableCell,
          {
            colSpan: 6,
            className: "h-24 text-center text-rose-600",
            children: [
              "Failed to load SLA data:",
              " ",
              (error == null ? void 0 : error.message) ?? "Unknown error"
            ]
          }
        ) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 6,
            className: "h-24 text-center text-muted-foreground",
            children: "No tickets match the current filter."
          }
        ) }) : sorted.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: String(t.ticketId) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: t.title || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: priorityBadge(
                priorityName(BigInt(t.priorityId)).toLowerCase()
              ),
              children: priorityName(BigInt(t.priorityId))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: formatDeadline(Number(t.slaDeadline) / 1e6) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `font-medium tabular-nums ${t._state === "breached" ? "text-rose-600 dark:text-rose-400" : t._state === "at_risk" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`,
              children: formatRemaining(t._remainingMs)
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: stateBadgeClass(t._state),
              children: stateLabel(t._state)
            }
          ) })
        ] }, String(t.ticketId))) })
      ] }) }) })
    ] })
  ] });
}
export {
  AdminSLAPage as default
};
