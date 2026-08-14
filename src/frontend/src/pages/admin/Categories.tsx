import {
  ConfirmDialog,
  EmptyState,
  PageHeader,
  TableSkeleton,
} from "@/components/shared";
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
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/useQueries";
import type { CategoryCreateInput, CategoryView } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CategoryFormValues {
  name: string;
  description: string;
}

export default function Categories() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<CategoryView | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<CategoryView | null>(
    null,
  );

  const createForm = useForm<CategoryFormValues>({
    defaultValues: { name: "", description: "" },
  });

  const renameForm = useForm<CategoryFormValues>({
    defaultValues: { name: "", description: "" },
  });

  const onCreateSubmit = async (values: CategoryFormValues) => {
    try {
      await createCategory.mutateAsync(values as CategoryCreateInput);
      toast.success("Category created successfully");
      setCreateOpen(false);
      createForm.reset();
    } catch (err) {
      toast.error("Failed to create category");
      console.error(err);
    }
  };

  const onRenameSubmit = async (values: CategoryFormValues) => {
    if (!renameTarget) return;
    try {
      await updateCategory.mutateAsync({
        id: renameTarget.id,
        name: values.name,
        description: values.description,
      });
      toast.success("Category updated successfully");
      setRenameTarget(null);
    } catch (err) {
      toast.error("Failed to update category");
      console.error(err);
    }
  };

  const onDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await updateCategory.mutateAsync({
        id: deactivateTarget.id,
        isActive: false,
      });
      toast.success("Category deactivated");
      setDeactivateTarget(null);
    } catch (err) {
      toast.error("Failed to deactivate category");
      console.error(err);
    }
  };

  const openRename = (cat: CategoryView) => {
    renameForm.reset({ name: cat.name, description: cat.description ?? "" });
    setRenameTarget(cat);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Create, rename, and deactivate ticket categories used across the helpdesk."
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>New category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize incoming tickets.
                </DialogDescription>
              </DialogHeader>
              <form
                id="create-category-form"
                onSubmit={createForm.handleSubmit(onCreateSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Name</Label>
                  <Input
                    id="cat-name"
                    placeholder="e.g. Billing"
                    {...createForm.register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                  {createForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Textarea
                    id="cat-desc"
                    placeholder="Short description of this category"
                    rows={3}
                    {...createForm.register("description")}
                  />
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
                  form="create-category-form"
                  disabled={createCategory.isPending}
                >
                  {createCategory.isPending ? "Creating..." : "Create category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : !categories || categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create your first category to start organizing tickets."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat.description || "—"}
                  </TableCell>
                  <TableCell>
                    {cat.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRename(cat)}
                    >
                      Rename
                    </Button>
                    {cat.isActive && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeactivateTarget(cat)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Rename dialog */}
      <Dialog
        open={renameTarget !== null}
        onOpenChange={(open) => !open && setRenameTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename category</DialogTitle>
            <DialogDescription>
              Update the name and description for this category.
            </DialogDescription>
          </DialogHeader>
          <form
            id="rename-category-form"
            onSubmit={renameForm.handleSubmit(onRenameSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="rename-name">Name</Label>
              <Input
                id="rename-name"
                {...renameForm.register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {renameForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {renameForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rename-desc">Description</Label>
              <Textarea
                id="rename-desc"
                rows={3}
                {...renameForm.register("description")}
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRenameTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="rename-category-form"
              disabled={updateCategory.isPending}
            >
              {updateCategory.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirm */}
      <ConfirmDialog
        open={deactivateTarget !== null}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Deactivate category"
        description={
          deactivateTarget
            ? `Are you sure you want to deactivate "${deactivateTarget.name}"? Existing tickets will keep their category, but new tickets cannot use it.`
            : ""
        }
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        destructive
        onConfirm={onDeactivate}
        trigger={
          <Button variant="ghost" size="sm">
            Deactivate
          </Button>
        }
      />
    </div>
  );
}
