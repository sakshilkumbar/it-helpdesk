import { c as createLucideIcon, ad as useAuditLogs, r as reactExports, j as jsxRuntimeExports, H as Search, F as Badge, B as Button, i as ChevronRight } from "./index-y0UiSxHL.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-xP9BGQcP.js";
import { I as Input } from "./input-BB_cSxD4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DZqbOTYv.js";
import { a as ChevronsUpDown, C as ChevronLeft } from "./chevrons-up-down-PzKLsqQ3.js";
import "./index-BDSHvDZP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode);
const PAGE_SIZE = 15;
const ACTION_TYPES = [
  "ticketCreated",
  "ticketStatusChanged",
  "ticketClosed",
  "ticketAssigned",
  "roleChanged",
  "userDeactivated",
  "userReactivated",
  "priorityUpdated",
  "categoryUpdated",
  "categoryCreated",
  "settingsUpdated"
];
function actionLabel(action) {
  return action.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function actionBadgeClass(action) {
  if (action.includes("created"))
    return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900";
  if (action.includes("closed"))
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
  if (action.includes("deactivated"))
    return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
  if (action.includes("reactivated"))
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
  if (action.includes("role_changed"))
    return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
  if (action.includes("status_changed") || action.includes("priority_changed"))
    return "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-900";
  if (action.includes("assigned"))
    return "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900";
  return "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
}
function formatTimestamp(ts) {
  if (ts === void 0 || ts === null) return "—";
  const d = typeof ts === "bigint" ? new Date(Number(ts) / 1e6) : new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(void 0, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function AdminAuditLogsPage() {
  const { data: logs, isLoading, isError, error } = useAuditLogs();
  const [search, setSearch] = reactExports.useState("");
  const [actionFilter, setActionFilter] = reactExports.useState("all");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [page, setPage] = reactExports.useState(0);
  const filtered = reactExports.useMemo(() => {
    if (!logs) return [];
    const q = search.trim().toLowerCase();
    return logs.filter((l) => {
      const matchesAction = actionFilter === "all" || l.action === actionFilter;
      const detail = (l.detail || "").toLowerCase();
      const actor = (l.actorId ? String(l.actorId.toText()) : "").toLowerCase();
      const target = (l.targetEntity || "").toLowerCase();
      const matchesSearch = !q || detail.includes(q) || actor.includes(q) || target.includes(q);
      return matchesAction && matchesSearch;
    });
  }, [logs, search, actionFilter]);
  const sorted = reactExports.useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a.timestamp ? new Date(Number(a.timestamp) / 1e6).getTime() : 0;
      const bv = b.timestamp ? new Date(Number(b.timestamp) / 1e6).getTime() : 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [filtered, sortDir]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = sorted.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );
  function toggleSort() {
    setSortDir((d) => d === "asc" ? "desc" : "asc");
  }
  const presentActions = reactExports.useMemo(() => {
    const set = new Set(ACTION_TYPES);
    if (logs) {
      for (const l of logs) if (l.action) set.add(l.action);
    }
    return Array.from(set).sort();
  }, [logs]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Audit Logs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Chronological record of significant platform actions. Newest first by default." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-5 w-5 text-muted-foreground" }),
        "Activity Log"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search by detail, actor, or target…",
                value: search,
                onChange: (e) => {
                  setSearch(e.target.value);
                  setPage(0);
                },
                className: "pl-8"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: actionFilter,
              onValueChange: (v) => {
                setActionFilter(v);
                setPage(0);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[220px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by action type" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All action types" }),
                  presentActions.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: a, children: actionLabel(a) }, a))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: toggleSort,
                className: "inline-flex items-center gap-1 font-medium hover:text-foreground",
                children: [
                  "Timestamp",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3 w-3 text-muted-foreground" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Actor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Target" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Detail" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              colSpan: 5,
              className: "h-24 text-center text-muted-foreground",
              children: "Loading audit logs…"
            }
          ) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableCell,
            {
              colSpan: 5,
              className: "h-24 text-center text-rose-600",
              children: [
                "Failed to load audit logs:",
                " ",
                (error == null ? void 0 : error.message) ?? "Unknown error"
              ]
            }
          ) }) : paged.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              colSpan: 5,
              className: "h-24 text-center text-muted-foreground",
              children: "No audit log entries match the current filters."
            }
          ) }) : paged.map((l, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground whitespace-nowrap", children: formatTimestamp(l.timestamp) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: l.actorId ? String(l.actorId.toText()) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: actionBadgeClass(l.action),
                children: actionLabel(l.action)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: l.targetEntity || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-md text-muted-foreground", children: l.detail || "—" })
          ] }, l.id ?? `${l.timestamp}-${idx}`)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: sorted.length === 0 ? "0 entries" : `Showing ${currentPage * PAGE_SIZE + 1}–${Math.min(
            (currentPage + 1) * PAGE_SIZE,
            sorted.length
          )} of ${sorted.length}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPage((p) => Math.max(0, p - 1)),
                disabled: currentPage === 0,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
                  " Previous"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Page ",
              currentPage + 1,
              " of ",
              pageCount
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setPage((p) => Math.min(pageCount - 1, p + 1)),
                disabled: currentPage >= pageCount - 1,
                children: [
                  "Next ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminAuditLogsPage as default
};
