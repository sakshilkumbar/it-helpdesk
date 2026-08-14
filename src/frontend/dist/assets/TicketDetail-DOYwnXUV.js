import { c as createLucideIcon, I as useParams, o as useNavigate, r as reactExports, J as useTicket, K as useTicketMessages, M as usePostTicketMessage, q as usePriorities, A as useCategories, j as jsxRuntimeExports, B as Button, E as EmptyState, t as Link, N as Avatar, O as AvatarFallback, F as Badge, s as Clock, S as Separator, v as formatDistanceToNow } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { T as TableSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { S as StatusBadge } from "./StatusBadge-C3JOGEpV.js";
import { P as PriorityBadge } from "./PriorityBadge-B6E1CvT5.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle, c as CardDescription, e as CardFooter } from "./card-xP9BGQcP.js";
import { T as Textarea } from "./textarea-34Xy4SLJ.js";
import { u as ue } from "./index-CICSQFzn.js";
import { A as ArrowLeft, M as MessageSquare, S as Send } from "./send-BVLVZbT6.js";
import { T as TriangleAlert } from "./triangle-alert-DxxnH3Y-.js";
import { F as FileText } from "./file-text-XGrUmBPS.js";
import { D as Download } from "./download-BS0EgW-Z.js";
import { L as LoaderCircle } from "./loader-circle-B34IBkrX.js";
import { C as CircleCheck } from "./circle-check-_t8Qr5P9.js";
import { S as Sparkles } from "./sparkles-DBjc9UT4.js";
import { i as isValid } from "./isValid-8ZmR24ka.js";
import { f as format } from "./format-BoCtbVp_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M13.234 20.252 21 12.3", key: "1cbrk9" }],
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
      key: "1pkts6"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode);
function toDate(ts) {
  if (ts == null) return null;
  try {
    const d = new Date(Number(ts) / 1e6);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}
function safeFormat(ts, fmt) {
  const d = toDate(ts);
  if (!d) return "—";
  try {
    return format(d, fmt);
  } catch {
    return "—";
  }
}
function safeFromNow(ts) {
  const d = toDate(ts);
  if (!d) return "—";
  try {
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}
function initials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => {
    var _a;
    return ((_a = p[0]) == null ? void 0 : _a.toUpperCase()) ?? "";
  }).join("") || "?";
}
function isOverdue(slaDeadline, status) {
  if (!slaDeadline) return false;
  const s = (status ?? "").toLowerCase();
  if (s === "resolved" || s === "closed" || s === "completed") return false;
  const d = toDate(slaDeadline);
  return d ? d.getTime() < Date.now() : false;
}
function TicketDetail() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const [message, setMessage] = reactExports.useState("");
  const threadEndRef = reactExports.useRef(null);
  const { data: ticket, isLoading, isError } = useTicket(id);
  const { data: messagesData, isLoading: msgsLoading } = useTicketMessages(id);
  const postMessage = usePostTicketMessage();
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();
  const priorityName = (id2) => {
    var _a;
    return ((_a = priorities == null ? void 0 : priorities.find((p) => p.id === id2)) == null ? void 0 : _a.name) ?? String(id2);
  };
  const priorityLevel = (id2) => {
    const p = priorities == null ? void 0 : priorities.find((pr) => pr.id === id2);
    return p ? Number(p.level) : 0;
  };
  const categoryName = (id2) => {
    var _a;
    return ((_a = categories == null ? void 0 : categories.find((c) => c.id === id2)) == null ? void 0 : _a.name) ?? String(id2);
  };
  const messages = messagesData ?? [];
  const sortedMessages = [...messages].sort((a, b) => {
    const ad = (toDate(a.createdAt ?? a.timestamp) ?? /* @__PURE__ */ new Date(0)).getTime();
    const bd = (toDate(b.createdAt ?? b.timestamp) ?? /* @__PURE__ */ new Date(0)).getTime();
    return ad - bd;
  });
  reactExports.useEffect(() => {
    var _a;
    (_a = threadEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);
  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    try {
      await postMessage.mutateAsync({
        ticketId: BigInt(id),
        body: trimmed,
        isInternal: false
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
          onClick: () => navigate({ to: "/employee/tickets" }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to tickets"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {})
    ] });
  }
  if (isError || !ticket) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => navigate({ to: "/employee/tickets" }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to tickets"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: TriangleAlert,
          title: "Ticket not found",
          description: "This ticket may have been removed or you do not have access to it.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employee/tickets", children: "Go to ticket history" }) })
        }
      ) }) })
    ] });
  }
  const attachments = ticket.attachments ?? [];
  const assignedAgent = ticket.assignedAgent;
  const overdue = isOverdue(
    ticket.slaDeadline != null ? String(ticket.slaDeadline) : void 0,
    ticket.status
  );
  const infoRows = [
    { label: "Category", value: categoryName(BigInt(ticket.categoryId ?? 0n)) },
    { label: "Status", value: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: ticket.status }) },
    {
      label: "Priority",
      value: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PriorityBadge,
        {
          priority: {
            name: priorityName(BigInt(ticket.priorityId ?? 0n)),
            level: priorityLevel(BigInt(ticket.priorityId ?? 0n))
          }
        }
      )
    },
    {
      label: "Assigned agent",
      value: assignedAgent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-6 w-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: initials(assignedAgent.toText()) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: String(assignedAgent.toText()) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Unassigned" })
    },
    {
      label: "Created",
      value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: safeFormat(ticket.createdAt, "MMM d, yyyy · h:mm a") })
    },
    {
      label: "Last updated",
      value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: safeFormat(ticket.updatedAt, "MMM d, yyyy · h:mm a") })
    },
    {
      label: "Closed",
      value: ticket.closedAt ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: safeFormat(ticket.closedAt, "MMM d, yyyy · h:mm a") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "—" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => navigate({ to: "/employee/tickets" }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Back to tickets"
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
            String(ticket.id ?? id).slice(-6)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: ticket.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PriorityBadge,
            {
              priority: {
                name: priorityName(BigInt(ticket.priorityId ?? 0n)),
                level: priorityLevel(BigInt(ticket.priorityId ?? 0n))
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
        attachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4" }),
              "Attachments"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
              attachments.length,
              " file",
              attachments.length === 1 ? "" : "s",
              " ",
              "attached to this ticket."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: attachments.map((a, idx) => {
            const name = a.name ?? a.fileName ?? `Attachment ${idx + 1}`;
            const url = a.url ?? a.downloadUrl;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center gap-3 rounded-md border p-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: name }),
                    a.size != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      (Number(a.size) / 1024).toFixed(1),
                      " KB"
                    ] })
                  ] }),
                  url && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: url,
                      download: name,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
                        "Download"
                      ]
                    }
                  ) })
                ]
              },
              url ?? name ?? idx
            );
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4" }),
              "Conversation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Messages between you and the support team. Newest appear at the bottom." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: msgsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) : sortedMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: MessageSquare,
              title: "No messages yet",
              description: "Start the conversation by posting a message below."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-4", children: [
            sortedMessages.map((m) => {
              const authorPrincipal = m.author;
              const authorText = authorPrincipal && typeof authorPrincipal === "object" ? authorPrincipal.toText() : typeof authorPrincipal === "string" ? authorPrincipal : "Unknown";
              const authorShort = authorText.slice(0, 8);
              const role = m.authorRole ?? "";
              const isAgent = role === "l1_help_desk" || role === "l2_resolver" || role === "admin";
              const roleLabel = role === "l1_help_desk" ? "L1 Agent" : role === "l2_resolver" ? "L2 Agent" : role === "admin" ? "Admin" : "Employee";
              const isMe = !isAgent;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: `flex gap-3 ${isMe ? "flex-row-reverse text-right" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs font-mono", children: authorShort.slice(0, 2).toUpperCase() }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `max-w-[80%] space-y-1 ${isMe ? "items-end" : ""}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: `flex items-center gap-2 text-xs ${isMe ? "justify-end" : ""}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-foreground", children: authorShort }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: roleLabel }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: safeFormat(
                                  m.createdAt ?? m.timestamp,
                                  "MMM d, h:mm a"
                                ) })
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: `inline-block rounded-lg px-3 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-left", children: m.content ?? m.body ?? "" })
                            }
                          )
                        ]
                      }
                    )
                  ]
                },
                String(
                  m.id ?? m.messageId ?? `${m.createdAt}-${authorText}`
                )
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: threadEndRef })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "border-t bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Type a message to the support team…",
                  value: message,
                  onChange: (e) => setMessage(e.target.value),
                  className: "min-h-[60px] resize-y",
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSend();
                    }
                  },
                  "aria-label": "New message"
                }
              ),
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
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 w-full text-xs text-muted-foreground", children: "Press ⌘/Ctrl + Enter to send." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Ticket information" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: infoRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start justify-between gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: row.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: row.value })
              ]
            },
            row.label
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: overdue ? "border-destructive/50" : "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
            "SLA Deadline"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: ticket.slaDeadline ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: safeFormat(ticket.slaDeadline, "MMM d, yyyy · h:mm a") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: safeFromNow(ticket.slaDeadline) }),
            overdue ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
              "Overdue"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
              "Within SLA"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No SLA deadline configured for this ticket." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-dashed bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary", "aria-hidden": true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "AI assist coming soon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Smart help for this conversation." })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Future AI-assist features for this ticket will include:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Suggested replies based on similar resolved tickets." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Automatic summarization of long threads." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Knowledge-base article recommendations." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AI features are disabled in this release." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "border-t bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: true, className: "w-full", "aria-disabled": true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
            "AI assist (disabled)"
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  TicketDetail,
  TicketDetail as default
};
