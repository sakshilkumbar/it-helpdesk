import { Link } from "@tanstack/react-router";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import {
  AlertTriangle,
  ArrowRight,
  Inbox,
  ShieldAlert,
  Ticket as TicketIcon,
  UserCheck,
} from "lucide-react";
import { useMemo } from "react";

import type { RoleDashboard } from "@/backend";
import {
  EmptyState,
  ErrorState,
  KpiCard,
  ListRowSkeleton,
  PageHeader,
  PriorityBadge,
  SlaIndicator,
  StatusBadge,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApi } from "@/hooks/useBackend";
import type { Actor } from "@/hooks/useBackend";
import { useMyAssignedTickets, usePriorities } from "@/hooks/useQueries";
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

/**
 * useRoleDashboard — fetches the role-aware dashboard payload
 * (getMyRoleDashboard). The backend returns RoleKPIs by name; we map them to
 * KpiCard props in the component. Trends are derived client-side because the
 * backend RoleKPI shape carries no trend signal.
 */
function useRoleDashboard() {
  return useApi<RoleDashboard>(["dashboard", "my-role"], (a: Actor) =>
    a.getMyRoleDashboard(),
  );
}

/**
 * useQueueTickets — fetches the resolver's queue tickets (getMyQueueTickets).
 * Used for the recent intake list on the L1 dashboard.
 */
function useQueueTickets() {
  return useApi<Ticket[]>(["tickets", "my-queue"], (a: Actor) =>
    a.getMyQueueTickets(),
  );
}

/** Look up a RoleKPI value by name (returns 0 when absent). */
function kpiValue(
  kpis: { value: bigint; name: string }[] | undefined,
  name: string,
): number {
  if (!kpis) return 0;
  const found = kpis.find((k) => k.name.toLowerCase() === name.toLowerCase());
  return found ? Number(found.value) : 0;
}

/**
 * At-risk window: a ticket is "at risk" when its SLA deadline falls within
 * this many nanoseconds of now (4 hours) but has not yet breached. Tunable.
 */
const SLA_AT_RISK_WINDOW_NS = 4 * 60 * 60 * 1_000_000_000; // 4h in ns

/**
 * Derive SLA indicator buckets from a nanosecond deadline.
 * - breached: deadline has passed (red)
 * - at_risk: deadline is within the at-risk window but not yet breached (amber)
 * - on_track: otherwise (green)
 */
function deriveSlaState(slaDeadline: bigint | undefined | null): {
  isBreached: boolean;
  isAtRisk: boolean;
} {
  if (slaDeadline == null) return { isBreached: false, isAtRisk: false };
  const nowNs = BigInt(Date.now()) * 1_000_000n;
  const deadlineNs = BigInt(slaDeadline);
  const isBreached = deadlineNs < nowNs;
  const isAtRisk =
    !isBreached && deadlineNs < nowNs + BigInt(SLA_AT_RISK_WINDOW_NS);
  return { isBreached, isAtRisk };
}

export function L1HelpDeskDashboard() {
  const {
    data: dashboard,
    isLoading: dashLoading,
    isError: dashError,
    refetch: refetchDash,
  } = useRoleDashboard();
  const {
    data: queueTickets,
    isLoading: queueLoading,
    isError: queueError,
    refetch: refetchQueue,
  } = useQueueTickets();
  const { data: priorities } = usePriorities();

  const priorityInfo = (id: bigint) => {
    const p = priorities?.find((pr) => pr.id === id);
    return {
      name: p?.name ?? `Priority ${id}`,
      level: p ? Number(p.level) : 0,
    };
  };

  const kpis = dashboard?.kpis ?? [];
  const newUnassigned = kpiValue(kpis, "new_unassigned");
  const awaitingTriage = kpiValue(kpis, "awaiting_triage");
  const slaAtRisk = kpiValue(kpis, "sla_at_risk");
  const myAssigned = kpiValue(kpis, "my_assigned");

  const tickets = queueTickets ?? [];

  // Recent intake — newest first by createdAt.
  const recentIntake = useMemo(
    () =>
      [...tickets]
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .slice(0, 6),
    [tickets],
  );

  const isLoading = dashLoading || queueLoading;
  const isError = dashError || queueError;
  const refetch = () => {
    void refetchDash();
    void refetchQueue();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="L1 Help Desk"
        description="Triage incoming tickets, monitor SLA risk, and work your assigned queue."
        actions={
          <Button asChild variant="outline">
            <Link
              to="/agent/tickets"
              data-ocid="l1_dashboard.open_queue_button"
            >
              <Inbox className="mr-2 h-4 w-4" />
              Open Full Queue
            </Link>
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="New / Unassigned"
          value={newUnassigned}
          icon={Inbox}
          tone="info"
          hint="Tickets needing first response"
          trend={newUnassigned > 0 ? "up" : "neutral"}
          trendLabel={newUnassigned > 0 ? "intake" : "clear"}
        />
        <KpiCard
          label="Awaiting Triage"
          value={awaitingTriage}
          icon={UserCheck}
          tone="accent"
          hint="Not yet categorized or prioritized"
          trend={awaitingTriage > 0 ? "up" : "neutral"}
          trendLabel={awaitingTriage > 0 ? "pending" : "clear"}
        />
        <KpiCard
          label="SLA At Risk"
          value={slaAtRisk}
          icon={ShieldAlert}
          tone="warning"
          hint="Approaching response deadline"
          trend={slaAtRisk > 0 ? "up" : "neutral"}
          trendLabel={slaAtRisk > 0 ? "watch" : "clear"}
        />
        <KpiCard
          label="My Assigned"
          value={myAssigned}
          icon={TicketIcon}
          tone="primary"
          hint="Tickets currently assigned to you"
        />
      </div>

      {/* Recent intake list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle>Recent Intake</CardTitle>
            <CardDescription>
              The most recently created tickets entering the L1 queue.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/agent/tickets" data-ocid="l1_dashboard.view_all_link">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ListRowSkeleton rows={6} />
          ) : isError ? (
            <ErrorState
              size="sm"
              title="Unable to load the queue"
              description="There was a problem fetching intake tickets."
              onRetry={refetch}
            />
          ) : recentIntake.length === 0 ? (
            <EmptyState
              size="sm"
              icon={Inbox}
              title="Queue is clear"
              description="No tickets are currently waiting in the L1 intake queue."
            />
          ) : (
            <ul className="divide-y">
              {recentIntake.map((t, idx) => (
                <li key={String(t.id)}>
                  <Link
                    to="/agent/tickets/$id"
                    params={{ id: String(t.id) }}
                    data-ocid={`l1_dashboard.intake_ticket.${idx}`}
                    className="flex flex-col gap-3 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-2 sm:py-3.5"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{String(t.id).slice(-6)}
                        </span>
                        <span className="truncate font-medium">{t.title}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Created {safeFromNow(t.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <SlaIndicator
                        compact
                        {...deriveSlaState(t.slaDeadline)}
                      />
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
        {recentIntake.length > 0 && (
          <CardFooter className="justify-end border-t bg-muted/20 py-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agent/tickets">Open full queue</Link>
            </Button>
          </CardFooter>
        )}
      </Card>

      {slaAtRisk > 0 && (
        <output
          className="flex items-start gap-3 rounded-lg border border-[oklch(var(--sla-at-risk)/0.3)] bg-[oklch(var(--sla-at-risk)/0.08)] p-4"
          data-ocid="l1_dashboard.sla_alert"
        >
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(var(--sla-at-risk))]"
            aria-hidden
          />
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {slaAtRisk} ticket{slaAtRisk === 1 ? "" : "s"} approaching SLA
              breach
            </p>
            <p className="text-xs text-muted-foreground">
              Review and respond to at-risk tickets before their response
              deadline passes.
            </p>
          </div>
        </output>
      )}
    </div>
  );
}

export default L1HelpDeskDashboard;
