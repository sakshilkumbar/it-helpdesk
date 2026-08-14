import Map "mo:core/Map";
import Array "mo:core/Array";
import Types "../types/tickets";
import Common "../types/common";

module {
  // Domain logic for tickets. Stateless module; state is injected by the mixin.
  public func toView(self : Types.Ticket) : Types.TicketView {
    {
      id = self.id;
      title = self.title;
      description = self.description;
      categoryId = self.categoryId;
      priorityId = self.priorityId;
      status = self.status;
      creator = self.creator;
      assignedAgent = self.assignedAgent;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
      closedAt = self.closedAt;
      slaDeadline = self.slaDeadline;
      attachments = self.attachments;
      predictedCategory = self.ai.predictedCategory;
      predictedPriority = self.ai.predictedPriority;
      duplicateOf = self.ai.duplicateOf;
      suggestedSolution = self.ai.suggestedSolution;
    };
  };

  public func createTicket(
    tickets : Map.Map<Common.TicketId, Types.Ticket>,
    nextId : { var next : Common.TicketId },
    creator : Common.UserId,
    input : Types.TicketCreateInput,
    slaDeadline : Common.Timestamp,
    now : Common.Timestamp,
  ) : Types.Ticket {
    let id = nextId.next;
    nextId.next := nextId.next + 1;
    let ticket : Types.Ticket = {
      id;
      var title = input.title;
      var description = input.description;
      var categoryId = input.categoryId;
      var priorityId = input.priorityId;
      var status = #open;
      var creator;
      var assignedAgent = null;
      var createdAt = now;
      var updatedAt = now;
      var closedAt = null;
      var slaDeadline;
      var attachments = input.attachments;
      var ai = {
        var predictedCategory = null;
        var predictedPriority = null;
        var duplicateOf = null;
        var suggestedSolution = null;
      };
    };
    tickets.add(id, ticket);
    ticket;
  };

  public func getTicket(
    tickets : Map.Map<Common.TicketId, Types.Ticket>,
    id : Common.TicketId,
  ) : ?Types.Ticket {
    tickets.get(id);
  };

  public func updateTicket(
    tickets : Map.Map<Common.TicketId, Types.Ticket>,
    id : Common.TicketId,
    input : Types.TicketUpdateInput,
    now : Common.Timestamp,
  ) : ?Types.Ticket {
    switch (tickets.get(id)) {
      case (?t) {
        switch (input.status) {
          case (?s) {
            t.status := s;
            if (s == #closed) {
              t.closedAt := ?now;
            };
          };
          case null {};
        };
        switch (input.assignedAgent) {
          case (?a) { t.assignedAgent := ?a };
          case null {};
        };
        switch (input.resolutionSummary) {
          case (?r) {
            // Append resolution summary to AI suggested solution field as a
            // placeholder for now; AI logic is excluded by contract.
            t.ai.suggestedSolution := ?r;
          };
          case null {};
        };
        t.updatedAt := now;
        ?t;
      };
      case null null;
    };
  };

  // Apply the query filters (status, priority, category, agent, creator,
  // search) to a snapshot of all tickets, returning matching TicketViews.
  func applyQuery(
    snapshot : [(Common.TicketId, Types.Ticket)],
    ticketQuery : Types.TicketQuery,
  ) : [Types.TicketView] {
    let filtered = snapshot.filter(func((_, t) : (Common.TicketId, Types.Ticket)) : Bool {
      let statusOk = switch (ticketQuery.status) {
        case (?s) t.status == s;
        case null true;
      };
      let priorityOk = switch (ticketQuery.priorityId) {
        case (?p) t.priorityId == p;
        case null true;
      };
      let categoryOk = switch (ticketQuery.categoryId) {
        case (?c) t.categoryId == c;
        case null true;
      };
      let agentOk = switch (ticketQuery.assignedAgent) {
        case (?a) t.assignedAgent == ?a;
        case null true;
      };
      let creatorOk = switch (ticketQuery.creator) {
        case (?c) t.creator == c;
        case null true;
      };
      let searchOk = switch (ticketQuery.search) {
        case (?term) {
          let tLower = term.toLower();
          t.title.toLower().contains(#text tLower) or (t.id == textToNat(term));
        };
        case null true;
      };
      statusOk and priorityOk and categoryOk and agentOk and creatorOk and searchOk;
    });
    let views = filtered.map(func((_, t)) = toView(t));
    let sorted = sortViews(views, ticketQuery.sortBy, ticketQuery.sortOrder);
    sorted;
  };

  // Best-effort text → Nat for ticket-id search; returns 0 (an unused id) on
  // failure so the equality check simply does not match.
  func textToNat(t : Text) : Nat {
    switch (t.toNat()) {
      case (?n) n;
      case null 0;
    };
  };

  func sortViews(
    views : [Types.TicketView],
    sortBy : ?{ #createdAt; #updatedAt; #priority },
    sortOrder : ?Common.SortOrder,
  ) : [Types.TicketView] {
    let order = sortOrder ?? #desc;
    let cmp = func(a : Types.TicketView, b : Types.TicketView) : { #less; #equal; #greater } {
      let base = switch (sortBy) {
        case (?#createdAt) Int.compare(a.createdAt, b.createdAt);
        case (?#updatedAt) Int.compare(a.updatedAt, b.updatedAt);
        case (?#priority) Nat.compare(a.priorityId, b.priorityId);
        case null Int.compare(a.createdAt, b.createdAt);
      };
      switch (order) {
        case (#asc) base;
        case (#desc) {
          switch (base) {
            case (#less) #greater;
            case (#equal) #equal;
            case (#greater) #less;
          };
        };
      };
    };
    views.sort(cmp);
  };

  // Paginate an already-filtered+sorted view array.
  func paginate(views : [Types.TicketView], page : Common.PageRequest) : [Types.TicketView] {
    let start = if (page.page == 0) { 0 } else { (page.page - 1) * page.pageSize };
    let end = if (start + page.pageSize > views.size()) { views.size() } else { start + page.pageSize };
    if (start >= views.size()) {
      [];
    } else {
      views.sliceToArray(start, end);
    };
  };

  public func listTickets(
    tickets : Map.Map<Common.TicketId, Types.Ticket>,
    ticketQuery : Types.TicketQuery,
  ) : [Types.TicketView] {
    let snapshot = tickets.toArray();
    let views = applyQuery(snapshot, ticketQuery);
    paginate(views, ticketQuery.page);
  };

  public func listTicketsByCreator(
    tickets : Map.Map<Common.TicketId, Types.Ticket>,
    creator : Common.UserId,
    ticketQuery : Types.TicketQuery,
  ) : [Types.TicketView] {
    let queryWithCreator : Types.TicketQuery = {
      ticketQuery with
      creator = ?creator;
    };
    listTickets(tickets, queryWithCreator);
  };

  public func listTicketsByAgent(
    tickets : Map.Map<Common.TicketId, Types.Ticket>,
    agent : Common.UserId,
    ticketQuery : Types.TicketQuery,
  ) : [Types.TicketView] {
    let queryWithAgent : Types.TicketQuery = {
      ticketQuery with
      assignedAgent = ?agent;
    };
    listTickets(tickets, queryWithAgent);
  };

  public func computeSLAStatuses(
    tickets : Map.Map<Common.TicketId, Types.Ticket>,
    now : Common.Timestamp,
  ) : [Types.TicketSLAStatus] {
    let snapshot = tickets.toArray();
    let statuses = snapshot.filterMap(
      func((_, t)) : ?Types.TicketSLAStatus {
        // Closed tickets are not SLA-monitored.
        if (t.status == #closed) {
          null;
        } else {
          let remaining : Int = t.slaDeadline - now;
          let isBreached = remaining < 0;
          // At risk: breached or within 20% of the deadline window remaining.
          let isAtRisk = isBreached or (remaining > 0 and remaining <= (t.slaDeadline - t.createdAt) / 5);
          ?{
            ticketId = t.id;
            title = t.title;
            priorityId = t.priorityId;
            status = t.status;
            slaDeadline = t.slaDeadline;
            timeRemainingNs = remaining;
            isBreached;
            isAtRisk;
          };
        };
      },
    );
    // Sort by time remaining ascending (most urgent first).
    statuses.sort(func(a : Types.TicketSLAStatus, b : Types.TicketSLAStatus) : { #less; #equal; #greater } {
      Int.compare(a.timeRemainingNs, b.timeRemainingNs);
    });
  };

  public func computeAnalytics(
    tickets : Map.Map<Common.TicketId, Types.Ticket>,
  ) : Types.TicketAnalytics {
    let snapshot = tickets.toArray();
    let total = snapshot.size();
    // byStatus
    var openCount = 0;
    var inProgressCount = 0;
    var pendingCount = 0;
    var resolvedCount = 0;
    var closedCount = 0;
    // byCategory and byPriority accumulated via mutable arrays rebuilt at end.
    var catPairs : [(Common.CategoryId, Nat)] = [];
    var priPairs : [(Common.PriorityId, Nat)] = [];
    var timePairs : [(Common.Timestamp, Nat)] = [];
    for ((_, t) in snapshot.values()) {
      switch (t.status) {
        case (#open) { openCount += 1 };
        case (#in_progress) { inProgressCount += 1 };
        case (#pending) { pendingCount += 1 };
        case (#resolved) { resolvedCount += 1 };
        case (#closed) { closedCount += 1 };
      };
      catPairs := bumpCount(catPairs, t.categoryId);
      priPairs := bumpCount(priPairs, t.priorityId);
      timePairs := bumpCount(timePairs, t.createdAt);
    };
    {
      totalTickets = total;
      byStatus = [
        (#open, openCount),
        (#in_progress, inProgressCount),
        (#pending, pendingCount),
        (#resolved, resolvedCount),
        (#closed, closedCount),
      ];
      byCategory = catPairs;
      byPriority = priPairs;
      createdOverTime = timePairs;
    };
  };

  // Helper: increment the count for a key in a (key, count) array, returning a
  // new array. Used by computeAnalytics for byCategory / byPriority / overTime.
  func bumpCount<K>(pairs : [(K, Nat)], key : K) : [(K, Nat)] {
    let found = pairs.findIndex(func((k, _) : (K, Nat)) : Bool { k == key });
    switch (found) {
      case (?i) {
        let (k, c) = pairs[i];
        let updated : (K, Nat) = (k, c + 1);
        // Rebuild the array with the updated pair at index i.
        let before = pairs.sliceToArray(0, i);
        let after = pairs.sliceToArray(i + 1, pairs.size());
        before.concat([updated]).concat(after);
      };
      case null {
        pairs.concat([(key, 1)]);
      };
    };
  };
};
