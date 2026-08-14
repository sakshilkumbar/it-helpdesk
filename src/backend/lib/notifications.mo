import List "mo:core/List";
import Array "mo:core/Array";
import Types "../types/notifications";
import Common "../types/common";

module {
  // Domain logic for in-app notifications. Stored as a List (chronological).
  public func toView(self : Types.Notification) : Types.NotificationView {
    {
      id = self.id;
      recipient = self.recipient;
      notificationType = self.notificationType;
      message = self.message;
      linkTicketId = self.linkTicketId;
      createdAt = self.createdAt;
      isRead = self.isRead;
    };
  };

  public func createNotification(
    notifications : List.List<Types.Notification>,
    nextId : { var next : Common.NotificationId },
    recipient : Common.UserId,
    notificationType : Types.NotificationType,
    message : Text,
    linkTicketId : ?Common.TicketId,
    now : Common.Timestamp,
  ) : Types.Notification {
    let id = nextId.next;
    nextId.next := nextId.next + 1;
    let notification : Types.Notification = {
      id;
      var recipient;
      var notificationType;
      var message;
      var linkTicketId;
      var createdAt = now;
      var isRead = false;
    };
    notifications.add(notification);
    notification;
  };

  public func listForUser(
    notifications : List.List<Types.Notification>,
    recipient : Common.UserId,
    includeRead : Bool,
  ) : [Types.NotificationView] {
    let snapshot = notifications.toArray();
    let filtered = snapshot.filter(func(n : Types.Notification) : Bool {
      let recipientOk = n.recipient == recipient;
      let readOk = includeRead or not n.isRead;
      recipientOk and readOk;
    });
    let views = filtered.map(func(n) = toView(n));
    // Sort newest first (chronological descending).
    views.sort(func(a : Types.NotificationView, b : Types.NotificationView) : { #less; #equal; #greater } {
      Nat.compare(b.createdAt, a.createdAt);
    });
  };

  public func markAsRead(
    notifications : List.List<Types.Notification>,
    id : Common.NotificationId,
    recipient : Common.UserId,
  ) : Bool {
    let snapshot = notifications.toArray();
    let found = snapshot.find(func(n : Types.Notification) : Bool {
      n.id == id and n.recipient == recipient;
    });
    switch (found) {
      case (?n) {
        n.isRead := true;
        true;
      };
      case null false;
    };
  };

  public func markAllAsRead(
    notifications : List.List<Types.Notification>,
    recipient : Common.UserId,
  ) : Nat {
    let snapshot = notifications.toArray();
    var count = 0;
    for (n in snapshot.values()) {
      if (n.recipient == recipient and not n.isRead) {
        n.isRead := true;
        count += 1;
      };
    };
    count;
  };

  public func countUnread(
    notifications : List.List<Types.Notification>,
    recipient : Common.UserId,
  ) : Nat {
    let snapshot = notifications.toArray();
    var count = 0;
    for (n in snapshot.values()) {
      if (n.recipient == recipient and not n.isRead) {
        count += 1;
      };
    };
    count;
  };
};
