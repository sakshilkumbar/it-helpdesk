import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Attachment {
    id: AttachmentId;
    mimeType: string;
    fileName: string;
    storageKey: string;
    sizeBytes: bigint;
    uploadedAt: Timestamp;
    uploadedBy: UserId;
}
export type Timestamp = bigint;
export interface PriorityCreateInput {
    name: string;
    level: bigint;
    slaTargetNs: bigint;
}
export interface TicketCreateInput {
    categoryId: CategoryId;
    title: string;
    description: string;
    priorityId: PriorityId;
    attachments: Array<Attachment>;
}
export interface UserView {
    id: UserId;
    lastSeenAt?: Timestamp;
    displayName: string;
    createdAt: Timestamp;
    role: AppRole;
    isActive: boolean;
    email?: string;
}
export interface TicketSLAStatus {
    status: TicketStatus;
    title: string;
    isAtRisk: boolean;
    slaDeadline: Timestamp;
    isBreached: boolean;
    timeRemainingNs: bigint;
    ticketId: TicketId;
    priorityId: PriorityId;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type AuditLogId = bigint;
export interface AgentSummary {
    resolutionRate: number;
    displayName: string;
    agentId: UserId;
    resolvedTicketCount: bigint;
    assignedTicketCount: bigint;
}
export type TicketId = bigint;
export interface NotificationView {
    id: NotificationId;
    notificationType: NotificationType;
    createdAt: Timestamp;
    recipient: UserId;
    isRead: boolean;
    message: string;
    linkTicketId?: TicketId;
}
export type KnowledgeArticleId = bigint;
export type PriorityId = bigint;
export interface RoleKPI {
    value: bigint;
    name: string;
}
export interface SystemSettingsUpdateInput {
    organizationName?: string;
    aiFeaturesEnabled?: boolean;
}
export interface PriorityView {
    id: PriorityId;
    name: string;
    createdAt: Timestamp;
    isActive: boolean;
    level: bigint;
    slaTargetNs: bigint;
}
export interface PriorityUpdateInput {
    id: PriorityId;
    name?: string;
    isActive?: boolean;
    level?: bigint;
    slaTargetNs?: bigint;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface TicketQuery {
    categoryId?: CategoryId;
    status?: TicketStatus;
    creator?: UserId;
    sortBy?: Variant_createdAt_updatedAt_priority;
    sortOrder?: SortOrder;
    assignedAgent?: UserId;
    page: PageRequest;
    search?: string;
    priorityId?: PriorityId;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface TicketView {
    id: TicketId;
    categoryId: CategoryId;
    status: TicketStatus;
    predictedCategory?: CategoryId;
    title: string;
    creator: UserId;
    predictedPriority?: PriorityId;
    slaDeadline: Timestamp;
    assignedAgent?: UserId;
    suggestedSolution?: string;
    createdAt: Timestamp;
    description: string;
    duplicateOf?: TicketId;
    updatedAt: Timestamp;
    closedAt?: Timestamp;
    priorityId: PriorityId;
    attachments: Array<Attachment>;
}
export interface CategoryCreateInput {
    name: string;
    description: string;
}
export interface RoleNavigation {
    role: AppRole;
    items: Array<NavItem>;
}
export interface AuditLogQuery {
    toTimestamp?: Timestamp;
    action?: AuditAction;
    fromTimestamp?: Timestamp;
    page: PageRequest;
    actorId?: UserId;
}
export interface PageRequest {
    page: bigint;
    pageSize: bigint;
}
export interface CategoryUpdateInput {
    id: CategoryId;
    name?: string;
    description?: string;
    isActive?: boolean;
}
export interface KnowledgeArticleCreateInput {
    categoryId?: CategoryId;
    title: string;
    content: string;
}
export interface TicketAnalytics {
    createdOverTime: Array<[Timestamp, bigint]>;
    totalTickets: bigint;
    byStatus: Array<[TicketStatus, bigint]>;
    byCategory: Array<[CategoryId, bigint]>;
    byPriority: Array<[PriorityId, bigint]>;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface KnowledgeArticleView {
    id: KnowledgeArticleId;
    categoryId?: CategoryId;
    title: string;
    content: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export type AttachmentId = bigint;
export interface KnowledgeArticleUpdateInput {
    id: KnowledgeArticleId;
    categoryId?: CategoryId | null;
    title?: string;
    content?: string;
}
export type UserId = Principal;
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface SystemSettingsView {
    organizationName: string;
    updatedAt: Timestamp;
    aiFeaturesEnabled: boolean;
}
export interface NavItem {
    name: string;
    badgeCount?: bigint;
    route: string;
}
export type NotificationId = bigint;
export interface TicketUpdateInput {
    status?: TicketStatus;
    assignedAgent?: UserId;
    resolutionSummary?: string;
    ticketId: TicketId;
}
export type MessageId = bigint;
export type CategoryId = bigint;
export interface AuditLogView {
    id: AuditLogId;
    action: AuditAction;
    actorId: UserId;
    detail: string;
    timestamp: Timestamp;
    targetEntity: string;
}
export interface RoleDashboard {
    kpis: Array<RoleKPI>;
    role: AppRole;
    queue: ResolverQueue;
    queueTicketCount: bigint;
}
export interface CategoryView {
    id: CategoryId;
    name: string;
    createdAt: Timestamp;
    description: string;
    isActive: boolean;
}
export interface TicketMessage {
    id: MessageId;
    body: string;
    createdAt: Timestamp;
    authorRole: AppRole;
    ticketId: TicketId;
    author: UserId;
    isInternal: boolean;
}
export enum AppRole {
    admin = "admin",
    l2_resolver = "l2_resolver",
    l1_help_desk = "l1_help_desk",
    employee = "employee"
}
export enum AuditAction {
    priorityUpdated = "priorityUpdated",
    ticketAssigned = "ticketAssigned",
    userDeactivated = "userDeactivated",
    categoryUpdated = "categoryUpdated",
    userReactivated = "userReactivated",
    settingsUpdated = "settingsUpdated",
    ticketStatusChanged = "ticketStatusChanged",
    ticketCreated = "ticketCreated",
    ticketClosed = "ticketClosed",
    roleChanged = "roleChanged",
    categoryCreated = "categoryCreated"
}
export enum NotificationType {
    ticketReply = "ticketReply",
    ticketUpdated = "ticketUpdated",
    ticketAssigned = "ticketAssigned",
    ticketClosed = "ticketClosed",
    roleChanged = "roleChanged"
}
export enum ResolverQueue {
    l1Default = "l1Default",
    l2Default = "l2Default"
}
export enum ResolverTier {
    l1 = "l1",
    l2 = "l2"
}
export enum SortOrder {
    asc = "asc",
    desc = "desc"
}
export enum TicketStatus {
    resolved = "resolved",
    closed = "closed",
    pending = "pending",
    in_progress = "in_progress",
    open = "open"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_createdAt_updatedAt_priority {
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    priority = "priority"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(user: UserId, newRole: AppRole): Promise<UserView>;
    closeTicket(ticketId: TicketId, resolutionSummary: string): Promise<TicketView>;
    countUnreadNotifications(): Promise<bigint>;
    createCategory(input: CategoryCreateInput): Promise<CategoryView>;
    createKnowledgeArticle(input: KnowledgeArticleCreateInput): Promise<KnowledgeArticleView>;
    createPriority(input: PriorityCreateInput): Promise<PriorityView>;
    createTicket(input: TicketCreateInput): Promise<TicketView>;
    deactivateUser(user: UserId): Promise<UserView>;
    escalateTicket(ticketId: TicketId, reason: string): Promise<TicketView>;
    execute(qJson: string): Promise<Result>;
    getCallerAppRole(): Promise<AppRole | null>;
    getCallerResolverTier(): Promise<ResolverTier | null>;
    getCallerUser(): Promise<UserView | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategory(id: CategoryId): Promise<CategoryView | null>;
    getKnowledgeArticle(id: KnowledgeArticleId): Promise<KnowledgeArticleView | null>;
    getMyQueueTickets(): Promise<Array<TicketView>>;
    getMyRoleDashboard(): Promise<RoleDashboard>;
    getMyRoleNavigation(): Promise<RoleNavigation>;
    getPriority(id: PriorityId): Promise<PriorityView | null>;
    getSLAStatuses(): Promise<Array<TicketSLAStatus>>;
    getSystemSettings(): Promise<SystemSettingsView>;
    getTicket(id: TicketId): Promise<TicketView | null>;
    getTicketAnalytics(): Promise<TicketAnalytics>;
    getUser(id: UserId): Promise<UserView | null>;
    isCallerAdmin(): Promise<boolean>;
    listAgents(): Promise<Array<AgentSummary>>;
    listAgentsByTier(tier: ResolverTier | null): Promise<Array<AgentSummary>>;
    listAllTickets(ticketQuery: TicketQuery): Promise<Array<TicketView>>;
    listAuditLogs(auditQuery: AuditLogQuery): Promise<Array<AuditLogView>>;
    listCategories(includeInactive: boolean): Promise<Array<CategoryView>>;
    listKnowledgeArticles(): Promise<Array<KnowledgeArticleView>>;
    listMyAssignedTickets(ticketQuery: TicketQuery): Promise<Array<TicketView>>;
    listMyNotifications(includeRead: boolean): Promise<Array<NotificationView>>;
    listMyTickets(ticketQuery: TicketQuery): Promise<Array<TicketView>>;
    listPriorities(includeInactive: boolean): Promise<Array<PriorityView>>;
    listTicketMessages(ticketId: TicketId): Promise<Array<TicketMessage>>;
    listUsers(search: string | null, roleFilter: AppRole | null, page: PageRequest): Promise<Array<UserView>>;
    markAllNotificationsAsRead(): Promise<bigint>;
    markNotificationAsRead(id: NotificationId): Promise<boolean>;
    postTicketMessage(ticketId: TicketId, body: string, isInternal: boolean): Promise<TicketMessage>;
    reactivateUser(user: UserId): Promise<UserView>;
    reassignTicket(ticketId: TicketId, newAgent: UserId): Promise<TicketView>;
    schema(): Promise<string>;
    updateCategory(input: CategoryUpdateInput): Promise<CategoryView>;
    updateKnowledgeArticle(input: KnowledgeArticleUpdateInput): Promise<KnowledgeArticleView>;
    updatePriority(input: PriorityUpdateInput): Promise<PriorityView>;
    updateSystemSettings(input: SystemSettingsUpdateInput): Promise<SystemSettingsView>;
    updateTicket(input: TicketUpdateInput): Promise<TicketView>;
}
