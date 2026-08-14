import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import KnowledgeTypes "../types/knowledge";
import KnowledgeLib "../lib/knowledge";

mixin (
  accessControlState : AccessControl.AccessControlState,
  articles : Map.Map<Common.KnowledgeArticleId, KnowledgeTypes.KnowledgeArticle>,
  nextArticleId : { var next : Common.KnowledgeArticleId },
) {
  // Any authenticated user: list knowledge-base articles (read-only placeholder).
  public query ({ caller }) func listKnowledgeArticles() : async [KnowledgeTypes.KnowledgeArticleView] {
    requireKnowledgeRegistered(accessControlState, caller);
    KnowledgeLib.listArticles(articles);
  };

  public query ({ caller }) func getKnowledgeArticle(
    id : Common.KnowledgeArticleId,
  ) : async ?KnowledgeTypes.KnowledgeArticleView {
    requireKnowledgeRegistered(accessControlState, caller);
    switch (KnowledgeLib.getArticle(articles, id)) {
      case (?a) ?a.toView();
      case null null;
    };
  };

  // Admin-only: create a knowledge-base article.
  public shared ({ caller }) func createKnowledgeArticle(
    input : KnowledgeTypes.KnowledgeArticleCreateInput,
  ) : async KnowledgeTypes.KnowledgeArticleView {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can create knowledge articles");
    };
    let created = KnowledgeLib.createArticle(articles, nextArticleId, input, Int.abs(Time.now()));
    created.toView();
  };

  // Admin-only: update a knowledge-base article.
  public shared ({ caller }) func updateKnowledgeArticle(
    input : KnowledgeTypes.KnowledgeArticleUpdateInput,
  ) : async KnowledgeTypes.KnowledgeArticleView {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only admins can update knowledge articles");
    };
    switch (KnowledgeLib.updateArticle(articles, input.id, input, Int.abs(Time.now()))) {
      case (?a) a.toView();
      case null Runtime.trap("Not found: knowledge article does not exist");
    };
  };

  // Require a registered (non-anonymous, known to access control) caller.
  func requireKnowledgeRegistered(state : AccessControl.AccessControlState, caller : Principal) : () {
    if (caller.isAnonymous()) {
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
