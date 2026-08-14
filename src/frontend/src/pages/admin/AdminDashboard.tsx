import { Link } from "@tanstack/react-router";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  InboxIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ErrorState,
  KpiCard,
  ListRowSkeleton,
  PageHeader,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useAgents,
  useAuditLogs,
  useCategories,
  usePriorities,
  useSLAStatuses,
  useTicketAnalytics,
} from "@/hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  open: "oklch(0.55 0.12 230)",
  in_progress: "oklch(0.72 0.15 65)",
  pending: "oklch(0.6 0.1 280)",
  resolved: "oklch(0.55 0.14 155)",
  closed: "oklch(0.5 0.012 230)",
};

const CATEGORY_PALETTE = [
  "oklch(0.42 0.09 200)",
  "oklch(0.72 0.15 65)",
  "oklch(0.55 0.14 155)",
  "oklch(0.6 0.1 280)",
  "oklch(0.55 0.12 230)",
  "oklch(0.7 0.13 75)",
  "oklch(0.5 0.012 230)",
  "oklch(0.62 0.2 22)",
];

const AI_FEATURES = [
  {
    id: "auto-classification",
    title: "Automatic Ticket Classification",
    description: "Categorize incoming tickets automatically based on content.",
  },
  {
    id: "priority-prediction",
    title: "Priority Prediction",
    description: "Predict ticket priority from initial message context.",
  },
  {
    id: "duplicate-detection",
    title: "Duplicate-Ticket Detection",
    description: "Flag potential duplicates before assignment.",
  },
  {
    id: "suggested-solutions",
    title: "Suggested Solutions",
    description: "Surface relevant knowledge-base solutions for agents.",
  },
  {
    id: "ai-chatbot",
    title: "AI Knowledge-Base Chatbot",
    description: "Self-service assistant for common support questions.",
  },
];

const QUICK_LINKS = [
  {
    title: "User Management",
    description: "Manage roles, approvals, and access.",
    icon: UsersIcon,
    href: "/admin/users",
  },
  {
    title: "Audit Logs",
    description: "Review system activity and changes.",
    icon: ScrollTextIcon,
    href: "/admin/audit-logs",
  },
  {
    title: "SLA Monitoring",
    description: "Track response and resolution SLAs.",
    icon: ShieldCheckIcon,
    href: "/admin/sla",
  },
  {
    title: "Settings",
    description: "Configure workspace preferences.",
    icon: SettingsIcon,
    href: "/admin/settings",
  },
];

export default function AdminDashboard() {
  const { data: analytics, isLoading, isError, refetch } = useTicketAnalytics();
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();
  const { data: slaStatuses } = useSLAStatuses();
  const { data: auditLogs } = useAuditLogs();
  const { data: agents } = useAgents();

  const priorityColor = (id: bigint): string => {
    const p = priorities?.find((pr) => pr.id === id);
    if (!p) return "oklch(0.7 0.008 230)";
    const name = p.name.toLowerCase();
    if (name.includes("critical") || name.includes("urgent"))
      return "oklch(0.55 0.22 25)";
    if (name.includes("high")) return "oklch(0.72 0.15 65)";
    if (name.includes("medium")) return "oklch(0.42 0.09 200)";
    if (name.includes("low")) return "oklch(0.55 0.14 155)";
    return "oklch(0.7 0.008 230)";
  };

  const statusData = useMemo(() => {
    if (!analytics?.byStatus) return [];
    return analytics.byStatus.map(([name, value]) => ({
      name,
      value: Number(value),
    }));
  }, [analytics]);

  const priorityData = useMemo(() => {
    if (!analytics?.byPriority) return [];
    return analytics.byPriority.map(([id, value]) => ({
      id,
      name: priorities?.find((pr) => pr.id === id)?.name ?? `Priority ${id}`,
      value: Number(value),
    }));
  }, [analytics, priorities]);

  const categoryData = useMemo(() => {
    if (!analytics?.byCategory) return [];
    return analytics.byCategory.map(([id, value], idx) => ({
      id,
      name: categories?.find((c) => c.id === id)?.name ?? `Category ${id}`,
      value: Number(value),
      fill: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length],
    }));
  }, [analytics, categories]);

  const openTickets = useMemo(() => {
    if (!analytics?.byStatus) return 0;
    const count = (status: string) =>
      Number(analytics.byStatus.find(([s]) => s === status)?.[1] ?? 0n);
    return count("open") + count("in_progress");
  }, [analytics]);

  const resolvedTickets = useMemo(() => {
    if (!analytics?.byStatus) return 0;
    const count = (status: string) =>
      Number(analytics.byStatus.find(([s]) => s === status)?.[1] ?? 0n);
    return count("resolved") + count("closed");
  }, [analytics]);

  const totalTickets = analytics ? Number(analytics.totalTickets) : 0;

  // "breached" is not a TicketStatus; SLA breaches are tracked separately.
  const breachedSla = useMemo(
    () => slaStatuses?.filter((s) => s.isBreached).length ?? 0,
    [slaStatuses],
  );
  const atRiskSla = useMemo(
    () => slaStatuses?.filter((s) => s.isAtRisk).length ?? 0,
    [slaStatuses],
  );

  const recentAuditLogs = useMemo(() => {
    if (!auditLogs) return [];
    return auditLogs.slice(0, 5);
  }, [auditLogs]);

  // Agent workload distribution — sorted by assigned count, descending.
  const agentWorkload = useMemo(() => {
    if (!agents) return [];
    return [...agents]
      .sort(
        (a, b) => Number(b.assignedTicketCount) - Number(a.assignedTicketCount),
      )
      .slice(0, 8);
  }, [agents]);

  const maxAssigned = useMemo(
    () =>
      agentWorkload.reduce(
        (m, a) => Math.max(m, Number(a.assignedTicketCount)),
        0,
      ),
    [agentWorkload],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Operational overview of tickets, SLAs, agent workload, and system activity."
      />

      {/* KPI summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Tickets"
          value={isLoading ? "—" : totalTickets.toLocaleString()}
          icon={TicketIcon}
          tone="primary"
          hint="All-time tickets"
        />
        <KpiCard
          label="Open Tickets"
          value={isLoading ? "—" : openTickets.toLocaleString()}
          icon={InboxIcon}
          tone="info"
          hint="Open + in progress"
          trend={openTickets > 0 ? "up" : "neutral"}
          trendLabel={openTickets > 0 ? "active" : "clear"}
        />
        <KpiCard
          label="Resolved Tickets"
          value={isLoading ? "—" : resolvedTickets.toLocaleString()}
          icon={CheckCircle2Icon}
          tone="success"
          hint="Resolved + closed"
          trend={resolvedTickets > 0 ? "up" : "neutral"}
          trendLabel={resolvedTickets > 0 ? "done" : "none"}
        />
        <KpiCard
          label="Breached SLA"
          value={breachedSla}
          icon={AlertTriangleIcon}
          tone="danger"
          hint={`${atRiskSla} at risk`}
          trend={breachedSla > 0 ? "up" : "neutral"}
          trendLabel={breachedSla > 0 ? "breaches" : "clear"}
        />
      </div>

      {isError && (
        <ErrorState
          size="sm"
          title="Unable to load analytics"
          description="There was a problem fetching ticket analytics."
          onRetry={() => void refetch()}
        />
      )}

      {/* Mini analytics charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base">Tickets by Status</CardTitle>
            <CardDescription>
              Distribution across current ticket states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={String(entry.name)}
                        fill={
                          STATUS_COLORS[String(entry.name)] ??
                          "oklch(0.7 0.008 230)"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid oklch(var(--border))",
                      background: "oklch(var(--popover))",
                      color: "oklch(var(--popover-foreground))",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base">Tickets by Priority</CardTitle>
            <CardDescription>Volume grouped by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="oklch(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "oklch(var(--muted))", opacity: 0.4 }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid oklch(var(--border))",
                      background: "oklch(var(--popover))",
                      color: "oklch(var(--popover-foreground))",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {priorityData.map((entry) => (
                      <Cell
                        key={String(entry.id)}
                        fill={priorityColor(entry.id)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category breakdown + Agent workload */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base">Tickets by Category</CardTitle>
            <CardDescription>Volume grouped by ticket category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No category data available
              </div>
            ) : (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="oklch(var(--border))"
                    />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      width={120}
                      tick={{
                        fontSize: 12,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "oklch(var(--muted))", opacity: 0.4 }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid oklch(var(--border))",
                        background: "oklch(var(--popover))",
                        color: "oklch(var(--popover-foreground))",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {categoryData.map((entry) => (
                        <Cell key={String(entry.id)} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Agent Workload</CardTitle>
              <CardDescription>Assigned tickets per agent</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/admin/agents"
                data-ocid="admin_dashboard.view_agents_link"
              >
                View agents
                <ArrowRightIcon className="ml-1 h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!agents ? (
              <ListRowSkeleton rows={5} />
            ) : agentWorkload.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No agents to display
              </div>
            ) : (
              <ul className="space-y-3">
                {agentWorkload.map((agent, idx) => {
                  const assigned = Number(agent.assignedTicketCount);
                  const resolved = Number(agent.resolvedTicketCount);
                  const pct =
                    maxAssigned > 0 ? (assigned / maxAssigned) * 100 : 0;
                  return (
                    <li
                      key={String(agent.agentId)}
                      data-ocid={`admin_dashboard.agent_workload.${idx}`}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate font-medium">
                          {agent.displayName}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {assigned} assigned · {resolved} resolved
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-smooth"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent audit logs + Quick links */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-subtle lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Recent Audit Log Activity
            </CardTitle>
            <CardDescription>Last 5 recorded system events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {!auditLogs ? (
              <ListRowSkeleton rows={5} />
            ) : recentAuditLogs.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No recent activity
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentAuditLogs.map((log, idx) => (
                  <li
                    key={`${log.timestamp}-${idx}`}
                    className="flex items-start gap-3 py-2.5"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <ScrollTextIcon
                        className="h-3.5 w-3.5 text-muted-foreground"
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight">
                        {log.action}
                      </p>
                      {log.detail ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {log.detail}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/admin/audit-logs"
                data-ocid="admin_dashboard.view_logs_link"
              >
                View all logs
                <ArrowRightIcon className="ml-1 h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base">Quick Links</CardTitle>
            <CardDescription>Jump to management areas</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  to={link.href}
                  data-ocid={`admin_dashboard.quick_link.${link.title.toLowerCase().replace(/\s+/g, "_")}`}
                  className="group flex items-center gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                    <Icon className="h-4 w-4 text-foreground" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">
                      {link.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRightIcon
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* AI features placeholder — full AI logic is out of scope; placeholder remains. */}
      <Card className="shadow-subtle border-dashed">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                <SparklesIcon
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden
                />
              </div>
              <div>
                <CardTitle className="text-base">AI Features</CardTitle>
                <CardDescription>
                  Planned intelligent capabilities
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <SparklesIcon className="h-3 w-3" aria-hidden />
              Coming soon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <fieldset
            className="rounded-md border border-dashed bg-muted/30 p-3"
            aria-label="AI features coming soon"
          >
            <p className="mb-3 text-sm text-muted-foreground">
              The following AI capabilities are planned for a future release.
              Toggles are disabled until each capability is enabled.
            </p>
            <Separator className="mb-3" />
            <ul className="space-y-3">
              {AI_FEATURES.map((feature) => (
                <li
                  key={feature.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <span
                    className="inline-flex h-5 w-9 shrink-0 cursor-not-allowed items-center rounded-full bg-muted px-0.5"
                    aria-disabled="true"
                    aria-label={`${feature.title} toggle disabled`}
                    role="switch"
                    aria-checked="false"
                    tabIndex={-1}
                  >
                    <span className="h-4 w-4 translate-x-0 rounded-full bg-background shadow-sm" />
                  </span>
                </li>
              ))}
            </ul>
          </fieldset>
        </CardContent>
      </Card>
    </div>
  );
}
