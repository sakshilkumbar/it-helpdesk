import { c as createLucideIcon, am as useUsers, an as useAssignUserRole, ao as useDeactivateUser, ap as useReactivateUser, r as reactExports, aq as AppRole, j as jsxRuntimeExports, af as Users, ar as UserCog, H as Search, F as Badge, as as DropdownMenu, at as DropdownMenuTrigger, B as Button, au as DropdownMenuContent, av as DropdownMenuLabel, aw as DropdownMenuItem, ax as DropdownMenuSeparator, i as ChevronRight, D as Dialog, k as DialogContent, l as DialogHeader, m as DialogTitle, n as DialogDescription, ay as DialogFooter } from "./index-y0UiSxHL.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-xP9BGQcP.js";
import { I as Input } from "./input-BB_cSxD4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DZqbOTYv.js";
import { U as UserCheck } from "./user-check-P_tXa6w9.js";
import { S as ShieldCheck } from "./shield-check-Bi7EWVO3.js";
import { a as ChevronsUpDown, C as ChevronLeft } from "./chevrons-up-down-PzKLsqQ3.js";
import "./index-BDSHvDZP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
];
const Ellipsis = createLucideIcon("ellipsis", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
const ROLE_OPTIONS = [
  { value: AppRole.admin, label: "Administrator" },
  { value: AppRole.l1_help_desk, label: "Level 1 Help Desk" },
  { value: AppRole.l2_resolver, label: "Level 2 Resolver" },
  { value: AppRole.employee, label: "Employee" }
];
const PAGE_SIZE = 10;
function roleBadgeClass(role) {
  switch (role) {
    case "admin":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    case "l1_help_desk":
      return "bg-primary/10 text-primary border-primary/20 dark:bg-primary/15 dark:text-primary dark:border-primary/25";
    case "l2_resolver":
      return "bg-info/10 text-info border-info/20 dark:bg-info/15 dark:text-info dark:border-info/25";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
}
function statusBadgeClass(status) {
  return status === "active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900" : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
}
function formatLastSeen(ts) {
  if (!ts) return "—";
  const d = new Date(Number(ts) / 1e6);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(void 0, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function AdminUsersPage() {
  const { data: users, isLoading, isError, error } = useUsers();
  const assignRole = useAssignUserRole();
  const deactivate = useDeactivateUser();
  const reactivate = useReactivateUser();
  const [search, setSearch] = reactExports.useState("");
  const [roleFilter, setRoleFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [sortKey, setSortKey] = reactExports.useState("name");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [page, setPage] = reactExports.useState(0);
  const [roleDialogUser, setRoleDialogUser] = reactExports.useState(null);
  const [pendingRole, setPendingRole] = reactExports.useState(AppRole.employee);
  const [confirmUser, setConfirmUser] = reactExports.useState(null);
  const [confirmAction, setConfirmAction] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const name = (u.displayName || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const matchesSearch = !q || name.includes(q) || email.includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || (u.isActive === true ? "active" : "inactive") === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);
  const sorted = reactExports.useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av;
      let bv;
      switch (sortKey) {
        case "name":
          av = (a.displayName || "").toLowerCase();
          bv = (b.displayName || "").toLowerCase();
          break;
        case "email":
          av = (a.email || "").toLowerCase();
          bv = (b.email || "").toLowerCase();
          break;
        case "role":
          av = a.role;
          bv = b.role;
          break;
        case "status":
          av = a.isActive === true ? "active" : "inactive";
          bv = b.isActive === true ? "active" : "inactive";
          break;
        case "lastSeen":
          av = a.lastSeenAt ? new Date(Number(a.lastSeenAt) / 1e6).getTime() : 0;
          bv = b.lastSeenAt ? new Date(Number(b.lastSeenAt) / 1e6).getTime() : 0;
          break;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = sorted.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );
  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }
  function openRoleDialog(u) {
    setRoleDialogUser(u);
    setPendingRole(u.role || AppRole.employee);
  }
  async function submitRoleChange() {
    if (!roleDialogUser) return;
    try {
      await assignRole.mutateAsync({
        user: roleDialogUser.id,
        newRole: pendingRole
      });
      setRoleDialogUser(null);
    } catch {
    }
  }
  function openConfirm(u, action) {
    setConfirmUser(u);
    setConfirmAction(action);
  }
  async function submitConfirm() {
    if (!confirmUser || !confirmAction) return;
    try {
      if (confirmAction === "deactivate") {
        await deactivate.mutateAsync({ user: confirmUser.id });
      } else {
        await reactivate.mutateAsync({ user: confirmUser.id });
      }
      setConfirmUser(null);
      setConfirmAction(null);
    } catch {
    }
  }
  const stats = reactExports.useMemo(() => {
    if (!users) return { total: 0, active: 0, admins: 0, agents: 0 };
    return {
      total: users.length,
      active: users.filter((u) => u.isActive === true).length,
      admins: users.filter((u) => u.role === AppRole.admin).length,
      agents: users.filter(
        (u) => u.role === AppRole.l1_help_desk || u.role === AppRole.l2_resolver
      ).length
    };
  }, [users]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "User Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage user accounts, assign roles, and control access across the platform." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Total Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.total }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.active }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Admins" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.admins }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Agents" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: stats.agents }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "All Users" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search by name or email…",
                value: search,
                onChange: (e) => {
                  setSearch(e.target.value);
                  setPage(0);
                },
                className: "pl-8"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: roleFilter,
                onValueChange: (v) => {
                  setRoleFilter(v);
                  setPage(0);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by role" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All roles" }),
                    ROLE_OPTIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.value, children: r.label }, r.value))
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: statusFilter,
                onValueChange: (v) => {
                  setStatusFilter(v);
                  setPage(0);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by status" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleSort("name"),
                className: "inline-flex items-center gap-1 font-medium hover:text-foreground",
                children: [
                  "Name",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3 w-3 text-muted-foreground" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleSort("email"),
                className: "inline-flex items-center gap-1 font-medium hover:text-foreground",
                children: [
                  "Email",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3 w-3 text-muted-foreground" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleSort("role"),
                className: "inline-flex items-center gap-1 font-medium hover:text-foreground",
                children: [
                  "Role",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3 w-3 text-muted-foreground" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleSort("status"),
                className: "inline-flex items-center gap-1 font-medium hover:text-foreground",
                children: [
                  "Status",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3 w-3 text-muted-foreground" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleSort("lastSeen"),
                className: "inline-flex items-center gap-1 font-medium hover:text-foreground",
                children: [
                  "Last Seen",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3 w-3 text-muted-foreground" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[60px] text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              colSpan: 6,
              className: "h-24 text-center text-muted-foreground",
              children: "Loading users…"
            }
          ) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableCell,
            {
              colSpan: 6,
              className: "h-24 text-center text-rose-600",
              children: [
                "Failed to load users:",
                " ",
                (error == null ? void 0 : error.message) ?? "Unknown error"
              ]
            }
          ) }) : paged.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              colSpan: 6,
              className: "h-24 text-center text-muted-foreground",
              children: "No users match the current filters."
            }
          ) }) : paged.map((u) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: u.displayName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: u.email || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: roleBadgeClass(u.role),
                  children: ((_a = ROLE_OPTIONS.find((r) => r.value === u.role)) == null ? void 0 : _a.label) ?? u.role
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: statusBadgeClass(
                    u.isActive === true ? "active" : "inactive"
                  ),
                  children: u.isActive === true ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: formatLastSeen(u.lastSeenAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Open actions" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "Actions" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => openRoleDialog(u), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "mr-2 h-4 w-4" }),
                    " Change role"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                  u.isActive === true ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      onClick: () => openConfirm(u, "deactivate"),
                      className: "text-rose-600 focus:text-rose-600",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "mr-2 h-4 w-4" }),
                        " Deactivate"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      onClick: () => openConfirm(u, "reactivate"),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "mr-2 h-4 w-4" }),
                        " ",
                        "Reactivate"
                      ]
                    }
                  )
                ] })
              ] }) })
            ] }, String(u.id.toText()));
          }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: sorted.length === 0 ? "0 users" : `Showing ${currentPage * PAGE_SIZE + 1}–${Math.min(
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
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!roleDialogUser,
        onOpenChange: (open) => !open && setRoleDialogUser(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Change role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
              "Assign a new role to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: (roleDialogUser == null ? void 0 : roleDialogUser.displayName) || (roleDialogUser == null ? void 0 : roleDialogUser.email) }),
              ". This affects what the user can access."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: pendingRole,
              onValueChange: (v) => setPendingRole(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a role" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ROLE_OPTIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.value, children: r.label }, r.value)) })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRoleDialogUser(null), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitRoleChange, disabled: assignRole.isPending, children: assignRole.isPending ? "Saving…" : "Save role" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!confirmUser,
        onOpenChange: (open) => !open && setConfirmUser(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: confirmAction === "deactivate" ? "Deactivate user" : "Reactivate user" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: confirmAction === "deactivate" ? `Are you sure you want to deactivate ${(confirmUser == null ? void 0 : confirmUser.displayName) || (confirmUser == null ? void 0 : confirmUser.email)}? They will lose access to the platform until reactivated.` : `Reactivate ${(confirmUser == null ? void 0 : confirmUser.displayName) || (confirmUser == null ? void 0 : confirmUser.email)}? They will regain access to the platform.` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setConfirmUser(null), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: confirmAction === "deactivate" ? "destructive" : "default",
                onClick: submitConfirm,
                disabled: deactivate.isPending || reactivate.isPending,
                children: confirmAction === "deactivate" ? deactivate.isPending ? "Deactivating…" : "Deactivate" : reactivate.isPending ? "Reactivating…" : "Reactivate"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminUsersPage as default
};
