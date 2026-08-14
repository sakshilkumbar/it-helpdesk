import { I as useParams, o as useNavigate, r as reactExports, J as useTicket, K as useTicketMessages, q as usePriorities, A as useCategories, M as usePostTicketMessage, Y as useUpdateTicket, Z as useCloseTicket, _ as useReassignTicket, $ as useAgents, j as jsxRuntimeExports, B as Button, E as EmptyState, t as Link, N as Avatar, O as AvatarFallback, F as Badge, a0 as Principal, v as formatDistanceToNow } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { T as TableSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cpx_DA6H.js";
import { S as StatusBadge } from "./StatusBadge-C3JOGEpV.js";
import { P as PriorityBadge } from "./PriorityBadge-B6E1CvT5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle, c as CardDescription, e as CardFooter } from "./card-xP9BGQcP.js";
import { T as Textarea } from "./textarea-34Xy4SLJ.js";
import { u as ue } from "./index-CICSQFzn.js";
import { A as ArrowLeft, M as MessageSquare, S as Send } from "./send-BVLVZbT6.js";
import { T as TriangleAlert } from "./triangle-alert-DxxnH3Y-.js";
import { L as LoaderCircle } from "./loader-circle-B34IBkrX.js";
import { p as parseISO } from "./parseISO-dp3PfPtl.js";
import { i as isValid } from "./isValid-8ZmR24ka.js";
import { f as format } from "./format-BoCtbVp_.js";
import "./index-BDSHvDZP.js";
function safeFormat(iso, fmt) {
  if (iso == null) return "—";
  try {
    const ms = typeof iso === "bigint" ? Number(iso) / 1e6 : iso;
    const d = typeof ms === "string" ? parseISO(ms) : new Date(ms);
    if (!isValid(d)) return "—";
    return format(d, fmt);
  } catch {
    return "—";
  }
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
function AgentTicketDetail() {
  var _a;
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const [message, setMessage] = reactExports.useState("");
  const [isInternal, setIsInternal] = reactExports.useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = reactExports.useState(false);
  const { data: ticket, isLoading, isError } = useTicket(id);
  const { data: messagesData, isLoading: msgsLoading } = useTicketMessages(id);
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();
  const postMessage = usePostTicketMessage();
  const updateTicket = useUpdateTicket();
  const closeTicket = useCloseTicket();
  const reassignTicket = useReassignTicket();
  const { data: agents } = useAgents();
  const priorityName = (id2) => {
    var _a2;
    return ((_a2 = priorities == null ? void 0 : priorities.find((p) => p.id === id2)) == null ? void 0 : _a2.name) ?? String(id2);
  };
  const priorityLevel = (id2) => {
    var _a2;
    return Number(((_a2 = priorities == null ? void 0 : priorities.find((p) => p.id === id2)) == null ? void 0 : _a2.level) ?? 0n);
  };
  const categoryName = (id2) => {
    var _a2;
    return ((_a2 = categories == null ? void 0 : categories.find((c) => c.id === id2)) == null ? void 0 : _a2.name) ?? String(id2);
  };
  const assignedAgent = (agent) => agent == null ? void 0 : agents == null ? void 0 : agents.find((a) => a.agentId.toText() === agent.toText());
  const messages = messagesData ?? [];
  const sortedMessages = [...messages].sort((a, b) => {
    const ad = Number(a.createdAt);
    const bd = Number(b.createdAt);
    return ad - bd;
  });
  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    try {
      await postMessage.mutateAsync({
        ticketId: BigInt(id),
        body: trimmed,
        isInternal
      });
      setMessage("");
      ue.success("Message sent");
    } catch (err) {
      ue.error("Failed to send message", {
        description: (err == null ? void 0 : err.message) ?? "Please try again."
      });
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => navigate({ to: "/agent/dashboard" }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to dashboard"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 8 })
    ] });
  }
  if (isError || !ticket) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => navigate({ to: "/agent/dashboard" }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to dashboard"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: TriangleAlert,
          title: "Ticket not found",
          description: "This ticket may have been removed or you do not have access to it.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/agent/dashboard", children: "Go to dashboard" }) })
        }
      ) }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => navigate({ to: "/agent/dashboard" }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Back to dashboard"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: ticket.title,
        description: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex flex-wrap items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
            "#",
            String(ticket.id).slice(-6)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: ticket.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PriorityBadge,
            {
              priority: {
                name: priorityName(BigInt(ticket.priorityId)),
                level: priorityLevel(BigInt(ticket.priorityId))
              }
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
              "Originally submitted ",
              safeFromNow(ticket.createdAt),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm leading-relaxed", children: ticket.description }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4" }),
              "Conversation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Messages between you and the ticket creator." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: msgsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 4 }) : sortedMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: MessageSquare,
              title: "No messages yet",
              description: "Start the conversation by posting a message below."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-4", children: sortedMessages.map((m) => {
            const isAgent = m.authorRole === "l1_help_desk" || m.authorRole === "l2_resolver" || m.authorRole === "admin";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: `flex gap-3 ${isAgent ? "flex-row-reverse text-right" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: isAgent ? "AG" : "U" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[80%] space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `flex items-center gap-2 text-xs ${isAgent ? "justify-end" : ""}`,
                        children: [
                          m.isInternal && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: "secondary",
                              className: "text-[10px]",
                              children: "Internal"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: safeFormat(m.createdAt, "MMM d, h:mm a") })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `inline-block rounded-lg px-3 py-2 text-sm ${isAgent ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-left", children: m.body })
                      }
                    )
                  ] })
                ]
              },
              String(m.id)
            );
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "border-t bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Type a message to the ticket creator…",
                value: message,
                onChange: (e) => setMessage(e.target.value),
                className: "min-h-[60px] resize-y",
                "aria-label": "New message"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isInternal,
                    onChange: (e) => setIsInternal(e.target.checked),
                    className: "h-4 w-4"
                  }
                ),
                "Internal note"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: handleSend,
                  disabled: !message.trim() || postMessage.isPending,
                  className: "shrink-0",
                  children: [
                    postMessage.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-2 h-4 w-4" }),
                    "Send"
                  ]
                }
              )
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Ticket information" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: ticket.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                PriorityBadge,
                {
                  priority: {
                    name: priorityName(BigInt(ticket.priorityId)),
                    level: priorityLevel(BigInt(ticket.priorityId))
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: categoryName(BigInt(ticket.categoryId)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Assigned Agent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: ((_a = assignedAgent(ticket.assignedAgent)) == null ? void 0 : _a.displayName) ?? "Unassigned" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: safeFormat(ticket.createdAt, "MMM d, yyyy · h:mm a") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Last updated" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: safeFormat(ticket.updatedAt, "MMM d, yyyy · h:mm a") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Ticket Actions" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ticket-status", className: "text-sm font-medium", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: ticket.status,
                  onValueChange: (v) => updateTicket.mutate({
                    ticketId: BigInt(id),
                    status: v
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "ticket-status", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "open", children: "Open" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "in_progress", children: "In Progress" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "resolved", children: "Resolved" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "closed", children: "Closed" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "ticket-agent", className: "text-sm font-medium", children: "Assign Agent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  onValueChange: (v) => reassignTicket.mutate({
                    ticketId: BigInt(id),
                    newAgent: Principal.fromText(v)
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "ticket-agent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select agent" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: agents == null ? void 0 : agents.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectItem,
                      {
                        value: a.agentId.toText(),
                        children: a.displayName
                      },
                      a.agentId.toText()
                    )) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: () => setCloseDialogOpen(true),
                children: "Close Ticket"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ConfirmDialog,
              {
                open: closeDialogOpen,
                onOpenChange: setCloseDialogOpen,
                onConfirm: () => closeTicket.mutate({
                  ticketId: BigInt(id),
                  resolutionSummary: "Ticket closed by agent"
                }),
                isLoading: closeTicket.isPending,
                trigger: null,
                title: "Close ticket",
                description: "Are you sure you want to close this ticket?",
                confirmLabel: "Close ticket",
                destructive: true
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  AgentTicketDetail,
  AgentTicketDetail as default
};
