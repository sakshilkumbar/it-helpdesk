import Common "common";

module {
  // An audit-log entry. Admins view a chronological, filterable list of
  // significant actions (ticket created, status changed, role changed,
  // ticket closed, user deactivated) with actor, timestamp, and detail.
  public type AuditAction = {
    #ticketCreated;
    #ticketStatusChanged;
    #ticketAssigned;
    #ticketClosed;
    #roleChanged;
    #userDeactivated;
    #userReactivated;
    #categoryCreated;
    #categoryUpdated;
    #priorityUpdated;
    #settingsUpdated;
  };

  public type AuditLog = {
    id : Common.AuditLogId;
    actorId : Common.UserId;
    action : AuditAction;
    targetEntity : Text; // human-readable target identifier
    timestamp : Common.Timestamp;
    detail : Text;
  };

  public type AuditLogView = {
    id : Common.AuditLogId;
    actorId : Common.UserId;
    action : AuditAction;
    targetEntity : Text;
    timestamp : Common.Timestamp;
    detail : Text;
  };

  public type AuditLogQuery = {
    action : ?AuditAction;
    actorId : ?Common.UserId;
    fromTimestamp : ?Common.Timestamp;
    toTimestamp : ?Common.Timestamp;
    page : Common.PageRequest;
  };
};
