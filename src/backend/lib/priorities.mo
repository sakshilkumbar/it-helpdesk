import Map "mo:core/Map";
import Array "mo:core/Array";
import Types "../types/priorities";
import Common "../types/common";

module {
  // Domain logic for priority levels and their SLA targets.
  public func toView(self : Types.Priority) : Types.PriorityView {
    {
      id = self.id;
      name = self.name;
      level = self.level;
      slaTargetNs = self.slaTargetNs;
      isActive = self.isActive;
      createdAt = self.createdAt;
    };
  };

  public func createPriority(
    priorities : Map.Map<Common.PriorityId, Types.Priority>,
    nextId : { var next : Common.PriorityId },
    input : Types.PriorityCreateInput,
    now : Common.Timestamp,
  ) : Types.Priority {
    let id = nextId.next;
    nextId.next := nextId.next + 1;
    let priority : Types.Priority = {
      id;
      var name = input.name;
      var level = input.level;
      var slaTargetNs = input.slaTargetNs;
      var isActive = true;
      var createdAt = now;
    };
    priorities.add(id, priority);
    priority;
  };

  public func getPriority(
    priorities : Map.Map<Common.PriorityId, Types.Priority>,
    id : Common.PriorityId,
  ) : ?Types.Priority {
    priorities.get(id);
  };

  public func updatePriority(
    priorities : Map.Map<Common.PriorityId, Types.Priority>,
    id : Common.PriorityId,
    input : Types.PriorityUpdateInput,
  ) : ?Types.Priority {
    switch (priorities.get(id)) {
      case (?p) {
        switch (input.name) {
          case (?n) { p.name := n };
          case null {};
        };
        switch (input.level) {
          case (?l) { p.level := l };
          case null {};
        };
        switch (input.slaTargetNs) {
          case (?s) { p.slaTargetNs := s };
          case null {};
        };
        switch (input.isActive) {
          case (?a) { p.isActive := a };
          case null {};
        };
        ?p;
      };
      case null null;
    };
  };

  public func listPriorities(
    priorities : Map.Map<Common.PriorityId, Types.Priority>,
    includeInactive : Bool,
  ) : [Types.PriorityView] {
    let snapshot = priorities.toArray();
    let filtered = snapshot.filterMap(
      func((_, p)) : ?Types.PriorityView {
        if (includeInactive or p.isActive) {
          ?toView(p);
        } else {
          null;
        };
      },
    );
    // Sort by level descending (most urgent first) for display.
    filtered.sort(func(a : Types.PriorityView, b : Types.PriorityView) : { #less; #equal; #greater } {
      Nat.compare(b.level, a.level);
    });
  };

  // Compute the SLA deadline for a ticket created at `now` with the given
  // priority, by looking up the priority's slaTargetNs.
  public func computeSLADeadline(
    priorities : Map.Map<Common.PriorityId, Types.Priority>,
    priorityId : Common.PriorityId,
    now : Common.Timestamp,
  ) : Common.Timestamp {
    switch (priorities.get(priorityId)) {
      case (?p) { now + p.slaTargetNs };
      case null {
        // Fallback: 24h SLA target if priority missing (should not happen in
        // practice — priorities are seeded by the migration).
        now + 86_400_000_000_000;
      };
    };
  };
};
