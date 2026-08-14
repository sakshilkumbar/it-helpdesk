import Common "common";

module {
  // A knowledge-base article. Admin-managed list view (read-only placeholder,
  // no AI retrieval yet). Reserved for the future AI chatbot / suggested
  // solutions features.
  public type KnowledgeArticle = {
    id : Common.KnowledgeArticleId;
    var title : Text;
    var content : Text;
    var categoryId : ?Common.CategoryId;
    var createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  public type KnowledgeArticleView = {
    id : Common.KnowledgeArticleId;
    title : Text;
    content : Text;
    categoryId : ?Common.CategoryId;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type KnowledgeArticleCreateInput = {
    title : Text;
    content : Text;
    categoryId : ?Common.CategoryId;
  };

  public type KnowledgeArticleUpdateInput = {
    id : Common.KnowledgeArticleId;
    title : ?Text;
    content : ?Text;
    categoryId : ??Common.CategoryId; // ? to update, null inner to clear
  };
};
