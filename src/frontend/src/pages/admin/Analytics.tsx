import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCategories,
  usePriorities,
  useTicketAnalytics,
} from "@/hooks/useQueries";
import { DownloadIcon, PrinterIcon, TicketIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  open: "#3b82f6",
  in_progress: "#f59e0b",
  pending: "#a855f7",
  resolved: "#10b981",
  closed: "#6b7280",
};

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  color: "hsl(var(--popover-foreground))",
};

export default function Analytics() {
  const { data: analytics, isLoading } = useTicketAnalytics();
  const { data: categories } = useCategories();
  const { data: priorities } = usePriorities();

  const categoryName = useCallback(
    (id: bigint) => categories?.find((c) => c.id === id)?.name ?? String(id),
    [categories],
  );

  const priorityName = useCallback(
    (id: bigint) => priorities?.find((p) => p.id === id)?.name ?? String(id),
    [priorities],
  );

  const categoryColor = (id: bigint) => {
    const name = categoryName(id).toLowerCase();
    if (name.includes("network")) return "#3b82f6";
    if (name.includes("hardware")) return "#f59e0b";
    if (name.includes("software")) return "#22c55e";
    if (name.includes("security")) return "#dc2626";
    return "#94a3b8";
  };

  const priorityColor = (id: bigint) => {
    const name = priorityName(id).toLowerCase();
    if (name.includes("critical") || name.includes("urgent")) return "#dc2626";
    if (name.includes("high")) return "#f59e0b";
    if (name.includes("medium")) return "#3b82f6";
    if (name.includes("low")) return "#10b981";
    return "#94a3b8";
  };

  const statusData = useMemo(() => {
    if (!analytics?.byStatus) return [];
    return analytics.byStatus.map(([name, value]) => ({
      name,
      value: Number(value),
    }));
  }, [analytics]);

  const categoryData = useMemo(() => {
    if (!analytics?.byCategory) return [];
    return analytics.byCategory.map(([id, value]) => ({
      id: BigInt(id),
      name: categoryName(BigInt(id)),
      value: Number(value),
    }));
  }, [analytics, categoryName]);

  const priorityData = useMemo(() => {
    if (!analytics?.byPriority) return [];
    return analytics.byPriority.map(([id, value]) => ({
      id: BigInt(id),
      name: priorityName(BigInt(id)),
      value: Number(value),
    }));
  }, [analytics, priorityName]);

  const createdOverTimeData = useMemo(() => {
    if (!analytics?.createdOverTime) return [];
    return analytics.createdOverTime.map(([ts, count]: [any, any]) => ({
      date: new Date(Number(ts) / 1e6).toLocaleDateString(),
      tickets: Number(count),
    }));
  }, [analytics]);

  const totalTickets = analytics?.totalTickets ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ticket Analytics"
        description="Comprehensive view of ticket volume, distribution, and trends."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled aria-disabled="true">
              <PrinterIcon className="mr-1.5 h-4 w-4" aria-hidden />
              Print
            </Button>
            <Button variant="default" size="sm" disabled aria-disabled="true">
              <DownloadIcon className="mr-1.5 h-4 w-4" aria-hidden />
              Export
            </Button>
          </div>
        }
      />

      {/* Total tickets KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tickets
            </CardTitle>
            <TicketIcon className="h-4 w-4 text-foreground" aria-hidden />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-3xl font-semibold tracking-tight">
              {isLoading ? "—" : totalTickets.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              All recorded tickets
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-3xl font-semibold tracking-tight">
              {isLoading ? "—" : statusData.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Distinct ticket states
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-3xl font-semibold tracking-tight">
              {isLoading ? "—" : categoryData.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active categories
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Priority Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-3xl font-semibold tracking-tight">
              {isLoading ? "—" : priorityData.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tracked priorities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Tickets by status — donut */}
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base">Tickets by Status</CardTitle>
            <CardDescription>Distribution across ticket states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={String(entry.name)}
                        fill={STATUS_COLORS[String(entry.name)] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
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

        {/* Tickets by category — bar */}
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base">Tickets by Category</CardTitle>
            <CardDescription>
              Volume grouped by support category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {categoryData.map((entry) => (
                      <Cell
                        key={String(entry.id)}
                        fill={categoryColor(entry.id)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tickets by priority — bar */}
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base">Tickets by Priority</CardTitle>
            <CardDescription>Volume grouped by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    contentStyle={tooltipStyle}
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

        {/* Tickets created over time — area */}
        <Card className="shadow-subtle lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Tickets Created Over Time
            </CardTitle>
            <CardDescription>Trend of new ticket creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={createdOverTimeData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="createdGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#createdGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
