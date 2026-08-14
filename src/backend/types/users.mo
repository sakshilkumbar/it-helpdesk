import Common "common";

module {
  // A registered user. The principal is the identity; the AppRole is assigned
  // by an admin (or defaulted to #employee on first sign-in).
  public type User = {
    id : Common.UserId;
    var displayName : Text;
    var email : ?Text;
    var role : Common.AppRole;
    var isActive : Bool;
    var createdAt : Common.Timestamp;
    var lastSeenAt : ?Common.Timestamp;
  };

  // Shared (serializable) view of a User returned by public endpoints.
  public type UserView = {
    id : Common.UserId;
    displayName : Text;
    email : ?Text;
    role : Common.AppRole;
    isActive : Bool;
    createdAt : Common.Timestamp;
    lastSeenAt : ?Common.Timestamp;
  };

  // Agent-specific summary used by the admin agent-management screen.
  public type AgentSummary = {
    agentId : Common.UserId;
    displayName : Text;
    assignedTicketCount : Nat;
    resolvedTicketCount : Nat;
    resolutionRate : Float; // resolved / (resolved + closed-without-resolution)
  };
};
