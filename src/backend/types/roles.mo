import Common "common";

module {
  // Domain-specific type definitions for the four-role ITSM model. The single
  // #support_agent role is replaced by two distinct resolver roles:
  //   - #l1_help_desk : first-line triage, ticket intake, basic resolution
  //   - #l2_resolver   : escalated, specialized resolution
  // These types define the queue scoping, KPI sets, and escalation rules that
  // distinguish L1 from L2. The develop phase implements the logic in
  // lib/roles.mo and exposes it through mixins/roles-api.mo.

  // The default ticket queue a resolver role sees on its dashboard. L1 sees
  // new/unassigned/triage tickets; L2 sees escalated/complex tickets.
  public type ResolverQueue = {
    #l1Default; // new, unassigned, in-triage tickets
    #l2Default; // escalated, complex tickets
  };

  // KPI definition for a role dashboard. Each role has its own KPI set; the
  // develop phase computes the values from live ticket state.
  public type RoleKPI = {
    name : Text; // e.g. "Open tickets", "Avg resolution time"
    value : Nat; // the computed metric value
  };

  // Dashboard summary for a given role. Combines the role's default queue
  // ticket count with its KPI set. Returned by the role-dashboard endpoint.
  public type RoleDashboard = {
    role : Common.AppRole;
    queue : ResolverQueue;
    queueTicketCount : Nat;
    kpis : [RoleKPI];
  };

  // Escalation rule: defines when a ticket should escalate from L1 to L2.
  // The develop phase evaluates these rules against a ticket's state.
  public type EscalationRule = {
    ticketId : Common.TicketId;
    fromTier : Common.ResolverTier; // #l1
    toTier : Common.ResolverTier; // #l2
    reason : Text; // e.g. "Complex category", "SLA at risk", "Manual escalation"
  };

  // Assignment rule result: which resolver tier a new ticket should be
  // assigned to, and the specific agent chosen within that tier.
  public type AssignmentResult = {
    tier : Common.ResolverTier;
    agentId : ?Common.UserId; // null if no active agent in that tier
  };

  // Navigation item for a role's sidebar. Each role has its own navigation
  // set; the frontend renders these per the caller's role.
  public type NavItem = {
    name : Text;
    route : Text;
    badgeCount : ?Nat; // optional count badge (e.g. assigned ticket count)
  };

  // The full navigation set for a role.
  public type RoleNavigation = {
    role : Common.AppRole;
    items : [NavItem];
  };
};
