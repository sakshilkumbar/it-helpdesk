module {
  // Cross-cutting identifiers and primitives shared across domains.
  public type Timestamp = Nat; // nanoseconds since epoch (Time.now())
  public type TicketId = Nat;
  public type CategoryId = Nat;
  public type PriorityId = Nat;
  public type UserId = Principal;
  public type MessageId = Nat;
  public type AttachmentId = Nat;
  public type AuditLogId = Nat;
  public type KnowledgeArticleId = Nat;
  public type NotificationId = Nat;

  // Application roles. The single #support_agent role has been split into two
  // distinct resolver roles for the four-role ITSM model:
  //   - #l1_help_desk : first-line triage, ticket intake, basic resolution
  //   - #l2_resolver   : escalated, specialized resolution
  // #employee and #admin continue unchanged.
  // NOTE: caffeineai-authorization's UserRole is { #admin; #user; #guest }.
  // We layer our own AppRole on top so the frontend can distinguish the four
  // business roles while still mapping to the underlying access-control
  // permission tiers (#l1_help_desk and #l2_resolver both map to the #user
  // access-control tier; only #admin maps to the #admin tier).
  public type AppRole = {
    #employee;
    #l1_help_desk;
    #l2_resolver;
    #admin;
  };

  // Resolver-tier classification. Both #l1_help_desk and #l2_resolver are
  // resolver roles; #employee and #admin are not. Used by assignment and
  // escalation rules to distinguish "is this a resolver?" from the specific
  // resolver tier.
  public type ResolverTier = {
    #l1;
    #l2;
  };

  // Generic pagination request shared by all list endpoints.
  public type PageRequest = {
    page : Nat; // 1-indexed
    pageSize : Nat;
  };

  // Generic paginated response wrapper.
  public type Page<T> = {
    items : [T];
    page : Nat;
    pageSize : Nat;
    total : Nat;
  };

  // Sort direction used by list endpoints.
  public type SortOrder = {
    #asc;
    #desc;
  };

  // Ticket status lifecycle.
  public type TicketStatus = {
    #open;
    #in_progress;
    #pending;
    #resolved;
    #closed;
  };

  // Attachment metadata stored alongside a ticket.
  public type Attachment = {
    id : AttachmentId;
    fileName : Text;
    mimeType : Text;
    sizeBytes : Nat;
    storageKey : Text; // object-storage key returned by the storage client
    uploadedBy : UserId;
    uploadedAt : Timestamp;
  };

  // A single message in a ticket thread.
  public type TicketMessage = {
    id : MessageId;
    ticketId : TicketId;
    author : UserId;
    authorRole : AppRole;
    body : Text;
    createdAt : Timestamp;
    isInternal : Bool; // true = agent-only internal note, not shown to employee
  };

  // Reserved AI fields on a ticket. All nullable and initially empty so the
  // UI can surface them as placeholders. No AI logic is implemented in v1.
  public type TicketAIPrediction = {
    var predictedCategory : ?CategoryId;
    var predictedPriority : ?PriorityId;
    var duplicateOf : ?TicketId;
    var suggestedSolution : ?Text;
  };
};
