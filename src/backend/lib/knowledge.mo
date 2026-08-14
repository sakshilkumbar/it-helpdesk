import Map "mo:core/Map";
import Array "mo:core/Array";
import Types "../types/knowledge";
import Common "../types/common";

module {
  // Domain logic for knowledge-base articles. Read-only placeholder list view
  // (no AI retrieval yet).
  public func toView(self : Types.KnowledgeArticle) : Types.KnowledgeArticleView {
    {
      id = self.id;
      title = self.title;
      content = self.content;
      categoryId = self.categoryId;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
    };
  };

  public func createArticle(
    articles : Map.Map<Common.KnowledgeArticleId, Types.KnowledgeArticle>,
    nextId : { var next : Common.KnowledgeArticleId },
    input : Types.KnowledgeArticleCreateInput,
    now : Common.Timestamp,
  ) : Types.KnowledgeArticle {
    let id = nextId.next;
    nextId.next := nextId.next + 1;
    let article : Types.KnowledgeArticle = {
      id;
      var title = input.title;
      var content = input.content;
      var categoryId = input.categoryId;
      var createdAt = now;
      var updatedAt = now;
    };
    articles.add(id, article);
    article;
  };

  public func getArticle(
    articles : Map.Map<Common.KnowledgeArticleId, Types.KnowledgeArticle>,
    id : Common.KnowledgeArticleId,
  ) : ?Types.KnowledgeArticle {
    articles.get(id);
  };

  public func updateArticle(
    articles : Map.Map<Common.KnowledgeArticleId, Types.KnowledgeArticle>,
    id : Common.KnowledgeArticleId,
    input : Types.KnowledgeArticleUpdateInput,
    now : Common.Timestamp,
  ) : ?Types.KnowledgeArticle {
    switch (articles.get(id)) {
      case (?a) {
        switch (input.title) {
          case (?t) { a.title := t };
          case null {};
        };
        switch (input.content) {
          case (?c) { a.content := c };
          case null {};
        };
        switch (input.categoryId) {
          case (?optC) {
            switch (optC) {
              case (?c) { a.categoryId := ?c };
              case null { a.categoryId := null };
            };
          };
          case null {};
        };
        a.updatedAt := now;
        ?a;
      };
      case null null;
    };
  };

  public func listArticles(
    articles : Map.Map<Common.KnowledgeArticleId, Types.KnowledgeArticle>,
  ) : [Types.KnowledgeArticleView] {
    let snapshot = articles.toArray();
    let views = snapshot.map(
      func((_, a)) = toView(a),
    );
    // Sort by updatedAt descending (most recently edited first).
    views.sort(func(a : Types.KnowledgeArticleView, b : Types.KnowledgeArticleView) : { #less; #equal; #greater } {
      Nat.compare(b.updatedAt, a.updatedAt);
    });
  };
};
