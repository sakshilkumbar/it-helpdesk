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
import {
  useCreatePriority,
  usePriorities,
  useUpdatePriority,
} from "@/hooks/useQueries";
import type { PriorityCreateInput, PriorityView } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const NS_PER_HOUR = 3.6e12;

interface PriorityFormValues {
  name: string;
  level: number;
  slaHours: number;
}

const nsToHours = (ns: bigint): number => {
  return Number(ns) / NS_PER_HOUR;
};

const hoursToNs = (hours: number): bigint => {
  return BigInt(Math.round(hours * NS_PER_HOUR));
};

export default function Priorities() {
  const { data: priorities, isLoading } = usePriorities();
  const createPriority = useCreatePriority();
  const updatePriority = useUpdatePriority();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PriorityView | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<PriorityView | null>(
    null,
  );

  const createForm = useForm<PriorityFormValues>({
    defaultValues: { name: "", level: 1, slaHours: 24 },
  });

  const editForm = useForm<PriorityFormValues>({
    defaultValues: { name: "", level: 1, slaHours: 24 },
  });

  const onCreateSubmit = async (values: PriorityFormValues) => {
    try {
      const input: PriorityCreateInput = {
        name: values.name,
        level: BigInt(values.level),
        slaTargetNs: hoursToNs(values.slaHours),
      };
      await createPriority.mutateAsync(input);
      toast.success("Priority created successfully");
      setCreateOpen(false);
      createForm.reset({ name: "", level: 1, slaHours: 24 });
    } catch (err) {
      toast.error("Failed to create priority");
      console.error(err);
    }
  };

  const onEditSubmit = async (values: PriorityFormValues) => {
    if (!editTarget) return;
    try {
      await updatePriority.mutateAsync({
        id: editTarget.id,
        name: values.name,
        level: BigInt(values.level),
        slaTargetNs: hoursToNs(values.slaHours),
      });
      toast.success("Priority updated successfully");
      setEditTarget(null);
    } catch (err) {
      toast.error("Failed to update priority");
      console.error(err);
    }
  };

  const onDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await updatePriority.mutateAsync({
        id: deactivateTarget.id,
        isActive: false,
      });
      toast.success("Priority deactivated");
      setDeactivateTarget(null);
    } catch (err) {
      toast.error("Failed to deactivate priority");
      console.error(err);
    }
  };

  const openEdit = (p: PriorityView) => {
    editForm.reset({
      name: p.name,
      level: Number(p.level),
      slaHours: nsToHours(p.slaTargetNs),
    });
    setEditTarget(p);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Priorities"
        description="Configure priority levels and their associated SLA target resolution times."
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>New priority</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create priority</DialogTitle>
                <DialogDescription>
                  Define a new priority level and its SLA target resolution
                  time.
                </DialogDescription>
              </DialogHeader>
              <form
                id="create-priority-form"
                onSubmit={createForm.handleSubmit(onCreateSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="p-name">Name</Label>
                  <Input
                    id="p-name"
                    placeholder="e.g. High"
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
                  <Label htmlFor="p-level">
                    Level (numeric, higher = more urgent)
                  </Label>
                  <Input
                    id="p-level"
                    type="number"
                    min={1}
                    {...createForm.register("level", {
                      required: "Level is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Level must be at least 1" },
                    })}
                  />
                  {createForm.formState.errors.level && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.level.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-sla">SLA target (hours)</Label>
                  <Input
                    id="p-sla"
                    type="number"
                    min={1}
                    step={1}
                    {...createForm.register("slaHours", {
                      required: "SLA target is required",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "SLA target must be at least 1 hour",
                      },
                    })}
                  />
                  {createForm.formState.errors.slaHours && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.slaHours.message}
                    </p>
                  )}
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
                  form="create-priority-form"
                  disabled={createPriority.isPending}
                >
                  {createPriority.isPending ? "Creating..." : "Create priority"}
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
        ) : !priorities || priorities.length === 0 ? (
          <EmptyState
            title="No priorities yet"
            description="Create your first priority level to define SLA targets."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>SLA target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priorities.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{Number(p.level)}</TableCell>
                  <TableCell>{nsToHours(p.slaTargetNs)} hours</TableCell>
                  <TableCell>
                    {p.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </Button>
                    {p.isActive && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeactivateTarget(p)}
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

      {/* Edit dialog */}
      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit priority</DialogTitle>
            <DialogDescription>
              Update the name, level, and SLA target for this priority.
            </DialogDescription>
          </DialogHeader>
          <form
            id="edit-priority-form"
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-p-name">Name</Label>
              <Input
                id="edit-p-name"
                {...editForm.register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {editForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-p-level">
                Level (numeric, higher = more urgent)
              </Label>
              <Input
                id="edit-p-level"
                type="number"
                min={1}
                {...editForm.register("level", {
                  required: "Level is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Level must be at least 1" },
                })}
              />
              {editForm.formState.errors.level && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.level.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-p-sla">SLA target (hours)</Label>
              <Input
                id="edit-p-sla"
                type="number"
                min={1}
                step={1}
                {...editForm.register("slaHours", {
                  required: "SLA target is required",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "SLA target must be at least 1 hour",
                  },
                })}
              />
              {editForm.formState.errors.slaHours && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.slaHours.message}
                </p>
              )}
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
              form="edit-priority-form"
              disabled={updatePriority.isPending}
            >
              {updatePriority.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirm */}
      <ConfirmDialog
        open={deactivateTarget !== null}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Deactivate priority"
        description={
          deactivateTarget
            ? `Are you sure you want to deactivate "${deactivateTarget.name}"? New tickets cannot use this priority once deactivated.`
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
