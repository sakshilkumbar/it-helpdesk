import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuditLogs } from "@/hooks/useQueries";
import type { AuditLogView } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  History,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

type SortDir = "asc" | "desc";

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
  "settingsUpdated",
] as const;

function actionLabel(action: string) {
  return action
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function actionBadgeClass(action: string) {
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

function formatTimestamp(
  ts: string | number | bigint | Date | undefined | null,
) {
  if (ts === undefined || ts === null) return "—";
  const d = typeof ts === "bigint" ? new Date(Number(ts) / 1e6) : new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AdminAuditLogsPage() {
  const { data: logs, isLoading, isError, error } = useAuditLogs();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!logs) return [];
    const q = search.trim().toLowerCase();
    return logs.filter((l) => {
      const matchesAction = actionFilter === "all" || l.action === actionFilter;
      const detail = (l.detail || "").toLowerCase();
      const actor = (l.actorId ? String(l.actorId.toText()) : "").toLowerCase();
      const target = (l.targetEntity || "").toLowerCase();
      const matchesSearch =
        !q || detail.includes(q) || actor.includes(q) || target.includes(q);
      return matchesAction && matchesSearch;
    });
  }, [logs, search, actionFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a.timestamp
        ? new Date(Number(a.timestamp) / 1e6).getTime()
        : 0;
      const bv = b.timestamp
        ? new Date(Number(b.timestamp) / 1e6).getTime()
        : 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [filtered, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = sorted.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  function toggleSort() {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  // Build a list of action types actually present (union with the known list).
  const presentActions = useMemo(() => {
    const set = new Set<string>(ACTION_TYPES as readonly string[]);
    if (logs) for (const l of logs) if (l.action) set.add(l.action);
    return Array.from(set).sort();
  }, [logs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Chronological record of significant platform actions. Newest first by
          default.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by detail, actor, or target…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-8"
              />
            </div>
            <Select
              value={actionFilter}
              onValueChange={(v) => {
                setActionFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All action types</SelectItem>
                {presentActions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {actionLabel(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <button
                      type="button"
                      onClick={toggleSort}
                      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    >
                      Timestamp{" "}
                      <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Loading audit logs…
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-rose-600"
                    >
                      Failed to load audit logs:{" "}
                      {(error as Error)?.message ?? "Unknown error"}
                    </TableCell>
                  </TableRow>
                ) : paged.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No audit log entries match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((l: AuditLogView, idx) => (
                    <TableRow key={l.id ?? `${l.timestamp}-${idx}`}>
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(l.timestamp)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {l.actorId ? String(l.actorId.toText()) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={actionBadgeClass(l.action)}
                        >
                          {actionLabel(l.action)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {l.targetEntity || "—"}
                      </TableCell>
                      <TableCell className="max-w-md text-muted-foreground">
                        {l.detail || "—"}
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
                ? "0 entries"
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
    </div>
  );
}
