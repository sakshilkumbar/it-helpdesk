import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Int64 "mo:core/Int64";
import Nat64 "mo:core/Nat64";
import Common "../types/common";
import UserTypes "../types/users";
import TicketTypes "../types/tickets";
import RoleTypes "../types/roles";
import TicketLib "../lib/tickets";
import UserLib "../lib/users";

module {
  // Domain logic for the four-role ITSM model. Stateless module; state is
  // injected by the mixin. Implements role classification, tier-based
  // assignment, escalation evaluation, queue scoping, KPI computation, and
  // per-role navigation.

  // Classify an AppRole into its resolver tier. Returns null for non-resolver
  // roles (#employee, #admin).
  public func resolverTierOf(role : Common.AppRole) : ?Common.ResolverTier {
    switch (role) {
      case (#l1_help_desk) ?#l1;
      case (#l2_resolver) ?#l2;
      case (#employee) null;
      case (#admin) null;
    };
  };

  // Whether an AppRole is a resolver role (#l1_help_desk or #l2_resolver).
  public func isResolverRole(role : Common.AppRole) : Bool {
    switch (role) {
      case (#l1_help_desk) true;
      case (#l2_resolver) true;
      case (#employee) false;
      case (#admin) false;
    };
  };

  // Map an AppRole to its default resolver queue. Returns null for non-resolver
  // roles.
  public func defaultQueueFor(role : Common.AppRole) : ?RoleTypes.ResolverQueue {
    switch (role) {
      case (#l1_help_desk) ?#l1Default;
      case (#l2_resolver) ?#l2Default;
      case (#employee) null;
      case (#admin) null;
    };
  };

  // Pick the active agent within a given resolver tier who has the fewest
  // currently-assigned open tickets. Returns null if no active agent exists in
  // that tier.
  public func pickAvailableAgentByTier(
    users : Map.Map<Common.UserId, UserTypes.User>,
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
    tier : Common.ResolverTier,
  ) : ?Common.UserId {
    let targetRole : Common.AppRole = switch (tier) {
      case (#l1) #l1_help_desk;
      case (#l2) #l2_resolver;
    };
    let agents = users.toArray().filter(func((_, u) : (Common.UserId, UserTypes.User)) : Bool {
      u.role == targetRole and u.isActive;
    });
    if (agents.size() == 0) { return null };
    var bestAgent : ?Common.UserId = null;
    var bestCount : Nat = 0;
    var first = true;
    for ((aId, _) in agents.values()) {
      var count : Nat = 0;
      for ((_, t) in tickets.toArray().values()) {
        switch (t.assignedAgent) {
          case (?a) {
            if (a == aId and (t.status == #open or t.status == #in_progress or t.status == #pending)) {
              count += 1;
            };
          };
          case null {};
        };
      };
      if (first or count < bestCount) {
        bestAgent := ?aId;
        bestCount := count;
        first := false;
      };
    };
    bestAgent;
  };

  // Decide which resolver tier a new ticket should be assigned to based on its
  // category and priority. L1 handles standard intake; L2 handles complex or
  // high-priority categories. Returns the AssignmentResult including the
  // chosen agent within that tier.
  //
  // Routing rule: Critical priority (priorityId 4) or Security category
  // (categoryId 6) routes to L2 (escalated/specialized). Everything else
  // routes to L1 (first-line triage).
  public func assignTicketByTier(
    users : Map.Map<Common.UserId, UserTypes.User>,
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
    categoryId : Common.CategoryId,
    priorityId : Common.PriorityId,
  ) : RoleTypes.AssignmentResult {
    let tier : Common.ResolverTier = if (priorityId == 4 or categoryId == 6) {
      #l2;
    } else {
      #l1;
    };
    let agent = pickAvailableAgentByTier(users, tickets, tier);
    { tier; agentId = agent };
  };

  // Evaluate whether a ticket should escalate from L1 to L2 based on its
  // current state. Returns an EscalationRule when escalation is warranted,
  // null otherwise.
  //
  // Escalation triggers:
  //   - SLA breached (now > slaDeadline) and ticket still open/in-progress/pending
  //   - Critical priority (priorityId 4) still in #open after intake
  //   - Security category (categoryId 6)
  public func evaluateEscalation(
    ticket : TicketTypes.Ticket,
    now : Common.Timestamp,
  ) : ?RoleTypes.EscalationRule {
    let isOpen = ticket.status == #open or ticket.status == #in_progress or ticket.status == #pending;
    if (not isOpen) { return null };
    let slaBreached = now > ticket.slaDeadline;
    if (slaBreached) {
      return ?{
        ticketId = ticket.id;
        fromTier = #l1;
        toTier = #l2;
        reason = "SLA breached — escalated to L2 for specialized resolution";
      };
    };
    if (ticket.priorityId == 4 and ticket.status == #open) {
      return ?{
        ticketId = ticket.id;
        fromTier = #l1;
        toTier = #l2;
        reason = "Critical priority ticket requires L2 specialized handling";
      };
    };
    if (ticket.categoryId == 6) {
      return ?{
        ticketId = ticket.id;
        fromTier = #l1;
        toTier = #l2;
        reason = "Security category requires L2 specialized resolution";
      };
    };
    null;
  };

  // List tickets in a resolver's default queue. L1 sees new/unassigned/in-
  // triage tickets; L2 sees escalated/complex tickets (critical priority or
  // security category). Scoped to the calling agent's assignments plus the
  // tier's default queue definition.
  public func listQueueTickets(
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
    agentId : Common.UserId,
    queue : RoleTypes.ResolverQueue,
  ) : [TicketTypes.TicketView] {
    let snapshot = tickets.toArray();
    let filtered = snapshot.filter(func((_, t) : (Common.TicketId, TicketTypes.Ticket)) : Bool {
      switch (queue) {
        case (#l1Default) {
          // L1 queue: new/unassigned/in-triage tickets, plus tickets
          // assigned to this agent that are still open/in-progress/pending.
          let isNew = t.status == #open;
          let isUnassigned = switch (t.assignedAgent) { case null true; case (?_) false };
          let isAssignedToMe = switch (t.assignedAgent) {
            case (?a) a == agentId and (t.status == #open or t.status == #in_progress or t.status == #pending);
            case null false;
          };
          // Exclude critical-priority and security-category tickets from L1
          // default queue (those belong to L2).
          let notL2Scope = not (t.priorityId == 4 or t.categoryId == 6);
          (isNew and isUnassigned and notL2Scope) or isAssignedToMe;
        };
        case (#l2Default) {
          // L2 queue: escalated/complex tickets (critical priority or security
          // category) that are still open/in-progress/pending, plus tickets
          // assigned to this agent.
          let isComplex = t.priorityId == 4 or t.categoryId == 6;
          let isOpen = t.status == #open or t.status == #in_progress or t.status == #pending;
          let isAssignedToMe = switch (t.assignedAgent) {
            case (?a) a == agentId and isOpen;
            case null false;
          };
          (isComplex and isOpen) or isAssignedToMe;
        };
      };
    });
    let views = filtered.map(func((_, t)) = t.toView());
    // Sort by SLA deadline ascending (most urgent first).
    views.sort(func(a : TicketTypes.TicketView, b : TicketTypes.TicketView) : { #less; #equal; #greater } {
      Nat.compare(a.slaDeadline, b.slaDeadline);
    });
  };

  // Compute the KPI set for a role dashboard. Each role has its own KPIs.
  public func computeRoleKPIs(
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
    users : Map.Map<Common.UserId, UserTypes.User>,
    caller : Common.UserId,
    role : Common.AppRole,
    now : Common.Timestamp,
  ) : [RoleTypes.RoleKPI] {
    let snapshot = tickets.toArray();
    switch (role) {
      case (#employee) {
        var myOpen = 0;
        var myResolved = 0;
        for ((_, t) in snapshot.values()) {
          if (t.creator == caller) {
            if (t.status == #open or t.status == #in_progress or t.status == #pending) {
              myOpen += 1;
            } else if (t.status == #resolved or t.status == #closed) {
              myResolved += 1;
            };
          };
        };
        [
          { name ="My Open Tickets"; value = myOpen },
          { name ="My Resolved Tickets"; value = myResolved },
        ];
      };
      case (#l1_help_desk) {
        var newTickets = 0;
        var inTriage = 0;
        var assignedToMe = 0;
        var resolvedToday = 0;
        let dayNs : Nat = 24 * 60 * 60 * 1_000_000_000;
        let dayAgo = if (now > dayNs) { now - dayNs } else { 0 };
        for ((_, t) in snapshot.values()) {
          let notL2Scope = not (t.priorityId == 4 or t.categoryId == 6);
          if (t.status == #open and notL2Scope) {
            newTickets += 1;
          };
          if (t.status == #in_progress and notL2Scope) {
            inTriage += 1;
          };
          switch (t.assignedAgent) {
            case (?a) {
              if (a == caller and (t.status == #open or t.status == #in_progress or t.status == #pending)) {
                assignedToMe += 1;
              };
            };
            case null {};
          };
          if ((t.status == #resolved or t.status == #closed) and t.updatedAt >= dayAgo) {
            switch (t.assignedAgent) {
              case (?a) { if (a == caller) { resolvedToday += 1 } };
              case null {};
            };
          };
        };
        [
          { name ="New Tickets"; value = newTickets },
          { name ="In Triage"; value = inTriage },
          { name ="Assigned To Me"; value = assignedToMe },
          { name ="Resolved Today"; value = resolvedToday },
        ];
      };
      case (#l2_resolver) {
        var escalatedToMe = 0;
        var complexOpen = 0;
        var resolvedToday = 0;
        let dayNs : Nat = 24 * 60 * 60 * 1_000_000_000;
        let dayAgo = if (now > dayNs) { now - dayNs } else { 0 };
        for ((_, t) in snapshot.values()) {
          let isComplex = t.priorityId == 4 or t.categoryId == 6;
          if (isComplex and (t.status == #open or t.status == #in_progress or t.status == #pending)) {
            complexOpen += 1;
          };
          switch (t.assignedAgent) {
            case (?a) {
              if (a == caller and (t.status == #open or t.status == #in_progress or t.status == #pending)) {
                escalatedToMe += 1;
              };
              if ((t.status == #resolved or t.status == #closed) and t.updatedAt >= dayAgo and a == caller) {
                resolvedToday += 1;
              };
            };
            case null {};
          };
        };
        [
          { name ="Escalated To Me"; value = escalatedToMe },
          { name ="Complex Open"; value = complexOpen },
          { name ="Resolved Today"; value = resolvedToday },
        ];
      };
      case (#admin) {
        var totalOpen = 0;
        var breachedSLA = 0;
        for ((_, t) in snapshot.values()) {
          if (t.status == #open or t.status == #in_progress or t.status == #pending) {
            totalOpen += 1;
            if (now > t.slaDeadline) {
              breachedSLA += 1;
            };
          };
        };
        [
          { name ="Total Open"; value = totalOpen },
          { name ="Breached SLA"; value = breachedSLA },
          { name ="Total Tickets"; value = snapshot.size() },
        ];
      };
    };
  };

  // Build the full dashboard summary for a role: default queue ticket count
  // plus the role's KPI set.
  public func buildRoleDashboard(
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
    users : Map.Map<Common.UserId, UserTypes.User>,
    caller : Common.UserId,
    role : Common.AppRole,
    now : Common.Timestamp,
  ) : RoleTypes.RoleDashboard {
    let kpis = computeRoleKPIs(tickets, users, caller, role, now);
    // Determine the queue and its ticket count. Non-resolver roles get the L1
    // default queue as a fallback view (admins see the L1 queue count as a
    // proxy for "intake load"; employees see their own open count).
    let queueOpt = defaultQueueFor(role);
    let queue : RoleTypes.ResolverQueue = queueOpt ?? #l1Default;
    let queueTickets = listQueueTickets(tickets, caller, queue);
    {
      role;
      queue;
      queueTicketCount = queueTickets.size();
      kpis;
    };
  };

  // Build the navigation set for a role. Each role has its own sidebar items.
  public func buildRoleNavigation(
    role : Common.AppRole,
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
    caller : Common.UserId,
  ) : RoleTypes.RoleNavigation {
    // Compute badge counts where relevant (assigned-to-me counts).
    var myAssignedCount : Nat = 0;
    for ((_, t) in tickets.toArray().values()) {
      switch (t.assignedAgent) {
        case (?a) {
          if (a == caller and (t.status == #open or t.status == #in_progress or t.status == #pending)) {
            myAssignedCount += 1;
          };
        };
        case null {};
      };
    };
    let items : [RoleTypes.NavItem] = switch (role) {
      case (#employee) [
        { name ="My Tickets"; route = "/my-tickets"; badgeCount = null },
        { name ="New Ticket"; route = "/new-ticket"; badgeCount = null },
        { name ="Knowledge Base"; route = "/knowledge"; badgeCount = null },
      ];
      case (#l1_help_desk) [
        { name ="Triage Queue"; route = "/l1/triage"; badgeCount = null },
        { name ="My Assigned"; route = "/l1/assigned"; badgeCount = ?myAssignedCount },
        { name ="Knowledge Base"; route = "/knowledge"; badgeCount = null },
      ];
      case (#l2_resolver) [
        { name ="Escalation Queue"; route = "/l2/escalations"; badgeCount = null },
        { name ="My Assigned"; route = "/l2/assigned"; badgeCount = ?myAssignedCount },
        { name ="Knowledge Base"; route = "/knowledge"; badgeCount = null },
      ];
      case (#admin) [
        { name ="All Tickets"; route = "/admin/tickets"; badgeCount = null },
        { name ="Users"; route = "/admin/users"; badgeCount = null },
        { name ="Categories"; route = "/admin/categories"; badgeCount = null },
        { name ="Priorities"; route = "/admin/priorities"; badgeCount = null },
        { name ="Audit Log"; route = "/admin/audit"; badgeCount = null },
        { name ="Settings"; route = "/admin/settings"; badgeCount = null },
      ];
    };
    { role; items };
  };

  // AppRole -> Text for audit-log detail messages and OQL variant-to-text
  // conversion. Four-arm version covering the split resolver roles.
  public func roleToText(role : Common.AppRole) : Text {
    switch (role) {
      case (#employee) "employee";
      case (#l1_help_desk) "l1_help_desk";
      case (#l2_resolver) "l2_resolver";
      case (#admin) "admin";
    };
  };

  // List agents filtered by resolver tier. Used by the admin agent-management
  // screen to show L1 and L2 agents separately. Pass null for all resolver
  // roles.
  public func listAgentsByTier(
    users : Map.Map<Common.UserId, UserTypes.User>,
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
    tier : ?Common.ResolverTier,
  ) : [UserTypes.AgentSummary] {
    let agents = users.toArray().filter(func((_, u) : (Common.UserId, UserTypes.User)) : Bool {
      let isResolver = u.role == #l1_help_desk or u.role == #l2_resolver;
      let tierOk = switch (tier) {
        case (?#l1) u.role == #l1_help_desk;
        case (?#l2) u.role == #l2_resolver;
        case null isResolver;
      };
      isResolver and tierOk and u.isActive;
    });
    agents.map(
      func((id, u)) : UserTypes.AgentSummary {
        var assigned = 0;
        var resolved = 0;
        for ((_, t) in tickets.toArray().values()) {
          switch (t.assignedAgent) {
            case (?a) {
              if (a == id) {
                assigned += 1;
                if (t.status == #resolved or t.status == #closed) {
                  resolved += 1;
                };
              };
            };
            case null {};
          };
        };
        let rate : Float = if (assigned == 0) {
          0.0;
        } else {
          let assignedFloat = Float.fromInt64(Int64.fromNat64(Nat64.fromNat(assigned)));
          let resolvedFloat = Float.fromInt64(Int64.fromNat64(Nat64.fromNat(resolved)));
          resolvedFloat / assignedFloat;
        };
        {
          agentId = id;
          displayName = u.displayName;
          assignedTicketCount = assigned;
          resolvedTicketCount = resolved;
          resolutionRate = rate;
        };
      },
    );
  };

  // Whether the caller may see internal notes on a ticket. Admins and resolver
  // roles (#l1_help_desk, #l2_resolver) may; the creator (employee) may not.
  public func canSeeInternalNotes(
    caller : Common.UserId,
    ticket : TicketTypes.Ticket,
    users : Map.Map<Common.UserId, UserTypes.User>,
  ) : Bool {
    switch (users.get(caller)) {
      case (?u) {
        switch (u.role) {
          case (#admin) true;
          case (#l1_help_desk) true;
          case (#l2_resolver) true;
          case (#employee) {
            // Employees may see internal notes only on their own tickets? No —
            // internal notes are agent-only by definition. Employees never see
            // them, even on their own tickets.
            false;
          };
        };
      };
      case null false;
    };
  };

  // Require the caller's business role to be a resolver role (#l1_help_desk
  // or #l2_resolver) or #admin. Traps with a clear message otherwise.
  public func requireResolverOrAdmin(
    caller : Common.UserId,
    users : Map.Map<Common.UserId, UserTypes.User>,
  ) : () {
    switch (users.get(caller)) {
      case (?u) {
        switch (u.role) {
          case (#admin) ();
          case (#l1_help_desk) ();
          case (#l2_resolver) ();
          case (#employee) {
            Runtime.trap("Unauthorized: only resolver roles or admins can perform this action");
          };
        };
      };
      case null {
        Runtime.trap("Unauthorized: caller is not a registered user");
      };
    };
  };
};
