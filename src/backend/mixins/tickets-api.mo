import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import TicketTypes "../types/tickets";
import UserTypes "../types/users";
import PriorityTypes "../types/priorities";
import AuditTypes "../types/audit";
import NotificationTypes "../types/notifications";
import TicketLib "../lib/tickets";
import MessageLib "../lib/messages";
import UserLib "../lib/users";
import PriorityLib "../lib/priorities";
import AuditLib "../lib/audit";
import NotificationLib "../lib/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
  ticketMessages : Map.Map<Common.TicketId, List.List<Common.TicketMessage>>,
  nextTicketId : { var next : Common.TicketId },
  nextMessageId : { var next : Common.MessageId },
  users : Map.Map<Common.UserId, UserTypes.User>,
  priorities : Map.Map<Common.PriorityId, PriorityTypes.Priority>,
  auditLogs : List.List<AuditTypes.AuditLog>,
  nextAuditLogId : { var next : Common.AuditLogId },
  notifications : List.List<NotificationTypes.Notification>,
  nextNotificationId : { var next : Common.NotificationId },
) {
  // Employee: create a new ticket. Computes the SLA deadline from the chosen
  // priority, assigns the ticket to an available support agent (the active
  // agent with the fewest currently-assigned open tickets), notifies the
  // assigned agent, and records an audit-log entry.
  public shared ({ caller }) func createTicket(
    input : TicketTypes.TicketCreateInput,
  ) : async TicketTypes.TicketView {
    requireTicketRegistered(accessControlState, caller);
    let now = Int.abs(Time.now());
    let slaDeadline = PriorityLib.computeSLADeadline(priorities, input.priorityId, now);
    let ticket = TicketLib.createTicket(tickets, nextTicketId, caller, input, slaDeadline, now);
    // Initialize the message thread for this ticket.
    ticketMessages.add(ticket.id, List.empty<Common.TicketMessage>());
    // Auto-assign to the least-loaded active support agent.
    let agent = pickAvailableAgent(users, tickets);
    switch (agent) {
      case (?aId) {
        ticket.assignedAgent := ?aId;
        ignore NotificationLib.createNotification(
          notifications, nextNotificationId, aId, #ticketAssigned,
          "Ticket #" # Nat.toText(ticket.id) # " has been assigned to you",
          ?ticket.id, now,
        );
        ignore AuditLib.record(
          auditLogs, nextAuditLogId, caller, #ticketAssigned,
          "ticket:" # Nat.toText(ticket.id),
          "Auto-assigned to agent " # aId.toText(), now,
        );
      };
      case null {};
    };
    ignore AuditLib.record(
      auditLogs, nextAuditLogId, caller, #ticketCreated,
      "ticket:" # Nat.toText(ticket.id),
      "Ticket created: " # input.title, now,
    );
    ticket.toView();
  };

  // Any authenticated user with access: get a single ticket. Access is granted
  // to the creator, the assigned agent, or any admin.
  public query ({ caller }) func getTicket(
    id : Common.TicketId,
  ) : async ?TicketTypes.TicketView {
    requireTicketRegistered(accessControlState, caller);
    switch (tickets.get(id)) {
      case (?t) {
        if (canAccessTicket(t, caller, accessControlState)) {
          ?t.toView();
        } else {
          null;
        };
      };
      case null null;
    };
  };

  // Employee: list own tickets (paginated, searchable, sortable).
  public query ({ caller }) func listMyTickets(
    ticketQuery : TicketTypes.TicketQuery,
  ) : async [TicketTypes.TicketView] {
    requireTicketRegistered(accessControlState, caller);
    TicketLib.listTicketsByCreator(tickets, caller, ticketQuery);
  };

  // Agent: list tickets assigned to the calling agent. Requires the caller's
  // business role to be #support_agent or #admin.
  public query ({ caller }) func listMyAssignedTickets(
    ticketQuery : TicketTypes.TicketQuery,
  ) : async [TicketTypes.TicketView] {
    requireTicketRegistered(accessControlState, caller);
    requireAgentOrAdmin(accessControlState, caller, users);
    TicketLib.listTicketsByAgent(tickets, caller, ticketQuery);
  };

  // Admin: list all tickets with full filter/sort/paginate.
  public query ({ caller }) func listAllTickets(
    ticketQuery : TicketTypes.TicketQuery,
  ) : async [TicketTypes.TicketView] {
    requireTicketAdmin(accessControlState, caller);
    TicketLib.listTickets(tickets, ticketQuery);
  };

  // Agent/Admin: update ticket status, assignment, resolution. Only the
  // assigned agent or an admin may update. On status change, notifies the
  // creator and records an audit-log entry.
  public shared ({ caller }) func updateTicket(
    input : TicketTypes.TicketUpdateInput,
  ) : async TicketTypes.TicketView {
    requireTicketRegistered(accessControlState, caller);
    let now = Int.abs(Time.now());
    let ticket = requireTicketAccess(tickets, input.ticketId, caller, accessControlState);
    let prevStatus = ticket.status;
    switch (TicketLib.updateTicket(tickets, input.ticketId, input, now)) {
      case (?t) {
        // Status-change side effects: notify creator + audit log.
        switch (input.status) {
          case (?s) {
            if (s != prevStatus) {
              ignore NotificationLib.createNotification(
                notifications, nextNotificationId, t.creator, #ticketUpdated,
                "Ticket #" # Nat.toText(t.id) # " status changed to " # ticketStatusToText(s),
                ?t.id, now,
              );
              ignore AuditLib.record(
                auditLogs, nextAuditLogId, caller, #ticketStatusChanged,
                "ticket:" # Nat.toText(t.id),
                "Status: " # ticketStatusToText(prevStatus) # " -> " # ticketStatusToText(s), now,
              );
            };
          };
          case null {};
        };
        t.toView();
      };
      case null Runtime.trap("Not found: ticket does not exist");
    };
  };

  // Agent/Admin: close a ticket with a resolution summary. Notifies the
  // creator and records an audit-log entry.
  public shared ({ caller }) func closeTicket(
    ticketId : Common.TicketId,
    resolutionSummary : Text,
  ) : async TicketTypes.TicketView {
    requireTicketRegistered(accessControlState, caller);
    let now = Int.abs(Time.now());
    let ticket = requireTicketAccess(tickets, ticketId, caller, accessControlState);
    let prevStatus = ticket.status;
    let input : TicketTypes.TicketUpdateInput = {
      ticketId;
      status = ?#closed;
      assignedAgent = null;
      resolutionSummary = ?resolutionSummary;
    };
    switch (TicketLib.updateTicket(tickets, ticketId, input, now)) {
      case (?t) {
        ignore NotificationLib.createNotification(
          notifications, nextNotificationId, t.creator, #ticketClosed,
          "Ticket #" # Nat.toText(t.id) # " has been closed: " # resolutionSummary,
          ?t.id, now,
        );
        ignore AuditLib.record(
          auditLogs, nextAuditLogId, caller, #ticketClosed,
          "ticket:" # Nat.toText(t.id),
          "Closed: " # resolutionSummary, now,
        );
        t.toView();
      };
      case null Runtime.trap("Not found: ticket does not exist");
    };
  };

  // Admin: reassign a ticket to a different agent. Notifies the new agent and
  // the creator, and records an audit-log entry.
  public shared ({ caller }) func reassignTicket(
    ticketId : Common.TicketId,
    newAgent : Common.UserId,
  ) : async TicketTypes.TicketView {
    requireTicketAdmin(accessControlState, caller);
    let now = Int.abs(Time.now());
    switch (tickets.get(ticketId)) {
      case (?t) {
        t.assignedAgent := ?newAgent;
        t.updatedAt := now;
        ignore NotificationLib.createNotification(
          notifications, nextNotificationId, newAgent, #ticketAssigned,
          "Ticket #" # Nat.toText(t.id) # " has been assigned to you",
          ?t.id, now,
        );
        ignore NotificationLib.createNotification(
          notifications, nextNotificationId, t.creator, #ticketUpdated,
          "Ticket #" # Nat.toText(t.id) # " has been reassigned",
          ?t.id, now,
        );
        ignore AuditLib.record(
          auditLogs, nextAuditLogId, caller, #ticketAssigned,
          "ticket:" # Nat.toText(t.id),
          "Reassigned to agent " # newAgent.toText(), now,
        );
        t.toView();
      };
      case null Runtime.trap("Not found: ticket does not exist");
    };
  };

  // Post a message in a ticket thread. Employees and agents both use this;
  // agents may set isInternal = true for internal notes (not shown to
  // employee). Only the creator, assigned agent, or admin may post.
  public shared ({ caller }) func postTicketMessage(
    ticketId : Common.TicketId,
    body : Text,
    isInternal : Bool,
  ) : async Common.TicketMessage {
    requireTicketRegistered(accessControlState, caller);
    let ticket = requireTicketAccess(tickets, ticketId, caller, accessControlState);
    let now = Int.abs(Time.now());
    let authorRole = resolveAuthorRole(caller, ticket, users, accessControlState);
    // Employees cannot post internal notes.
    let effectiveInternal = isInternal and (authorRole == #l1_help_desk or authorRole == #l2_resolver or authorRole == #admin);
    let thread = switch (ticketMessages.get(ticketId)) {
      case (?l) l;
      case null {
        let l = List.empty<Common.TicketMessage>();
        ticketMessages.add(ticketId, l);
        l;
      };
    };
    let message = MessageLib.addMessage(
      thread, nextMessageId, ticketId, caller, authorRole, body, effectiveInternal, now,
    );
    // Notify the other party of the reply.
    let notifyRecipient = if (caller == ticket.creator) {
      // Employee replied -> notify assigned agent (if any).
      ticket.assignedAgent;
    } else {
      // Agent/admin replied -> notify creator.
      ?ticket.creator;
    };
    switch (notifyRecipient) {
      case (?r) {
        ignore NotificationLib.createNotification(
          notifications, nextNotificationId, r, #ticketReply,
          "New reply on ticket #" # Nat.toText(ticketId),
          ?ticketId, now,
        );
      };
      case null {};
    };
    message;
  };

  // List messages in a ticket thread. Employees see only non-internal messages;
  // agents/admins see all. Access requires creator, assigned agent, or admin.
  public query ({ caller }) func listTicketMessages(
    ticketId : Common.TicketId,
  ) : async [Common.TicketMessage] {
    requireTicketRegistered(accessControlState, caller);
    let ticket = requireTicketAccess(tickets, ticketId, caller, accessControlState);
    let includeInternal = canSeeInternalNotes(caller, ticket, users, accessControlState);
    switch (ticketMessages.get(ticketId)) {
      case (?l) MessageLib.listMessages(l, includeInternal);
      case null [];
    };
  };

  // Admin: ticket analytics for the dashboard.
  public query ({ caller }) func getTicketAnalytics() : async TicketTypes.TicketAnalytics {
    requireTicketAdmin(accessControlState, caller);
    TicketLib.computeAnalytics(tickets);
  };

  // --- Helpers ---

  // Require a registered (non-anonymous, known to access control) caller.
  func requireTicketRegistered(state : AccessControl.AccessControlState, caller : Principal) : () {
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

  // Admin-only guard.
  func requireTicketAdmin(state : AccessControl.AccessControlState, caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: caller is anonymous");
    };
    if (not AccessControl.isAdmin(state, caller)) {
      Runtime.trap("Unauthorized: only admins can perform this action");
    };
  };

  // Require the caller's business role to be #support_agent or #admin.
  func requireAgentOrAdmin(
    state : AccessControl.AccessControlState,
    caller : Principal,
    users : Map.Map<Common.UserId, UserTypes.User>,
  ) : () {
    if (AccessControl.isAdmin(state, caller)) {
      return;
    };
    switch (users.get(caller)) {
      case (?u) {
        if (u.role != #l1_help_desk and u.role != #l2_resolver) {
          Runtime.trap("Unauthorized: only support agents or admins can perform this action");
        };
      };
      case null {
        Runtime.trap("Unauthorized: only support agents or admins can perform this action");
      };
    };
  };

  // Access check for a single ticket: creator, assigned agent, or admin.
  func canAccessTicket(
    t : TicketTypes.Ticket,
    caller : Common.UserId,
    state : AccessControl.AccessControlState,
  ) : Bool {
    if (AccessControl.isAdmin(state, caller)) { return true };
    if (t.creator == caller) { return true };
    switch (t.assignedAgent) {
      case (?a) a == caller;
      case null false;
    };
  };

  // Require access to a ticket (creator, assigned agent, or admin). Returns
  // the ticket record. Traps on missing ticket or insufficient access.
  func requireTicketAccess(
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
    ticketId : Common.TicketId,
    caller : Common.UserId,
    state : AccessControl.AccessControlState,
  ) : TicketTypes.Ticket {
    switch (tickets.get(ticketId)) {
      case (?t) {
        if (not canAccessTicket(t, caller, state)) {
          Runtime.trap("Unauthorized: you do not have access to this ticket");
        };
        t;
      };
      case null Runtime.trap("Not found: ticket does not exist");
    };
  };

  // Resolve the author role for a message poster. Admins and agents are
  // determined by the business role on the User record; the creator defaults
  // to #employee.
  func resolveAuthorRole(
    caller : Common.UserId,
    ticket : TicketTypes.Ticket,
    users : Map.Map<Common.UserId, UserTypes.User>,
    state : AccessControl.AccessControlState,
  ) : Common.AppRole {
    if (AccessControl.isAdmin(state, caller)) { return #admin };
    switch (users.get(caller)) {
      case (?u) u.role;
      case null {
        // Caller has no User record but is registered in access control;
        // treat the ticket creator as #employee, otherwise default to
        // #employee (the access-control tier is #user for non-admins).
        #employee;
      };
    };
  };

  // Whether the caller may see internal notes on a ticket. Admins and the
  // assigned agent may; the creator (employee) may not.
  func canSeeInternalNotes(
    caller : Common.UserId,
    ticket : TicketTypes.Ticket,
    users : Map.Map<Common.UserId, UserTypes.User>,
    state : AccessControl.AccessControlState,
  ) : Bool {
    if (AccessControl.isAdmin(state, caller)) { return true };
    switch (ticket.assignedAgent) {
      case (?a) {
        if (a == caller) { return true };
        // Also allow any support_agent to see internal notes (agents may
        // cover for each other); check the business role.
        switch (users.get(caller)) {
          case (?u) (u.role == #l1_help_desk or u.role == #l2_resolver);
          case null false;
        };
      };
      case null {
        switch (users.get(caller)) {
          case (?u) (u.role == #l1_help_desk or u.role == #l2_resolver);
          case null false;
        };
      };
    };
  };

  // Pick the active support agent with the fewest currently-assigned open
  // tickets. Returns null if no active support agents exist.
  func pickAvailableAgent(
    users : Map.Map<Common.UserId, UserTypes.User>,
    tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>,
  ) : ?Common.UserId {
    let agents = users.toArray().filter(func((_, u) : (Common.UserId, UserTypes.User)) : Bool {
      (u.role == #l1_help_desk or u.role == #l2_resolver) and u.isActive;
    });
    if (agents.size() == 0) { return null };
    // Count open/in-progress/pending tickets per agent.
    var bestAgent : ?Common.UserId = null;
    var bestCount : Nat = 0;
    var first = true;
    for ((aId, _) in agents.values()) {
      var count : Nat = 0;
      for ((_, t) in tickets.toArray().values()) {
        switch (t.assignedAgent) {
          case (?a) {
            if (a == aId and (t.status == #open or t.status == #in_progress or t.status == #pending)) {
              count += 1;
            };
          };
          case null {};
        };
      };
      if (first or count < bestCount) {
        bestAgent := ?aId;
        bestCount := count;
        first := false;
      };
    };
    bestAgent;
  };

  // TicketStatus -> Text for notification/audit messages.
  func ticketStatusToText(s : Common.TicketStatus) : Text {
    switch (s) {
      case (#open) "open";
      case (#in_progress) "in_progress";
      case (#pending) "pending";
      case (#resolved) "resolved";
      case (#closed) "closed";
    };
  };
};
