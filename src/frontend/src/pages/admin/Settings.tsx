import { PageHeader, TableSkeleton } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSystemSettings, useUpdateSystemSettings } from "@/hooks/useQueries";
import type { SystemSettingsUpdateInput } from "@/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SettingsFormValues {
  organizationName: string;
}

const AI_FEATURES = [
  {
    key: "classification",
    title: "Automatic ticket classification",
    description:
      "Automatically assign categories to incoming tickets based on content.",
  },
  {
    key: "priority-prediction",
    title: "Priority prediction",
    description: "Predict the appropriate priority level for new tickets.",
  },
  {
    key: "duplicate-detection",
    title: "Duplicate-ticket detection",
    description: "Flag tickets that appear to duplicate existing ones.",
  },
  {
    key: "suggested-solutions",
    title: "Suggested solutions",
    description:
      "Surface relevant knowledge-base articles as suggested resolutions.",
  },
  {
    key: "chatbot",
    title: "AI chatbot",
    description: "Conversational assistant grounded in your knowledge base.",
  },
];

export default function Settings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateSettings = useUpdateSystemSettings();

  const form = useForm<SettingsFormValues>({
    defaultValues: { organizationName: "" },
  });

  useEffect(() => {
    if (settings?.organizationName) {
      form.reset({ organizationName: settings.organizationName });
    }
  }, [settings, form]);

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      const input: SystemSettingsUpdateInput = {
        organizationName: values.organizationName,
      };
      await updateSettings.mutateAsync(input);
      toast.success("Settings saved");
    } catch (err) {
      toast.error("Failed to save settings");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System settings"
        description="Configure organization details and review upcoming AI capabilities."
      />

      {isLoading ? (
        <div className="p-6">
          <TableSkeleton rows={4} />
        </div>
      ) : (
        <div className="grid gap-6 max-w-3xl">
          {/* Organization settings */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                Basic details used across the helpdesk and customer-facing
                surfaces.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization name</Label>
                  <Input
                    id="org-name"
                    placeholder="e.g. Acme Support"
                    {...form.register("organizationName", {
                      required: "Organization name is required",
                      minLength: {
                        value: 2,
                        message:
                          "Organization name must be at least 2 characters",
                      },
                    })}
                  />
                  {form.formState.errors.organizationName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.organizationName.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateSettings.isPending}>
                    {updateSettings.isPending ? "Saving..." : "Save settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* AI features placeholder */}
          <Card className="opacity-75">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI features coming soon</CardTitle>
                  <CardDescription>
                    The following AI capabilities are planned for a future
                    release. They are disabled in this version.
                  </CardDescription>
                </div>
                <Badge variant="secondary">Coming soon</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {AI_FEATURES.map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-start justify-between gap-4 rounded-md border p-4"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <Switch disabled aria-label={feature.title} />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                These toggles are placeholders. AI logic is not enabled in this
                version.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
