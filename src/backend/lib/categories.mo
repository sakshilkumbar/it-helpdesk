import Map "mo:core/Map";
import Array "mo:core/Array";
import Types "../types/categories";
import Common "../types/common";

module {
  // Domain logic for ticket categories.
  public func toView(self : Types.Category) : Types.CategoryView {
    {
      id = self.id;
      name = self.name;
      description = self.description;
      isActive = self.isActive;
      createdAt = self.createdAt;
    };
  };

  public func createCategory(
    categories : Map.Map<Common.CategoryId, Types.Category>,
    nextId : { var next : Common.CategoryId },
    input : Types.CategoryCreateInput,
    now : Common.Timestamp,
  ) : Types.Category {
    let id = nextId.next;
    nextId.next := nextId.next + 1;
    let category : Types.Category = {
      id;
      var name = input.name;
      var description = input.description;
      var isActive = true;
      var createdAt = now;
    };
    categories.add(id, category);
    category;
  };

  public func getCategory(
    categories : Map.Map<Common.CategoryId, Types.Category>,
    id : Common.CategoryId,
  ) : ?Types.Category {
    categories.get(id);
  };

  public func updateCategory(
    categories : Map.Map<Common.CategoryId, Types.Category>,
    id : Common.CategoryId,
    input : Types.CategoryUpdateInput,
  ) : ?Types.Category {
    switch (categories.get(id)) {
      case (?c) {
        switch (input.name) {
          case (?n) { c.name := n };
          case null {};
        };
        switch (input.description) {
          case (?d) { c.description := d };
          case null {};
        };
        switch (input.isActive) {
          case (?a) { c.isActive := a };
          case null {};
        };
        ?c;
      };
      case null null;
    };
  };

  public func listCategories(
    categories : Map.Map<Common.CategoryId, Types.Category>,
    includeInactive : Bool,
  ) : [Types.CategoryView] {
    let snapshot = categories.toArray();
    let filtered = snapshot.filterMap(
      func((_, c)) : ?Types.CategoryView {
        if (includeInactive or c.isActive) {
          ?toView(c);
        } else {
          null;
        };
      },
    );
    // Sort by id ascending for stable display.
    filtered.sort(func(a : Types.CategoryView, b : Types.CategoryView) : { #less; #equal; #greater } {
      Nat.compare(a.id, b.id);
    });
  };
};
