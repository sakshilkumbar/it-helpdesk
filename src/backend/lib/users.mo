import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Types "../types/users";
import Common "../types/common";

module {
  // Domain logic for users. Stateless module; state is injected by the mixin.
  public func toView(self : Types.User) : Types.UserView {
    {
      id = self.id;
      displayName = self.displayName;
      email = self.email;
      role = self.role;
      isActive = self.isActive;
      createdAt = self.createdAt;
      lastSeenAt = self.lastSeenAt;
    };
  };

  public func createUser(
    id : Common.UserId,
    displayName : Text,
    email : ?Text,
    role : Common.AppRole,
    now : Common.Timestamp,
  ) : Types.User {
    {
      id;
      var displayName;
      var email;
      var role;
      var isActive = true;
      var createdAt = now;
      var lastSeenAt = ?now;
    };
  };

  public func findUser(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
  ) : ?Types.User {
    users.get(id);
  };

  public func listUsers(
    users : Map.Map<Common.UserId, Types.User>,
    search : ?Text,
    roleFilter : ?Common.AppRole,
    page : Common.PageRequest,
  ) : [Types.UserView] {
    let snapshot = users.toArray();
    let filtered = snapshot.filter(func((_, u) : (Common.UserId, Types.User)) : Bool {
      let roleOk = switch (roleFilter) {
        case (?r) u.role == r;
        case null true;
      };
      let searchOk = switch (search) {
        case (?term) {
          let t = term.toLower();
          u.displayName.toLower().contains(#text t) or u.id.toText().toLower().contains(#text t);
        };
        case null true;
      };
      roleOk and searchOk;
    });
    let views = filtered.map(func((_, u)) = toView(u));
    let start = if (page.page == 0) { 0 } else { (page.page - 1) * page.pageSize };
    let end = if (start + page.pageSize > views.size()) { views.size() } else { start + page.pageSize };
    if (start >= views.size()) {
      [];
    } else {
      views.sliceToArray(start, end);
    };
  };

  public func assignRole(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
    newRole : Common.AppRole,
  ) : ?Types.User {
    switch (users.get(id)) {
      case (?u) {
        u.role := newRole;
        ?u;
      };
      case null null;
    };
  };

  public func setActive(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
    active : Bool,
  ) : ?Types.User {
    switch (users.get(id)) {
      case (?u) {
        u.isActive := active;
        ?u;
      };
      case null null;
    };
  };

  public func touchLastSeen(
    users : Map.Map<Common.UserId, Types.User>,
    id : Common.UserId,
    now : Common.Timestamp,
  ) : () {
    switch (users.get(id)) {
      case (?u) {
        u.lastSeenAt := ?now;
      };
      case null {};
    };
  };
};
