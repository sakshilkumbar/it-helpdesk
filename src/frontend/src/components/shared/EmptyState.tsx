import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Visual size — "sm" for inline card empties, "default" for full-page. */
  size?: "sm" | "default";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "default",
}: EmptyStateProps) {
  return (
    <output
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/20 text-center",
        size === "default" ? "px-6 py-16" : "px-6 py-10",
        className,
      )}
      data-ocid="empty_state"
    >
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5",
            size === "default" ? "h-14 w-14" : "h-11 w-11",
          )}
        >
          <Icon className={size === "default" ? "h-7 w-7" : "h-5 w-5"} />
        </div>
      )}
      <div className="space-y-1.5">
        <h3
          className={cn(
            "font-semibold text-foreground",
            size === "default" ? "text-base" : "text-sm",
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "mx-auto max-w-sm text-muted-foreground",
              size === "default" ? "text-sm" : "text-xs",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </output>
  );
}
