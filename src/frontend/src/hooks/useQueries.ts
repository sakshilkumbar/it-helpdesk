import type {
  AgentSummary,
  AppRole,
  AuditLog,
  AuditLogQuery,
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
  KnowledgeArticle,
  KnowledgeArticleCreateInput,
  KnowledgeArticleUpdateInput,
  Notification,
  PageRequest,
  Priority,
  PriorityCreateInput,
  PriorityUpdateInput,
  SLAStatus,
  SystemSettings,
  SystemSettingsUpdateInput,
  Ticket,
  TicketAnalytics,
  TicketCreateInput,
  TicketMessage,
  TicketQuery,
  TicketStatus,
  TicketUpdateInput,
  User,
  UserId,
} from "@/types";
import { useApi, useApiMutation } from "./useBackend";
import type { Actor } from "./useBackend";

// Default page request (page 1, 50 items). Backend expects bigint page/pageSize.
const DEFAULT_PAGE: PageRequest = { page: 1n, pageSize: 50n };
const DEFAULT_TICKET_QUERY: TicketQuery = { page: DEFAULT_PAGE };
const DEFAULT_AUDIT_QUERY: AuditLogQuery = { page: DEFAULT_PAGE };

// ---------- Tickets ----------

export function useMyTickets(ticketQuery: TicketQuery = DEFAULT_TICKET_QUERY) {
  return useApi<Ticket[]>(["tickets", "mine", ticketQuery], (a: Actor) =>
    a.listMyTickets(ticketQuery),
  );
}

export function useMyAssignedTickets(
  ticketQuery: TicketQuery = DEFAULT_TICKET_QUERY,
) {
  return useApi<Ticket[]>(["tickets", "assigned", ticketQuery], (a: Actor) =>
    a.listMyAssignedTickets(ticketQuery),
  );
}

export function useAllTickets(ticketQuery: TicketQuery = DEFAULT_TICKET_QUERY) {
  return useApi<Ticket[]>(["tickets", "all", ticketQuery], (a: Actor) =>
    a.listAllTickets(ticketQuery),
  );
}

export function useTicket(id: string | number | bigint) {
  return useApi<Ticket | null>(
    ["ticket", String(id)],
    (a: Actor) => a.getTicket(BigInt(id)),
    { enabled: id !== "" && id !== 0 },
  );
}

export function useTicketMessages(id: string | number | bigint) {
  return useApi<TicketMessage[]>(
    ["ticket", String(id), "messages"],
    (a: Actor) => a.listTicketMessages(BigInt(id)),
    { enabled: id !== "" && id !== 0 },
  );
}

export function useTicketAnalytics() {
  return useApi<TicketAnalytics>(["analytics", "tickets"], (a: Actor) =>
    a.getTicketAnalytics(),
  );
}

export function useCreateTicket() {
  return useApiMutation<TicketCreateInput, Ticket>((a, v) => a.createTicket(v));
}

export function useUpdateTicket() {
  return useApiMutation<TicketUpdateInput, Ticket>((a, v) => a.updateTicket(v));
}

export function useCloseTicket() {
  return useApiMutation<
    { ticketId: bigint; resolutionSummary: string },
    Ticket
  >((a, v) => a.closeTicket(v.ticketId, v.resolutionSummary));
}

export function useReassignTicket() {
  return useApiMutation<{ ticketId: bigint; newAgent: UserId }, Ticket>(
    (a, v) => a.reassignTicket(v.ticketId, v.newAgent),
  );
}

export function usePostTicketMessage() {
  return useApiMutation<
    { ticketId: bigint; body: string; isInternal: boolean },
    TicketMessage
  >((a, v) => a.postTicketMessage(v.ticketId, v.body, v.isInternal));
}

// ---------- Users / Agents ----------

export function useUsers(
  search: string | null = null,
  roleFilter: AppRole | null = null,
  page: PageRequest = DEFAULT_PAGE,
) {
  return useApi<User[]>(
    ["users", search ?? "", roleFilter ?? "", page.page, page.pageSize],
    (a: Actor) => a.listUsers(search, roleFilter, page),
  );
}

export function useAgents() {
  return useApi<AgentSummary[]>(["agents"], (a: Actor) => a.listAgents());
}

export function useAssignUserRole() {
  return useApiMutation<{ user: UserId; newRole: AppRole }, User>((a, v) =>
    a.assignUserRole(v.user, v.newRole),
  );
}

export function useDeactivateUser() {
  return useApiMutation<{ user: UserId }, User>((a, v) =>
    a.deactivateUser(v.user),
  );
}

export function useReactivateUser() {
  return useApiMutation<{ user: UserId }, User>((a, v) =>
    a.reactivateUser(v.user),
  );
}

// ---------- Categories ----------

export function useCategories(includeInactive = false) {
  return useApi<Category[]>(["categories", includeInactive], (a: Actor) =>
    a.listCategories(includeInactive),
  );
}

export function useCreateCategory() {
  return useApiMutation<CategoryCreateInput, Category>((a, v) =>
    a.createCategory(v),
  );
}

export function useUpdateCategory() {
  return useApiMutation<CategoryUpdateInput, Category>((a, v) =>
    a.updateCategory(v),
  );
}

// ---------- Priorities ----------

export function usePriorities(includeInactive = false) {
  return useApi<Priority[]>(["priorities", includeInactive], (a: Actor) =>
    a.listPriorities(includeInactive),
  );
}

export function useCreatePriority() {
  return useApiMutation<PriorityCreateInput, Priority>((a, v) =>
    a.createPriority(v),
  );
}

export function useUpdatePriority() {
  return useApiMutation<PriorityUpdateInput, Priority>((a, v) =>
    a.updatePriority(v),
  );
}

// ---------- SLA ----------

export function useSLAStatuses() {
  return useApi<SLAStatus[]>(["sla", "statuses"], (a: Actor) =>
    a.getSLAStatuses(),
  );
}

// ---------- Audit Logs ----------

export function useAuditLogs(auditQuery: AuditLogQuery = DEFAULT_AUDIT_QUERY) {
  return useApi<AuditLog[]>(["audit-logs", auditQuery], (a: Actor) =>
    a.listAuditLogs(auditQuery),
  );
}

// ---------- Knowledge Base ----------

export function useKnowledgeArticles() {
  return useApi<KnowledgeArticle[]>(["kb"], (a: Actor) =>
    a.listKnowledgeArticles(),
  );
}

export function useKnowledgeArticle(id: string | number | bigint) {
  return useApi<KnowledgeArticle | null>(
    ["kb", String(id)],
    (a: Actor) => a.getKnowledgeArticle(BigInt(id)),
    { enabled: id !== "" && id !== 0 },
  );
}

export function useCreateKnowledgeArticle() {
  return useApiMutation<KnowledgeArticleCreateInput, KnowledgeArticle>((a, v) =>
    a.createKnowledgeArticle(v),
  );
}

export function useUpdateKnowledgeArticle() {
  return useApiMutation<KnowledgeArticleUpdateInput, KnowledgeArticle>((a, v) =>
    a.updateKnowledgeArticle(v),
  );
}

// ---------- Notifications ----------

export function useMyNotifications(includeRead = true) {
  return useApi<Notification[]>(
    ["notifications", "mine", includeRead],
    (a: Actor) => a.listMyNotifications(includeRead),
  );
}

export function useUnreadNotificationCount() {
  return useApi<number>(["notifications", "unread"], (a: Actor) =>
    a.countUnreadNotifications().then((n) => Number(n)),
  );
}

export function useMarkNotificationAsRead() {
  return useApiMutation<{ id: bigint }, boolean>((a, v) =>
    a.markNotificationAsRead(v.id),
  );
}

export function useMarkAllNotificationsAsRead() {
  return useApiMutation<void, bigint>((a) => a.markAllNotificationsAsRead());
}

// ---------- System Settings ----------

export function useSystemSettings() {
  return useApi<SystemSettings>(["settings"], (a: Actor) =>
    a.getSystemSettings(),
  );
}

export function useUpdateSystemSettings() {
  return useApiMutation<SystemSettingsUpdateInput, SystemSettings>((a, v) =>
    a.updateSystemSettings(v),
  );
}
