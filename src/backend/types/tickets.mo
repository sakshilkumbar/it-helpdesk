import Common "common";

module {
  // The full ticket record stored in stable state. Carries reserved AI fields
  // (all nullable, initially empty) surfaced in the UI as placeholders.
  public type Ticket = {
    id : Common.TicketId;
    var title : Text;
    var description : Text;
    var categoryId : Common.CategoryId;
    var priorityId : Common.PriorityId;
    var status : Common.TicketStatus;
    var creator : Common.UserId;
    var assignedAgent : ?Common.UserId;
    var createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
    var closedAt : ?Common.Timestamp;
    var slaDeadline : Common.Timestamp; // target resolution time based on priority
    var attachments : [Common.Attachment];
    var ai : Common.TicketAIPrediction; // reserved AI scaffolding, no logic in v1
  };

  // Shared view of a ticket returned by public endpoints.
  public type TicketView = {
    id : Common.TicketId;
    title : Text;
    description : Text;
    categoryId : Common.CategoryId;
    priorityId : Common.PriorityId;
    status : Common.TicketStatus;
    creator : Common.UserId;
    assignedAgent : ?Common.UserId;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
    closedAt : ?Common.Timestamp;
    slaDeadline : Common.Timestamp;
    attachments : [Common.Attachment];
    predictedCategory : ?Common.CategoryId;
    predictedPriority : ?Common.PriorityId;
    duplicateOf : ?Common.TicketId;
    suggestedSolution : ?Text;
  };

  // Input for creating a new ticket.
  public type TicketCreateInput = {
    title : Text;
    description : Text;
    categoryId : Common.CategoryId;
    priorityId : Common.PriorityId;
    attachments : [Common.Attachment];
  };

  // Input for updating a ticket (status, assignment, resolution).
  public type TicketUpdateInput = {
    ticketId : Common.TicketId;
    status : ?Common.TicketStatus;
    assignedAgent : ?Common.UserId;
    resolutionSummary : ?Text;
  };

  // Filter + sort + paginate request for ticket list endpoints.
  public type TicketQuery = {
    status : ?Common.TicketStatus;
    priorityId : ?Common.PriorityId;
    categoryId : ?Common.CategoryId;
    assignedAgent : ?Common.UserId;
    creator : ?Common.UserId;
    search : ?Text; // matches title or ticket id
    sortBy : ?{
      #createdAt;
      #updatedAt;
      #priority;
    };
    sortOrder : ?Common.SortOrder;
    page : Common.PageRequest;
  };

  // SLA status for a single ticket, used by the admin SLA monitor.
  public type TicketSLAStatus = {
    ticketId : Common.TicketId;
    title : Text;
    priorityId : Common.PriorityId;
    status : Common.TicketStatus;
    slaDeadline : Common.Timestamp;
    timeRemainingNs : Int; // negative when breached
    isBreached : Bool;
    isAtRisk : Bool;
  };

  // Ticket analytics for the admin dashboard.
  public type TicketAnalytics = {
    totalTickets : Nat;
    byStatus : [(Common.TicketStatus, Nat)];
    byCategory : [(Common.CategoryId, Nat)];
    byPriority : [(Common.PriorityId, Nat)];
    createdOverTime : [(Common.Timestamp, Nat)]; // bucketed counts
  };
};
