import { c as createLucideIcon, $ as useAgents, aa as useAllTickets, _ as useReassignTicket, r as reactExports, j as jsxRuntimeExports, B as Button, F as Badge, D as Dialog, k as DialogContent, l as DialogHeader, m as DialogTitle, n as DialogDescription, ay as DialogFooter, a0 as Principal } from "./index-y0UiSxHL.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-xP9BGQcP.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DZqbOTYv.js";
import { I as Inbox } from "./inbox-CGn7sgad.js";
import { C as CircleCheck } from "./circle-check-_t8Qr5P9.js";
import { T as TrendingUp } from "./trending-up-B98oyL-8.js";
import { R as RefreshCw } from "./refresh-cw-PhAmOQ-J.js";
import "./index-BDSHvDZP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z",
      key: "12oyoe"
    }
  ],
  ["path", { d: "M21 16v2a4 4 0 0 1-4 4h-5", key: "1x7m43" }]
];
const Headset = createLucideIcon("headset", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19", key: "1x9vlm" }],
  ["circle", { cx: "6.5", cy: "6.5", r: "2.5", key: "4mh3h7" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "2.5", key: "1mdrzq" }]
];
const Percent = createLucideIcon("percent", __iconNode);
function rateClass(rate) {
  if (rate >= 80)
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
  if (rate >= 50)
    return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
  return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
}
function rateLabel(rate) {
  if (rate >= 80) return "High";
  if (rate >= 50) return "Moderate";
  return "Low";
}
function AdminAgentsPage() {
  const { data: agents, isLoading, isError, error } = useAgents();
  const { data: allTickets } = useAllTickets();
  const reassign = useReassignTicket();
  const [reassignOpen, setReassignOpen] = reactExports.useState(false);
  const [selectedTicketId, setSelectedTicketId] = reactExports.useState("");
  const [selectedAgentId, setSelectedAgentId] = reactExports.useState("");
  const stats = reactExports.useMemo(() => {
    if (!agents) return { total: 0, assigned: 0, resolved: 0, avgRate: 0 };
    const total = agents.length;
    const assigned = agents.reduce(
      (s, a) => s + Number(a.assignedTicketCount ?? 0),
      0
    );
    const resolved = agents.reduce(
      (s, a) => s + Number(a.resolvedTicketCount ?? 0),
      0
    );
    const rates = agents.map(
      (a) => typeof a.resolutionRate === "number" ? a.resolutionRate : null
    ).filter((r) => r != null);
    const avgRate = rates.length ? rates.reduce((s, r) => s + r, 0) / rates.length : 0;
    return { total, assigned, resolved, avgRate };
  }, [agents]);
  const assignableTickets = reactExports.useMemo(() => {
    if (!allTickets) return [];
    return allTickets.filter((t) => t.status === "open" || t.status === "in_progress").map((t) => ({
      id: String(t.id),
      title: t.title || String(t.id)
    }));
  }, [allTickets]);
  function openReassign(ticketId) {
    setSelectedTicketId("");
    setSelectedAgentId("");
    setReassignOpen(true);
  }
  async function submitReassign() {
    if (!selectedTicketId || !selectedAgentId) return;
    try {
      await reassign.mutateAsync({
        ticketId: BigInt(selectedTicketId),
        newAgent: Principal.fromText(selectedAgentId)
      });
      setReassignOpen(false);
      setSelectedTicketId("");
      setSelectedAgentId("");
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Support Agents" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Monitor agent workload and reassign tickets to balance capacity." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Agents" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Headset, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.total }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Open Tickets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.assigned }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Resolved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.resolved }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Avg. Resolution" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-semibold", children: [
          stats.avgRate.toFixed(1),
          "%"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Agent Roster" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => openReassign(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
          " Reassign ticket"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Agent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Assigned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Resolved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Resolution Rate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[120px] text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 5,
            className: "h-24 text-center text-muted-foreground",
            children: "Loading agents…"
          }
        ) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableCell,
          {
            colSpan: 5,
            className: "h-24 text-center text-rose-600",
            children: [
              "Failed to load agents:",
              " ",
              (error == null ? void 0 : error.message) ?? "Unknown error"
            ]
          }
        ) }) : !agents || agents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 5,
            className: "h-24 text-center text-muted-foreground",
            children: "No support agents found."
          }
        ) }) : agents.map((a) => {
          const assigned = Number(a.assignedTicketCount ?? 0);
          const resolved = Number(a.resolvedTicketCount ?? 0);
          const rate = typeof a.resolutionRate === "number" ? a.resolutionRate : assigned + resolved > 0 ? Math.round(resolved / (assigned + resolved) * 100) : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium", children: (a.displayName || "?").charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: a.displayName || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: String(a.agentId.toText()) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: assigned }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: resolved }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: rateClass(rate),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "mr-1 h-3 w-3" }),
                  rate.toFixed(0),
                  "% · ",
                  rateLabel(rate)
                ]
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => openReassign(),
                disabled: assignableTickets.length === 0,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-1.5 h-3.5 w-3.5" }),
                  " ",
                  "Reassign"
                ]
              }
            ) })
          ] }, String(a.agentId.toText()));
        }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: reassignOpen, onOpenChange: setReassignOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reassign ticket" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Select a ticket and the agent who should take ownership. The previous assignee will be notified." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ticket-select", className: "text-sm font-medium", children: "Ticket" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: selectedTicketId,
              onValueChange: setSelectedTicketId,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "ticket-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a ticket" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: assignableTickets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "_none", disabled: true, children: "No assignable tickets available" }) : assignableTickets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.title }, t.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "agent-select", className: "text-sm font-medium", children: "New assignee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: selectedAgentId,
              onValueChange: setSelectedAgentId,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "agent-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select an agent" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (agents ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  SelectItem,
                  {
                    value: String(a.agentId.toText()),
                    children: [
                      a.displayName,
                      " (",
                      Number(a.assignedTicketCount ?? 0),
                      " ",
                      "open)"
                    ]
                  },
                  String(a.agentId.toText())
                )) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setReassignOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: submitReassign,
            disabled: reassign.isPending || !selectedTicketId || !selectedAgentId,
            children: reassign.isPending ? "Reassigning…" : "Reassign ticket"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AdminAgentsPage as default
};
