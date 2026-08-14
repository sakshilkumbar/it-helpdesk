import { Link } from "@tanstack/react-router";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import {
  ArrowRight,
  Clock,
  Gauge,
  Inbox,
  MessageCircle,
  ShieldAlert,
  TrendingUp,
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
 * (getMyRoleDashboard). Resolution-time KPIs come from the backend by name.
 */
function useRoleDashboard() {
  return useApi<RoleDashboard>(["dashboard", "my-role"], (a: Actor) =>
    a.getMyRoleDashboard(),
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

/** Format a nanosecond duration as a compact human label (e.g. "3d 4h"). */
function formatDurationNs(ns: bigint | undefined | null): string {
  if (ns == null) return "—";
  const totalMin = Number(ns) / 60_000_000_000;
  if (!Number.isFinite(totalMin) || totalMin < 0) return "—";
  if (totalMin < 1) return "<1m";
  if (totalMin < 60) return `${Math.round(totalMin)}m`;
  const hours = totalMin / 60;
  if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }
  const days = hours / 24;
  const d = Math.floor(days);
  const h = Math.round((days - d) * 24);
  return h === 0 ? `${d}d` : `${d}d ${h}h`;
}

export function L2ResolverDashboard() {
  const {
    data: dashboard,
    isLoading: dashLoading,
    isError: dashError,
    refetch: refetchDash,
  } = useRoleDashboard();
  const {
    data: assigned,
    isLoading: assignedLoading,
    isError: assignedError,
    refetch: refetchAssigned,
  } = useMyAssignedTickets();
  const { data: priorities } = usePriorities();

  const priorityInfo = (id: bigint) => {
    const p = priorities?.find((pr) => pr.id === id);
    return {
      name: p?.name ?? `Priority ${id}`,
      level: p ? Number(p.level) : 0,
    };
  };

  const kpis = dashboard?.kpis ?? [];
  const escalatedToMe = kpiValue(kpis, "escalated_to_me");
  const awaitingResponse = kpiValue(kpis, "awaiting_my_response");
  const slaBreachRisk = kpiValue(kpis, "sla_breach_risk");
  const avgResolutionNs = kpis.find((k) =>
    k.name.toLowerCase().includes("resolution"),
  )?.value;
  const resolvedCount = kpiValue(kpis, "resolved");

  const tickets = assigned ?? [];

  // Escalated tickets assigned to me — most recently updated first.
  const escalatedTickets = useMemo(
    () =>
      [...tickets]
        .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
        .slice(0, 6),
    [tickets],
  );

  const isLoading = dashLoading || assignedLoading;
  const isError = dashError || assignedError;
  const refetch = () => {
    void refetchDash();
    void refetchAssigned();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="L2 Resolver"
        description="Work escalated tickets, respond to awaiting items, and track resolution performance."
        actions={
          <Button asChild variant="outline">
            <Link
              to="/agent/tickets"
              data-ocid="l2_dashboard.open_assigned_button"
            >
              <Inbox className="mr-2 h-4 w-4" />
              My Assigned Tickets
            </Link>
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Escalated To Me"
          value={escalatedToMe}
          icon={TrendingUp}
          tone="danger"
          hint="Tickets escalated to you for resolution"
          trend={escalatedToMe > 0 ? "up" : "neutral"}
          trendLabel={escalatedToMe > 0 ? "active" : "clear"}
        />
        <KpiCard
          label="Awaiting My Response"
          value={awaitingResponse}
          icon={MessageCircle}
          tone="accent"
          hint="Tickets waiting on your reply or action"
          trend={awaitingResponse > 0 ? "up" : "neutral"}
          trendLabel={awaitingResponse > 0 ? "pending" : "clear"}
        />
        <KpiCard
          label="SLA Breach Risk"
          value={slaBreachRisk}
          icon={ShieldAlert}
          tone="warning"
          hint="Tickets at risk of missing resolution SLA"
          trend={slaBreachRisk > 0 ? "up" : "neutral"}
          trendLabel={slaBreachRisk > 0 ? "watch" : "clear"}
        />
        <KpiCard
          label="Avg Resolution Time"
          value={formatDurationNs(avgResolutionNs)}
          icon={Gauge}
          tone="primary"
          hint={`Resolved ${resolvedCount} ticket${resolvedCount === 1 ? "" : "s"}`}
        />
      </div>

      {/* Escalated tickets assigned to me */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle>Escalated Tickets Assigned To Me</CardTitle>
            <CardDescription>
              The most recently updated tickets escalated to you for resolution.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/agent/tickets" data-ocid="l2_dashboard.view_all_link">
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
              title="Unable to load tickets"
              description="There was a problem fetching your escalated tickets."
              onRetry={refetch}
            />
          ) : escalatedTickets.length === 0 ? (
            <EmptyState
              size="sm"
              icon={Inbox}
              title="No escalated tickets"
              description="Tickets escalated to you will appear here for resolution."
            />
          ) : (
            <ul className="divide-y">
              {escalatedTickets.map((t, idx) => (
                <li key={String(t.id)}>
                  <Link
                    to="/agent/tickets/$id"
                    params={{ id: String(t.id) }}
                    data-ocid={`l2_dashboard.escalated_ticket.${idx}`}
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
                        <span>Updated {safeFromNow(t.updatedAt)}</span>
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
        {escalatedTickets.length > 0 && (
          <CardFooter className="justify-end border-t bg-muted/20 py-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agent/tickets">Open my assigned tickets</Link>
            </Button>
          </CardFooter>
        )}
      </Card>

      {slaBreachRisk > 0 && (
        <output
          className="flex items-start gap-3 rounded-lg border border-[oklch(var(--sla-at-risk)/0.3)] bg-[oklch(var(--sla-at-risk)/0.08)] p-4"
          data-ocid="l2_dashboard.sla_alert"
        >
          <Clock
            className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(var(--sla-at-risk))]"
            aria-hidden
          />
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {slaBreachRisk} ticket{slaBreachRisk === 1 ? "" : "s"} at risk of
              SLA breach
            </p>
            <p className="text-xs text-muted-foreground">
              Prioritize these tickets to meet resolution-time SLAs before the
              deadline passes.
            </p>
          </div>
        </output>
      )}
    </div>
  );
}

export default L2ResolverDashboard;
