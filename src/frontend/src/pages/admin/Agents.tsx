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
  useAgents,
  useAllTickets,
  useReassignTicket,
} from "@/hooks/useQueries";
import type { AgentSummary } from "@/types";
import { Principal } from "@icp-sdk/core/principal";
import {
  CheckCircle2,
  Headset,
  Inbox,
  Percent,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

function rateClass(rate: number) {
  if (rate >= 80)
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
  if (rate >= 50)
    return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900";
  return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900";
}

function rateLabel(rate: number) {
  if (rate >= 80) return "High";
  if (rate >= 50) return "Moderate";
  return "Low";
}

export default function AdminAgentsPage() {
  const { data: agents, isLoading, isError, error } = useAgents();
  const { data: allTickets } = useAllTickets();
  const reassign = useReassignTicket();

  const [reassignOpen, setReassignOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  const stats = useMemo(() => {
    if (!agents) return { total: 0, assigned: 0, resolved: 0, avgRate: 0 };
    const total = agents.length;
    const assigned = agents.reduce(
      (s, a) => s + Number(a.assignedTicketCount ?? 0),
      0,
    );
    const resolved = agents.reduce(
      (s, a) => s + Number(a.resolvedTicketCount ?? 0),
      0,
    );
    const rates = agents
      .map((a) =>
        typeof a.resolutionRate === "number" ? a.resolutionRate : null,
      )
      .filter((r): r is number => r != null);
    const avgRate = rates.length
      ? rates.reduce((s, r) => s + r, 0) / rates.length
      : 0;
    return { total, assigned, resolved, avgRate };
  }, [agents]);

  // Build a flat list of assignable tickets from all tickets that are still
  // open or in progress. AgentSummary does not expose per-agent ticket lists,
  // so we derive the reassignment pool from the full ticket list.
  const assignableTickets = useMemo(() => {
    if (!allTickets) return [];
    return allTickets
      .filter((t) => t.status === "open" || t.status === "in_progress")
      .map((t) => ({
        id: String(t.id),
        title: t.title || String(t.id),
      }));
  }, [allTickets]);

  function openReassign(ticketId?: string) {
    setSelectedTicketId(ticketId ?? "");
    setSelectedAgentId("");
    setReassignOpen(true);
  }

  async function submitReassign() {
    if (!selectedTicketId || !selectedAgentId) return;
    try {
      await reassign.mutateAsync({
        ticketId: BigInt(selectedTicketId),
        newAgent: Principal.fromText(selectedAgentId),
      });
      setReassignOpen(false);
      setSelectedTicketId("");
      setSelectedAgentId("");
    } catch {
      /* surfaced via mutation state */
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Support Agents
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor agent workload and reassign tickets to balance capacity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agents
            </CardTitle>
            <Headset className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Tickets
            </CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Resolution
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stats.avgRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Agent Roster</CardTitle>
          <Button variant="outline" size="sm" onClick={() => openReassign()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reassign ticket
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead className="text-right">Assigned</TableHead>
                  <TableHead className="text-right">Resolved</TableHead>
                  <TableHead className="text-right">Resolution Rate</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Loading agents…
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-rose-600"
                    >
                      Failed to load agents:{" "}
                      {(error as Error)?.message ?? "Unknown error"}
                    </TableCell>
                  </TableRow>
                ) : !agents || agents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No support agents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  agents.map((a: AgentSummary) => {
                    const assigned = Number(a.assignedTicketCount ?? 0);
                    const resolved = Number(a.resolvedTicketCount ?? 0);
                    const rate =
                      typeof a.resolutionRate === "number"
                        ? a.resolutionRate
                        : assigned + resolved > 0
                          ? Math.round((resolved / (assigned + resolved)) * 100)
                          : 0;
                    return (
                      <TableRow key={String(a.agentId.toText())}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                              {(a.displayName || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {a.displayName || "—"}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {String(a.agentId.toText())}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {assigned}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {resolved}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Badge
                              variant="outline"
                              className={rateClass(rate)}
                            >
                              <Percent className="mr-1 h-3 w-3" />
                              {rate.toFixed(0)}% · {rateLabel(rate)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReassign()}
                            disabled={assignableTickets.length === 0}
                          >
                            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />{" "}
                            Reassign
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reassign ticket</DialogTitle>
            <DialogDescription>
              Select a ticket and the agent who should take ownership. The
              previous assignee will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="ticket-select" className="text-sm font-medium">
                Ticket
              </label>
              <Select
                value={selectedTicketId}
                onValueChange={setSelectedTicketId}
              >
                <SelectTrigger id="ticket-select">
                  <SelectValue placeholder="Select a ticket" />
                </SelectTrigger>
                <SelectContent>
                  {assignableTickets.length === 0 ? (
                    <SelectItem value="_none" disabled>
                      No assignable tickets available
                    </SelectItem>
                  ) : (
                    assignableTickets.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="agent-select" className="text-sm font-medium">
                New assignee
              </label>
              <Select
                value={selectedAgentId}
                onValueChange={setSelectedAgentId}
              >
                <SelectTrigger id="agent-select">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {(agents ?? []).map((a) => (
                    <SelectItem
                      key={String(a.agentId.toText())}
                      value={String(a.agentId.toText())}
                    >
                      {a.displayName} ({Number(a.assignedTicketCount ?? 0)}{" "}
                      open)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitReassign}
              disabled={
                reassign.isPending || !selectedTicketId || !selectedAgentId
              }
            >
              {reassign.isPending ? "Reassigning…" : "Reassign ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
