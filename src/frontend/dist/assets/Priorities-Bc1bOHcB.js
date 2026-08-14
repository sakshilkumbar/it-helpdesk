import { q as usePriorities, aC as useCreatePriority, aD as useUpdatePriority, r as reactExports, j as jsxRuntimeExports, D as Dialog, aB as DialogTrigger, B as Button, k as DialogContent, l as DialogHeader, m as DialogTitle, n as DialogDescription, ay as DialogFooter, E as EmptyState, F as Badge } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { T as TableSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Cpx_DA6H.js";
import "./StatusBadge-C3JOGEpV.js";
import { I as Input } from "./input-BB_cSxD4.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DZqbOTYv.js";
import { b as useForm, L as Label } from "./label-my991swb.js";
import { u as ue } from "./index-CICSQFzn.js";
const NS_PER_HOUR = 36e11;
const nsToHours = (ns) => {
  return Number(ns) / NS_PER_HOUR;
};
const hoursToNs = (hours) => {
  return BigInt(Math.round(hours * NS_PER_HOUR));
};
function Priorities() {
  const { data: priorities, isLoading } = usePriorities();
  const createPriority = useCreatePriority();
  const updatePriority = useUpdatePriority();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deactivateTarget, setDeactivateTarget] = reactExports.useState(
    null
  );
  const createForm = useForm({
    defaultValues: { name: "", level: 1, slaHours: 24 }
  });
  const editForm = useForm({
    defaultValues: { name: "", level: 1, slaHours: 24 }
  });
  const onCreateSubmit = async (values) => {
    try {
      const input = {
        name: values.name,
        level: BigInt(values.level),
        slaTargetNs: hoursToNs(values.slaHours)
      };
      await createPriority.mutateAsync(input);
      ue.success("Priority created successfully");
      setCreateOpen(false);
      createForm.reset({ name: "", level: 1, slaHours: 24 });
    } catch (err) {
      ue.error("Failed to create priority");
      console.error(err);
    }
  };
  const onEditSubmit = async (values) => {
    if (!editTarget) return;
    try {
      await updatePriority.mutateAsync({
        id: editTarget.id,
        name: values.name,
        level: BigInt(values.level),
        slaTargetNs: hoursToNs(values.slaHours)
      });
      ue.success("Priority updated successfully");
      setEditTarget(null);
    } catch (err) {
      ue.error("Failed to update priority");
      console.error(err);
    }
  };
  const onDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await updatePriority.mutateAsync({
        id: deactivateTarget.id,
        isActive: false
      });
      ue.success("Priority deactivated");
      setDeactivateTarget(null);
    } catch (err) {
      ue.error("Failed to deactivate priority");
      console.error(err);
    }
  };
  const openEdit = (p) => {
    editForm.reset({
      name: p.name,
      level: Number(p.level),
      slaHours: nsToHours(p.slaTargetNs)
    });
    setEditTarget(p);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Priorities",
        description: "Configure priority levels and their associated SLA target resolution times.",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "New priority" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Define a new priority level and its SLA target resolution time." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                id: "create-priority-form",
                onSubmit: createForm.handleSubmit(onCreateSubmit),
                className: "space-y-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-name", children: "Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "p-name",
                        placeholder: "e.g. High",
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-level", children: "Level (numeric, higher = more urgent)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "p-level",
                        type: "number",
                        min: 1,
                        ...createForm.register("level", {
                          required: "Level is required",
                          valueAsNumber: true,
                          min: { value: 1, message: "Level must be at least 1" }
                        })
                      }
                    ),
                    createForm.formState.errors.level && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: createForm.formState.errors.level.message })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-sla", children: "SLA target (hours)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "p-sla",
                        type: "number",
                        min: 1,
                        step: 1,
                        ...createForm.register("slaHours", {
                          required: "SLA target is required",
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: "SLA target must be at least 1 hour"
                          }
                        })
                      }
                    ),
                    createForm.formState.errors.slaHours && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: createForm.formState.errors.slaHours.message })
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
                  form: "create-priority-form",
                  disabled: createPriority.isPending,
                  children: createPriority.isPending ? "Creating..." : "Create priority"
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-card", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 5 }) }) : !priorities || priorities.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "No priorities yet",
        description: "Create your first priority level to define SLA targets."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "SLA target" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: priorities.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: Number(p.level) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
          nsToHours(p.slaTargetNs),
          " hours"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: p.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Inactive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => openEdit(p),
              children: "Edit"
            }
          ),
          p.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: () => setDeactivateTarget(p),
              children: "Deactivate"
            }
          )
        ] })
      ] }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editTarget !== null,
        onOpenChange: (open) => !open && setEditTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit priority" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update the name, level, and SLA target for this priority." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              id: "edit-priority-form",
              onSubmit: editForm.handleSubmit(onEditSubmit),
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-p-name", children: "Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-p-name",
                      ...editForm.register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters"
                        }
                      })
                    }
                  ),
                  editForm.formState.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editForm.formState.errors.name.message })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-p-level", children: "Level (numeric, higher = more urgent)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-p-level",
                      type: "number",
                      min: 1,
                      ...editForm.register("level", {
                        required: "Level is required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Level must be at least 1" }
                      })
                    }
                  ),
                  editForm.formState.errors.level && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editForm.formState.errors.level.message })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-p-sla", children: "SLA target (hours)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-p-sla",
                      type: "number",
                      min: 1,
                      step: 1,
                      ...editForm.register("slaHours", {
                        required: "SLA target is required",
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: "SLA target must be at least 1 hour"
                        }
                      })
                    }
                  ),
                  editForm.formState.errors.slaHours && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editForm.formState.errors.slaHours.message })
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
                form: "edit-priority-form",
                disabled: updatePriority.isPending,
                children: updatePriority.isPending ? "Saving..." : "Save changes"
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
        title: "Deactivate priority",
        description: deactivateTarget ? `Are you sure you want to deactivate "${deactivateTarget.name}"? New tickets cannot use this priority once deactivated.` : "",
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
  Priorities as default
};
