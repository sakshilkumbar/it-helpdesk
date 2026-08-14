// Frontend TypeScript types — re-export backend enums and add UI-specific types

import { AppRole, ResolverTier } from "@/backend";
import type {
  AuditAction,
  NotificationType,
  SortOrder,
  TicketStatus,
  UserRole,
  Variant_createdAt_updatedAt_priority,
} from "@/backend";

// Re-export backend enums (values) for convenience
export { AppRole, ResolverTier };

// Re-export backend enum types that are only used as types on the frontend
export type {
  TicketStatus,
  SortOrder,
  AuditAction,
  NotificationType,
  UserRole,
  Variant_createdAt_updatedAt_priority,
};

// Re-export backend record/view types under their canonical *View names
export type {
  TicketView as Ticket,
  UserView as User,
  PriorityView as Priority,
  CategoryView as Category,
  NotificationView as Notification,
  AuditLogView as AuditLog,
  KnowledgeArticleView as KnowledgeArticle,
  SystemSettingsView as SystemSettings,
  TicketSLAStatus as SLAStatus,
  TicketMessage,
  TicketAnalytics,
  TicketSLAStatus,
  TicketView,
  UserView,
  PriorityView,
  CategoryView,
  NotificationView,
  AuditLogView,
  KnowledgeArticleView,
  SystemSettingsView,
  AgentSummary,
  Attachment,
  Error_,
  Timestamp,
  TicketId,
  UserId,
  CategoryId,
  PriorityId,
  NotificationId,
  AuditLogId,
  KnowledgeArticleId,
  MessageId,
  AttachmentId,
  PageRequest,
  TicketQuery,
  AuditLogQuery,
  TicketCreateInput,
  TicketUpdateInput,
  CategoryCreateInput,
  CategoryUpdateInput,
  PriorityCreateInput,
  PriorityUpdateInput,
  KnowledgeArticleCreateInput,
  KnowledgeArticleUpdateInput,
  SystemSettingsUpdateInput,
} from "@/backend";

// UI-specific role labels
export const ROLE_LABELS: Record<AppRole, string> = {
  [AppRole.admin]: "Administrator",
  [AppRole.l1_help_desk]: "Level 1 Help Desk",
  [AppRole.l2_resolver]: "Level 2 Resolver",
  [AppRole.employee]: "Employee",
};

// Pagination — UI-friendly wrapper (backend PageRequest uses bigint)
export interface PageRequestUI {
  page: number;
  pageSize: number;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filtering
export interface TicketFilterState {
  search: string;
  status: TicketStatus | "all";
  priority: string | "all";
  category: string | "all";
  assignee: string | "all";
}

export interface UserFilterState {
  search: string;
  role: AppRole | "all";
  active: "all" | "active" | "inactive";
}

export interface AuditLogFilterState {
  search: string;
  action: string | "all";
  startDate: string | "";
  endDate: string | "";
}

export interface KnowledgeFilterState {
  search: string;
  category: string | "all";
}

// Sorting
export type SortDirection = "asc" | "desc";

export interface SortState<T extends string = string> {
  field: T;
  direction: SortDirection;
}

// Navigation
export interface NavItem {
  label: string;
  to: string;
  icon?: string;
  roles: AppRole[];
}

// Toast notifications
export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

// Empty
export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

// Helper to normalize backend Error_ variant to a readable message
export function errorToMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    if ("NotFound" in e) return String(e.NotFound ?? "Not found");
    if ("Unauthorized" in e) return String(e.Unauthorized ?? "Unauthorized");
    if ("Forbidden" in e) return String(e.Forbidden ?? "Forbidden");
    if ("AlreadyExists" in e)
      return String(e.AlreadyExists ?? "Already exists");
    if ("Invalid" in e) return String(e.Invalid ?? "Invalid input");
    if ("Conflict" in e) return String(e.Conflict ?? "Conflict");
    if ("Internal" in e) return String(e.Internal ?? "Internal error");
    if ("message" in e) return String(e.message);
  }
  return "An unexpected error occurred";
}
