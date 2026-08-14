import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UserTypes "../types/users";
import TicketTypes "../types/tickets";
import AuditTypes "../types/audit";
import NotificationTypes "../types/notifications";
import RoleTypes "../types/roles";
import RoleLib "../lib/roles";
import TicketLib "../lib/tickets";
import AuditLib "../lib/audit";
import NotificationLib "../lib/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<Common.UserId, UserTypes.User>,
  tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
  auditLogs : List.List<AuditTypes.AuditLog>,
  nextAuditLogId : { var next : Common.AuditLogId },
  notifications : List.List<NotificationTypes.Notification>,
  nextNotificationId : { var next : Common.NotificationId },
) {
  // Public API for the four-role ITSM model. Implements the role-dashboard,
  // queue, escalation, and navigation endpoints against the live ticket and
  // user state.

  // Resolve the caller's business role from the User record. Falls back to
  // #admin if access control says the caller is an admin but no User record
  // exists yet (defensive); null if the caller is anonymous.
  func resolveCallerRole(caller : Common.UserId) : ?Common.AppRole {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      switch (users.get(caller)) {
        case (?u) ?u.role;
        case null ?#admin;
      };
    } else {
      switch (users.get(caller)) {
        case (?u) ?u.role;
        case null null;
      };
    };
  };

  // Query the caller's resolver tier. Returns null for non-resolver roles
  // (#employee, #admin).
  public query ({ caller }) func getCallerResolverTier() : async ?Common.ResolverTier {
    requireRolesRegistered(caller);
    switch (resolveCallerRole(caller)) {
      case (?role) RoleLib.resolverTierOf(role);
      case null null;
    };
  };

  // Query the caller's role dashboard: default queue ticket count plus the
  // role's KPI set. Available to all authenticated users; the dashboard is
  // scoped to the caller's role.
  public query ({ caller }) func getMyRoleDashboard() : async RoleTypes.RoleDashboard {
    requireRolesRegistered(caller);
    let role = resolveCallerRole(caller) ?? #employee;
    let now = Int.abs(Time.now());
    RoleLib.buildRoleDashboard(tickets, users, caller, role, now);
  };

  // Query the caller's default resolver queue tickets. L1 sees new/unassigned/
  // in-triage tickets; L2 sees escalated/complex tickets. Requires the caller
  // to be a resolver role (#l1_help_desk or #l2_resolver) or admin.
  public query ({ caller }) func getMyQueueTickets() : async [TicketTypes.TicketView] {
    requireRolesRegistered(caller);
    RoleLib.requireResolverOrAdmin(caller, users);
    let role = resolveCallerRole(caller) ?? #employee;
    let queueOpt = RoleLib.defaultQueueFor(role);
    // Admins default to the L1 queue view (intake load); resolvers get their
    // own tier's queue.
    let queue : RoleTypes.ResolverQueue = queueOpt ?? #l1Default;
    RoleLib.listQueueTickets(tickets, caller, queue);
  };

  // Query the navigation set for the caller's role. Available to all
  // authenticated users; the frontend renders the sidebar per the caller's
  // role.
  public query ({ caller }) func getMyRoleNavigation() : async RoleTypes.RoleNavigation {
    requireRolesRegistered(caller);
    let role = resolveCallerRole(caller) ?? #employee;
    RoleLib.buildRoleNavigation(role, tickets, caller);
  };

  // Escalate a ticket from L1 to L2. Requires the caller to be a resolver
  // role or admin. Records an audit-log entry and notifies the newly-assigned
  // L2 agent (if any). Returns the updated ticket view.
  public shared ({ caller }) func escalateTicket(
    ticketId : Common.TicketId,
    reason : Text,
  ) : async TicketTypes.TicketView {
    requireRolesRegistered(caller);
    RoleLib.requireResolverOrAdmin(caller, users);
    let now = Int.abs(Time.now());
    let ticket = switch (tickets.get(ticketId)) {
      case (?t) t;
      case null Runtime.trap("Not found: ticket does not exist");
    };
    // Pick an available L2 agent to assign the escalated ticket to.
    let l2Agent = RoleLib.pickAvailableAgentByTier(users, tickets, #l2);
    ticket.assignedAgent := l2Agent;
    ticket.updatedAt := now;
    // Notify the newly-assigned L2 agent (if any).
    switch (l2Agent) {
      case (?aId) {
        ignore NotificationLib.createNotification(
          notifications, nextNotificationId, aId, #ticketAssigned,
          "Ticket #" # Nat.toText(ticket.id) # " escalated to you: " # reason,
          ?ticket.id, now,
        );
      };
      case null {};
    };
    ignore AuditLib.record(
      auditLogs, nextAuditLogId, caller, #ticketAssigned,
      "ticket:" # Nat.toText(ticket.id),
      "Escalated to L2: " # reason, now,
    );
    ticket.toView();
  };

  // Admin-only: list agents filtered by resolver tier. Pass null for all
  // resolver roles, #l1 for L1 help desk agents, #l2 for L2 resolver agents.
  public query ({ caller }) func listAgentsByTier(
    tier : ?Common.ResolverTier,
  ) : async [UserTypes.AgentSummary] {
    requireRolesAdmin(caller);
    RoleLib.listAgentsByTier(users, tickets, tier);
  };

  // --- Helpers ---

  // Require a registered (non-anonymous, known to access control) caller.
  func requireRolesRegistered(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: caller is anonymous");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?_) {};
      case null {
        Runtime.trap("Unauthorized: caller is not a registered user");
      };
    };
  };

  // Admin-only guard.
  func requireRolesAdmin(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: caller is anonymous");
    };
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can perform this action");
    };
  };
};
