import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  useCreateTicket,
  usePriorities,
} from "@/hooks/useQueries";

interface FormValues {
  title: string;
  description: string;
  categoryId: string;
  priorityId: string;
}

interface AttachedFile {
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

export function CreateTicket() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categoriesData, isLoading: catLoading } = useCategories();
  const { data: prioritiesData, isLoading: priLoading } = usePriorities();

  const categories = categoriesData ?? [];
  const priorities = prioritiesData ?? [];

  const [attachments, setAttachments] = useState<AttachedFile[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      priorityId: "",
    },
  });

  const uploadOne = useCallback(async (file: File) => {
    setAttachments((prev) => [
      ...prev,
      { file, progress: 0, status: "uploading" },
    ]);
    // Simulated upload progress — actual storage upload is handled server-side
    // once the ticket is created. This UI is a local placeholder.
    const interval = setInterval(() => {
      setAttachments((prev) =>
        prev.map((a) =>
          a.file === file
            ? { ...a, progress: Math.min(100, a.progress + Math.random() * 25) }
            : a,
        ),
      );
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setAttachments((prev) =>
        prev.map((a) =>
          a.file === file ? { ...a, status: "done", progress: 100 } : a,
        ),
      );
    }, 1200);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      files.forEach(uploadOne);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadOne],
  );

  const removeAttachment = useCallback((file: File) => {
    setAttachments((prev) => prev.filter((a) => a.file !== file));
  }, []);

  const onSubmit = async (values: FormValues) => {
    const pendingUploads = attachments.filter((a) => a.status === "uploading");
    if (pendingUploads.length > 0) {
      toast.warning("Please wait for file uploads to finish", {
        description: `${pendingUploads.length} file(s) still uploading.`,
      });
      return;
    }

    try {
      const result = await createTicket.mutateAsync({
        title: values.title,
        description: values.description,
        categoryId: BigInt(values.categoryId),
        priorityId: BigInt(values.priorityId),
        attachments: [],
      });

      toast.success("Ticket created", {
        description: "Your support request has been submitted.",
      });

      const newId = result?.id;
      if (newId !== undefined) {
        navigate({
          to: "/employee/tickets/$id",
          params: { id: String(newId) },
        });
      } else {
        navigate({ to: "/employee/tickets" });
      }
    } catch (err: any) {
      toast.error("Failed to create ticket", {
        description: err?.message ?? "Please try again.",
      });
    }
  };

  const uploadingCount = attachments.filter(
    (a) => a.status === "uploading",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Ticket"
        description="Submit a new support request. Provide as much detail as possible to help our agents resolve it quickly."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket details</CardTitle>
                  <CardDescription>
                    Required fields are marked with an asterisk.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Briefly summarize the issue"
                            maxLength={160}
                            {...form.register("title", {
                              required: "Title is required",
                              minLength: {
                                value: 8,
                                message: "Title must be at least 8 characters",
                              },
                              maxLength: {
                                value: 160,
                                message:
                                  "Title must be 160 characters or fewer",
                              },
                            })}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value.length}/160 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={catLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories
                                .filter((c) => c.isActive)
                                .map((c) => (
                                  <SelectItem
                                    key={String(c.id)}
                                    value={String(c.id)}
                                  >
                                    {c.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priorityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={priLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorities
                                .filter((p) => p.isActive)
                                .map((p) => (
                                  <SelectItem
                                    key={String(p.id)}
                                    value={String(p.id)}
                                  >
                                    {p.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the issue, including steps to reproduce, expected behavior, and actual behavior."
                            className="min-h-[180px] resize-y"
                            maxLength={8000}
                            {...form.register("description", {
                              required: "Description is required",
                              minLength: {
                                value: 20,
                                message:
                                  "Description must be at least 20 characters",
                              },
                              maxLength: {
                                value: 8000,
                                message:
                                  "Description must be 8000 characters or fewer",
                              },
                            })}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value.length}/8000 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Attachments */}
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>
                    Optionally attach screenshots or files to help us understand
                    the issue.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files ?? []);
                      files.forEach(uploadOne);
                    }}
                  >
                    <Upload
                      className="h-8 w-8 text-muted-foreground"
                      aria-hidden
                    />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files here, or
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                    />
                    <p className="text-xs text-muted-foreground">
                      Images, PDFs, documents, and archives up to platform
                      limits.
                    </p>
                  </div>

                  {attachments.length > 0 && (
                    <ul className="space-y-2">
                      {attachments.map((a, idx) => (
                        <li
                          key={`${a.file.name}-${idx}`}
                          className="flex items-center gap-3 rounded-md border p-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-medium">
                                {a.file.name}
                              </span>
                              <div className="flex items-center gap-2">
                                {a.status === "done" && (
                                  <Badge variant="secondary" className="gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Uploaded
                                  </Badge>
                                )}
                                {a.status === "error" && (
                                  <Badge
                                    variant="destructive"
                                    className="gap-1"
                                  >
                                    <AlertCircle className="h-3 w-3" />
                                    Failed
                                  </Badge>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => removeAttachment(a.file)}
                                  aria-label={`Remove ${a.file.name}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{(a.file.size / 1024).toFixed(1)} KB</span>
                              {a.status === "uploading" && (
                                <span>
                                  · uploading… {Math.round(a.progress)}%
                                </span>
                              )}
                              {a.status === "error" && a.error && (
                                <span className="text-destructive">
                                  · {a.error}
                                </span>
                              )}
                            </div>
                            {a.status === "uploading" && (
                              <Progress value={a.progress} className="h-1.5" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter className="justify-end border-t bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate({ to: "/employee/dashboard" })}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createTicket.isPending || uploadingCount > 0}
                    >
                      {createTicket.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        "Submit ticket"
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        {/* Sidebar: AI suggestions placeholder */}
        <div className="space-y-6">
          <Card className="border-dashed bg-muted/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base">
                    AI suggestions coming soon
                  </CardTitle>
                  <CardDescription>
                    Intelligent assistance is on the way.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                This section will soon provide intelligent help while you write
                your ticket:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>
                    <strong className="font-medium text-foreground">
                      Duplicate detection
                    </strong>{" "}
                    — warnings when a similar ticket already exists, so you can
                    avoid re-submitting.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>
                    <strong className="font-medium text-foreground">
                      Suggested solutions
                    </strong>{" "}
                    — relevant knowledge-base articles and fixes surfaced as you
                    describe the issue.
                  </span>
                </li>
              </ul>
              <Separator />
              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                <span>AI features are disabled in this release.</span>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20">
              <Button disabled className="w-full" aria-disabled>
                <Sparkles className="mr-2 h-4 w-4" />
                AI suggestions (disabled)
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Tips for a great ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Include clear steps to reproduce the issue.</p>
              <p>• Mention expected vs. actual behavior.</p>
              <p>• Attach screenshots or logs when possible.</p>
              <p>
                • Pick the lowest priority that fits — it helps us triage
                fairly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
