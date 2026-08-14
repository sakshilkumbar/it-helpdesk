import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Int "mo:core/Int";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Verify "mo:identity-attributes/Internal/Verify";
// OQL: import the *Value modules directly so their `_toRow` instances are in
// scope as module fields — the compiler walks them to resolve the implicit
// `_toRow : V -> Value` parameter on `Entity.payload`. Importing `Entity`
// alone (or the top-level `OQL` re-export) leaves those instances out of scope
// (M0072/M0098). `Entity` is imported directly so the builder functions
// (manual, payload, controllerOnly, public_, build) resolve as explicit
// module-function calls. `BoolValue` is needed for Bool payload fields
// (isActive, isRead); `Array`/`Iter` for the flattened ticketMessage iterator.
import Entity "mo:caffeineai-oql/Entity";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import Expose "mo:caffeineai-oql/Expose";

import Common "types/common";
import UserTypes "types/users";
import TicketTypes "types/tickets";
import CategoryTypes "types/categories";
import PriorityTypes "types/priorities";
import AuditTypes "types/audit";
import KnowledgeTypes "types/knowledge";
import NotificationTypes "types/notifications";
import SettingsTypes "types/settings";

import UsersApi "mixins/users-api";
import TicketsApi "mixins/tickets-api";
import RolesApi "mixins/roles-api";
import UserLib "lib/users";
import CategoriesApi "mixins/categories-api";
import PrioritiesApi "mixins/priorities-api";
import AuditApi "mixins/audit-api";
import KnowledgeApi "mixins/knowledge-api";
import NotificationsApi "mixins/notifications-api";
import SettingsApi "mixins/settings-api";

actor {
  // --- Authorization (existing) ---
  // accessControlState is initialized by the authorization package itself
  // (opaque internal type owned by caffeineai-authorization). It is NOT part
  // of our domain migration chain. Marked transient so enhanced orthogonal
  // persistence excludes it from stable storage and re-initializes it on
  // restart (it has a stable-field initializer, which the new system forbids
  // for non-transient fields).
  transient let accessControlState = AccessControl.initState();
  include MixinAuthorization(
    accessControlState,
    ?(func(caller : Principal, attrs : Verify.IdentityAttributes) {
      let existing : ?UserTypes.User = users.get(caller);
      switch (existing) {
        case (?_) {};
        case null {
          let name = switch (attrs.name) {
            case (?n) n;
            case null "User " # caller.toText();
          };
          let newUser : UserTypes.User = UserLib.createUser(caller, name, attrs.email, #employee, Int.abs(Time.now()));
          users.add(caller, newUser);
        };
      };
    }),
  );

  // --- Stable state (initialized by the migration chain) ---
  // Users
  let users : Map.Map<Common.UserId, UserTypes.User>;
  let nextUserId : { var next : Common.Timestamp };

  // Tickets + threads
  let tickets : Map.Map<Common.TicketId, TicketTypes.Ticket>;
  let ticketMessages : Map.Map<Common.TicketId, List.List<Common.TicketMessage>>;
  let nextTicketId : { var next : Common.TicketId };
  let nextMessageId : { var next : Common.MessageId };

  // Categories + priorities
  let categories : Map.Map<Common.CategoryId, CategoryTypes.Category>;
  let nextCategoryId : { var next : Common.CategoryId };
  let priorities : Map.Map<Common.PriorityId, PriorityTypes.Priority>;
  let nextPriorityId : { var next : Common.PriorityId };

  // Audit logs (chronological List)
  let auditLogs : List.List<AuditTypes.AuditLog>;
  let nextAuditLogId : { var next : Common.AuditLogId };

  // Knowledge base
  let knowledgeArticles : Map.Map<Common.KnowledgeArticleId, KnowledgeTypes.KnowledgeArticle>;
  let nextArticleId : { var next : Common.KnowledgeArticleId };

  // Notifications (chronological List)
  let notifications : List.List<NotificationTypes.Notification>;
  let nextNotificationId : { var next : Common.NotificationId };

  // System settings (single record)
  let systemSettings : SettingsTypes.SystemSettings;

  // --- Domain mixins ---
  include UsersApi(accessControlState, users, nextUserId, tickets, auditLogs, nextAuditLogId);
  include TicketsApi(accessControlState, tickets, ticketMessages, nextTicketId, nextMessageId, users, priorities, auditLogs, nextAuditLogId, notifications, nextNotificationId);
  include RolesApi(accessControlState, users, tickets, auditLogs, nextAuditLogId, notifications, nextNotificationId);
  include CategoriesApi(accessControlState, categories, nextCategoryId, auditLogs, nextAuditLogId);
  include PrioritiesApi(accessControlState, priorities, nextPriorityId, auditLogs, nextAuditLogId);
  include AuditApi(accessControlState, tickets, auditLogs, nextAuditLogId);
  include KnowledgeApi(accessControlState, knowledgeArticles, nextArticleId);
  include NotificationsApi(accessControlState, notifications, nextNotificationId);
  include SettingsApi(accessControlState, systemSettings, auditLogs, nextAuditLogId);

  // --- OQL: expose queryable entities to the Data Intelligence agent ---
  // Every persisted (non-transient) actor field that holds queryable data is
  // exposed here with appropriate per-table authorization:
  //   - ticket, ticketMessage, category, priority, auditLog: controllerOnly
  //     (private operational data the agent reads as controller; end users
  //     access their data through the regular shared endpoints, not OQL).
  //   - knowledgeArticle: public_ (admin-managed reference content, world-
  //     readable like a public knowledge base).
  //   - notification: scopedPerUser + ownedBy(recipient) (strictly private
  //     per-user data; the agent is intentionally blind to it).
  // Users are intentionally NOT exposed (they back auth only).
  // Manual mode is used throughout because these records carry `var` fields,
  // nested records, array fields, and variants that auto-derivation cannot
  // handle.
  //
  // Helpers for OQL variant-to-text conversion (variants are not auto-
  // derivable). Defined here (before the `include Expose` block) because
  // Motoko does not hoist `func` bindings in the actor body — they must be in
  // scope at the point the OQL entity declarations reference them.
  func statusToText(s : Common.TicketStatus) : Text {
    switch (s) {
      case (#open) "open";
      case (#in_progress) "in_progress";
      case (#pending) "pending";
      case (#resolved) "resolved";
      case (#closed) "closed";
    };
  };

  func actionToText(a : AuditTypes.AuditAction) : Text {
    switch (a) {
      case (#ticketCreated) "ticketCreated";
      case (#ticketStatusChanged) "ticketStatusChanged";
      case (#ticketAssigned) "ticketAssigned";
      case (#ticketClosed) "ticketClosed";
      case (#roleChanged) "roleChanged";
      case (#userDeactivated) "userDeactivated";
      case (#userReactivated) "userReactivated";
      case (#categoryCreated) "categoryCreated";
      case (#categoryUpdated) "categoryUpdated";
      case (#priorityUpdated) "priorityUpdated";
      case (#settingsUpdated) "settingsUpdated";
    };
  };

  func notificationTypeToText(n : NotificationTypes.NotificationType) : Text {
    switch (n) {
      case (#ticketAssigned) "ticketAssigned";
      case (#ticketUpdated) "ticketUpdated";
      case (#ticketClosed) "ticketClosed";
      case (#ticketReply) "ticketReply";
      case (#roleChanged) "roleChanged";
    };
  };

  // Flatten the nested ticketMessages map (Map<TicketId, List<TicketMessage>>)
  // into a single iterator over all messages, so each message becomes one
  // queryable row in the ticketMessage entity. Built eagerly at query time;
  // acceptable for the occasional Data Intelligence agent query.
  func allMessages() : Iter.Iter<Common.TicketMessage> {
    var acc : [Common.TicketMessage] = [];
    for (msgList in ticketMessages.values()) {
      acc := acc.concat(msgList.toArray());
    };
    acc.values();
  };

  include Expose({
    entities = [
      // Ticket — full record including description, closedAt, attachment
      // count, and the reserved AI placeholder fields (predictedCategory,
      // predictedPriority, duplicateOf, suggestedSolution). Options are
      // collapsed to sentinels (0 / "") so the schema type is stable and the
      // fields stay queryable. categoryId and priorityId are edged to the
      // category/priority entities for analytics joins.
      do {
        let b = Entity.manual<TicketTypes.Ticket>("ticket", func() = tickets.values(), "Ticket", "id");
        b.payload("id", func(t) = t.id)
          .payload("title", func(t) = t.title)
          .payload("description", func(t) = t.description)
          .payload("categoryId", func(t) = t.categoryId)
          .payload("priorityId", func(t) = t.priorityId)
          .payload("status", func(t) = statusToText(t.status))
          .payload("creator", func(t) = t.creator)
          .payload("assignedAgent", func(t) = switch (t.assignedAgent) { case (?a) a; case null Principal.fromText("aaaaa-aa") })
          .payload("createdAt", func(t) = t.createdAt)
          .payload("updatedAt", func(t) = t.updatedAt)
          .payload("closedAt", func(t) = switch (t.closedAt) { case (?ts) ts; case null 0 })
          .payload("slaDeadline", func(t) = t.slaDeadline)
          .payload("attachmentCount", func(t) = t.attachments.size())
          .payload("predictedCategory", func(t) = switch (t.ai.predictedCategory) { case (?c) c; case null 0 })
          .payload("predictedPriority", func(t) = switch (t.ai.predictedPriority) { case (?p) p; case null 0 })
          .payload("duplicateOf", func(t) = switch (t.ai.duplicateOf) { case (?d) d; case null 0 })
          .payload("suggestedSolution", func(t) = switch (t.ai.suggestedSolution) { case (?s) s; case null "" })
          .edge("categoryId", "category")
          .edge("priorityId", "priority")
          .controllerOnly()
          .build();
      },
      // Ticket message — one row per message across all ticket threads.
      // controllerOnly: private operational data the agent analyzes (response
      // times, reply counts); end users read threads via getTicketMessages.
      do {
        let b = Entity.manual<Common.TicketMessage>("ticketMessage", func() = allMessages(), "TicketMessage", "id");
        b.payload("id", func(m) = m.id)
          .payload("ticketId", func(m) = m.ticketId)
          .payload("author", func(m) = m.author)
          .payload("authorRole", func(m) = switch (m.authorRole) { case (#employee) "employee"; case (#l1_help_desk) "l1_help_desk"; case (#l2_resolver) "l2_resolver"; case (#admin) "admin" })
          .payload("body", func(m) = m.body)
          .payload("createdAt", func(m) = m.createdAt)
          .payload("isInternal", func(m) = m.isInternal)
          .edge("ticketId", "ticket")
          .controllerOnly()
          .build();
      },
      // Category — admin-managed reference data. controllerOnly so the agent
      // can join ticket.categoryId → category for "tickets by category"
      // analytics while keeping direct OQL reads admin-side.
      do {
        let b = Entity.manual<CategoryTypes.Category>("category", func() = categories.values(), "Category", "id");
        b.payload("id", func(c) = c.id)
          .payload("name", func(c) = c.name)
          .payload("description", func(c) = c.description)
          .payload("isActive", func(c) = c.isActive)
          .payload("createdAt", func(c) = c.createdAt)
          .controllerOnly()
          .build();
      },
      // Priority — admin-managed reference data with SLA targets.
      // controllerOnly for the same reason as category; enables
      // "tickets by priority" and SLA analytics joins.
      do {
        let b = Entity.manual<PriorityTypes.Priority>("priority", func() = priorities.values(), "Priority", "id");
        b.payload("id", func(p) = p.id)
          .payload("name", func(p) = p.name)
          .payload("level", func(p) = p.level)
          .payload("slaTargetNs", func(p) = p.slaTargetNs)
          .payload("isActive", func(p) = p.isActive)
          .payload("createdAt", func(p) = p.createdAt)
          .controllerOnly()
          .build();
      },
      // Audit log — admin-only chronological action history.
      do {
        let b = Entity.manual<AuditTypes.AuditLog>("auditLog", func() = auditLogs.values(), "AuditLog", "id");
        b.payload("id", func(l) = l.id)
          .payload("actorId", func(l) = l.actorId)
          .payload("action", func(l) = actionToText(l.action))
          .payload("targetEntity", func(l) = l.targetEntity)
          .payload("timestamp", func(l) = l.timestamp)
          .payload("detail", func(l) = l.detail)
          .controllerOnly()
          .build();
      },
      // Knowledge article — admin-managed, public-readable reference content.
      // categoryId is exposed (0 sentinel for null) for category joins.
      do {
        let b = Entity.manual<KnowledgeTypes.KnowledgeArticle>("knowledgeArticle", func() = knowledgeArticles.values(), "KnowledgeArticle", "id");
        b.payload("id", func(a) = a.id)
          .payload("title", func(a) = a.title)
          .payload("content", func(a) = a.content)
          .payload("categoryId", func(a) = switch (a.categoryId) { case (?c) c; case null 0 })
          .payload("createdAt", func(a) = a.createdAt)
          .payload("updatedAt", func(a) = a.updatedAt)
          .public_()
          .build();
      },
      // Notification — strictly private per-user in-app notifications.
      // scopedPerUser + ownedBy(recipient): each signed-in user reads only
      // their own notifications; the Data Intelligence agent is intentionally
      // blind to this table (notifications are not aggregate analytics data).
      do {
        let b = Entity.manual<NotificationTypes.Notification>("notification", func() = notifications.values(), "Notification", "id");
        b.payload("id", func(n) = n.id)
          .payload("recipient", func(n) = n.recipient)
          .payload("notificationType", func(n) = notificationTypeToText(n.notificationType))
          .payload("message", func(n) = n.message)
          .payload("linkTicketId", func(n) = switch (n.linkTicketId) { case (?t) t; case null 0 })
          .payload("createdAt", func(n) = n.createdAt)
          .payload("isRead", func(n) = n.isRead)
          .ownedBy("recipient")
          .scopedPerUser()
          .build();
      },
    ];
  });
};
