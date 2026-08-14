import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import CategoryTypes "../types/categories";
import AuditTypes "../types/audit";
import CategoryLib "../lib/categories";
import AuditLib "../lib/audit";

mixin (
  accessControlState : AccessControl.AccessControlState,
  categories : Map.Map<Common.CategoryId, CategoryTypes.Category>,
  nextCategoryId : { var next : Common.CategoryId },
  auditLogs : List.List<AuditTypes.AuditLog>,
  nextAuditLogId : { var next : Common.AuditLogId },
) {
  public query ({ caller }) func listCategories(
    includeInactive : Bool,
  ) : async [CategoryTypes.CategoryView] {
    requireCategoryRegistered(accessControlState, caller);
    CategoryLib.listCategories(categories, includeInactive);
  };

  public query ({ caller }) func getCategory(
    id : Common.CategoryId,
  ) : async ?CategoryTypes.CategoryView {
    requireCategoryRegistered(accessControlState, caller);
    switch (CategoryLib.getCategory(categories, id)) {
      case (?c) ?c.toView();
      case null null;
    };
  };

  // Admin-only: create a category.
  public shared ({ caller }) func createCategory(
    input : CategoryTypes.CategoryCreateInput,
  ) : async CategoryTypes.CategoryView {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can create categories");
    };
    let created = CategoryLib.createCategory(categories, nextCategoryId, input, Int.abs(Time.now()));
    ignore AuditLib.record(
      auditLogs, nextAuditLogId, caller, #categoryCreated,
      "category:" # Nat.toText(created.id),
      "Category created: " # input.name,
      Int.abs(Time.now()),
    );
    created.toView();
  };

  // Admin-only: rename or deactivate a category.
  public shared ({ caller }) func updateCategory(
    input : CategoryTypes.CategoryUpdateInput,
  ) : async CategoryTypes.CategoryView {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can update categories");
    };
    switch (CategoryLib.updateCategory(categories, input.id, input)) {
      case (?c) {
        ignore AuditLib.record(
          auditLogs, nextAuditLogId, caller, #categoryUpdated,
          "category:" # Nat.toText(input.id),
          "Category updated: " # Nat.toText(input.id),
          Int.abs(Time.now()),
        );
        c.toView();
      };
      case null Runtime.trap("Not found: category does not exist");
    };
  };

  // Require a registered (non-anonymous, known to access control) caller.
  func requireCategoryRegistered(state : AccessControl.AccessControlState, caller : Principal) : () {
    if (Principal.isAnonymous(caller)) {
      Runtime.trap("Unauthorized: caller is anonymous");
    };
    switch (state.userRoles.get(caller)) {
      case (?_) {};
      case null {
        Runtime.trap("Unauthorized: caller is not a registered user");
      };
    };
  };
};
