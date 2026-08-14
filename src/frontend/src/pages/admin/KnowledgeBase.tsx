import { EmptyState, PageHeader, TableSkeleton } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  useCreateKnowledgeArticle,
  useKnowledgeArticles,
  useUpdateKnowledgeArticle,
} from "@/hooks/useQueries";
import type {
  KnowledgeArticleCreateInput,
  KnowledgeArticleView,
} from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ArticleFormValues {
  title: string;
  content: string;
  categoryId: string;
}

const formatDate = (ns: bigint): string => {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function KnowledgeBase() {
  const { data: articles, isLoading } = useKnowledgeArticles();
  const { data: categories } = useCategories();
  const createArticle = useCreateKnowledgeArticle();
  const updateArticle = useUpdateKnowledgeArticle();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<KnowledgeArticleView | null>(
    null,
  );

  const createForm = useForm<ArticleFormValues>({
    defaultValues: { title: "", content: "", categoryId: "" },
  });

  const editForm = useForm<ArticleFormValues>({
    defaultValues: { title: "", content: "", categoryId: "" },
  });

  const categoryName = (categoryId?: bigint): string => {
    if (!categoryId) return "—";
    const cat = categories?.find((c) => BigInt(c.id) === categoryId);
    return cat?.name ?? "—";
  };

  const onCreateSubmit = async (values: ArticleFormValues) => {
    try {
      const input: KnowledgeArticleCreateInput = {
        title: values.title,
        content: values.content,
        categoryId: values.categoryId ? BigInt(values.categoryId) : undefined,
      };
      await createArticle.mutateAsync(input);
      toast.success("Article created successfully");
      setCreateOpen(false);
      createForm.reset({ title: "", content: "", categoryId: "" });
    } catch (err) {
      toast.error("Failed to create article");
      console.error(err);
    }
  };

  const onEditSubmit = async (values: ArticleFormValues) => {
    if (!editTarget) return;
    try {
      await updateArticle.mutateAsync({
        id: editTarget.id,
        title: values.title,
        content: values.content,
        categoryId: values.categoryId ? BigInt(values.categoryId) : undefined,
      });
      toast.success("Article updated successfully");
      setEditTarget(null);
    } catch (err) {
      toast.error("Failed to update article");
      console.error(err);
    }
  };

  const openEdit = (article: KnowledgeArticleView) => {
    editForm.reset({
      title: article.title,
      content: article.content,
      categoryId: article.categoryId != null ? String(article.categoryId) : "",
    });
    setEditTarget(article);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge base"
        description="Manage support articles. AI-assisted retrieval is coming soon."
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>New article</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create article</DialogTitle>
                <DialogDescription>
                  Add a new knowledge-base article for agents and customers.
                </DialogDescription>
              </DialogHeader>
              <form
                id="create-article-form"
                onSubmit={createForm.handleSubmit(onCreateSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="a-title">Title</Label>
                  <Input
                    id="a-title"
                    placeholder="e.g. How to reset your password"
                    {...createForm.register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters",
                      },
                    })}
                  />
                  {createForm.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="a-content">Content</Label>
                  <Textarea
                    id="a-content"
                    placeholder="Write the article body..."
                    rows={6}
                    {...createForm.register("content", {
                      required: "Content is required",
                      minLength: {
                        value: 10,
                        message: "Content must be at least 10 characters",
                      },
                    })}
                  />
                  {createForm.formState.errors.content && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.content.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={createForm.watch("categoryId")}
                    onValueChange={(value) =>
                      createForm.setValue("categoryId", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        ?.filter((c) => c.isActive)
                        .map((c) => (
                          <SelectItem key={String(c.id)} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="create-article-form"
                  disabled={createArticle.isPending}
                >
                  {createArticle.isPending ? "Creating..." : "Create article"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-md border border-l-4 border-l-primary/40 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        AI-assisted article retrieval is coming soon. Articles are currently
        managed manually by admins.
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : !articles || articles.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Create your first knowledge-base article to help agents and customers."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>
                    {a.categoryId ? (
                      <Badge variant="outline">
                        {categoryName(a.categoryId)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(a.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(a.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(a)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit article</DialogTitle>
            <DialogDescription>
              Update the title, content, and category for this article.
            </DialogDescription>
          </DialogHeader>
          <form
            id="edit-article-form"
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-a-title">Title</Label>
              <Input
                id="edit-a-title"
                {...editForm.register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />
              {editForm.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-a-content">Content</Label>
              <Textarea
                id="edit-a-content"
                rows={6}
                {...editForm.register("content", {
                  required: "Content is required",
                  minLength: {
                    value: 10,
                    message: "Content must be at least 10 characters",
                  },
                })}
              />
              {editForm.formState.errors.content && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.content.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={editForm.watch("categoryId")}
                onValueChange={(value) =>
                  editForm.setValue("categoryId", value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.filter((c) => c.isActive)
                    .map((c) => (
                      <SelectItem key={String(c.id)} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </form>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-article-form"
              disabled={updateArticle.isPending}
            >
              {updateArticle.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
