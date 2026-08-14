/**
 * roleHelpers — canonical role utilities for the 4-role IT Helpdesk model.
 *
 * Backend AppRole variants: #employee, #l1_help_desk, #l2_resolver, #admin.
 * Unknown / unassigned callers default to the Employee experience.
 */

import { AppRole, ResolverTier } from "@/types";

/** Ordered list of all backend roles. */
export const ALL_ROLES: AppRole[] = [
  AppRole.employee,
  AppRole.l1_help_desk,
  AppRole.l2_resolver,
  AppRole.admin,
];

/** Human-readable role labels (matches backend roleLabels contract). */
export const ROLE_LABELS: Record<AppRole, string> = {
  [AppRole.employee]: "Employee",
  [AppRole.l1_help_desk]: "Level 1 Help Desk",
  [AppRole.l2_resolver]: "Level 2 Resolver",
  [AppRole.admin]: "Administrator",
};

/** Short role labels for compact UI (badges, pills). */
export const ROLE_SHORT_LABELS: Record<AppRole, string> = {
  [AppRole.employee]: "Employee",
  [AppRole.l1_help_desk]: "L1 Help Desk",
  [AppRole.l2_resolver]: "L2 Resolver",
  [AppRole.admin]: "Admin",
};

/** Tailwind badge classes per role — petrol-teal primary, amber accent. */
export const ROLE_BADGE_CLASS: Record<AppRole, string> = {
  [AppRole.employee]:
    "bg-primary/10 text-primary border-primary/20 dark:bg-primary/15 dark:text-primary dark:border-primary/25",
  [AppRole.l1_help_desk]:
    "bg-accent/15 text-accent-foreground border-accent/30 dark:bg-accent/20 dark:text-accent-foreground dark:border-accent/35",
  [AppRole.l2_resolver]:
    "bg-info/10 text-info border-info/20 dark:bg-info/15 dark:text-info dark:border-info/25",
  [AppRole.admin]:
    "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/15 dark:text-destructive dark:border-destructive/25",
};

/** Dot color per role for the topbar profile indicator. */
export const ROLE_DOT_CLASS: Record<AppRole, string> = {
  [AppRole.employee]: "bg-primary",
  [AppRole.l1_help_desk]: "bg-accent",
  [AppRole.l2_resolver]: "bg-info",
  [AppRole.admin]: "bg-destructive",
};

/** The landing dashboard route for each role. */
export const ROLE_HOME: Record<AppRole, string> = {
  [AppRole.employee]: "/employee/dashboard",
  [AppRole.l1_help_desk]: "/agent/dashboard",
  [AppRole.l2_resolver]: "/agent/dashboard",
  [AppRole.admin]: "/admin/dashboard",
};

/** Resolver tier labels. */
export const TIER_LABELS: Record<ResolverTier, string> = {
  [ResolverTier.l1]: "Level 1",
  [ResolverTier.l2]: "Level 2",
};

/** Normalize a possibly-null role to a non-null one (defaults to employee). */
export function normalizeRole(role: AppRole | null | undefined): AppRole {
  return role ?? AppRole.employee;
}

/** Role label, falling back to "Employee" for unknown roles. */
export function roleLabel(role: AppRole | null | undefined): string {
  return ROLE_LABELS[normalizeRole(role)];
}

/** Short role label for compact surfaces. */
export function roleShortLabel(role: AppRole | null | undefined): string {
  return ROLE_SHORT_LABELS[normalizeRole(role)];
}

/** Home route for a role (defaults to employee dashboard). */
export function roleHomePath(role: AppRole | null | undefined): string {
  return ROLE_HOME[normalizeRole(role)];
}

/** Badge classes for a role. */
export function roleBadgeClass(role: AppRole | null | undefined): string {
  return ROLE_BADGE_CLASS[normalizeRole(role)];
}

/** Dot class for a role. */
export function roleDotClass(role: AppRole | null | undefined): string {
  return ROLE_DOT_CLASS[normalizeRole(role)];
}

/** Whether a role is any kind of resolver/agent (L1 or L2). */
export function isResolverRole(role: AppRole | null | undefined): boolean {
  const r = normalizeRole(role);
  return r === AppRole.l1_help_desk || r === AppRole.l2_resolver;
}

/** Whether a role is admin. */
export function isAdminRole(role: AppRole | null | undefined): boolean {
  return normalizeRole(role) === AppRole.admin;
}

/** Initials from a display name. */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Friendly label for a message author role (used in ticket threads). */
export function authorRoleLabel(role: AppRole | null | undefined): string {
  const r = normalizeRole(role);
  switch (r) {
    case AppRole.admin:
      return "Admin";
    case AppRole.l1_help_desk:
      return "L1 Agent";
    case AppRole.l2_resolver:
      return "L2 Agent";
    default:
      return "Employee";
  }
}

/** Whether an author role is an agent/admin (used to align message bubbles). */
export function isAgentAuthor(role: AppRole | null | undefined): boolean {
  const r = normalizeRole(role);
  return (
    r === AppRole.l1_help_desk ||
    r === AppRole.l2_resolver ||
    r === AppRole.admin
  );
}
