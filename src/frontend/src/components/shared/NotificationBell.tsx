import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAuth";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useMyNotifications,
  useUnreadNotificationCount,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "./EmptyState";

const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  ticketReply: "Reply",
  ticketUpdated: "Updated",
  ticketAssigned: "Assigned",
  ticketClosed: "Closed",
  roleChanged: "Role Changed",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useCurrentUser();
  const { data: notifications, isLoading } = useMyNotifications();
  const { data: unreadCount, refetch } = useUnreadNotificationCount();
  const markRead = useMarkNotificationAsRead();
  const markAllRead = useMarkAllNotificationsAsRead();

  const handleMarkRead = async (id: bigint) => {
    await markRead.mutateAsync({ id });
    refetch();
  };

  const handleMarkAll = async () => {
    await markAllRead.mutateAsync();
    refetch();
  };

  const handleOpenTicket = (ticketId?: bigint) => {
    if (ticketId === undefined) return;
    setOpen(false);
    // Route to the ticket detail view appropriate for the caller's role.
    const to =
      role === "employee"
        ? "/employee/tickets/$id"
        : role === "admin"
          ? "/admin/tickets/$id"
          : "/agent/tickets/$id";
    void navigate({
      to,
      params: { id: String(ticketId) },
    });
  };

  const count = unreadCount ?? 0;
  const items = notifications ?? [];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={handleMarkAll}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="space-y-3 p-3">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up."
              className="border-0 py-10"
            />
          ) : (
            <div className="divide-y">
              {items.map((n) => {
                const isUnread = !n.isRead;
                const typeLabel =
                  NOTIFICATION_TYPE_LABEL[n.notificationType] ?? "Info";
                return (
                  <div
                    key={String(n.id)}
                    className={cn(
                      "flex gap-3 px-3 py-3 transition-colors hover:bg-muted/50",
                      isUnread && "bg-primary/5",
                    )}
                  >
                    <div className="mt-0.5 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          {typeLabel}
                        </span>
                        {isUnread && (
                          <span
                            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                            aria-label="Unread"
                          />
                        )}
                      </div>
                      <p className="text-sm font-medium leading-tight">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-muted-foreground">
                          {n.createdAt
                            ? formatDistanceToNow(
                                new Date(Number(n.createdAt) / 1_000_000),
                                { addSuffix: true },
                              )
                            : ""}
                        </p>
                        {n.linkTicketId !== undefined && (
                          <button
                            type="button"
                            className="text-[11px] font-medium text-primary hover:underline"
                            onClick={() => handleOpenTicket(n.linkTicketId)}
                          >
                            View ticket
                          </button>
                        )}
                      </div>
                    </div>
                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => handleMarkRead(n.id)}
                        aria-label="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
