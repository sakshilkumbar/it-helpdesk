import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import TicketTypes "../types/tickets";
import AuditTypes "../types/audit";
import TicketLib "../lib/tickets";
import AuditLib "../lib/audit";

mixin (
  accessControlState : AccessControl.AccessControlState,
  tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
  auditLogs : List.List<AuditTypes.AuditLog>,
  nextAuditLogId : { var next : Common.AuditLogId },
) {
  // Admin-only: SLA monitor — list tickets breaching or at risk of breaching.
  public query ({ caller }) func getSLAStatuses() : async [TicketTypes.TicketSLAStatus] {
    requireAuditAdmin(accessControlState, caller);
    TicketLib.computeSLAStatuses(tickets, Int.abs(Time.now()));
  };

  // Admin-only: view audit logs (chronological, filterable, paginated).
  public query ({ caller }) func listAuditLogs(
    auditQuery : AuditTypes.AuditLogQuery,
  ) : async [AuditTypes.AuditLogView] {
    requireAuditAdmin(accessControlState, caller);
    AuditLib.listLogs(auditLogs, auditQuery);
  };

  // Admin-only guard. Traps with a clear message for anonymous, unregistered,
  // or non-admin callers.
  func requireAuditAdmin(state : AccessControl.AccessControlState, caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: caller is anonymous");
    };
    if (not AccessControl.isAdmin(state, caller)) {
      Runtime.trap("Unauthorized: only admins can perform this action");
    };
  };
};
