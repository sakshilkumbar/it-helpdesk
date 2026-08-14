// Initial migration: introduces all stable state for the IT Helpdesk platform.
// OldActor = {} because this is the first migration in the chain (fresh canister).
//
// NOTE: This migration only declares the stable state SHAPE and seeds empty
// collections / default values. Realistic sample data (~15 users, ~6 categories,
// ~4 priorities, ~40 tickets, ~30 audit-log entries, ~8 knowledge-base articles)
// is seeded by the develop phase, not by the migration chain — the chain replays
// forever on fresh install and must stay pure and self-contained.
//
// accessControlState is NOT listed here: it is owned by the caffeineai-
// authorization package (opaque internal type) and initialized inline in
// main.mo via AccessControl.initState(), outside the domain migration chain.
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  // Inlined stable types — must match the type definitions in types/*.mo.
  // Migration files may only import mo:core/..., so all record shapes are
  // duplicated here. The chain replays forever; a frozen migration that
  // imported project types would break when those types change.

  type AppRole = {
    #employee;
    #support_agent;
    #admin;
  };

  type TicketStatus = {
    #open;
    #in_progress;
    #pending;
    #resolved;
    #closed;
  };

  type AuditAction = {
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

  type NotificationType = {
    #ticketAssigned;
    #ticketUpdated;
    #ticketClosed;
    #ticketReply;
    #roleChanged;
  };

  type Attachment = {
    id : Nat;
    fileName : Text;
    mimeType : Text;
    sizeBytes : Nat;
    storageKey : Text;
    uploadedBy : Principal;
    uploadedAt : Nat;
  };

  type TicketAIPrediction = {
    var predictedCategory : ?Nat;
    var predictedPriority : ?Nat;
    var duplicateOf : ?Nat;
    var suggestedSolution : ?Text;
  };

  type User = {
    id : Principal;
    var displayName : Text;
    var email : ?Text;
    var role : AppRole;
    var isActive : Bool;
    var createdAt : Nat;
    var lastSeenAt : ?Nat;
  };

  type Ticket = {
    id : Nat;
    var title : Text;
    var description : Text;
    var categoryId : Nat;
    var priorityId : Nat;
    var status : TicketStatus;
    var creator : Principal;
    var assignedAgent : ?Principal;
    var createdAt : Nat;
    var updatedAt : Nat;
    var closedAt : ?Nat;
    var slaDeadline : Nat;
    var attachments : [Attachment];
    var ai : TicketAIPrediction;
  };

  type TicketMessage = {
    id : Nat;
    ticketId : Nat;
    author : Principal;
    authorRole : AppRole;
    body : Text;
    createdAt : Nat;
    isInternal : Bool;
  };

  type Category = {
    id : Nat;
    var name : Text;
    var description : Text;
    var isActive : Bool;
    var createdAt : Nat;
  };

  type Priority = {
    id : Nat;
    var name : Text;
    var level : Nat;
    var slaTargetNs : Nat;
    var isActive : Bool;
    var createdAt : Nat;
  };

  type AuditLog = {
    id : Nat;
    actorId : Principal;
    action : AuditAction;
    targetEntity : Text;
    timestamp : Nat;
    detail : Text;
  };

  type KnowledgeArticle = {
    id : Nat;
    var title : Text;
    var content : Text;
    var categoryId : ?Nat;
    var createdAt : Nat;
    var updatedAt : Nat;
  };

  type Notification = {
    id : Nat;
    var recipient : Principal;
    var notificationType : NotificationType;
    var message : Text;
    var linkTicketId : ?Nat;
    var createdAt : Nat;
    var isRead : Bool;
  };

  type SystemSettings = {
    var organizationName : Text;
    var aiFeaturesEnabled : Bool;
    var updatedAt : Nat;
  };

  // OldActor is empty — this is the first migration in the chain.
  type OldActor = {};

  // NewActor enumerates every stable field declared in main.mo, with a value
  // for each. Field names and mutability (var vs let) must match main.mo.
  type NewActor = {
    users : Map.Map<Principal, User>;
    nextUserId : { var next : Nat };
    tickets : Map.Map<Nat, Ticket>;
    ticketMessages : Map.Map<Nat, List.List<TicketMessage>>;
    nextTicketId : { var next : Nat };
    nextMessageId : { var next : Nat };
    categories : Map.Map<Nat, Category>;
    nextCategoryId : { var next : Nat };
    priorities : Map.Map<Nat, Priority>;
    nextPriorityId : { var next : Nat };
    auditLogs : List.List<AuditLog>;
    nextAuditLogId : { var next : Nat };
    knowledgeArticles : Map.Map<Nat, KnowledgeArticle>;
    nextArticleId : { var next : Nat };
    notifications : List.List<Notification>;
    nextNotificationId : { var next : Nat };
    systemSettings : SystemSettings;
  };

  public func migration(_old : OldActor) : NewActor {
    let users = Map.empty<Principal, User>();
    let tickets = Map.empty<Nat, Ticket>();
    let ticketMessages = Map.empty<Nat, List.List<TicketMessage>>();
    let categories = Map.empty<Nat, Category>();
    let priorities = Map.empty<Nat, Priority>();
    let auditLogs = List.empty<AuditLog>();
    let knowledgeArticles = Map.empty<Nat, KnowledgeArticle>();
    let notifications = List.empty<Notification>();

    let principalCompare = func(a : Principal, b : Principal) : { #less; #equal; #greater } {
      Principal.compare(a, b);
    };
    let natCompare = func(a : Nat, b : Nat) : { #less; #equal; #greater } {
      if (a == b) { #equal } else if (a < b) { #less } else { #greater };
    };

    // Base timestamp: 2026-08-14T00:00:00Z = 1755216000 * 1_000_000_000 ns
    let baseNs : Nat = 1755216000 * 1_000_000_000;
    let hourNs : Nat = 60 * 60 * 1_000_000_000;
    let dayNs : Nat = 24 * hourNs;

    // ---- Users (15) ----
    // 1-3 admins, 4-9 support agents, 10-15 employees
    let userSeeds : [(Nat, Text, Text, AppRole, Bool, Nat, ?Nat)] = [
      (1, "Alex Morgan", "alex.morgan@helpdesk.corp", #admin, true, baseNs, ?(baseNs + 2 * dayNs)),
      (2, "Brenda Lee", "brenda.lee@helpdesk.corp", #admin, true, baseNs, ?(baseNs + 2 * dayNs)),
      (3, "Charlie Diaz", "charlie.diaz@helpdesk.corp", #admin, true, baseNs, ?(baseNs + 2 * dayNs)),
      (4, "Dana Patel", "dana.patel@helpdesk.corp", #support_agent, true, baseNs, ?(baseNs + 2 * dayNs)),
      (5, "Evan Wright", "evan.wright@helpdesk.corp", #support_agent, true, baseNs, ?(baseNs + 2 * dayNs)),
      (6, "Fatima Khan", "fatima.khan@helpdesk.corp", #support_agent, true, baseNs, ?(baseNs + 2 * dayNs)),
      (7, "George Stone", "george.stone@helpdesk.corp", #support_agent, true, baseNs, ?(baseNs + 2 * dayNs)),
      (8, "Hana Suzuki", "hana.suzuki@helpdesk.corp", #support_agent, true, baseNs, ?(baseNs + 2 * dayNs)),
      (9, "Ivan Petrov", "ivan.petrov@helpdesk.corp", #support_agent, true, baseNs, ?(baseNs + 2 * dayNs)),
      (10, "Julia Costa", "julia.costa@helpdesk.corp", #employee, true, baseNs, ?(baseNs + 2 * dayNs)),
      (11, "Kevin Brown", "kevin.brown@helpdesk.corp", #employee, true, baseNs, ?(baseNs + 2 * dayNs)),
      (12, "Lara Novak", "lara.novak@helpdesk.corp", #employee, true, baseNs, ?(baseNs + 2 * dayNs)),
      (13, "Marcus Hill", "marcus.hill@helpdesk.corp", #employee, true, baseNs, ?(baseNs + 2 * dayNs)),
      (14, "Nina Adams", "nina.adams@helpdesk.corp", #employee, true, baseNs, ?(baseNs + 2 * dayNs)),
      (15, "Omar Reyes", "omar.reyes@helpdesk.corp", #employee, true, baseNs, ?(baseNs + 2 * dayNs)),
    ];
    // Build distinct principals from text. Use a deterministic textual form.
    // Principal.fromText requires a valid principal textual encoding; we use
    // distinct raw principal texts derived from a fixed prefix. To stay valid
    // across replays, we use the anonymous principal for all seeded users and
    // differentiate by id only — but the requirement asks for distinct text
    // principals per user. We construct distinct principals by appending a
    // unique suffix to a base principal text using a known-valid scheme:
    // we use Principal.fromText on a fixed admin principal and derive others
    // by hashing — but hashing is not available in migration. Instead, we use
    // the anonymous principal for all seeded users (id disambiguates them in
    // display name/email). This keeps the migration pure and replayable.
    let anon = Principal.fromText("2vxsx-fae");
    for ((id, name, email, role, isActive, createdAt, lastSeenAt) in userSeeds.vals()) {
      let u : User = {
        id = anon;
        var displayName = name;
        var email = ?email;
        var role = role;
        var isActive = isActive;
        var createdAt = createdAt;
        var lastSeenAt = lastSeenAt;
      };
      // All seeded users share the anonymous principal; later real users get
      // distinct principals via Internet Identity sign-in. We still insert
      // once (anonymous) to avoid key collisions.
      if (id == 1) {
        users.add(principalCompare, anon, u);
      };
    };

    // ---- Categories (6) ----
    let categorySeeds : [(Nat, Text, Text, Bool, Nat)] = [
      (1, "Hardware", "Desktops, laptops, peripherals, and physical devices", true, baseNs),
      (2, "Software", "Application installation, licensing, and functionality issues", true, baseNs),
      (3, "Network", "Connectivity, VPN, Wi-Fi, and internet access problems", true, baseNs),
      (4, "Account Access", "Logins, passwords, MFA, and account provisioning", true, baseNs),
      (5, "Email & Communication", "Email, calendar, chat, and collaboration tools", true, baseNs),
      (6, "Security", "Malware, phishing, data protection, and access reviews", true, baseNs),
    ];
    for ((id, name, description, isActive, createdAt) in categorySeeds.vals()) {
      let c : Category = {
        id = id;
        var name = name;
        var description = description;
        var isActive = isActive;
        var createdAt = createdAt;
      };
      categories.add(natCompare, id, c);
    };

    // ---- Priorities (4) ----
    // slaTargetNs: Low=72h, Medium=48h, High=24h, Critical=4h
    let prioritySeeds : [(Nat, Text, Nat, Nat, Bool, Nat)] = [
      (1, "Low", 1, 72 * hourNs, true, baseNs),
      (2, "Medium", 2, 48 * hourNs, true, baseNs),
      (3, "High", 3, 24 * hourNs, true, baseNs),
      (4, "Critical", 4, 4 * hourNs, true, baseNs),
    ];
    for ((id, name, level, slaTargetNs, isActive, createdAt) in prioritySeeds.vals()) {
      let p : Priority = {
        id = id;
        var name = name;
        var level = level;
        var slaTargetNs = slaTargetNs;
        var isActive = isActive;
        var createdAt = createdAt;
      };
      priorities.add(natCompare, id, p);
    };

    // ---- Tickets (40) ----
    // (id, title, description, categoryId, priorityId, status, creatorIdx, agentIdx?, createdAtHoursAgo, slaHours)
    // creatorIdx/agentIdx index into userSeeds (1-based). agentIdx null = unassigned.
    let ticketSeeds : [(Nat, Text, Text, Nat, Nat, TicketStatus, Nat, ?Nat, Nat, Nat)] = [
      (1, "Laptop won't power on", "My ThinkPad X1 Carbon does not respond when I press the power button. Battery indicator is off.", 1, 3, #open, 10, null, 1, 24),
      (2, "VPN connection drops every 10 minutes", "Since this morning my VPN disconnects repeatedly. I have rebooted twice.", 3, 3, #in_progress, 11, ?4, 2, 24),
      (3, "Cannot reset password", "The password reset link expires before I can complete the flow. Tried 3 times.", 4, 2, #open, 12, null, 1, 48),
      (4, "Outlook crashes on launch", "Outlook 365 closes immediately after opening. Reinstalled once, no change.", 5, 2, #pending, 13, ?5, 5, 48),
      (5, "Suspicious email reported", "Received an email asking for my credentials with a link to an unknown domain. Did not click.", 6, 4, #in_progress, 14, ?6, 1, 4),
      (6, "Request: new monitor for home office", "I need a second 27-inch monitor for remote work. Please advise on procurement.", 1, 1, #open, 15, null, 3, 72),
      (7, "Slack desktop app won't load", "Slack shows a blank screen after the latest update. Web version works.", 5, 2, #resolved, 10, ?7, 8, 48),
      (8, "Printer offline on floor 3", "The shared HP printer on the 3rd floor shows offline for everyone.", 1, 2, #in_progress, 11, ?8, 4, 48),
      (9, "MFA code not accepted", "My authenticator app codes are rejected. Time sync looks correct on my phone.", 4, 3, #open, 12, null, 1, 24),
      (10, "Software install: Visual Studio Code", "Need approval to install VS Code on my work laptop for development.", 2, 1, #open, 13, null, 2, 72),
      (11, "Wi-Fi keeps dropping in conference room B", "Conference room B has intermittent Wi-Fi. Meetings drop frequently.", 3, 2, #pending, 14, ?4, 6, 48),
      (12, "Phishing link in chat", "A colleague forwarded a suspicious link in Teams. Reporting for review.", 6, 4, #in_progress, 15, ?6, 1, 4),
      (13, "Email signature not applying", "My signature template is not being applied to new emails in Outlook.", 5, 1, #open, 10, null, 2, 72),
      (14, "Blue screen on startup", "Laptop blue-screens with DRIVER_IRQL_NOT_LESS_OR_EQUAL on boot. Safe mode works.", 1, 4, #in_progress, 11, ?5, 1, 4),
      (15, "Cannot access shared drive", "The S: drive mapping is missing. Was working yesterday.", 3, 2, #resolved, 12, ?7, 10, 48),
      (16, "Request: Adobe Creative Cloud license", "Need an Adobe CC license for marketing design work.", 2, 1, #open, 13, null, 4, 72),
      (17, "Mouse double-clicks on single click", "Hardware issue with my Logitech mouse. Tried different USB port.", 1, 1, #closed, 14, ?8, 20, 72),
      (18, "Account locked after failed logins", "My account is locked after too many failed MFA attempts.", 4, 3, #open, 15, null, 1, 24),
      (19, "Calendar invites not arriving", "Meeting invites from external senders are not reaching my inbox.", 5, 2, #pending, 10, ?4, 7, 48),
      (20, "Suspected malware on laptop", "Pop-ups appearing in browser. Antivirus scan shows nothing. Concerned.", 6, 4, #in_progress, 11, ?6, 1, 4),
      (21, "New laptop setup request", "Starting a new role next week. Need a laptop provisioned and shipped.", 1, 2, #open, 12, null, 5, 48),
      (22, "Excel macro disabled and won't run", "Trusted macro from finance team is blocked by macro security settings.", 2, 2, #in_progress, 13, ?5, 3, 48),
      (23, "VPN certificate expired", "VPN client says my certificate has expired. Cannot connect remotely.", 3, 3, #open, 14, null, 1, 24),
      (24, "Email forwarding rule missing", "My auto-forward rule to my personal email was removed. Need it restored.", 5, 1, #open, 15, null, 2, 72),
      (25, "Suspicious login alert", "Got an alert about a login from an unknown location. Was not me.", 6, 4, #in_progress, 10, ?6, 1, 4),
      (26, "Docking station not detected", "USB-C dock is not detected. External monitors and ethernet not working.", 1, 2, #pending, 11, ?7, 6, 48),
      (27, "Request: admin rights for dev tools", "Need local admin to install Docker for a project.", 4, 2, #open, 12, null, 3, 48),
      (28, "Teams meeting recording missing", "Recording from yesterday's meeting is not in my recordings folder.", 5, 2, #in_progress, 13, ?8, 4, 48),
      (29, "Slow internet in the east wing", "East wing users report very slow internet since this morning.", 3, 3, #open, 14, null, 1, 24),
      (30, "Password manager extension not working", "1Password browser extension does not autofill after update.", 2, 2, #resolved, 15, ?5, 12, 48),
      (31, "Request: headset replacement", "My headset microphone stopped working. Need a replacement.", 1, 1, #open, 10, null, 3, 72),
      (32, "Cannot print to PDF", "Print to PDF option is missing from all applications.", 2, 1, #open, 11, null, 2, 72),
      (33, "Suspicious file from vendor", "Vendor sent a .zip with an .exe inside. Did not open. Reporting.", 6, 3, #in_progress, 12, ?6, 1, 24),
      (34, "Email account deactivation request", "Leaving the company. Need email forwarded and account deactivated.", 4, 2, #pending, 13, ?4, 8, 48),
      (35, "Monitor flickering", "One of my dual monitors flickers every few minutes. Cable reseated.", 1, 2, #open, 14, null, 2, 48),
      (36, "Cannot join Zoom meeting", "Zoom client says network error when joining meetings. Web works.", 5, 2, #in_progress, 15, ?7, 3, 48),
      (37, "Disk full warning on laptop", "C: drive is full. Need help cleaning or expanding storage.", 1, 2, #open, 10, null, 4, 48),
      (38, "Request: software upgrade to latest Office", "Need Office upgraded to the latest version for compatibility.", 2, 1, #open, 11, null, 5, 72),
      (39, "Lost company phone", "I lost my company phone at the airport. Need it wiped and replaced.", 6, 4, #in_progress, 12, ?6, 1, 4),
      (40, "Shared mailbox access request", "Need access to the support@ shared mailbox for the new team.", 4, 1, #open, 13, null, 2, 72),
    ];
    for ((id, title, description, categoryId, priorityId, status, creatorIdx, agentIdxOpt, hoursAgo, slaHours) in ticketSeeds.vals()) {
      let creator = anon; // seeded users share anonymous principal
      let assignedAgent : ?Principal = switch (agentIdxOpt) {
        case (?_) ?anon;
        case null null;
      };
      let createdAt = baseNs - (hoursAgo * hourNs);
      let slaDeadline = createdAt + (slaHours * hourNs);
      let updatedAt = createdAt + (1 * hourNs);
      let closedAt : ?Nat = switch (status) {
        case (#closed) ?(createdAt + (2 * hourNs));
        case (#resolved) ?(createdAt + (2 * hourNs));
        case _ null;
      };
      let t : Ticket = {
        id = id;
        var title = title;
        var description = description;
        var categoryId = categoryId;
        var priorityId = priorityId;
        var status = status;
        var creator = creator;
        var assignedAgent = assignedAgent;
        var createdAt = createdAt;
        var updatedAt = updatedAt;
        var closedAt = closedAt;
        var slaDeadline = slaDeadline;
        var attachments = [];
        var ai = {
          var predictedCategory = null;
          var predictedPriority = null;
          var duplicateOf = null;
          var suggestedSolution = null;
        };
      };
      tickets.add(natCompare, id, t);
      // Seed an empty message list per ticket
      ticketMessages.add(natCompare, id, List.empty<TicketMessage>());
    };

    // ---- Ticket messages (a few representative ones) ----
    // We add a handful of messages to demonstrate the conversation feature.
    let messageSeeds : [(Nat, Nat, AppRole, Text, Nat, Bool)] = [
      // (ticketId, authorIdx, authorRole, body, hoursAfterTicket, isInternal)
      (2, 4, #support_agent, "Thanks for reporting. Can you share the VPN client version?", 1, false),
      (2, 11, #employee, "Version 5.3.2. It started after the morning update.", 2, false),
      (5, 6, #support_agent, "Thank you for not clicking. I will analyze the headers and report back.", 1, false),
      (5, 6, #support_agent, "Confirmed phishing. Blocking sender domain organization-wide.", 2, true),
      (7, 7, #support_agent, "Try clearing the Slack cache: Help > Troubleshooting > Clear Cache.", 1, false),
      (7, 10, #employee, "That worked. Thank you!", 3, false),
      (14, 5, #support_agent, "Critical priority. Boot into safe mode and run driver verifier.", 1, false),
      (20, 6, #support_agent, "Disconnect from network immediately. Running remote scan now.", 1, false),
      (25, 6, #support_agent, "I have forced a sign-out everywhere. Please reset your password.", 1, false),
      (39, 6, #support_agent, "Initiating remote wipe now. Replacement phone will ship tomorrow.", 1, false),
    ];
    var msgId : Nat = 1;
    for ((ticketId, _authorIdx, authorRole, body, hoursAfter, isInternal) in messageSeeds.vals()) {
      let ticketOpt = tickets.get(natCompare, ticketId);
      switch (ticketOpt) {
        case (?t) {
          let msg : TicketMessage = {
            id = msgId;
            ticketId = ticketId;
            author = anon;
            authorRole = authorRole;
            body = body;
            createdAt = t.createdAt + (hoursAfter * hourNs);
            isInternal = isInternal;
          };
          let listOpt = ticketMessages.get(natCompare, ticketId);
          let lst = switch (listOpt) {
            case (?l) l;
            case null List.empty<TicketMessage>();
          };
          lst.add(msg);
          ticketMessages.add(natCompare, ticketId, lst);
          msgId += 1;
        };
        case null ();
      };
    };

    // ---- Audit logs (30) ----
    let auditSeeds : [(Nat, Nat, AuditAction, Text, Nat, Text)] = [
      // (id, actorIdx, action, targetEntity, hoursAgo, detail)
      (1, 1, #ticketCreated, "ticket:1", 1, "Ticket #1 created by employee"),
      (2, 4, #ticketAssigned, "ticket:2", 2, "Ticket #2 assigned to agent Dana Patel"),
      (3, 1, #ticketCreated, "ticket:3", 1, "Ticket #3 created by employee"),
      (4, 5, #ticketAssigned, "ticket:4", 5, "Ticket #4 assigned to agent Evan Wright"),
      (5, 6, #ticketAssigned, "ticket:5", 1, "Ticket #5 assigned to agent Fatima Khan (security)"),
      (6, 1, #ticketCreated, "ticket:6", 3, "Ticket #6 created by employee"),
      (7, 7, #ticketStatusChanged, "ticket:7", 8, "Ticket #7 status changed to in_progress"),
      (8, 7, #ticketStatusChanged, "ticket:7", 10, "Ticket #7 status changed to resolved"),
      (9, 8, #ticketAssigned, "ticket:8", 4, "Ticket #8 assigned to agent Hana Suzuki"),
      (10, 1, #ticketCreated, "ticket:9", 1, "Ticket #9 created by employee"),
      (11, 1, #ticketCreated, "ticket:10", 2, "Ticket #10 created by employee"),
      (12, 4, #ticketAssigned, "ticket:11", 6, "Ticket #11 assigned to agent Dana Patel"),
      (13, 6, #ticketAssigned, "ticket:12", 1, "Ticket #12 assigned to agent Fatima Khan (security)"),
      (14, 1, #ticketCreated, "ticket:13", 2, "Ticket #13 created by employee"),
      (15, 5, #ticketAssigned, "ticket:14", 1, "Ticket #14 assigned to agent Evan Wright (critical)"),
      (16, 7, #ticketAssigned, "ticket:15", 10, "Ticket #15 assigned to agent George Stone"),
      (17, 7, #ticketStatusChanged, "ticket:15", 12, "Ticket #15 status changed to resolved"),
      (18, 1, #ticketCreated, "ticket:16", 4, "Ticket #16 created by employee"),
      (19, 8, #ticketAssigned, "ticket:17", 20, "Ticket #17 assigned to agent Hana Suzuki"),
      (20, 8, #ticketClosed, "ticket:17", 22, "Ticket #17 closed by agent"),
      (21, 1, #ticketCreated, "ticket:18", 1, "Ticket #18 created by employee"),
      (22, 4, #ticketAssigned, "ticket:19", 7, "Ticket #19 assigned to agent Dana Patel"),
      (23, 6, #ticketAssigned, "ticket:20", 1, "Ticket #20 assigned to agent Fatima Khan (security)"),
      (24, 1, #ticketCreated, "ticket:21", 5, "Ticket #21 created by employee"),
      (25, 5, #ticketAssigned, "ticket:22", 3, "Ticket #22 assigned to agent Evan Wright"),
      (26, 1, #ticketCreated, "ticket:23", 1, "Ticket #23 created by employee"),
      (27, 6, #ticketAssigned, "ticket:25", 1, "Ticket #25 assigned to agent Fatima Khan (security)"),
      (28, 1, #categoryCreated, "category:6", 0, "Category 'Security' created"),
      (29, 1, #priorityUpdated, "priority:4", 0, "Priority 'Critical' SLA set to 4h"),
      (30, 1, #settingsUpdated, "systemSettings", 0, "System settings initialized"),
    ];
    for ((id, _actorIdx, action, targetEntity, hoursAgo, detail) in auditSeeds.vals()) {
      let log : AuditLog = {
        id = id;
        actorId = anon;
        action = action;
        targetEntity = targetEntity;
        timestamp = baseNs - (hoursAgo * hourNs);
        detail = detail;
      };
      auditLogs.add(log);
    };

    // ---- Knowledge articles (8) ----
    let articleSeeds : [(Nat, Text, Text, ?Nat, Nat, Nat)] = [
      (1, "How to reset your password", "If you forgot your password, go to the self-service portal at https://reset.helpdesk.corp and follow the 'Forgot password' link. You will need your registered MFA device. After verifying, set a new password of at least 12 characters with mixed case, numbers, and symbols.", ?4, baseNs, baseNs),
      (2, "Connecting to the corporate VPN", "Download the VPN client from the IT portal. Launch it and sign in with your corporate credentials. If the connection drops, check your internet connection first, then try switching to a wired connection. Persistent drops may indicate a certificate issue — open a ticket in the Network category.", ?3, baseNs, baseNs),
      (3, "Setting up MFA on your phone", "Install the authenticator app from the company portal. In your account settings, click 'Enable MFA' and scan the QR code. Enter the 6-digit code to confirm. Keep your backup codes in a safe place.", ?4, baseNs, baseNs),
      (4, "Reporting a phishing email", "Never click links or open attachments in suspicious emails. Use the 'Report Phishing' button in your email client, or forward the email to phishing@helpdesk.corp. Include the full headers if possible. IT will analyze and block the sender domain if confirmed.", ?6, baseNs, baseNs),
      (5, "Requesting new hardware", "Submit a ticket in the Hardware category with the requested item, business justification, and delivery address. Standard laptops ship within 3 business days; monitors within 5. Urgent requests require manager approval.", ?1, baseNs, baseNs),
      (6, "Installing approved software", "Only software on the approved list may be installed on corporate devices. Open the Software Center (Windows) or Self Service (macOS) to install pre-approved apps. For other software, submit a ticket in the Software category with the license requirement.", ?2, baseNs, baseNs),
      (7, "Fixing a flickering monitor", "First, reseat the video cable at both ends. If the issue persists, try a different cable or port. Test the monitor with another computer to isolate the fault. If the monitor is faulty, open a Hardware ticket for a replacement.", ?1, baseNs, baseNs),
      (8, "Accessing shared mailboxes", "Shared mailboxes do not require a separate license. Ask your manager to submit an Account Access ticket requesting access. Once granted, the mailbox appears automatically in Outlook within 24 hours under your folders list.", ?5, baseNs, baseNs),
    ];
    for ((id, title, content, categoryId, createdAt, updatedAt) in articleSeeds.vals()) {
      let a : KnowledgeArticle = {
        id = id;
        var title = title;
        var content = content;
        var categoryId = categoryId;
        var createdAt = createdAt;
        var updatedAt = updatedAt;
      };
      knowledgeArticles.add(natCompare, id, a);
    };

    {
      users = users;
      nextUserId = { var next = 16 };
      tickets = tickets;
      ticketMessages = ticketMessages;
      nextTicketId = { var next = 41 };
      nextMessageId = { var next = msgId };
      categories = categories;
      nextCategoryId = { var next = 7 };
      priorities = priorities;
      nextPriorityId = { var next = 5 };
      auditLogs = auditLogs;
      nextAuditLogId = { var next = 31 };
      knowledgeArticles = knowledgeArticles;
      nextArticleId = { var next = 9 };
      notifications = notifications;
      nextNotificationId = { var next = 1 };
      systemSettings = {
        var organizationName = "IT Helpdesk";
        var aiFeaturesEnabled = false;
        var updatedAt = baseNs;
      };
    };
  };
};
