import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";

import { withRoleGuard } from "@/components/auth/withRoleGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { roleHomePath } from "@/lib/roleHelpers";
import { AppRole } from "@/types";

const Login = lazy(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const EmployeeDashboard = lazy(() =>
  import("@/pages/employee/EmployeeDashboard").then((m) => ({
    default: m.EmployeeDashboard,
  })),
);
const CreateTicket = lazy(() =>
  import("@/pages/employee/CreateTicket").then((m) => ({
    default: m.CreateTicket,
  })),
);
const TicketHistory = lazy(() =>
  import("@/pages/employee/TicketHistory").then((m) => ({
    default: m.TicketHistory,
  })),
);
const TicketDetail = lazy(() =>
  import("@/pages/employee/TicketDetail").then((m) => ({
    default: m.TicketDetail,
  })),
);
const AgentDashboard = lazy(() =>
  import("@/pages/agent/AgentDashboard").then((m) => ({
    default: m.AgentDashboard,
  })),
);
const AgentTicketDetail = lazy(() =>
  import("@/pages/agent/AgentTicketDetail").then((m) => ({
    default: m.AgentTicketDetail,
  })),
);
const AdminTickets = lazy(() =>
  import("@/pages/admin/AdminTickets").then((m) => ({ default: m.default })),
);
const AgentTickets = lazy(() =>
  import("@/pages/admin/AdminTickets").then((m) => ({ default: m.default })),
);
const AdminTicketDetail = lazy(() =>
  import("@/pages/agent/AgentTicketDetail").then((m) => ({
    default: m.AgentTicketDetail,
  })),
);
const AdminDashboard = lazy(() =>
  import("@/pages/admin/AdminDashboard").then((m) => ({ default: m.default })),
);
const Analytics = lazy(() =>
  import("@/pages/admin/Analytics").then((m) => ({ default: m.default })),
);
const Users = lazy(() =>
  import("@/pages/admin/Users").then((m) => ({ default: m.default })),
);
const Agents = lazy(() =>
  import("@/pages/admin/Agents").then((m) => ({ default: m.default })),
);
const SLA = lazy(() =>
  import("@/pages/admin/SLA").then((m) => ({ default: m.default })),
);
const AuditLogs = lazy(() =>
  import("@/pages/admin/AuditLogs").then((m) => ({ default: m.default })),
);
const Categories = lazy(() =>
  import("@/pages/admin/Categories").then((m) => ({ default: m.default })),
);
const Priorities = lazy(() =>
  import("@/pages/admin/Priorities").then((m) => ({ default: m.default })),
);
const Settings = lazy(() =>
  import("@/pages/admin/Settings").then((m) => ({ default: m.default })),
);
const KnowledgeBase = lazy(() =>
  import("@/pages/admin/KnowledgeBase").then((m) => ({ default: m.default })),
);

const rootRoute = createRootRoute({
  component: () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
      // Root renders login shell; route guards handle redirects
      return <Outlet />;
    }
    return <AppLayout />;
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => {
    const { isAuthenticated, role } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <Navigate to={roleHomePath(role)} />;
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => {
    const { isAuthenticated, role } = useAuth();
    if (isAuthenticated) {
      return <Navigate to={roleHomePath(role)} />;
    }
    return (
      <Suspense fallback={null}>
        <Login />
      </Suspense>
    );
  },
});

const empDashboard = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employee/dashboard",
  component: withRoleGuard([AppRole.employee], EmployeeDashboard),
});

const empNewTicket = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employee/tickets/new",
  component: withRoleGuard([AppRole.employee], CreateTicket),
});

const empTickets = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employee/tickets",
  component: withRoleGuard([AppRole.employee], TicketHistory),
});

const empTicketDetail = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employee/tickets/$id",
  component: withRoleGuard([AppRole.employee], TicketDetail),
});

const agentDashboard = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agent/dashboard",
  component: withRoleGuard(
    [AppRole.l1_help_desk, AppRole.l2_resolver, AppRole.admin],
    AgentDashboard,
  ),
});

const agentTicketDetail = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agent/tickets/$id",
  component: withRoleGuard(
    [AppRole.l1_help_desk, AppRole.l2_resolver, AppRole.admin],
    AgentTicketDetail,
  ),
});

const agentTickets = createRoute({
  getParentRoute: () => rootRoute,
  path: "/agent/tickets",
  component: withRoleGuard(
    [AppRole.l1_help_desk, AppRole.l2_resolver, AppRole.admin],
    AgentTickets,
  ),
});

const adminTickets = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/tickets",
  component: withRoleGuard([AppRole.admin], AdminTickets),
});

const adminTicketDetail = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/tickets/$id",
  component: withRoleGuard(
    [AppRole.admin, AppRole.l1_help_desk, AppRole.l2_resolver],
    AdminTicketDetail,
  ),
});

const adminDashboard = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: withRoleGuard([AppRole.admin], AdminDashboard),
});

const adminUsers = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  component: withRoleGuard([AppRole.admin], Users),
});

const adminAgents = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/agents",
  component: withRoleGuard([AppRole.admin], Agents),
});

const adminAnalytics = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/analytics",
  component: withRoleGuard([AppRole.admin], Analytics),
});

const adminSla = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/sla",
  component: withRoleGuard([AppRole.admin], SLA),
});

const adminAuditLogs = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/audit-logs",
  component: withRoleGuard([AppRole.admin], AuditLogs),
});

const adminCategories = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/categories",
  component: withRoleGuard([AppRole.admin], Categories),
});

const adminPriorities = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/priorities",
  component: withRoleGuard([AppRole.admin], Priorities),
});

const adminKnowledgeBase = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/knowledge-base",
  component: withRoleGuard([AppRole.admin], KnowledgeBase),
});

const adminSettings = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: withRoleGuard([AppRole.admin], Settings),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  empDashboard,
  empNewTicket,
  empTickets,
  empTicketDetail,
  agentDashboard,
  agentTicketDetail,
  agentTickets,
  adminDashboard,
  adminTickets,
  adminTicketDetail,
  adminUsers,
  adminAgents,
  adminAnalytics,
  adminSla,
  adminAuditLogs,
  adminCategories,
  adminPriorities,
  adminKnowledgeBase,
  adminSettings,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  // Router created at module level — stable across renders.
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
