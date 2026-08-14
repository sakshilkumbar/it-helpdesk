import { AppRole } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAssignUserRole,
  useDeactivateUser,
  useReactivateUser,
  useUsers,
} from "@/hooks/useQueries";
import type { UserView } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
  Users as UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

type Role = AppRole;
type Status = "active" | "inactive";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: AppRole.admin, label: "Administrator" },
  { value: AppRole.l1_help_desk, label: "Level 1 Help Desk" },
  { value: AppRole.l2_resolver, label: "Level 2 Resolver" },
  { value: AppRole.employee, label: "Employee" },
];

type SortKey = "name" | "email" | "role" | "status" | "lastSeen";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function roleBadgeClass(role: string) {
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

function statusBadgeClass(status: Status) {
  return status === "active"
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
    : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
}

function formatLastSeen(ts: bigint | undefined | null) {
  if (!ts) return "—";
  const d = new Date(Number(ts) / 1e6);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUsersPage() {
  const { data: users, isLoading, isError, error } = useUsers();
  const assignRole = useAssignUserRole();
  const deactivate = useDeactivateUser();
  const reactivate = useReactivateUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);

  const [roleDialogUser, setRoleDialogUser] = useState<UserView | null>(null);
  const [pendingRole, setPendingRole] = useState<Role>(AppRole.employee);
  const [confirmUser, setConfirmUser] = useState<UserView | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "deactivate" | "reactivate" | null
  >(null);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const name = (u.displayName || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const matchesSearch = !q || name.includes(q) || email.includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (u.isActive === true ? "active" : "inactive") === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: any;
      let bv: any;
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
          av = a.lastSeenAt
            ? new Date(Number(a.lastSeenAt) / 1e6).getTime()
            : 0;
          bv = b.lastSeenAt
            ? new Date(Number(b.lastSeenAt) / 1e6).getTime()
            : 0;
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
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function openRoleDialog(u: UserView) {
    setRoleDialogUser(u);
    setPendingRole((u.role as Role) || AppRole.employee);
  }

  async function submitRoleChange() {
    if (!roleDialogUser) return;
    try {
      await assignRole.mutateAsync({
        user: roleDialogUser.id,
        newRole: pendingRole,
      });
      setRoleDialogUser(null);
    } catch {
      /* error surfaced via mutation state */
    }
  }

  function openConfirm(u: UserView, action: "deactivate" | "reactivate") {
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
      /* error surfaced via mutation state */
    }
  }

  const stats = useMemo(() => {
    if (!users) return { total: 0, active: 0, admins: 0, agents: 0 };
    return {
      total: users.length,
      active: users.filter((u) => u.isActive === true).length,
      admins: users.filter((u) => u.role === AppRole.admin).length,
      agents: users.filter(
        (u) =>
          u.role === AppRole.l1_help_desk || u.role === AppRole.l2_resolver,
      ).length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage user accounts, assign roles, and control access across the
          platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admins
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agents
            </CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.agents}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={roleFilter}
                onValueChange={(v) => {
                  setRoleFilter(v as Role | "all");
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as Status | "all");
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("name")}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      Name{" "}
                      <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("email")}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      Email{" "}
                      <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("role")}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      Role{" "}
                      <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("status")}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      Status{" "}
                      <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("lastSeen")}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      Last Seen{" "}
                      <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TableHead>
                  <TableHead className="w-[60px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Loading users…
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-rose-600"
                    >
                      Failed to load users:{" "}
                      {(error as Error)?.message ?? "Unknown error"}
                    </TableCell>
                  </TableRow>
                ) : paged.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No users match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((u) => (
                    <TableRow key={String(u.id.toText())}>
                      <TableCell className="font-medium">
                        {u.displayName || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.email || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={roleBadgeClass(u.role)}
                        >
                          {ROLE_OPTIONS.find((r) => r.value === u.role)
                            ?.label ?? u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusBadgeClass(
                            u.isActive === true ? "active" : "inactive",
                          )}
                        >
                          {u.isActive === true ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatLastSeen(u.lastSeenAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openRoleDialog(u)}>
                              <UserCog className="mr-2 h-4 w-4" /> Change role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {u.isActive === true ? (
                              <DropdownMenuItem
                                onClick={() => openConfirm(u, "deactivate")}
                                className="text-rose-600 focus:text-rose-600"
                              >
                                <UserX className="mr-2 h-4 w-4" /> Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => openConfirm(u, "reactivate")}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />{" "}
                                Reactivate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {sorted.length === 0
                ? "0 users"
                : `Showing ${currentPage * PAGE_SIZE + 1}–${Math.min(
                    (currentPage + 1) * PAGE_SIZE,
                    sorted.length,
                  )} of ${sorted.length}`}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span>
                Page {currentPage + 1} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={currentPage >= pageCount - 1}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role assignment dialog */}
      <Dialog
        open={!!roleDialogUser}
        onOpenChange={(open) => !open && setRoleDialogUser(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              Assign a new role to{" "}
              <span className="font-medium text-foreground">
                {roleDialogUser?.displayName || roleDialogUser?.email}
              </span>
              . This affects what the user can access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Select
              value={pendingRole}
              onValueChange={(v) => setPendingRole(v as Role)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogUser(null)}>
              Cancel
            </Button>
            <Button onClick={submitRoleChange} disabled={assignRole.isPending}>
              {assignRole.isPending ? "Saving…" : "Save role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm deactivate / reactivate */}
      <Dialog
        open={!!confirmUser}
        onOpenChange={(open) => !open && setConfirmUser(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "deactivate"
                ? "Deactivate user"
                : "Reactivate user"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "deactivate"
                ? `Are you sure you want to deactivate ${confirmUser?.displayName || confirmUser?.email}? They will lose access to the platform until reactivated.`
                : `Reactivate ${confirmUser?.displayName || confirmUser?.email}? They will regain access to the platform.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmUser(null)}>
              Cancel
            </Button>
            <Button
              variant={
                confirmAction === "deactivate" ? "destructive" : "default"
              }
              onClick={submitConfirm}
              disabled={deactivate.isPending || reactivate.isPending}
            >
              {confirmAction === "deactivate"
                ? deactivate.isPending
                  ? "Deactivating…"
                  : "Deactivate"
                : reactivate.isPending
                  ? "Reactivating…"
                  : "Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
