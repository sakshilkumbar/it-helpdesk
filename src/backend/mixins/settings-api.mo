import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import SettingsTypes "../types/settings";
import AuditTypes "../types/audit";
import SettingsLib "../lib/settings";
import AuditLib "../lib/audit";

mixin (
  accessControlState : AccessControl.AccessControlState,
  settings : SettingsTypes.SystemSettings,
  auditLogs : List.List<AuditTypes.AuditLog>,
  nextAuditLogId : { var next : Common.AuditLogId },
) {
  // Any authenticated user: read system settings (e.g. organization name).
  public query ({ caller }) func getSystemSettings() : async SettingsTypes.SystemSettingsView {
    requireSettingsRegistered(accessControlState, caller);
    settings.toView();
  };

  // Admin-only: update system settings (org name, default SLA targets,
  // AI-features toggle placeholder — no AI logic in v1).
  public shared ({ caller }) func updateSystemSettings(
    input : SettingsTypes.SystemSettingsUpdateInput,
  ) : async SettingsTypes.SystemSettingsView {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can update system settings");
    };
    settings.updateSettings(input, Int.abs(Time.now()));
    ignore AuditLib.record(
      auditLogs, nextAuditLogId, caller, #settingsUpdated,
      "settings",
      "Settings updated",
      Int.abs(Time.now()),
    );
    settings.toView();
  };

  // Require a registered (non-anonymous, known to access control) caller.
  // Traps with a clear message for anonymous or unregistered principals.
  func requireSettingsRegistered(state : AccessControl.AccessControlState, caller : Principal) : () {
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
