import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { usePriorities, useSLAStatuses } from "@/hooks/useQueries";
import { AlertTriangle, CheckCircle2, Clock, Timer } from "lucide-react";
import { useMemo, useState } from "react";

type SLAState = "on_track" | "at_risk" | "breached";
type Filter = "all" | SLAState;

function priorityBadge(p: string) {
  switch (p) {
    case "urgent":
    case "critical":
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
    case "high":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    case "medium":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900";
    case "low":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
}

function stateBadgeClass(s: SLAState) {
  switch (s) {
    case "on_track":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
    case "at_risk":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    case "breached":
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
  }
}

function stateLabel(s: SLAState) {
  switch (s) {
    case "on_track":
      return "On track";
    case "at_risk":
      return "At risk";
    case "breached":
      return "Breached";
  }
}

function formatDeadline(ts: string | number | Date | undefined | null) {
  if (!ts) return "—";
  const d = new Date(ts as any);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRemaining(ms: number) {
  if (ms <= 0) return "Breached";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

export default function AdminSLAPage() {
  const { data: tickets, isLoading, isError, error } = useSLAStatuses();
  const { data: priorities } = usePriorities();
  const [filter, setFilter] = useState<Filter>("all");

  const priorityName = (id: bigint) =>
    priorities?.find((p) => p.id === id)?.name ?? String(id);

  const enriched = useMemo(() => {
    if (!tickets) return [];
    return tickets.map((t) => {
      const deadlineMs = t.slaDeadline
        ? new Date(Number(t.slaDeadline) / 1e6).getTime()
        : 0;
      const remainingMs = deadlineMs ? deadlineMs - Date.now() : 0;
      const state: SLAState = t.isBreached
        ? "breached"
        : t.isAtRisk
          ? "at_risk"
          : remainingMs <= 0
            ? "breached"
            : "on_track";
      return {
        ...t,
        _state: state,
        _remainingMs: remainingMs,
        _deadlineMs: deadlineMs,
      };
    });
  }, [tickets]);

  const filtered = useMemo(() => {
    if (filter === "all") return enriched;
    return enriched.filter((t) => t._state === filter);
  }, [enriched, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      // breached first, then at_risk, then on_track; within each, soonest deadline
      const order: Record<SLAState, number> = {
        breached: 0,
        at_risk: 1,
        on_track: 2,
      };
      if (order[a._state] !== order[b._state])
        return order[a._state] - order[b._state];
      return a._deadlineMs - b._deadlineMs;
    });
  }, [filtered]);

  const stats = useMemo(() => {
    const total = enriched.length;
    const atRisk = enriched.filter((t) => t._state === "at_risk").length;
    const breached = enriched.filter((t) => t._state === "breached").length;
    const onTrack = enriched.filter((t) => t._state === "on_track").length;
    return { total, atRisk, breached, onTrack };
  }, [enriched]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          SLA Monitoring
        </h1>
        <p className="text-sm text-muted-foreground">
          Track tickets against their target resolution times. Act before SLAs
          breach.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tickets
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On Track
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.onTrack}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              At Risk
            </CardTitle>
            <Timer className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
              {stats.atRisk}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Breached
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
              {stats.breached}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Tickets by SLA Status</CardTitle>
          <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by SLA status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="on_track">On track</SelectItem>
              <SelectItem value="at_risk">At risk</SelectItem>
              <SelectItem value="breached">Breached</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Ticket</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>SLA Deadline</TableHead>
                  <TableHead>Time Remaining</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Loading SLA data…
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-rose-600"
                    >
                      Failed to load SLA data:{" "}
                      {(error as Error)?.message ?? "Unknown error"}
                    </TableCell>
                  </TableRow>
                ) : sorted.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No tickets match the current filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  sorted.map((t) => (
                    <TableRow key={String(t.ticketId)}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {String(t.ticketId)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {t.title || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={priorityBadge(
                            priorityName(BigInt(t.priorityId)).toLowerCase(),
                          )}
                        >
                          {priorityName(BigInt(t.priorityId))}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDeadline(Number(t.slaDeadline) / 1e6)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium tabular-nums ${
                            t._state === "breached"
                              ? "text-rose-600 dark:text-rose-400"
                              : t._state === "at_risk"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {formatRemaining(t._remainingMs)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={stateBadgeClass(t._state)}
                        >
                          {stateLabel(t._state)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
