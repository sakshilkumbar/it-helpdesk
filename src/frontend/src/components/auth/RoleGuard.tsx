import { Navigate } from "@tanstack/react-router";

import { useAuth } from "@/hooks/useAuth";
import { roleHomePath } from "@/lib/roleHelpers";
import type { AppRole } from "@/types";

export interface RoleGuardProps {
  /** Roles allowed to view the guarded route. */
  allow: AppRole[];
  children: React.ReactNode;
}

/**
 * RoleGuard — gates a route behind authentication + role authorization.
 * Unauthenticated users are redirected to /login.
 * Authenticated users without an allowed role are redirected to their
 * own role dashboard.
 */
export function RoleGuard({ allow, children }: RoleGuardProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && !allow.includes(role)) {
    return <Navigate to={roleHomePath(role)} />;
  }

  return <>{children}</>;
}

export default RoleGuard;
