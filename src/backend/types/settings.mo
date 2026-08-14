import Common "common";

module {
  // System settings. Admins manage: organization name, default SLA targets
  // per priority, and a toggle for enabling future AI features (placeholder,
  // no AI logic).
  public type SystemSettings = {
    var organizationName : Text;
    var aiFeaturesEnabled : Bool; // placeholder toggle, no AI logic in v1
    var updatedAt : Common.Timestamp;
  };

  public type SystemSettingsView = {
    organizationName : Text;
    aiFeaturesEnabled : Bool;
    updatedAt : Common.Timestamp;
  };

  public type SystemSettingsUpdateInput = {
    organizationName : ?Text;
    aiFeaturesEnabled : ?Bool;
  };
};
