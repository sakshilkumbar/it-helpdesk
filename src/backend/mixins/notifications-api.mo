import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import NotificationTypes "../types/notifications";
import NotificationLib "../lib/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notifications : List.List<NotificationTypes.Notification>,
  nextNotificationId : { var next : Common.NotificationId },
) {
  // Any authenticated user: list their notifications (unread + recent).
  public query ({ caller }) func listMyNotifications(
    includeRead : Bool,
  ) : async [NotificationTypes.NotificationView] {
    requireNotificationRegistered(accessControlState, caller);
    NotificationLib.listForUser(notifications, caller, includeRead);
  };

  // Any authenticated user: count of unread notifications (for the bell badge).
  public query ({ caller }) func countUnreadNotifications() : async Nat {
    requireNotificationRegistered(accessControlState, caller);
    NotificationLib.countUnread(notifications, caller);
  };

  // Any authenticated user: mark a single notification as read (owner check).
  public shared ({ caller }) func markNotificationAsRead(
    id : Common.NotificationId,
  ) : async Bool {
    requireNotificationRegistered(accessControlState, caller);
    NotificationLib.markAsRead(notifications, id, caller);
  };

  // Any authenticated user: mark all of the caller's notifications as read.
  public shared ({ caller }) func markAllNotificationsAsRead() : async Nat {
    requireNotificationRegistered(accessControlState, caller);
    NotificationLib.markAllAsRead(notifications, caller);
  };

  // Require a registered (non-anonymous, known to access control) caller.
  func requireNotificationRegistered(state : AccessControl.AccessControlState, caller : Principal) : () {
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
};
