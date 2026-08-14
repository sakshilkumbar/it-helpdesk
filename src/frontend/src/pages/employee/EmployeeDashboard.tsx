import { Link, useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  Plus,
  Ticket as TicketIcon,
} from "lucide-react";
import { useMemo } from "react";

import {
  EmptyState,
  ErrorState,
  KpiCard,
  ListRowSkeleton,
  PageHeader,
  PriorityBadge,
  StatusBadge,
  statusLabel,
} from "@/components/shared";
import type { UiTicketStatus } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMyTickets, usePriorities } from "@/hooks/useQueries";
import type { Ticket } from "@/types";

function safeFromNow(iso: bigint | string | undefined | null): string {
  if (iso == null) return "—";
  try {
    const ms = typeof iso === "bigint" ? Number(iso) / 1_000_000 : iso;
    const d = typeof ms === "string" ? parseISO(ms) : new Date(ms as number);
    if (!isValid(d)) return "—";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}

/** Statuses that count as "open" from the employee's perspective. */
const OPEN_STATUSES = new Set(["open", "in_progress", "pending"]);
const RESOLVED_STATUSES = new Set(["resolved", "closed"]);

export function EmployeeDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, isFetching } = useMyTickets();
  const { data: priorities } = usePriorities();

  const tickets = data ?? [];

  const priorityInfo = (id: bigint) => {
    const p = priorities?.find((pr) => pr.id === id);
    return {
      name: p?.name ?? `Priority ${id}`,
      level: p ? Number(p.level) : 0,
    };
  };

  const openTickets = useMemo(
    () => tickets.filter((t) => OPEN_STATUSES.has(t.status)),
    [tickets],
  );
  const resolvedTickets = useMemo(
    () => tickets.filter((t) => RESOLVED_STATUSES.has(t.status)),
    [tickets],
  );

  // Status breakdown — count per status for the breakdown cards.
  const statusBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of tickets) {
      counts.set(t.status, (counts.get(t.status) ?? 0) + 1);
    }
    return counts;
  }, [tickets]);

  const recent = useMemo(
    () =>
      [...tickets]
        .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
        .slice(0, 5),
    [tickets],
  );

  const total = tickets.length;
  const openCount = openTickets.length;
  const resolvedCount = resolvedTickets.length;

  // Status breakdown entries (only statuses the employee actually has).
  const breakdownEntries = useMemo(
    () =>
      (["open", "in_progress", "pending", "resolved", "closed"] as const)
        .filter((s) => (statusBreakdown.get(s) ?? 0) > 0)
        .map((s) => ({
          status: s,
          count: statusBreakdown.get(s) ?? 0,
          pct:
            total > 0
              ? Math.round(((statusBreakdown.get(s) ?? 0) / total) * 100)
              : 0,
        })),
    [statusBreakdown, total],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Support"
        description="Track your support tickets and quickly raise new requests."
        actions={
          <Button
            onClick={() => navigate({ to: "/employee/tickets/new" })}
            data-ocid="employee_dashboard.create_ticket_button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="My Open Tickets"
          value={openCount}
          icon={Clock}
          tone="primary"
          hint="Awaiting response or in progress"
          trend={openCount > 0 ? "up" : "neutral"}
          trendLabel={openCount > 0 ? "active" : "none"}
        />
        <KpiCard
          label="Total Submitted"
          value={total}
          icon={TicketIcon}
          tone="info"
          hint="All tickets you have submitted"
        />
        <KpiCard
          label="Resolved"
          value={resolvedCount}
          icon={CheckCircle2}
          tone="success"
          hint="Closed or resolved successfully"
          trend={resolvedCount > 0 ? "up" : "neutral"}
          trendLabel={resolvedCount > 0 ? "done" : "none"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent tickets */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Recently Updated</CardTitle>
              <CardDescription>
                The five most recently updated tickets you submitted.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/employee/tickets"
                data-ocid="employee_dashboard.view_all_link"
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ListRowSkeleton rows={5} />
            ) : isError ? (
              <ErrorState
                size="sm"
                title="Unable to load tickets"
                description="There was a problem fetching your tickets."
                onRetry={() => void refetch()}
              />
            ) : recent.length === 0 ? (
              <EmptyState
                size="sm"
                icon={Inbox}
                title="No tickets yet"
                description="When you submit a support ticket it will appear here."
                action={
                  <Button
                    onClick={() => navigate({ to: "/employee/tickets/new" })}
                    data-ocid="employee_dashboard.empty_create_button"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first ticket
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y">
                {recent.map((t, idx) => (
                  <li key={String(t.id)}>
                    <Link
                      to="/employee/tickets/$id"
                      params={{ id: String(t.id) }}
                      data-ocid={`employee_dashboard.recent_ticket.${idx}`}
                      className="flex flex-col gap-3 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-2 sm:py-3.5"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{String(t.id).slice(-6)}
                          </span>
                          <span className="truncate font-medium">
                            {t.title}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>Updated {safeFromNow(t.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:shrink-0">
                        <PriorityBadge
                          priority={priorityInfo(BigInt(t.priorityId))}
                        />
                        <StatusBadge status={t.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          {recent.length > 0 && (
            <CardFooter className="justify-end border-t bg-muted/20 py-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/employee/tickets">Open ticket history</Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Status breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>How your tickets are distributed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading breakdown…
              </div>
            ) : breakdownEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tickets to break down yet.
              </p>
            ) : (
              breakdownEntries.map((entry) => (
                <div
                  key={entry.status}
                  data-ocid={`employee_dashboard.status_breakdown.${entry.status}`}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <StatusBadge
                        status={entry.status as Ticket["status"]}
                        withDot
                      />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {entry.count} · {entry.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-smooth"
                      style={{ width: `${entry.pct}%` }}
                    />
                  </div>
                </div>
              ))
            )}
            <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
              <span>
                {statusLabel("open" as UiTicketStatus)} +{" "}
                {statusLabel("in_progress" as UiTicketStatus)} +{" "}
                {statusLabel("pending" as UiTicketStatus)} = open
              </span>
              <span className="font-mono">{openCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {isFetching && !isLoading && (
        <p className="sr-only" aria-live="polite">
          Refreshing your tickets…
        </p>
      )}
    </div>
  );
}

export default EmployeeDashboard;
