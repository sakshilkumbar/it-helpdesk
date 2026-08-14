import Common "common";

module {
  // An in-app notification. All roles see unread and recent notifications
  // with mark-as-read. No email notifications in v1 (excluded by contract).
  public type NotificationType = {
    #ticketAssigned;
    #ticketUpdated;
    #ticketClosed;
    #ticketReply;
    #roleChanged;
  };

  public type Notification = {
    id : Common.NotificationId;
    var recipient : Common.UserId;
    var notificationType : NotificationType;
    var message : Text;
    var linkTicketId : ?Common.TicketId;
    var createdAt : Common.Timestamp;
    var isRead : Bool;
  };

  public type NotificationView = {
    id : Common.NotificationId;
    recipient : Common.UserId;
    notificationType : NotificationType;
    message : Text;
    linkTicketId : ?Common.TicketId;
    createdAt : Common.Timestamp;
    isRead : Bool;
  };
};
