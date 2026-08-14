import List "mo:core/List";
import Array "mo:core/Array";
import Types "../types/audit";
import Common "../types/common";

module {
  // Domain logic for audit logs. Stored as a chronological List.
  public func toView(self : Types.AuditLog) : Types.AuditLogView {
    {
      id = self.id;
      actorId = self.actorId;
      action = self.action;
      targetEntity = self.targetEntity;
      timestamp = self.timestamp;
      detail = self.detail;
    };
  };

  public func record(
    logs : List.List<Types.AuditLog>,
    nextId : { var next : Common.AuditLogId },
    actorId : Common.UserId,
    action : Types.AuditAction,
    targetEntity : Text,
    detail : Text,
    now : Common.Timestamp,
  ) : Types.AuditLog {
    let id = nextId.next;
    nextId.next := nextId.next + 1;
    let entry : Types.AuditLog = {
      id;
      actorId;
      action;
      targetEntity;
      timestamp = now;
      detail;
    };
    logs.add(entry);
    entry;
  };

  public func listLogs(
    logs : List.List<Types.AuditLog>,
    auditQuery : Types.AuditLogQuery,
  ) : [Types.AuditLogView] {
    let snapshot = logs.toArray();
    let filtered = snapshot.filter(func(l : Types.AuditLog) : Bool {
      let actionOk = switch (auditQuery.action) {
        case (?a) l.action == a;
        case null true;
      };
      let actorOk = switch (auditQuery.actorId) {
        case (?a) l.actorId == a;
        case null true;
      };
      let fromOk = switch (auditQuery.fromTimestamp) {
        case (?t) l.timestamp >= t;
        case null true;
      };
      let toOk = switch (auditQuery.toTimestamp) {
        case (?t) l.timestamp <= t;
        case null true;
      };
      actionOk and actorOk and fromOk and toOk;
    });
    // Sort newest first (chronological descending).
    let sorted = filtered.sort(func(a : Types.AuditLog, b : Types.AuditLog) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp);
    });
    let views = sorted.map(func(l) = toView(l));
    let page = auditQuery.page;
    let start = if (page.page == 0) { 0 } else { (page.page - 1) * page.pageSize };
    let end = if (start + page.pageSize > views.size()) { views.size() } else { start + page.pageSize };
    if (start >= views.size()) {
      [];
    } else {
      views.sliceToArray(start, end);
    };
  };
};
