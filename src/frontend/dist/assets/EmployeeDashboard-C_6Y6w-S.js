import { o as useNavigate, p as useMyTickets, q as usePriorities, r as reactExports, j as jsxRuntimeExports, B as Button, s as Clock, T as Ticket, t as Link, E as EmptyState, v as formatDistanceToNow } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { L as ListRowSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { K as KpiCard, A as ArrowRight, E as ErrorState } from "./KpiCard-CYaWsqhQ.js";
import { S as StatusBadge, s as statusLabel } from "./StatusBadge-C3JOGEpV.js";
import { P as PriorityBadge } from "./PriorityBadge-B6E1CvT5.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-xP9BGQcP.js";
import { P as Plus } from "./plus-BTRHdzuK.js";
import { C as CircleCheck } from "./circle-check-_t8Qr5P9.js";
import { I as Inbox } from "./inbox-CGn7sgad.js";
import { L as LoaderCircle } from "./loader-circle-B34IBkrX.js";
import { p as parseISO } from "./parseISO-dp3PfPtl.js";
import { i as isValid } from "./isValid-8ZmR24ka.js";
import "./triangle-alert-DxxnH3Y-.js";
import "./refresh-cw-PhAmOQ-J.js";
function safeFromNow(iso) {
  if (iso == null) return "—";
  try {
    const ms = typeof iso === "bigint" ? Number(iso) / 1e6 : iso;
    const d = typeof ms === "string" ? parseISO(ms) : new Date(ms);
    if (!isValid(d)) return "—";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}
const OPEN_STATUSES = /* @__PURE__ */ new Set(["open", "in_progress", "pending"]);
const RESOLVED_STATUSES = /* @__PURE__ */ new Set(["resolved", "closed"]);
function EmployeeDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, isFetching } = useMyTickets();
  const { data: priorities } = usePriorities();
  const tickets = data ?? [];
  const priorityInfo = (id) => {
    const p = priorities == null ? void 0 : priorities.find((pr) => pr.id === id);
    return {
      name: (p == null ? void 0 : p.name) ?? `Priority ${id}`,
      level: p ? Number(p.level) : 0
    };
  };
  const openTickets = reactExports.useMemo(
    () => tickets.filter((t) => OPEN_STATUSES.has(t.status)),
    [tickets]
  );
  const resolvedTickets = reactExports.useMemo(
    () => tickets.filter((t) => RESOLVED_STATUSES.has(t.status)),
    [tickets]
  );
  const statusBreakdown = reactExports.useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const t of tickets) {
      counts.set(t.status, (counts.get(t.status) ?? 0) + 1);
    }
    return counts;
  }, [tickets]);
  const recent = reactExports.useMemo(
    () => [...tickets].sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt)).slice(0, 5),
    [tickets]
  );
  const total = tickets.length;
  const openCount = openTickets.length;
  const resolvedCount = resolvedTickets.length;
  const breakdownEntries = reactExports.useMemo(
    () => ["open", "in_progress", "pending", "resolved", "closed"].filter((s) => (statusBreakdown.get(s) ?? 0) > 0).map((s) => ({
      status: s,
      count: statusBreakdown.get(s) ?? 0,
      pct: total > 0 ? Math.round((statusBreakdown.get(s) ?? 0) / total * 100) : 0
    })),
    [statusBreakdown, total]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "My Support",
        description: "Track your support tickets and quickly raise new requests.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate({ to: "/employee/tickets/new" }),
            "data-ocid": "employee_dashboard.create_ticket_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "Create Ticket"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "My Open Tickets",
          value: openCount,
          icon: Clock,
          tone: "primary",
          hint: "Awaiting response or in progress",
          trend: openCount > 0 ? "up" : "neutral",
          trendLabel: openCount > 0 ? "active" : "none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Total Submitted",
          value: total,
          icon: Ticket,
          tone: "info",
          hint: "All tickets you have submitted"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Resolved",
          value: resolvedCount,
          icon: CircleCheck,
          tone: "success",
          hint: "Closed or resolved successfully",
          trend: resolvedCount > 0 ? "up" : "neutral",
          trendLabel: resolvedCount > 0 ? "done" : "none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recently Updated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "The five most recently updated tickets you submitted." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/employee/tickets",
              "data-ocid": "employee_dashboard.view_all_link",
              children: [
                "View all",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ListRowSkeleton, { rows: 5 }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ErrorState,
          {
            size: "sm",
            title: "Unable to load tickets",
            description: "There was a problem fetching your tickets.",
            onRetry: () => void refetch()
          }
        ) : recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            size: "sm",
            icon: Inbox,
            title: "No tickets yet",
            description: "When you submit a support ticket it will appear here.",
            action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => navigate({ to: "/employee/tickets/new" }),
                "data-ocid": "employee_dashboard.empty_create_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                  "Create your first ticket"
                ]
              }
            )
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: recent.map((t, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/employee/tickets/$id",
            params: { id: String(t.id) },
            "data-ocid": `employee_dashboard.recent_ticket.${idx}`,
            className: "flex flex-col gap-3 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-2 sm:py-3.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                    "#",
                    String(t.id).slice(-6)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: t.title })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Updated ",
                  safeFromNow(t.updatedAt)
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PriorityBadge,
                  {
                    priority: priorityInfo(BigInt(t.priorityId))
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: t.status })
              ] })
            ]
          }
        ) }, String(t.id))) }) }),
        recent.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-end border-t bg-muted/20 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employee/tickets", children: "Open ticket history" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Status Breakdown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "How your tickets are distributed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Loading breakdown…"
          ] }) : breakdownEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No tickets to break down yet." }) : breakdownEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `employee_dashboard.status_breakdown.${entry.status}`,
              className: "space-y-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatusBadge,
                    {
                      status: entry.status,
                      withDot: true
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                    entry.count,
                    " · ",
                    entry.pct,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-primary transition-smooth",
                    style: { width: `${entry.pct}%` }
                  }
                ) })
              ]
            },
            entry.status
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t pt-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              statusLabel("open"),
              " +",
              " ",
              statusLabel("in_progress"),
              " +",
              " ",
              statusLabel("pending"),
              " = open"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: openCount })
          ] })
        ] })
      ] })
    ] }),
    isFetching && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sr-only", "aria-live": "polite", children: "Refreshing your tickets…" })
  ] });
}
export {
  EmployeeDashboard,
  EmployeeDashboard as default
};
