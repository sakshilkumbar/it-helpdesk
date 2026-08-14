import Types "../types/settings";

module {
  // Domain logic for system settings. Single-record state held by the actor.
  public func toView(self : Types.SystemSettings) : Types.SystemSettingsView {
    {
      organizationName = self.organizationName;
      aiFeaturesEnabled = self.aiFeaturesEnabled;
      updatedAt = self.updatedAt;
    };
  };

  public func updateSettings(
    self : Types.SystemSettings,
    input : Types.SystemSettingsUpdateInput,
    now : Nat,
  ) : () {
    switch (input.organizationName) {
      case (?n) { self.organizationName := n };
      case null {};
    };
    switch (input.aiFeaturesEnabled) {
      case (?a) { self.aiFeaturesEnabled := a };
      case null {};
    };
    self.updatedAt := now;
  };
};
