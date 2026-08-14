import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Int64 "mo:core/Int64";
import Nat64 "mo:core/Nat64";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UserTypes "../types/users";
import TicketTypes "../types/tickets";
import AuditTypes "../types/audit";
import UserLib "../lib/users";
import AuditLib "../lib/audit";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<Common.UserId, UserTypes.User>,
  nextUserId : { var next : Common.Timestamp },
  tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
  auditLogs : List.List<AuditTypes.AuditLog>,
  nextAuditLogId : { var next : Common.AuditLogId },
) {
  // Resolve the AppRole for the caller. Reads the business role stored on the
  // User record in the users map (the source of truth for the three-role
  // model), falling back to null if the caller has no User record yet.
  public query ({ caller }) func getCallerAppRole() : async ?Common.AppRole {
    requireUserRegistered(accessControlState, caller);
    switch (users.get(caller)) {
      case (?u) ?u.role;
      case null null;
    };
  };

  public query ({ caller }) func getCallerUser() : async ?UserTypes.UserView {
    requireUserRegistered(accessControlState, caller);
    switch (users.get(caller)) {
      case (?u) ?u.toView();
      case null null;
    };
  };

  public query ({ caller }) func getUser(id : Common.UserId) : async ?UserTypes.UserView {
    requireUserRegistered(accessControlState, caller);
    switch (users.get(id)) {
      case (?u) ?u.toView();
      case null null;
    };
  };

  public query ({ caller }) func listUsers(
    search : ?Text,
    roleFilter : ?Common.AppRole,
    page : Common.PageRequest,
  ) : async [UserTypes.UserView] {
    requireUserRegistered(accessControlState, caller);
    UserLib.listUsers(users, search, roleFilter, page);
  };

  // Admin-only: assign or change a user's role.
  public shared ({ caller }) func assignUserRole(
    user : Common.UserId,
    newRole : Common.AppRole,
  ) : async UserTypes.UserView {
    requireUserAdmin(accessControlState, caller);
    switch (UserLib.assignRole(users, user, newRole)) {
      case (?u) {
        ignore AuditLib.record(
          auditLogs, nextAuditLogId, caller, #roleChanged,
          "user:" # user.toText(),
          "Role changed to " # roleToText(newRole) # " for user " # user.toText(),
          Int.abs(Time.now()),
        );
        u.toView();
      };
      case null Runtime.trap("Not found: user does not exist");
    };
  };

  // Admin-only: deactivate a user.
  public shared ({ caller }) func deactivateUser(
    user : Common.UserId,
  ) : async UserTypes.UserView {
    requireUserAdmin(accessControlState, caller);
    switch (UserLib.setActive(users, user, false)) {
      case (?u) {
        ignore AuditLib.record(
          auditLogs, nextAuditLogId, caller, #userDeactivated,
          "user:" # user.toText(),
          "User deactivated: " # user.toText(),
          Int.abs(Time.now()),
        );
        u.toView();
      };
      case null Runtime.trap("Not found: user does not exist");
    };
  };

  // Admin-only: reactivate a user.
  public shared ({ caller }) func reactivateUser(
    user : Common.UserId,
  ) : async UserTypes.UserView {
    requireUserAdmin(accessControlState, caller);
    switch (UserLib.setActive(users, user, true)) {
      case (?u) {
        ignore AuditLib.record(
          auditLogs, nextAuditLogId, caller, #userReactivated,
          "user:" # user.toText(),
          "User reactivated: " # user.toText(),
          Int.abs(Time.now()),
        );
        u.toView();
      };
      case null Runtime.trap("Not found: user does not exist");
    };
  };

  // Admin-only: list support agents with their ticket counts and resolution
  // rates for the agent-management screen. Iterates users with role
  // #support_agent and joins against the tickets map for assignment and
  // resolution counts.
  public query ({ caller }) func listAgents() : async [UserTypes.AgentSummary] {
    requireUserAdmin(accessControlState, caller);
    let agentUsers = users.toArray().filter(func((_, u) : (Common.UserId, UserTypes.User)) : Bool {
      u.role == #l1_help_desk or u.role == #l2_resolver;
    });
    agentUsers.map(
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
        let rate : Float = if (assigned == 0) { 0.0 } else {
          // resolved / assigned as a Float ratio.
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

  // Require a registered (non-anonymous, known to access control) caller.
  func requireUserRegistered(state : AccessControl.AccessControlState, caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: caller is anonymous");
    };
    switch (state.userRoles.get(caller)) {
      case (?_) {};
      case null {
        Runtime.trap("Unauthorized: caller is not a registered user");
      };
    };
  };

  // Admin-only guard. Traps with a clear message for anonymous, unregistered,
  // or non-admin callers.
  func requireUserAdmin(state : AccessControl.AccessControlState, caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: caller is anonymous");
    };
    if (not AccessControl.isAdmin(state, caller)) {
      Runtime.trap("Unauthorized: only admins can perform this action");
    };
  };

  // AppRole -> Text for audit-log detail messages.
  func roleToText(r : Common.AppRole) : Text {
    switch (r) {
      case (#employee) "employee";
      case (#l1_help_desk) "l1_help_desk";
      case (#l2_resolver) "l2_resolver";
      case (#admin) "admin";
    };
  };
};
