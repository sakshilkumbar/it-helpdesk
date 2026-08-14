import type { TicketStatus, UserId } from "@/backend";
import {
  ConfirmDialog,
  EmptyState,
  PageHeader,
  PriorityBadge,
  StatusBadge,
  TableSkeleton,
} from "@/components/shared";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAgents,
  useCategories,
  useCloseTicket,
  usePostTicketMessage,
  usePriorities,
  useReassignTicket,
  useTicket,
  useTicketMessages,
  useUpdateTicket,
} from "@/hooks/useQueries";
import { Principal } from "@icp-sdk/core/principal";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function safeFormat(
  iso: bigint | string | undefined | null,
  fmt: string,
): string {
  if (iso == null) return "—";
  try {
    const ms = typeof iso === "bigint" ? Number(iso) / 1_000_000 : iso;
    const d = typeof ms === "string" ? parseISO(ms) : new Date(ms as any);
    if (!isValid(d)) return "—";
    return format(d, fmt);
  } catch {
    return "—";
  }
}

function safeFromNow(iso: bigint | string | undefined | null): string {
  if (iso == null) return "—";
  try {
    const ms = typeof iso === "bigint" ? Number(iso) / 1_000_000 : iso;
    const d = typeof ms === "string" ? parseISO(ms) : new Date(ms as any);
    if (!isValid(d)) return "—";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}

export function AgentTicketDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const { data: ticket, isLoading, isError } = useTicket(id);
  const { data: messagesData, isLoading: msgsLoading } = useTicketMessages(id);
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();
  const postMessage = usePostTicketMessage();
  const updateTicket = useUpdateTicket();
  const closeTicket = useCloseTicket();
  const reassignTicket = useReassignTicket();
  const { data: agents } = useAgents();

  const priorityName = (id: bigint) =>
    priorities?.find((p) => p.id === id)?.name ?? String(id);
  const priorityLevel = (id: bigint) =>
    Number(priorities?.find((p) => p.id === id)?.level ?? 0n);
  const categoryName = (id: bigint) =>
    categories?.find((c) => c.id === id)?.name ?? String(id);
  const assignedAgent = (agent?: UserId) =>
    agent == null
      ? undefined
      : agents?.find((a) => a.agentId.toText() === agent.toText());

  const messages = messagesData ?? [];
  const sortedMessages = [...messages].sort((a, b) => {
    const ad = Number(a.createdAt);
    const bd = Number(b.createdAt);
    return ad - bd;
  });

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    try {
      await postMessage.mutateAsync({
        ticketId: BigInt(id),
        body: trimmed,
        isInternal,
      });
      setMessage("");
      toast.success("Message sent");
    } catch (err: any) {
      toast.error("Failed to send message", {
        description: err?.message ?? "Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/agent/dashboard" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/agent/dashboard" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>
        <Card>
          <CardContent>
            <EmptyState
              icon={AlertTriangle}
              title="Ticket not found"
              description="This ticket may have been removed or you do not have access to it."
              action={
                <Button asChild>
                  <Link to="/agent/dashboard">Go to dashboard</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/agent/dashboard" })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Button>

      <PageHeader
        title={ticket.title}
        description={
          (
            <span className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground">
                #{String(ticket.id).slice(-6)}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge
                priority={{
                  name: priorityName(BigInt(ticket.priorityId)),
                  level: priorityLevel(BigInt(ticket.priorityId)),
                }}
              />
            </span>
          ) as any
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>
                Originally submitted {safeFromNow(ticket.createdAt)}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversation
              </CardTitle>
              <CardDescription>
                Messages between you and the ticket creator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {msgsLoading ? (
                <TableSkeleton rows={4} />
              ) : sortedMessages.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Start the conversation by posting a message below."
                />
              ) : (
                <ol className="space-y-4">
                  {sortedMessages.map((m) => {
                    const isAgent =
                      m.authorRole === "l1_help_desk" ||
                      m.authorRole === "l2_resolver" ||
                      m.authorRole === "admin";
                    return (
                      <li
                        key={String(m.id)}
                        className={`flex gap-3 ${isAgent ? "flex-row-reverse text-right" : ""}`}
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-xs">
                            {isAgent ? "AG" : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] space-y-1">
                          <div
                            className={`flex items-center gap-2 text-xs ${isAgent ? "justify-end" : ""}`}
                          >
                            {m.isInternal && (
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                Internal
                              </Badge>
                            )}
                            <span className="text-muted-foreground">
                              {safeFormat(m.createdAt, "MMM d, h:mm a")}
                            </span>
                          </div>
                          <div
                            className={`inline-block rounded-lg px-3 py-2 text-sm ${
                              isAgent
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-left">
                              {m.body}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/20">
              <div className="flex w-full flex-col items-end gap-2">
                <Textarea
                  placeholder="Type a message to the ticket creator…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[60px] resize-y"
                  aria-label="New message"
                />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="h-4 w-4"
                    />
                    Internal note
                  </label>
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim() || postMessage.isPending}
                    className="shrink-0"
                  >
                    {postMessage.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-muted-foreground">Priority</span>
                <PriorityBadge
                  priority={{
                    name: priorityName(BigInt(ticket.priorityId)),
                    level: priorityLevel(BigInt(ticket.priorityId)),
                  }}
                />
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm font-medium">
                  {categoryName(BigInt(ticket.categoryId))}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Assigned Agent
                </span>
                <span className="text-sm font-medium">
                  {assignedAgent(ticket.assignedAgent)?.displayName ??
                    "Unassigned"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm text-muted-foreground">
                  {safeFormat(ticket.createdAt, "MMM d, yyyy · h:mm a")}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Last updated
                </span>
                <span className="text-sm text-muted-foreground">
                  {safeFormat(ticket.updatedAt, "MMM d, yyyy · h:mm a")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="ticket-status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={ticket.status}
                  onValueChange={(v) =>
                    updateTicket.mutate({
                      ticketId: BigInt(id),
                      status: v as TicketStatus,
                    })
                  }
                >
                  <SelectTrigger id="ticket-status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="ticket-agent" className="text-sm font-medium">
                  Assign Agent
                </label>
                <Select
                  onValueChange={(v) =>
                    reassignTicket.mutate({
                      ticketId: BigInt(id),
                      newAgent: Principal.fromText(v),
                    })
                  }
                >
                  <SelectTrigger id="ticket-agent">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents?.map((a) => (
                      <SelectItem
                        key={a.agentId.toText()}
                        value={a.agentId.toText()}
                      >
                        {a.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="destructive"
                onClick={() => setCloseDialogOpen(true)}
              >
                Close Ticket
              </Button>
              <ConfirmDialog
                open={closeDialogOpen}
                onOpenChange={setCloseDialogOpen}
                onConfirm={() =>
                  closeTicket.mutate({
                    ticketId: BigInt(id),
                    resolutionSummary: "Ticket closed by agent",
                  })
                }
                isLoading={closeTicket.isPending}
                trigger={null}
                title="Close ticket"
                description="Are you sure you want to close this ticket?"
                confirmLabel="Close ticket"
                destructive
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AgentTicketDetail;
