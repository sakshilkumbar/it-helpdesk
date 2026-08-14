import Common "common";

module {
  // A priority level (e.g. Low, Medium, High, Critical) with its associated
  // SLA target resolution time. Admins configure priorities and SLA targets.
  public type Priority = {
    id : Common.PriorityId;
    var name : Text;
    var level : Nat; // numeric weight for sorting (higher = more urgent)
    var slaTargetNs : Nat; // SLA target resolution time in nanoseconds
    var isActive : Bool;
    var createdAt : Common.Timestamp;
  };

  public type PriorityView = {
    id : Common.PriorityId;
    name : Text;
    level : Nat;
    slaTargetNs : Nat;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type PriorityCreateInput = {
    name : Text;
    level : Nat;
    slaTargetNs : Nat;
  };

  public type PriorityUpdateInput = {
    id : Common.PriorityId;
    name : ?Text;
    level : ?Nat;
    slaTargetNs : ?Nat;
    isActive : ?Bool;
  };
};
