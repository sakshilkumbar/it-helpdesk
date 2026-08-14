import { useAuth } from "@/hooks/useAuth";
import { ResolverTier } from "@/types";
import { L1HelpDeskDashboard } from "./L1HelpDeskDashboard";
import { L2ResolverDashboard } from "./L2ResolverDashboard";

/**
 * AgentDashboard — dispatcher for resolver-tier dashboards.
 *
 * The /agent/dashboard route is shared by L1 and L2 resolver roles. This
 * component reads the caller's resolverTier from useAuth and renders the
 * appropriate role-specific dashboard. Admins viewing the agent workspace
 * default to the L1 view (the L1 intake queue is the most general surface).
 *
 * While the tier is still loading, a neutral loading shell is shown so the
 * page does not flash the wrong dashboard.
 */
export function AgentDashboard() {
  const { resolverTier, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <output
        className="flex items-center justify-center py-24"
        data-ocid="agent_dashboard.loading"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
            aria-hidden
          />
          Loading your workspace…
        </div>
      </output>
    );
  }

  if (resolverTier === ResolverTier.l2) {
    return <L2ResolverDashboard />;
  }

  // L1 tier, admin viewers, and unknown tiers all land on the L1 dashboard.
  return <L1HelpDeskDashboard />;
}

export default AgentDashboard;
