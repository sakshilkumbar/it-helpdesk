import { ab as useTicketAnalytics, q as usePriorities, A as useCategories, ac as useSLAStatuses, ad as useAuditLogs, $ as useAgents, r as reactExports, j as jsxRuntimeExports, T as Ticket, B as Button, t as Link, ae as ScrollText, af as Users, ag as Settings, F as Badge, S as Separator } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { L as ListRowSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { K as KpiCard, E as ErrorState, A as ArrowRight } from "./KpiCard-CYaWsqhQ.js";
import "./StatusBadge-C3JOGEpV.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-xP9BGQcP.js";
import { I as Inbox } from "./inbox-CGn7sgad.js";
import { C as CircleCheck } from "./circle-check-_t8Qr5P9.js";
import { T as TriangleAlert } from "./triangle-alert-DxxnH3Y-.js";
import { R as ResponsiveContainer, P as PieChart, a as Pie, C as Cell, T as Tooltip, L as Legend, B as BarChart, b as CartesianGrid, X as XAxis, Y as YAxis, c as Bar } from "./PieChart-BkIerehd.js";
import { S as ShieldCheck } from "./shield-check-Bi7EWVO3.js";
import { S as Sparkles } from "./sparkles-DBjc9UT4.js";
import "./refresh-cw-PhAmOQ-J.js";
const STATUS_COLORS = {
  open: "oklch(0.55 0.12 230)",
  in_progress: "oklch(0.72 0.15 65)",
  pending: "oklch(0.6 0.1 280)",
  resolved: "oklch(0.55 0.14 155)",
  closed: "oklch(0.5 0.012 230)"
};
const CATEGORY_PALETTE = [
  "oklch(0.42 0.09 200)",
  "oklch(0.72 0.15 65)",
  "oklch(0.55 0.14 155)",
  "oklch(0.6 0.1 280)",
  "oklch(0.55 0.12 230)",
  "oklch(0.7 0.13 75)",
  "oklch(0.5 0.012 230)",
  "oklch(0.62 0.2 22)"
];
const AI_FEATURES = [
  {
    id: "auto-classification",
    title: "Automatic Ticket Classification",
    description: "Categorize incoming tickets automatically based on content."
  },
  {
    id: "priority-prediction",
    title: "Priority Prediction",
    description: "Predict ticket priority from initial message context."
  },
  {
    id: "duplicate-detection",
    title: "Duplicate-Ticket Detection",
    description: "Flag potential duplicates before assignment."
  },
  {
    id: "suggested-solutions",
    title: "Suggested Solutions",
    description: "Surface relevant knowledge-base solutions for agents."
  },
  {
    id: "ai-chatbot",
    title: "AI Knowledge-Base Chatbot",
    description: "Self-service assistant for common support questions."
  }
];
const QUICK_LINKS = [
  {
    title: "User Management",
    description: "Manage roles, approvals, and access.",
    icon: Users,
    href: "/admin/users"
  },
  {
    title: "Audit Logs",
    description: "Review system activity and changes.",
    icon: ScrollText,
    href: "/admin/audit-logs"
  },
  {
    title: "SLA Monitoring",
    description: "Track response and resolution SLAs.",
    icon: ShieldCheck,
    href: "/admin/sla"
  },
  {
    title: "Settings",
    description: "Configure workspace preferences.",
    icon: Settings,
    href: "/admin/settings"
  }
];
function AdminDashboard() {
  const { data: analytics, isLoading, isError, refetch } = useTicketAnalytics();
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();
  const { data: slaStatuses } = useSLAStatuses();
  const { data: auditLogs } = useAuditLogs();
  const { data: agents } = useAgents();
  const priorityColor = (id) => {
    const p = priorities == null ? void 0 : priorities.find((pr) => pr.id === id);
    if (!p) return "oklch(0.7 0.008 230)";
    const name = p.name.toLowerCase();
    if (name.includes("critical") || name.includes("urgent"))
      return "oklch(0.55 0.22 25)";
    if (name.includes("high")) return "oklch(0.72 0.15 65)";
    if (name.includes("medium")) return "oklch(0.42 0.09 200)";
    if (name.includes("low")) return "oklch(0.55 0.14 155)";
    return "oklch(0.7 0.008 230)";
  };
  const statusData = reactExports.useMemo(() => {
    if (!(analytics == null ? void 0 : analytics.byStatus)) return [];
    return analytics.byStatus.map(([name, value]) => ({
      name,
      value: Number(value)
    }));
  }, [analytics]);
  const priorityData = reactExports.useMemo(() => {
    if (!(analytics == null ? void 0 : analytics.byPriority)) return [];
    return analytics.byPriority.map(([id, value]) => {
      var _a;
      return {
        id,
        name: ((_a = priorities == null ? void 0 : priorities.find((pr) => pr.id === id)) == null ? void 0 : _a.name) ?? `Priority ${id}`,
        value: Number(value)
      };
    });
  }, [analytics, priorities]);
  const categoryData = reactExports.useMemo(() => {
    if (!(analytics == null ? void 0 : analytics.byCategory)) return [];
    return analytics.byCategory.map(([id, value], idx) => {
      var _a;
      return {
        id,
        name: ((_a = categories == null ? void 0 : categories.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? `Category ${id}`,
        value: Number(value),
        fill: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length]
      };
    });
  }, [analytics, categories]);
  const openTickets = reactExports.useMemo(() => {
    if (!(analytics == null ? void 0 : analytics.byStatus)) return 0;
    const count = (status) => {
      var _a;
      return Number(((_a = analytics.byStatus.find(([s]) => s === status)) == null ? void 0 : _a[1]) ?? 0n);
    };
    return count("open") + count("in_progress");
  }, [analytics]);
  const resolvedTickets = reactExports.useMemo(() => {
    if (!(analytics == null ? void 0 : analytics.byStatus)) return 0;
    const count = (status) => {
      var _a;
      return Number(((_a = analytics.byStatus.find(([s]) => s === status)) == null ? void 0 : _a[1]) ?? 0n);
    };
    return count("resolved") + count("closed");
  }, [analytics]);
  const totalTickets = analytics ? Number(analytics.totalTickets) : 0;
  const breachedSla = reactExports.useMemo(
    () => (slaStatuses == null ? void 0 : slaStatuses.filter((s) => s.isBreached).length) ?? 0,
    [slaStatuses]
  );
  const atRiskSla = reactExports.useMemo(
    () => (slaStatuses == null ? void 0 : slaStatuses.filter((s) => s.isAtRisk).length) ?? 0,
    [slaStatuses]
  );
  const recentAuditLogs = reactExports.useMemo(() => {
    if (!auditLogs) return [];
    return auditLogs.slice(0, 5);
  }, [auditLogs]);
  const agentWorkload = reactExports.useMemo(() => {
    if (!agents) return [];
    return [...agents].sort(
      (a, b) => Number(b.assignedTicketCount) - Number(a.assignedTicketCount)
    ).slice(0, 8);
  }, [agents]);
  const maxAssigned = reactExports.useMemo(
    () => agentWorkload.reduce(
      (m, a) => Math.max(m, Number(a.assignedTicketCount)),
      0
    ),
    [agentWorkload]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Admin Dashboard",
        description: "Operational overview of tickets, SLAs, agent workload, and system activity."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Total Tickets",
          value: isLoading ? "—" : totalTickets.toLocaleString(),
          icon: Ticket,
          tone: "primary",
          hint: "All-time tickets"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Open Tickets",
          value: isLoading ? "—" : openTickets.toLocaleString(),
          icon: Inbox,
          tone: "info",
          hint: "Open + in progress",
          trend: openTickets > 0 ? "up" : "neutral",
          trendLabel: openTickets > 0 ? "active" : "clear"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Resolved Tickets",
          value: isLoading ? "—" : resolvedTickets.toLocaleString(),
          icon: CircleCheck,
          tone: "success",
          hint: "Resolved + closed",
          trend: resolvedTickets > 0 ? "up" : "neutral",
          trendLabel: resolvedTickets > 0 ? "done" : "none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          label: "Breached SLA",
          value: breachedSla,
          icon: TriangleAlert,
          tone: "danger",
          hint: `${atRiskSla} at risk`,
          trend: breachedSla > 0 ? "up" : "neutral",
          trendLabel: breachedSla > 0 ? "breaches" : "clear"
        }
      )
    ] }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorState,
      {
        size: "sm",
        title: "Unable to load analytics",
        description: "There was a problem fetching ticket analytics.",
        onRetry: () => void refetch()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Tickets by Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Distribution across current ticket states" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[260px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pie,
            {
              data: statusData,
              dataKey: "value",
              nameKey: "name",
              cx: "50%",
              cy: "50%",
              innerRadius: 55,
              outerRadius: 85,
              paddingAngle: 2,
              children: statusData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cell,
                {
                  fill: STATUS_COLORS[String(entry.name)] ?? "oklch(0.7 0.008 230)"
                },
                String(entry.name)
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              contentStyle: {
                borderRadius: "8px",
                border: "1px solid oklch(var(--border))",
                background: "oklch(var(--popover))",
                color: "oklch(var(--popover-foreground))"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Legend,
            {
              verticalAlign: "bottom",
              iconType: "circle",
              wrapperStyle: { fontSize: "12px" }
            }
          )
        ] }) }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Tickets by Priority" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Volume grouped by priority level" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[260px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: priorityData,
            margin: { top: 10, right: 10, left: -10, bottom: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CartesianGrid,
                {
                  strokeDasharray: "3 3",
                  vertical: false,
                  stroke: "oklch(var(--border))"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "name",
                  tickLine: false,
                  axisLine: false,
                  tick: {
                    fontSize: 12,
                    fill: "oklch(var(--muted-foreground))"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  tickLine: false,
                  axisLine: false,
                  tick: {
                    fontSize: 12,
                    fill: "oklch(var(--muted-foreground))"
                  },
                  allowDecimals: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  cursor: { fill: "oklch(var(--muted))", opacity: 0.4 },
                  contentStyle: {
                    borderRadius: "8px",
                    border: "1px solid oklch(var(--border))",
                    background: "oklch(var(--popover))",
                    color: "oklch(var(--popover-foreground))"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", radius: [6, 6, 0, 0], children: priorityData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cell,
                {
                  fill: priorityColor(entry.id)
                },
                String(entry.id)
              )) })
            ]
          }
        ) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Tickets by Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Volume grouped by ticket category" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: categoryData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[200px] items-center justify-center text-sm text-muted-foreground", children: "No category data available" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[220px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: categoryData,
            layout: "vertical",
            margin: { top: 5, right: 20, left: 0, bottom: 5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CartesianGrid,
                {
                  strokeDasharray: "3 3",
                  horizontal: false,
                  stroke: "oklch(var(--border))"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  type: "number",
                  tickLine: false,
                  axisLine: false,
                  tick: {
                    fontSize: 12,
                    fill: "oklch(var(--muted-foreground))"
                  },
                  allowDecimals: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  type: "category",
                  dataKey: "name",
                  tickLine: false,
                  axisLine: false,
                  width: 120,
                  tick: {
                    fontSize: 12,
                    fill: "oklch(var(--muted-foreground))"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  cursor: { fill: "oklch(var(--muted))", opacity: 0.4 },
                  contentStyle: {
                    borderRadius: "8px",
                    border: "1px solid oklch(var(--border))",
                    background: "oklch(var(--popover))",
                    color: "oklch(var(--popover-foreground))"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", radius: [0, 6, 6, 0], children: categoryData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.fill }, String(entry.id))) })
            ]
          }
        ) }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Agent Workload" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Assigned tickets per agent" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/admin/agents",
              "data-ocid": "admin_dashboard.view_agents_link",
              children: [
                "View agents",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-3.5 w-3.5", "aria-hidden": true })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !agents ? /* @__PURE__ */ jsxRuntimeExports.jsx(ListRowSkeleton, { rows: 5 }) : agentWorkload.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[200px] items-center justify-center text-sm text-muted-foreground", children: "No agents to display" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: agentWorkload.map((agent, idx) => {
          const assigned = Number(agent.assignedTicketCount);
          const resolved = Number(agent.resolvedTicketCount);
          const pct = maxAssigned > 0 ? assigned / maxAssigned * 100 : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              "data-ocid": `admin_dashboard.agent_workload.${idx}`,
              className: "space-y-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: agent.displayName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                    assigned,
                    " assigned · ",
                    resolved,
                    " resolved"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-primary transition-smooth",
                    style: { width: `${pct}%` }
                  }
                ) })
              ]
            },
            String(agent.agentId)
          );
        }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Recent Audit Log Activity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Last 5 recorded system events" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-1", children: !auditLogs ? /* @__PURE__ */ jsxRuntimeExports.jsx(ListRowSkeleton, { rows: 5 }) : recentAuditLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-32 items-center justify-center text-sm text-muted-foreground", children: "No recent activity" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: recentAuditLogs.map((log, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-start gap-3 py-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ScrollText,
                {
                  className: "h-3.5 w-3.5 text-muted-foreground",
                  "aria-hidden": true
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium leading-tight", children: log.action }),
                log.detail ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: log.detail }) : null
              ] })
            ]
          },
          `${log.timestamp}-${idx}`
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/admin/audit-logs",
            "data-ocid": "admin_dashboard.view_logs_link",
            children: [
              "View all logs",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-3.5 w-3.5", "aria-hidden": true })
            ]
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Quick Links" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Jump to management areas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "grid gap-2", children: QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: link.href,
              "data-ocid": `admin_dashboard.quick_link.${link.title.toLowerCase().replace(/\s+/g, "_")}`,
              className: "group flex items-center gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:bg-muted/50",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-md bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-foreground", "aria-hidden": true }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium leading-tight", children: link.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: link.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ArrowRight,
                  {
                    className: "h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5",
                    "aria-hidden": true
                  }
                )
              ]
            },
            link.title
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle border-dashed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-md bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Sparkles,
            {
              className: "h-4 w-4 text-muted-foreground",
              "aria-hidden": true
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "AI Features" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Planned intelligent capabilities" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3", "aria-hidden": true }),
          "Coming soon"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "fieldset",
        {
          className: "rounded-md border border-dashed bg-muted/30 p-3",
          "aria-label": "AI features coming soon",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-sm text-muted-foreground", children: "The following AI capabilities are planned for a future release. Toggles are disabled until each capability is enabled." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: AI_FEATURES.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-start justify-between gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: feature.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: feature.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "inline-flex h-5 w-9 shrink-0 cursor-not-allowed items-center rounded-full bg-muted px-0.5",
                      "aria-disabled": "true",
                      "aria-label": `${feature.title} toggle disabled`,
                      role: "switch",
                      "aria-checked": "false",
                      tabIndex: -1,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 translate-x-0 rounded-full bg-background shadow-sm" })
                    }
                  )
                ]
              },
              feature.id
            )) })
          ]
        }
      ) })
    ] })
  ] });
}
export {
  AdminDashboard as default
};
