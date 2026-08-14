import { Suspense, lazy } from "react";

import { RoleGuard } from "@/components/auth/RoleGuard";
import type { AppRole } from "@/types";

/** Shared fallback for lazy-loaded guarded pages. */
function PageFallback() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static array of fixed length
          <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

/**
 * withRoleGuard — HOC that wraps a lazy component in RoleGuard + Suspense.
 * Use for route components that need auth + role gating.
 */
export function withRoleGuard(
  allow: AppRole[],
  Component: React.LazyExoticComponent<React.ComponentType>,
) {
  return function Guarded() {
    return (
      <RoleGuard allow={allow}>
        <Suspense fallback={<PageFallback />}>
          <Component />
        </Suspense>
      </RoleGuard>
    );
  };
}

export default withRoleGuard;
