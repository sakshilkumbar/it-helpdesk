import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Retry handler. When omitted, the retry button is hidden. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Override the default warning icon. */
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  /** Visual size — "sm" for inline card errors, "default" for full-page. */
  size?: "sm" | "default";
}

/**
 * ErrorState — friendly, recoverable error surface for failed data fetches
 * or mutations. Shows an icon, headline, supporting copy, and a retry action.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again in a moment.",
  onRetry,
  retryLabel = "Try again",
  icon: Icon = AlertTriangle,
  className,
  size = "default",
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 text-center",
        size === "default" ? "px-6 py-16" : "px-6 py-10",
        className,
      )}
      data-ocid="error_state"
      role="alert"
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5",
          size === "default" ? "h-14 w-14" : "h-11 w-11",
        )}
      >
        <Icon className={size === "default" ? "h-7 w-7" : "h-5 w-5"} />
      </div>
      <div className="space-y-1.5">
        <h3
          className={cn(
            "font-semibold text-foreground",
            size === "default" ? "text-base" : "text-sm",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mx-auto max-w-sm text-muted-foreground",
            size === "default" ? "text-sm" : "text-xs",
          )}
        >
          {description}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size={size === "default" ? "default" : "sm"}
          onClick={onRetry}
          data-ocid="error_state.retry_button"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
