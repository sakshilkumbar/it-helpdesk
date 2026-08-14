import { o as useNavigate, r as reactExports, p as useMyTickets, G as SortOrder, V as Variant_createdAt_updatedAt_priority, q as usePriorities, A as useCategories, j as jsxRuntimeExports, t as Link, B as Button, H as Search, E as EmptyState, i as ChevronRight } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { T as TableSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { S as StatusBadge } from "./StatusBadge-C3JOGEpV.js";
import { P as PriorityBadge } from "./PriorityBadge-B6E1CvT5.js";
import { D as DataTable } from "./DataTable-CYOHfKyl.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-xP9BGQcP.js";
import { I as Input } from "./input-BB_cSxD4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { P as Plus } from "./plus-BTRHdzuK.js";
import { I as Inbox } from "./inbox-CGn7sgad.js";
import { C as ChevronLeft } from "./chevrons-up-down-PzKLsqQ3.js";
import { i as isValid } from "./isValid-8ZmR24ka.js";
import { f as format } from "./format-BoCtbVp_.js";
import "./table-DZqbOTYv.js";
import "./index-BDSHvDZP.js";
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
function priorityRank(p) {
  if (!p) return 0;
  const name = (typeof p === "string" ? p : String(p)).toLowerCase();
  if (name.includes("crit") || name.includes("urgent")) return 4;
  if (name.includes("high")) return 3;
  if (name.includes("med")) return 2;
  if (name.includes("low")) return 1;
  return 0;
}
function TicketHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [sortField, setSortField] = reactExports.useState("updatedAt");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [page, setPage] = reactExports.useState(1);
  const pageSize = 10;
  const { data, isLoading, isError, isFetching } = useMyTickets({
    page: { page: BigInt(page), pageSize: BigInt(pageSize) },
    search,
    sortBy: sortField === "priority" ? Variant_createdAt_updatedAt_priority.priority : sortField === "createdAt" ? Variant_createdAt_updatedAt_priority.createdAt : Variant_createdAt_updatedAt_priority.updatedAt,
    sortOrder: sortDir === "asc" ? SortOrder.asc : SortOrder.desc
  });
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();
  const priorityName = reactExports.useCallback(
    (id) => {
      var _a;
      return ((_a = priorities == null ? void 0 : priorities.find((p) => p.id === id)) == null ? void 0 : _a.name) ?? String(id);
    },
    [priorities]
  );
  const priorityLevel = reactExports.useCallback(
    (id) => {
      const p = priorities == null ? void 0 : priorities.find((pr) => pr.id === id);
      return p ? Number(p.level) : 0;
    },
    [priorities]
  );
  const categoryName = reactExports.useCallback(
    (id) => {
      var _a;
      return ((_a = categories == null ? void 0 : categories.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? String(id);
    },
    [categories]
  );
  const rawTickets = Array.isArray(data) ? data : [];
  const totalCount = rawTickets.length;
  const tickets = reactExports.useMemo(() => {
    let list = [...rawTickets];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) => String(t.title ?? "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let av;
      let bv;
      if (sortField === "priority") {
        av = priorityRank(a.priorityId);
        bv = priorityRank(b.priorityId);
      } else {
        av = (toDate(a[sortField] ?? a.createdAt) ?? /* @__PURE__ */ new Date(0)).getTime();
        bv = (toDate(b[sortField] ?? b.createdAt) ?? /* @__PURE__ */ new Date(0)).getTime();
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [rawTickets, search, sortField, sortDir]);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const columns = reactExports.useMemo(
    () => [
      {
        key: "id",
        accessor: (t) => String(t.id ?? ""),
        header: "Ticket",
        render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/employee/tickets/$id",
            params: { id: String(t.id ?? t.ticketId ?? "") },
            className: "group flex flex-col",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                "#",
                String(t.id ?? t.ticketId ?? "").slice(-6)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-primary group-hover:underline", children: t.title })
            ]
          }
        )
      },
      {
        key: "category",
        accessor: (t) => String(t.categoryId ?? ""),
        header: "Category",
        render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: categoryName(BigInt(t.categoryId ?? 0n)) })
      },
      {
        key: "priority",
        accessor: (t) => String(t.priorityId ?? ""),
        header: "Priority",
        render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          PriorityBadge,
          {
            priority: {
              name: priorityName(BigInt(t.priorityId ?? 0n)),
              level: priorityLevel(BigInt(t.priorityId ?? 0n))
            }
          }
        )
      },
      {
        key: "status",
        accessor: (t) => String(t.status ?? ""),
        header: "Status",
        render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: t.status })
      },
      {
        key: "createdAt",
        accessor: (t) => String(t.createdAt ?? ""),
        header: "Created",
        render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: safeFormat(t.createdAt, "MMM d, yyyy") })
      },
      {
        key: "updatedAt",
        accessor: (t) => String(t.updatedAt ?? ""),
        header: "Last updated",
        render: (t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: safeFormat(t.updatedAt, "MMM d, yyyy · h:mm a") })
      }
    ],
    [priorityName, priorityLevel, categoryName]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "My Tickets",
        description: "Search, sort, and review every support ticket you have submitted.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate({ to: "/employee/tickets/new" }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "New Ticket"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Ticket History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: totalCount > 0 ? `${totalCount} ticket${totalCount === 1 ? "" : "s"} total` : "You have not submitted any tickets yet." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search by title…",
                value: search,
                onChange: (e) => {
                  setSearch(e.target.value);
                  setPage(1);
                },
                className: "pl-9",
                "aria-label": "Search tickets by title"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: sortField,
                onValueChange: (v) => setSortField(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px]", "aria-label": "Sort field", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "updatedAt", children: "Last updated" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "createdAt", children: "Created date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "priority", children: "Priority" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: sortDir,
                onValueChange: (v) => setSortDir(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "w-[120px]",
                      "aria-label": "Sort direction",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "desc", children: "Descending" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "asc", children: "Ascending" })
                  ] })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Inbox,
            title: "Unable to load tickets",
            description: "There was a problem fetching your tickets. Please try again later."
          }
        ) : tickets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Inbox,
            title: search ? "No matching tickets" : "No tickets yet",
            description: search ? "Try adjusting your search query." : "Submit your first support ticket to get started.",
            action: !search ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => navigate({ to: "/employee/tickets/new" }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                  "Create a ticket"
                ]
              }
            ) : void 0
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          DataTable,
          {
            columns,
            data: tickets,
            rowKey: (t) => String(t.id ?? t.ticketId ?? ""),
            onRowClick: (t) => navigate({
              to: "/employee/tickets/$id",
              params: { id: String(t.id ?? t.ticketId ?? "") }
            })
          }
        ),
        !isLoading && !isError && tickets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: (page - 1) * pageSize + 1 }),
            "–",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: Math.min(page * pageSize, totalCount) }),
            " ",
            "of",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: totalCount }),
            isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-muted-foreground", children: "· loading…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: page <= 1,
                onClick: () => setPage((p) => Math.max(1, p - 1)),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "mr-1 h-4 w-4" }),
                  "Previous"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              "Page ",
              page,
              " of ",
              totalPages
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: page >= totalPages,
                onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
                children: [
                  "Next",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
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
  TicketHistory,
  TicketHistory as default
};
