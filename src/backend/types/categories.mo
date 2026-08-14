import Common "common";

module {
  // A ticket category. Admins create, rename, and deactivate categories.
  public type Category = {
    id : Common.CategoryId;
    var name : Text;
    var description : Text;
    var isActive : Bool;
    var createdAt : Common.Timestamp;
  };

  public type CategoryView = {
    id : Common.CategoryId;
    name : Text;
    description : Text;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type CategoryCreateInput = {
    name : Text;
    description : Text;
  };

  public type CategoryUpdateInput = {
    id : Common.CategoryId;
    name : ?Text;
    description : ?Text;
    isActive : ?Bool;
  };
};
