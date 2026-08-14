import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import PriorityTypes "../types/priorities";
import AuditTypes "../types/audit";
import PriorityLib "../lib/priorities";
import AuditLib "../lib/audit";

mixin (
  accessControlState : AccessControl.AccessControlState,
  priorities : Map.Map<Common.PriorityId, PriorityTypes.Priority>,
  nextPriorityId : { var next : Common.PriorityId },
  auditLogs : List.List<AuditTypes.AuditLog>,
  nextAuditLogId : { var next : Common.AuditLogId },
) {
  public query ({ caller }) func listPriorities(
    includeInactive : Bool,
  ) : async [PriorityTypes.PriorityView] {
    requirePriorityRegistered(accessControlState, caller);
    PriorityLib.listPriorities(priorities, includeInactive);
  };

  public query ({ caller }) func getPriority(
    id : Common.PriorityId,
  ) : async ?PriorityTypes.PriorityView {
    requirePriorityRegistered(accessControlState, caller);
    switch (PriorityLib.getPriority(priorities, id)) {
      case (?p) ?p.toView();
      case null null;
    };
  };

  // Admin-only: create a priority level with its SLA target.
  public shared ({ caller }) func createPriority(
    input : PriorityTypes.PriorityCreateInput,
  ) : async PriorityTypes.PriorityView {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can create priorities");
    };
    let created = PriorityLib.createPriority(priorities, nextPriorityId, input, Int.abs(Time.now()));
    ignore AuditLib.record(
      auditLogs, nextAuditLogId, caller, #priorityUpdated,
      "priority:" # Nat.toText(created.id),
      "Priority created: " # input.name,
      Int.abs(Time.now()),
    );
    created.toView();
  };

  // Admin-only: update a priority level or its SLA target.
  public shared ({ caller }) func updatePriority(
    input : PriorityTypes.PriorityUpdateInput,
  ) : async PriorityTypes.PriorityView {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can update priorities");
    };
    switch (PriorityLib.updatePriority(priorities, input.id, input)) {
      case (?p) {
        ignore AuditLib.record(
          auditLogs, nextAuditLogId, caller, #priorityUpdated,
          "priority:" # Nat.toText(input.id),
          "Priority updated: " # Nat.toText(input.id),
          Int.abs(Time.now()),
        );
        p.toView();
      };
      case null Runtime.trap("Not found: priority does not exist");
    };
  };

  // Require a registered (non-anonymous, known to access control) caller.
  func requirePriorityRegistered(state : AccessControl.AccessControlState, caller : Principal) : () {
    if (Principal.isAnonymous(caller)) {
      Runtime.trap("Unauthorized: caller is anonymous");
    };
    switch (state.userRoles.get(caller)) {
      case (?_) {};
      case null {
        Runtime.trap("Unauthorized: caller is not a registered user");
      };
    };
  };
};
