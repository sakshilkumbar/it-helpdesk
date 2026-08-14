import { c as createLucideIcon, j as jsxRuntimeExports, g as cn, s as Clock, q as usePriorities, r as reactExports, B as Button, t as Link, T as Ticket, E as EmptyState, Q as useApi, v as formatDistanceToNow, R as useMyAssignedTickets, U as useAuth, W as ResolverTier } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { L as ListRowSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { K as KpiCard, A as ArrowRight, E as ErrorState } from "./KpiCard-CYaWsqhQ.js";
import { S as StatusBadge } from "./StatusBadge-C3JOGEpV.js";
import { P as PriorityBadge } from "./PriorityBadge-B6E1CvT5.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-xP9BGQcP.js";
import { I as Inbox } from "./inbox-CGn7sgad.js";
import { U as UserCheck } from "./user-check-P_tXa6w9.js";
import { T as TriangleAlert } from "./triangle-alert-DxxnH3Y-.js";
import { p as parseISO } from "./parseISO-dp3PfPtl.js";
import { i as isValid } from "./isValid-8ZmR24ka.js";
import { T as TrendingUp } from "./trending-up-B98oyL-8.js";
import "./refresh-cw-PhAmOQ-J.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
];
const Gauge = createLucideIcon("gauge", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
function resolveBucket(isBreached, isAtRisk) {
  if (isBreached) return "breached";
  if (isAtRisk) return "at_risk";
  return "on_track";
}
const BUCKET_CONFIG = {
  on_track: {
    dot: "bg-[oklch(var(--sla-on-track))]",
    text: "text-[oklch(var(--sla-on-track))]",
    ring: "sla-dot-on-track",
    label: "On track"
  },
  at_risk: {
    dot: "bg-[oklch(var(--sla-at-risk))]",
    text: "text-[oklch(var(--sla-at-risk))]",
    ring: "sla-dot-at-risk",
    label: "At risk"
  },
  breached: {
    dot: "bg-[oklch(var(--sla-breached))]",
    text: "text-[oklch(var(--sla-breached))]",
    ring: "sla-dot-breached",
    label: "Breached"
  }
};
function SlaIndicator({
  isBreached,
  isAtRisk,
  label,
  compact = false,
  className
}) {
  const bucket = resolveBucket(isBreached, isAtRisk);
  const cfg = BUCKET_CONFIG[bucket];
  if (compact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "inline-flex h-2.5 w-2.5 rounded-full",
          cfg.dot,
          cfg.ring,
          bucket === "at_risk" && "animate-sla-pulse",
          className
        ),
        role: "img",
        "aria-label": `SLA ${cfg.label}${label ? `: ${label}` : ""}`
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        cfg.text,
        className
      ),
      "data-ocid": "sla_indicator",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "inline-flex h-2 w-2 rounded-full",
              cfg.dot,
              cfg.ring,
              bucket === "at_risk" && "animate-sla-pulse"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label ?? cfg.label })
      ]
    }
  );
}
function safeFromNow$1(iso) {
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
function useRoleDashboard$1() {
  return useApi(
    ["dashboard", "my-role"],
    (a) => a.getMyRoleDashboard()
  );
}
function useQueueTickets() {
  return useApi(
    ["tickets", "my-queue"],
    (a) => a.getMyQueueTickets()
  );
}
function kpiValue$1(kpis, name) {
  if (!kpis) return 0;
  const found = kpis.find((k) => k.name.toLowerCase() === name.toLowerCase());
  return found ? Number(found.value) : 0;
}
const SLA_AT_RISK_WINDOW_NS$1 = 4 * 60 * 60 * 1e9;
function deriveSlaState$1(slaDeadline) {
  if (slaDeadline == null) return { isBreached: false, isAtRisk: false };
  const nowNs = BigInt(Date.now()) * 1000000n;
  const deadlineNs = BigInt(slaDeadline);
  const isBreached = deadlineNs < nowNs;
  const isAtRisk = !isBreached && deadlineNs < nowNs + BigInt(SLA_AT_RISK_WINDOW_NS$1);
  return { isBreached, isAtRisk };
}
function L1HelpDeskDashboard() {
  const {
    data: dashboard,
    isLoading: dashLoading,
    isError: dashError,
    refetch: refetchDash
  } = useRoleDashboard$1();
  const {
    data: queueTickets,
    isLoading: queueLoading,
    isError: queueError,
    refetch: refetchQueue
  } = useQueueTickets();
  const { data: priorities } = usePriorities();
  const priorityInfo = (id) => {
    const p = priorities == null ? void 0 : priorities.find((pr) => pr.id === id);
    return {
      name: (p == null ? void 0 : p.name) ?? `Priority ${id}`,
      level: p ? Number(p.level) : 0
    };
  };
  const kpis = (dashboard == null ? void 0 : dashboard.kpis) ?? [];
  const newUnassigned = kpiValue$1(kpis, "new_unassigned");
  const awaitingTriage = kpiValue$1(kpis, "awaiting_triage");
  const slaAtRisk = kpiValue$1(kpis, "sla_at_risk");
  const myAssigned = kpiValue$1(kpis, "my_assigned");
  const tickets = queueTickets ?? [];
  const recentIntake = reactExports.useMemo(
    () => [...tickets].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 6),
    [tickets]
  );
  const isLoading = dashLoading || queueLoading;
  const isError = dashError || queueError;
  const refetch = () => {
    void refetchDash();
    void refetchQueue();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "L1 Help Desk",
        description: "Triage incoming tickets, monitor SLA risk, and work your assigned queue.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/agent/tickets",
            "data-ocid": "l1_dashboard.open_queue_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "mr-2 h-4 w-4" }),
              "Open Full Queue"
            ]
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "New / Unassigned",
          value: newUnassigned,
          icon: Inbox,
          tone: "info",
          hint: "Tickets needing first response",
          trend: newUnassigned > 0 ? "up" : "neutral",
          trendLabel: newUnassigned > 0 ? "intake" : "clear"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Awaiting Triage",
          value: awaitingTriage,
          icon: UserCheck,
          tone: "accent",
          hint: "Not yet categorized or prioritized",
          trend: awaitingTriage > 0 ? "up" : "neutral",
          trendLabel: awaitingTriage > 0 ? "pending" : "clear"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "SLA At Risk",
          value: slaAtRisk,
          icon: ShieldAlert,
          tone: "warning",
          hint: "Approaching response deadline",
          trend: slaAtRisk > 0 ? "up" : "neutral",
          trendLabel: slaAtRisk > 0 ? "watch" : "clear"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "My Assigned",
          value: myAssigned,
          icon: Ticket,
          tone: "primary",
          hint: "Tickets currently assigned to you"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent Intake" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "The most recently created tickets entering the L1 queue." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/agent/tickets", "data-ocid": "l1_dashboard.view_all_link", children: [
          "View all",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ListRowSkeleton, { rows: 6 }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ErrorState,
        {
          size: "sm",
          title: "Unable to load the queue",
          description: "There was a problem fetching intake tickets.",
          onRetry: refetch
        }
      ) : recentIntake.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          size: "sm",
          icon: Inbox,
          title: "Queue is clear",
          description: "No tickets are currently waiting in the L1 intake queue."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: recentIntake.map((t, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/agent/tickets/$id",
          params: { id: String(t.id) },
          "data-ocid": `l1_dashboard.intake_ticket.${idx}`,
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
                "Created ",
                safeFromNow$1(t.createdAt)
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SlaIndicator,
                {
                  compact: true,
                  ...deriveSlaState$1(t.slaDeadline)
                }
              ),
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
      recentIntake.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-end border-t bg-muted/20 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/agent/tickets", children: "Open full queue" }) }) })
    ] }),
    slaAtRisk > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "output",
      {
        className: "flex items-start gap-3 rounded-lg border border-[oklch(var(--sla-at-risk)/0.3)] bg-[oklch(var(--sla-at-risk)/0.08)] p-4",
        "data-ocid": "l1_dashboard.sla_alert",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TriangleAlert,
            {
              className: "mt-0.5 h-5 w-5 shrink-0 text-[oklch(var(--sla-at-risk))]",
              "aria-hidden": true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
              slaAtRisk,
              " ticket",
              slaAtRisk === 1 ? "" : "s",
              " approaching SLA breach"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Review and respond to at-risk tickets before their response deadline passes." })
          ] })
        ]
      }
    )
  ] });
}
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
function useRoleDashboard() {
  return useApi(
    ["dashboard", "my-role"],
    (a) => a.getMyRoleDashboard()
  );
}
function kpiValue(kpis, name) {
  if (!kpis) return 0;
  const found = kpis.find((k) => k.name.toLowerCase() === name.toLowerCase());
  return found ? Number(found.value) : 0;
}
const SLA_AT_RISK_WINDOW_NS = 4 * 60 * 60 * 1e9;
function deriveSlaState(slaDeadline) {
  if (slaDeadline == null) return { isBreached: false, isAtRisk: false };
  const nowNs = BigInt(Date.now()) * 1000000n;
  const deadlineNs = BigInt(slaDeadline);
  const isBreached = deadlineNs < nowNs;
  const isAtRisk = !isBreached && deadlineNs < nowNs + BigInt(SLA_AT_RISK_WINDOW_NS);
  return { isBreached, isAtRisk };
}
function formatDurationNs(ns) {
  if (ns == null) return "—";
  const totalMin = Number(ns) / 6e10;
  if (!Number.isFinite(totalMin) || totalMin < 0) return "—";
  if (totalMin < 1) return "<1m";
  if (totalMin < 60) return `${Math.round(totalMin)}m`;
  const hours = totalMin / 60;
  if (hours < 24) {
    const h2 = Math.floor(hours);
    const m = Math.round((hours - h2) * 60);
    return m === 0 ? `${h2}h` : `${h2}h ${m}m`;
  }
  const days = hours / 24;
  const d = Math.floor(days);
  const h = Math.round((days - d) * 24);
  return h === 0 ? `${d}d` : `${d}d ${h}h`;
}
function L2ResolverDashboard() {
  var _a;
  const {
    data: dashboard,
    isLoading: dashLoading,
    isError: dashError,
    refetch: refetchDash
  } = useRoleDashboard();
  const {
    data: assigned,
    isLoading: assignedLoading,
    isError: assignedError,
    refetch: refetchAssigned
  } = useMyAssignedTickets();
  const { data: priorities } = usePriorities();
  const priorityInfo = (id) => {
    const p = priorities == null ? void 0 : priorities.find((pr) => pr.id === id);
    return {
      name: (p == null ? void 0 : p.name) ?? `Priority ${id}`,
      level: p ? Number(p.level) : 0
    };
  };
  const kpis = (dashboard == null ? void 0 : dashboard.kpis) ?? [];
  const escalatedToMe = kpiValue(kpis, "escalated_to_me");
  const awaitingResponse = kpiValue(kpis, "awaiting_my_response");
  const slaBreachRisk = kpiValue(kpis, "sla_breach_risk");
  const avgResolutionNs = (_a = kpis.find(
    (k) => k.name.toLowerCase().includes("resolution")
  )) == null ? void 0 : _a.value;
  const resolvedCount = kpiValue(kpis, "resolved");
  const tickets = assigned ?? [];
  const escalatedTickets = reactExports.useMemo(
    () => [...tickets].sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt)).slice(0, 6),
    [tickets]
  );
  const isLoading = dashLoading || assignedLoading;
  const isError = dashError || assignedError;
  const refetch = () => {
    void refetchDash();
    void refetchAssigned();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "L2 Resolver",
        description: "Work escalated tickets, respond to awaiting items, and track resolution performance.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/agent/tickets",
            "data-ocid": "l2_dashboard.open_assigned_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "mr-2 h-4 w-4" }),
              "My Assigned Tickets"
            ]
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Escalated To Me",
          value: escalatedToMe,
          icon: TrendingUp,
          tone: "danger",
          hint: "Tickets escalated to you for resolution",
          trend: escalatedToMe > 0 ? "up" : "neutral",
          trendLabel: escalatedToMe > 0 ? "active" : "clear"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Awaiting My Response",
          value: awaitingResponse,
          icon: MessageCircle,
          tone: "accent",
          hint: "Tickets waiting on your reply or action",
          trend: awaitingResponse > 0 ? "up" : "neutral",
          trendLabel: awaitingResponse > 0 ? "pending" : "clear"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "SLA Breach Risk",
          value: slaBreachRisk,
          icon: ShieldAlert,
          tone: "warning",
          hint: "Tickets at risk of missing resolution SLA",
          trend: slaBreachRisk > 0 ? "up" : "neutral",
          trendLabel: slaBreachRisk > 0 ? "watch" : "clear"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Avg Resolution Time",
          value: formatDurationNs(avgResolutionNs),
          icon: Gauge,
          tone: "primary",
          hint: `Resolved ${resolvedCount} ticket${resolvedCount === 1 ? "" : "s"}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Escalated Tickets Assigned To Me" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "The most recently updated tickets escalated to you for resolution." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/agent/tickets", "data-ocid": "l2_dashboard.view_all_link", children: [
          "View all",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ListRowSkeleton, { rows: 6 }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ErrorState,
        {
          size: "sm",
          title: "Unable to load tickets",
          description: "There was a problem fetching your escalated tickets.",
          onRetry: refetch
        }
      ) : escalatedTickets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          size: "sm",
          icon: Inbox,
          title: "No escalated tickets",
          description: "Tickets escalated to you will appear here for resolution."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: escalatedTickets.map((t, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/agent/tickets/$id",
          params: { id: String(t.id) },
          "data-ocid": `l2_dashboard.escalated_ticket.${idx}`,
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
                SlaIndicator,
                {
                  compact: true,
                  ...deriveSlaState(t.slaDeadline)
                }
              ),
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
      escalatedTickets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-end border-t bg-muted/20 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/agent/tickets", children: "Open my assigned tickets" }) }) })
    ] }),
    slaBreachRisk > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "output",
      {
        className: "flex items-start gap-3 rounded-lg border border-[oklch(var(--sla-at-risk)/0.3)] bg-[oklch(var(--sla-at-risk)/0.08)] p-4",
        "data-ocid": "l2_dashboard.sla_alert",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Clock,
            {
              className: "mt-0.5 h-5 w-5 shrink-0 text-[oklch(var(--sla-at-risk))]",
              "aria-hidden": true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
              slaBreachRisk,
              " ticket",
              slaBreachRisk === 1 ? "" : "s",
              " at risk of SLA breach"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Prioritize these tickets to meet resolution-time SLAs before the deadline passes." })
          ] })
        ]
      }
    )
  ] });
}
function AgentDashboard() {
  const { resolverTier, isLoadingUser } = useAuth();
  if (isLoadingUser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "output",
      {
        className: "flex items-center justify-center py-24",
        "data-ocid": "agent_dashboard.loading",
        "aria-live": "polite",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent",
              "aria-hidden": true
            }
          ),
          "Loading your workspace…"
        ] })
      }
    );
  }
  if (resolverTier === ResolverTier.l2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(L2ResolverDashboard, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(L1HelpDeskDashboard, {});
}
export {
  AgentDashboard,
  AgentDashboard as default
};
