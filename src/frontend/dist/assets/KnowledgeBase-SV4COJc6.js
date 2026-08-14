import { aS as useKnowledgeArticles, A as useCategories, aT as useCreateKnowledgeArticle, aU as useUpdateKnowledgeArticle, r as reactExports, j as jsxRuntimeExports, D as Dialog, aB as DialogTrigger, B as Button, k as DialogContent, l as DialogHeader, m as DialogTitle, n as DialogDescription, ay as DialogFooter, E as EmptyState, F as Badge } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { T as TableSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import "./StatusBadge-C3JOGEpV.js";
import { I as Input } from "./input-BB_cSxD4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DZqbOTYv.js";
import { b as useForm, L as Label } from "./label-my991swb.js";
import { T as Textarea } from "./textarea-34Xy4SLJ.js";
import { u as ue } from "./index-CICSQFzn.js";
import "./index-BDSHvDZP.js";
const formatDate = (ns) => {
  return new Date(Number(ns) / 1e6).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};
function KnowledgeBase() {
  const { data: articles, isLoading } = useKnowledgeArticles();
  const { data: categories } = useCategories();
  const createArticle = useCreateKnowledgeArticle();
  const updateArticle = useUpdateKnowledgeArticle();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(
    null
  );
  const createForm = useForm({
    defaultValues: { title: "", content: "", categoryId: "" }
  });
  const editForm = useForm({
    defaultValues: { title: "", content: "", categoryId: "" }
  });
  const categoryName = (categoryId) => {
    if (!categoryId) return "—";
    const cat = categories == null ? void 0 : categories.find((c) => BigInt(c.id) === categoryId);
    return (cat == null ? void 0 : cat.name) ?? "—";
  };
  const onCreateSubmit = async (values) => {
    try {
      const input = {
        title: values.title,
        content: values.content,
        categoryId: values.categoryId ? BigInt(values.categoryId) : void 0
      };
      await createArticle.mutateAsync(input);
      ue.success("Article created successfully");
      setCreateOpen(false);
      createForm.reset({ title: "", content: "", categoryId: "" });
    } catch (err) {
      ue.error("Failed to create article");
      console.error(err);
    }
  };
  const onEditSubmit = async (values) => {
    if (!editTarget) return;
    try {
      await updateArticle.mutateAsync({
        id: editTarget.id,
        title: values.title,
        content: values.content,
        categoryId: values.categoryId ? BigInt(values.categoryId) : void 0
      });
      ue.success("Article updated successfully");
      setEditTarget(null);
    } catch (err) {
      ue.error("Failed to update article");
      console.error(err);
    }
  };
  const openEdit = (article) => {
    editForm.reset({
      title: article.title,
      content: article.content,
      categoryId: article.categoryId != null ? String(article.categoryId) : ""
    });
    setEditTarget(article);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Knowledge base",
        description: "Manage support articles. AI-assisted retrieval is coming soon.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "New article" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create article" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Add a new knowledge-base article for agents and customers." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                id: "create-article-form",
                onSubmit: createForm.handleSubmit(onCreateSubmit),
                className: "space-y-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "a-title", children: "Title" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "a-title",
                        placeholder: "e.g. How to reset your password",
                        ...createForm.register("title", {
                          required: "Title is required",
                          minLength: {
                            value: 3,
                            message: "Title must be at least 3 characters"
                          }
                        })
                      }
                    ),
                    createForm.formState.errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: createForm.formState.errors.title.message })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "a-content", children: "Content" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "a-content",
                        placeholder: "Write the article body...",
                        rows: 6,
                        ...createForm.register("content", {
                          required: "Content is required",
                          minLength: {
                            value: 10,
                            message: "Content must be at least 10 characters"
                          }
                        })
                      }
                    ),
                    createForm.formState.errors.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: createForm.formState.errors.content.message })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: createForm.watch("categoryId"),
                        onValueChange: (value) => createForm.setValue("categoryId", value, {
                          shouldValidate: true
                        }),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a category (optional)" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories == null ? void 0 : categories.filter((c) => c.isActive).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(c.id), children: c.name }, String(c.id))) })
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setCreateOpen(false),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  form: "create-article-form",
                  disabled: createArticle.isPending,
                  children: createArticle.isPending ? "Creating..." : "Create article"
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-l-4 border-l-primary/40 bg-muted/30 px-4 py-3 text-sm text-muted-foreground", children: "AI-assisted article retrieval is coming soon. Articles are currently managed manually by admins." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-card", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 5 }) }) : !articles || articles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "No articles yet",
        description: "Create your first knowledge-base article to help agents and customers."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Updated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: articles.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: a.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: a.categoryId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: categoryName(a.categoryId) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: formatDate(a.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: formatDate(a.updatedAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => openEdit(a),
            children: "Edit"
          }
        ) })
      ] }, a.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editTarget !== null,
        onOpenChange: (open) => !open && setEditTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit article" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update the title, content, and category for this article." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              id: "edit-article-form",
              onSubmit: editForm.handleSubmit(onEditSubmit),
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-a-title", children: "Title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-a-title",
                      ...editForm.register("title", {
                        required: "Title is required",
                        minLength: {
                          value: 3,
                          message: "Title must be at least 3 characters"
                        }
                      })
                    }
                  ),
                  editForm.formState.errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editForm.formState.errors.title.message })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-a-content", children: "Content" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "edit-a-content",
                      rows: 6,
                      ...editForm.register("content", {
                        required: "Content is required",
                        minLength: {
                          value: 10,
                          message: "Content must be at least 10 characters"
                        }
                      })
                    }
                  ),
                  editForm.formState.errors.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editForm.formState.errors.content.message })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: editForm.watch("categoryId"),
                      onValueChange: (value) => editForm.setValue("categoryId", value, {
                        shouldValidate: true
                      }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a category (optional)" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories == null ? void 0 : categories.filter((c) => c.isActive).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(c.id), children: c.name }, String(c.id))) })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setEditTarget(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                form: "edit-article-form",
                disabled: updateArticle.isPending,
                children: updateArticle.isPending ? "Saving..." : "Save changes"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  KnowledgeBase as default
};
