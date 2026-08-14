// Role-split migration: replaces the single #support_agent role with two
// distinct resolver roles (#l1_help_desk, #l2_resolver) across all stable
// state that carries an AppRole.
//
// OldActor mirrors the previously deployed stable signature (3-role AppRole:
// #employee / #support_agent / #admin). NewActor mirrors the new stable
// signature (4-role AppRole: #employee / #l1_help_desk / #l2_resolver / #admin).
//
// Transformation:
//   - User.role : #support_agent -> #l1_help_desk (default resolver tier)
//   - TicketMessage.authorRole : #support_agent -> #l1_help_desk
//   - All other fields pass through unchanged.
//
// Self-contained: only mo:core imports; old AND new types inlined. The chain
// replays forever, so a frozen migration that imported project types would
// break when those types change.
import Map "mo:core/Map";
import List "mo:core/List";

module {
  // ---- Old types (previously deployed: 3-role model) ----
  type OldAppRole = {
    #employee;
    #support_agent;
    #admin;
  };

  type OldTicketStatus = {
    #open;
    #in_progress;
    #pending;
    #resolved;
    #closed;
  };

  type OldAuditAction = {
    #ticketCreated;
    #ticketStatusChanged;
    #ticketAssigned;
    #ticketClosed;
    #roleChanged;
    #userDeactivated;
    #userReactivated;
    #categoryCreated;
    #categoryUpdated;
    #priorityUpdated;
    #settingsUpdated;
  };

  type OldNotificationType = {
    #ticketAssigned;
    #ticketUpdated;
    #ticketClosed;
    #ticketReply;
    #roleChanged;
  };

  type OldAttachment = {
    id : Nat;
    fileName : Text;
    mimeType : Text;
    sizeBytes : Nat;
    storageKey : Text;
    uploadedBy : Principal;
    uploadedAt : Nat;
  };

  type OldTicketAIPrediction = {
    var predictedCategory : ?Nat;
    var predictedPriority : ?Nat;
    var duplicateOf : ?Nat;
    var suggestedSolution : ?Text;
  };

  type OldUser = {
    id : Principal;
    var displayName : Text;
    var email : ?Text;
    var role : OldAppRole;
    var isActive : Bool;
    var createdAt : Nat;
    var lastSeenAt : ?Nat;
  };

  type OldTicket = {
    id : Nat;
    var title : Text;
    var description : Text;
    var categoryId : Nat;
    var priorityId : Nat;
    var status : OldTicketStatus;
    var creator : Principal;
    var assignedAgent : ?Principal;
    var createdAt : Nat;
    var updatedAt : Nat;
    var closedAt : ?Nat;
    var slaDeadline : Nat;
    var attachments : [OldAttachment];
    var ai : OldTicketAIPrediction;
  };

  type OldTicketMessage = {
    id : Nat;
    ticketId : Nat;
    author : Principal;
    authorRole : OldAppRole;
    body : Text;
    createdAt : Nat;
    isInternal : Bool;
  };

  type OldCategory = {
    id : Nat;
    var name : Text;
    var description : Text;
    var isActive : Bool;
    var createdAt : Nat;
  };

  type OldPriority = {
    id : Nat;
    var name : Text;
    var level : Nat;
    var slaTargetNs : Nat;
    var isActive : Bool;
    var createdAt : Nat;
  };

  type OldAuditLog = {
    id : Nat;
    actorId : Principal;
    action : OldAuditAction;
    targetEntity : Text;
    timestamp : Nat;
    detail : Text;
  };

  type OldKnowledgeArticle = {
    id : Nat;
    var title : Text;
    var content : Text;
    var categoryId : ?Nat;
    var createdAt : Nat;
    var updatedAt : Nat;
  };

  type OldNotification = {
    id : Nat;
    var recipient : Principal;
    var notificationType : OldNotificationType;
    var message : Text;
    var linkTicketId : ?Nat;
    var createdAt : Nat;
    var isRead : Bool;
  };

  type OldSystemSettings = {
    var organizationName : Text;
    var aiFeaturesEnabled : Bool;
    var updatedAt : Nat;
  };

  type OldActor = {
    users : Map.Map<Principal, OldUser>;
    nextUserId : { var next : Nat };
    tickets : Map.Map<Nat, OldTicket>;
    ticketMessages : Map.Map<Nat, List.List<OldTicketMessage>>;
    nextTicketId : { var next : Nat };
    nextMessageId : { var next : Nat };
    categories : Map.Map<Nat, OldCategory>;
    nextCategoryId : { var next : Nat };
    priorities : Map.Map<Nat, OldPriority>;
    nextPriorityId : { var next : Nat };
    auditLogs : List.List<OldAuditLog>;
    nextAuditLogId : { var next : Nat };
    knowledgeArticles : Map.Map<Nat, OldKnowledgeArticle>;
    nextArticleId : { var next : Nat };
    notifications : List.List<OldNotification>;
    nextNotificationId : { var next : Nat };
    systemSettings : OldSystemSettings;
  };

  // ---- New types (4-role model) ----
  type NewAppRole = {
    #employee;
    #l1_help_desk;
    #l2_resolver;
    #admin;
  };

  type NewTicketStatus = {
    #open;
    #in_progress;
    #pending;
    #resolved;
    #closed;
  };

  type NewAuditAction = {
    #ticketCreated;
    #ticketStatusChanged;
    #ticketAssigned;
    #ticketClosed;
    #roleChanged;
    #userDeactivated;
    #userReactivated;
    #categoryCreated;
    #categoryUpdated;
    #priorityUpdated;
    #settingsUpdated;
  };

  type NewNotificationType = {
    #ticketAssigned;
    #ticketUpdated;
    #ticketClosed;
    #ticketReply;
    #roleChanged;
  };

  type NewAttachment = {
    id : Nat;
    fileName : Text;
    mimeType : Text;
    sizeBytes : Nat;
    storageKey : Text;
    uploadedBy : Principal;
    uploadedAt : Nat;
  };

  type NewTicketAIPrediction = {
    var predictedCategory : ?Nat;
    var predictedPriority : ?Nat;
    var duplicateOf : ?Nat;
    var suggestedSolution : ?Text;
  };

  type NewUser = {
    id : Principal;
    var displayName : Text;
    var email : ?Text;
    var role : NewAppRole;
    var isActive : Bool;
    var createdAt : Nat;
    var lastSeenAt : ?Nat;
  };

  type NewTicket = {
    id : Nat;
    var title : Text;
    var description : Text;
    var categoryId : Nat;
    var priorityId : Nat;
    var status : NewTicketStatus;
    var creator : Principal;
    var assignedAgent : ?Principal;
    var createdAt : Nat;
    var updatedAt : Nat;
    var closedAt : ?Nat;
    var slaDeadline : Nat;
    var attachments : [NewAttachment];
    var ai : NewTicketAIPrediction;
  };

  type NewTicketMessage = {
    id : Nat;
    ticketId : Nat;
    author : Principal;
    authorRole : NewAppRole;
    body : Text;
    createdAt : Nat;
    isInternal : Bool;
  };

  type NewCategory = {
    id : Nat;
    var name : Text;
    var description : Text;
    var isActive : Bool;
    var createdAt : Nat;
  };

  type NewPriority = {
    id : Nat;
    var name : Text;
    var level : Nat;
    var slaTargetNs : Nat;
    var isActive : Bool;
    var createdAt : Nat;
  };

  type NewAuditLog = {
    id : Nat;
    actorId : Principal;
    action : NewAuditAction;
    targetEntity : Text;
    timestamp : Nat;
    detail : Text;
  };

  type NewKnowledgeArticle = {
    id : Nat;
    var title : Text;
    var content : Text;
    var categoryId : ?Nat;
    var createdAt : Nat;
    var updatedAt : Nat;
  };

  type NewNotification = {
    id : Nat;
    var recipient : Principal;
    var notificationType : NewNotificationType;
    var message : Text;
    var linkTicketId : ?Nat;
    var createdAt : Nat;
    var isRead : Bool;
  };

  type NewSystemSettings = {
    var organizationName : Text;
    var aiFeaturesEnabled : Bool;
    var updatedAt : Nat;
  };

  type NewActor = {
    users : Map.Map<Principal, NewUser>;
    nextUserId : { var next : Nat };
    tickets : Map.Map<Nat, NewTicket>;
    ticketMessages : Map.Map<Nat, List.List<NewTicketMessage>>;
    nextTicketId : { var next : Nat };
    nextMessageId : { var next : Nat };
    categories : Map.Map<Nat, NewCategory>;
    nextCategoryId : { var next : Nat };
    priorities : Map.Map<Nat, NewPriority>;
    nextPriorityId : { var next : Nat };
    auditLogs : List.List<NewAuditLog>;
    nextAuditLogId : { var next : Nat };
    knowledgeArticles : Map.Map<Nat, NewKnowledgeArticle>;
    nextArticleId : { var next : Nat };
    notifications : List.List<NewNotification>;
    nextNotificationId : { var next : Nat };
    systemSettings : NewSystemSettings;
  };

  // Map an old AppRole to the new 4-role model. #support_agent becomes
  // #l1_help_desk (the default resolver tier per the role-split spec);
  // #employee and #admin pass through unchanged.
  func migrateRole(old : OldAppRole) : NewAppRole {
    switch (old) {
      case (#employee) #employee;
      case (#support_agent) #l1_help_desk;
      case (#admin) #admin;
    };
  };

  // TicketStatus, AuditAction, and NotificationType are unchanged between old
  // and new — cast through the switch so the compiler sees the new type.
  func migrateStatus(old : OldTicketStatus) : NewTicketStatus {
    switch (old) {
      case (#open) #open;
      case (#in_progress) #in_progress;
      case (#pending) #pending;
      case (#resolved) #resolved;
      case (#closed) #closed;
    };
  };

  func migrateAuditAction(old : OldAuditAction) : NewAuditAction {
    switch (old) {
      case (#ticketCreated) #ticketCreated;
      case (#ticketStatusChanged) #ticketStatusChanged;
      case (#ticketAssigned) #ticketAssigned;
      case (#ticketClosed) #ticketClosed;
      case (#roleChanged) #roleChanged;
      case (#userDeactivated) #userDeactivated;
      case (#userReactivated) #userReactivated;
      case (#categoryCreated) #categoryCreated;
      case (#categoryUpdated) #categoryUpdated;
      case (#priorityUpdated) #priorityUpdated;
      case (#settingsUpdated) #settingsUpdated;
    };
  };

  func migrateNotificationType(old : OldNotificationType) : NewNotificationType {
    switch (old) {
      case (#ticketAssigned) #ticketAssigned;
      case (#ticketUpdated) #ticketUpdated;
      case (#ticketClosed) #ticketClosed;
      case (#ticketReply) #ticketReply;
      case (#roleChanged) #roleChanged;
    };
  };

  // Attachment is an immutable record with no AppRole field — cast field by
  // field so the compiler accepts the new type.
  func migrateAttachment(old : OldAttachment) : NewAttachment {
    {
      id = old.id;
      fileName = old.fileName;
      mimeType = old.mimeType;
      sizeBytes = old.sizeBytes;
      storageKey = old.storageKey;
      uploadedBy = old.uploadedBy;
      uploadedAt = old.uploadedAt;
    };
  };

  // TicketAIPrediction has only var fields with primitive option types —
  // rebuild from the old var fields.
  func migrateAI(old : OldTicketAIPrediction) : NewTicketAIPrediction {
    {
      var predictedCategory = old.predictedCategory;
      var predictedPriority = old.predictedPriority;
      var duplicateOf = old.duplicateOf;
      var suggestedSolution = old.suggestedSolution;
    };
  };

  // User: rebuild as a NewUser because the var role field is typed OldAppRole
  // on the old record and cannot be reassigned a NewAppRole in place. Copy all
  // other var fields across.
  func migrateUser(old : OldUser) : NewUser {
    {
      id = old.id;
      var displayName = old.displayName;
      var email = old.email;
      var role = migrateRole(old.role);
      var isActive = old.isActive;
      var createdAt = old.createdAt;
      var lastSeenAt = old.lastSeenAt;
    };
  };

  // Ticket: rebuild as a NewTicket because the var status field is typed
  // OldTicketStatus on the old record and cannot be reassigned a NewTicketStatus
  // in place. attachments and ai are var fields too — rebuild with the new
  // types.
  func migrateTicket(old : OldTicket) : NewTicket {
    {
      id = old.id;
      var title = old.title;
      var description = old.description;
      var categoryId = old.categoryId;
      var priorityId = old.priorityId;
      var status = migrateStatus(old.status);
      var creator = old.creator;
      var assignedAgent = old.assignedAgent;
      var createdAt = old.createdAt;
      var updatedAt = old.updatedAt;
      var closedAt = old.closedAt;
      var slaDeadline = old.slaDeadline;
      var attachments = old.attachments.map(migrateAttachment);
      var ai = migrateAI(old.ai);
    };
  };

  // TicketMessage: authorRole is an IMMUTABLE field, so the record must be
  // rebuilt with the migrated role.
  func migrateMessage(old : OldTicketMessage) : NewTicketMessage {
    {
      id = old.id;
      ticketId = old.ticketId;
      author = old.author;
      authorRole = migrateRole(old.authorRole);
      body = old.body;
      createdAt = old.createdAt;
      isInternal = old.isInternal;
    };
  };

  // Category, Priority, KnowledgeArticle: no AppRole fields — pass through.
  // Cast through the new type so the compiler accepts the result.
  func migrateCategory(old : OldCategory) : NewCategory {
    old;
  };

  func migratePriority(old : OldPriority) : NewPriority {
    old;
  };

  func migrateKnowledgeArticle(old : OldKnowledgeArticle) : NewKnowledgeArticle {
    old;
  };

  // AuditLog: action is immutable — rebuild with the migrated action.
  func migrateAuditLog(old : OldAuditLog) : NewAuditLog {
    {
      id = old.id;
      actorId = old.actorId;
      action = migrateAuditAction(old.action);
      targetEntity = old.targetEntity;
      timestamp = old.timestamp;
      detail = old.detail;
    };
  };

  // Notification: rebuild as a NewNotification because the var
  // notificationType field is typed OldNotificationType on the old record and
  // cannot be reassigned a NewNotificationType in place.
  func migrateNotification(old : OldNotification) : NewNotification {
    {
      id = old.id;
      var recipient = old.recipient;
      var notificationType = migrateNotificationType(old.notificationType);
      var message = old.message;
      var linkTicketId = old.linkTicketId;
      var createdAt = old.createdAt;
      var isRead = old.isRead;
    };
  };

  // SystemSettings: no AppRole fields — pass through.
  func migrateSettings(old : OldSystemSettings) : NewSystemSettings {
    old;
  };

  public func migration(old : OldActor) : NewActor {
    // Users: mutate var role in place via the map.
    let newUsers = old.users.map<Principal, OldUser, NewUser>(
      func(_, u) = migrateUser(u),
    );
    // Tickets: mutate var fields in place.
    let newTickets = old.tickets.map<Nat, OldTicket, NewTicket>(
      func(_, t) = migrateTicket(t),
    );
    // TicketMessages: rebuild each message (authorRole is immutable).
    let newTicketMessages = old.ticketMessages.map<Nat, List.List<OldTicketMessage>, List.List<NewTicketMessage>>(
      func(_, msgList) {
        let migrated = msgList.toArray().map(migrateMessage);
        let newList = List.empty<NewTicketMessage>();
        for (m in migrated.values()) {
          newList.add(m);
        };
        newList;
      },
    );
    // Categories, priorities, knowledge: pass through.
    let newCategories = old.categories.map<Nat, OldCategory, NewCategory>(
      func(_, c) = migrateCategory(c),
    );
    let newPriorities = old.priorities.map<Nat, OldPriority, NewPriority>(
      func(_, p) = migratePriority(p),
    );
    let newKnowledgeArticles = old.knowledgeArticles.map<Nat, OldKnowledgeArticle, NewKnowledgeArticle>(
      func(_, a) = migrateKnowledgeArticle(a),
    );
    // Audit logs: rebuild each (action is immutable).
    let migratedAudit = old.auditLogs.toArray().map(migrateAuditLog);
    let newAuditLogs = List.empty<NewAuditLog>();
    for (l in migratedAudit.values()) {
      newAuditLogs.add(l);
    };
    // Notifications: mutate var notificationType in place.
    let migratedNotifs = old.notifications.toArray().map(migrateNotification);
    let newNotifications = List.empty<NewNotification>();
    for (n in migratedNotifs.values()) {
      newNotifications.add(n);
    };
    // System settings: pass through.
    let newSettings = migrateSettings(old.systemSettings);

    {
      users = newUsers;
      nextUserId = old.nextUserId;
      tickets = newTickets;
      ticketMessages = newTicketMessages;
      nextTicketId = old.nextTicketId;
      nextMessageId = old.nextMessageId;
      categories = newCategories;
      nextCategoryId = old.nextCategoryId;
      priorities = newPriorities;
      nextPriorityId = old.nextPriorityId;
      auditLogs = newAuditLogs;
      nextAuditLogId = old.nextAuditLogId;
      knowledgeArticles = newKnowledgeArticles;
      nextArticleId = old.nextArticleId;
      notifications = newNotifications;
      nextNotificationId = old.nextNotificationId;
      systemSettings = newSettings;
    };
  };
};
