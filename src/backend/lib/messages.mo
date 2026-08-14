import List "mo:core/List";
import Array "mo:core/Array";
import Types "../types/common";

module {
  // Domain logic for ticket message threads. Messages are stored in a List
  // per ticket (keyed by ticket id in the mixin's outer Map).
  public func addMessage(
    messages : List.List<Types.TicketMessage>,
    nextMessageId : { var next : Types.MessageId },
    ticketId : Types.TicketId,
    author : Types.UserId,
    authorRole : Types.AppRole,
    body : Text,
    isInternal : Bool,
    now : Types.Timestamp,
  ) : Types.TicketMessage {
    let id = nextMessageId.next;
    nextMessageId.next := nextMessageId.next + 1;
    let message : Types.TicketMessage = {
      id;
      ticketId;
      author;
      authorRole;
      body;
      createdAt = now;
      isInternal;
    };
    messages.add(message);
    message;
  };

  public func listMessages(
    messages : List.List<Types.TicketMessage>,
    includeInternal : Bool,
  ) : [Types.TicketMessage] {
    let snapshot = messages.toArray();
    let filtered = snapshot.filter(func(m : Types.TicketMessage) : Bool {
      includeInternal or not m.isInternal;
    });
    // Sort oldest first (chronological ascending) for natural thread reading.
    filtered.sort(func(a : Types.TicketMessage, b : Types.TicketMessage) : { #less; #equal; #greater } {
      Nat.compare(a.createdAt, b.createdAt);
    });
  };
};
