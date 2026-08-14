import { A as useCategories, az as useCreateCategory, aA as useUpdateCategory, r as reactExports, j as jsxRuntimeExports, D as Dialog, aB as DialogTrigger, B as Button, k as DialogContent, l as DialogHeader, m as DialogTitle, n as DialogDescription, ay as DialogFooter, E as EmptyState, F as Badge } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { T as TableSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cpx_DA6H.js";
import "./StatusBadge-C3JOGEpV.js";
import { I as Input } from "./input-BB_cSxD4.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DZqbOTYv.js";
import { b as useForm, L as Label } from "./label-my991swb.js";
import { T as Textarea } from "./textarea-34Xy4SLJ.js";
import { u as ue } from "./index-CICSQFzn.js";
function Categories() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [renameTarget, setRenameTarget] = reactExports.useState(null);
  const [deactivateTarget, setDeactivateTarget] = reactExports.useState(
    null
  );
  const createForm = useForm({
    defaultValues: { name: "", description: "" }
  });
  const renameForm = useForm({
    defaultValues: { name: "", description: "" }
  });
  const onCreateSubmit = async (values) => {
    try {
      await createCategory.mutateAsync(values);
      ue.success("Category created successfully");
      setCreateOpen(false);
      createForm.reset();
    } catch (err) {
      ue.error("Failed to create category");
      console.error(err);
    }
  };
  const onRenameSubmit = async (values) => {
    if (!renameTarget) return;
    try {
      await updateCategory.mutateAsync({
        id: renameTarget.id,
        name: values.name,
        description: values.description
      });
      ue.success("Category updated successfully");
      setRenameTarget(null);
    } catch (err) {
      ue.error("Failed to update category");
      console.error(err);
    }
  };
  const onDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await updateCategory.mutateAsync({
        id: deactivateTarget.id,
        isActive: false
      });
      ue.success("Category deactivated");
      setDeactivateTarget(null);
    } catch (err) {
      ue.error("Failed to deactivate category");
      console.error(err);
    }
  };
  const openRename = (cat) => {
    renameForm.reset({ name: cat.name, description: cat.description ?? "" });
    setRenameTarget(cat);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Categories",
        description: "Create, rename, and deactivate ticket categories used across the helpdesk.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "New category" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Add a new category to organize incoming tickets." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                id: "create-category-form",
                onSubmit: createForm.handleSubmit(onCreateSubmit),
                className: "space-y-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cat-name", children: "Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "cat-name",
                        placeholder: "e.g. Billing",
                        ...createForm.register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters"
                          }
                        })
                      }
                    ),
                    createForm.formState.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: createForm.formState.errors.name.message })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cat-desc", children: "Description" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "cat-desc",
                        placeholder: "Short description of this category",
                        rows: 3,
                        ...createForm.register("description")
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
                  form: "create-category-form",
                  disabled: createCategory.isPending,
                  children: createCategory.isPending ? "Creating..." : "Create category"
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-card", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 5 }) }) : !categories || categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "No categories yet",
        description: "Create your first category to start organizing tickets."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: cat.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: cat.description || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: cat.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Inactive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => openRename(cat),
              children: "Rename"
            }
          ),
          cat.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: () => setDeactivateTarget(cat),
              children: "Deactivate"
            }
          )
        ] })
      ] }, cat.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: renameTarget !== null,
        onOpenChange: (open) => !open && setRenameTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Rename category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update the name and description for this category." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              id: "rename-category-form",
              onSubmit: renameForm.handleSubmit(onRenameSubmit),
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rename-name", children: "Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "rename-name",
                      ...renameForm.register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters"
                        }
                      })
                    }
                  ),
                  renameForm.formState.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: renameForm.formState.errors.name.message })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rename-desc", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "rename-desc",
                      rows: 3,
                      ...renameForm.register("description")
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
                onClick: () => setRenameTarget(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                form: "rename-category-form",
                disabled: updateCategory.isPending,
                children: updateCategory.isPending ? "Saving..." : "Save changes"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: deactivateTarget !== null,
        onOpenChange: (open) => !open && setDeactivateTarget(null),
        title: "Deactivate category",
        description: deactivateTarget ? `Are you sure you want to deactivate "${deactivateTarget.name}"? Existing tickets will keep their category, but new tickets cannot use it.` : "",
        confirmLabel: "Deactivate",
        cancelLabel: "Cancel",
        destructive: true,
        onConfirm: onDeactivate,
        trigger: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Deactivate" })
      }
    )
  ] });
}
export {
  Categories as default
};
