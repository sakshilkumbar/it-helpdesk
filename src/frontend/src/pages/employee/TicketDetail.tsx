import {
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  usePostTicketMessage,
  usePriorities,
  useTicket,
  useTicketMessages,
} from "@/hooks/useQueries";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { format, formatDistanceToNow, isValid } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function toDate(ts: any): Date | null {
  if (ts == null) return null;
  try {
    // Backend Timestamp is Nat nanoseconds — divide by 1e6 before constructing Date.
    const d = new Date(Number(ts) / 1e6);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

function safeFormat(ts: any, fmt: string): string {
  const d = toDate(ts);
  if (!d) return "—";
  try {
    return format(d, fmt);
  } catch {
    return "—";
  }
}

function safeFromNow(ts: any): string {
  const d = toDate(ts);
  if (!d) return "—";
  try {
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}

function initials(name?: string): string {
  if (!name) return "?";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function isOverdue(slaDeadline?: any, status?: string): boolean {
  if (!slaDeadline) return false;
  const s = (status ?? "").toLowerCase();
  if (s === "resolved" || s === "closed" || s === "completed") return false;
  const d = toDate(slaDeadline);
  return d ? d.getTime() < Date.now() : false;
}

export function TicketDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const threadEndRef = useRef<HTMLDivElement>(null);

  const { data: ticket, isLoading, isError } = useTicket(id);
  const { data: messagesData, isLoading: msgsLoading } = useTicketMessages(id);
  const postMessage = usePostTicketMessage();
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();

  const priorityName = (id: bigint) =>
    priorities?.find((p) => p.id === id)?.name ?? String(id);
  const priorityLevel = (id: bigint) => {
    const p = priorities?.find((pr) => pr.id === id);
    return p ? Number(p.level) : 0;
  };
  const categoryName = (id: bigint) =>
    categories?.find((c) => c.id === id)?.name ?? String(id);

  const messages = (messagesData ?? []) as any[];
  const sortedMessages = [...messages].sort((a, b) => {
    const ad = (toDate(a.createdAt ?? a.timestamp) ?? new Date(0)).getTime();
    const bd = (toDate(b.createdAt ?? b.timestamp) ?? new Date(0)).getTime();
    return ad - bd; // newest at bottom
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll-to-bottom on new messages
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    try {
      await postMessage.mutateAsync({
        ticketId: BigInt(id),
        body: trimmed,
        isInternal: false,
      } as any);
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
          onClick={() => navigate({ to: "/employee/tickets" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to tickets
        </Button>
        <TableSkeleton />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/employee/tickets" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to tickets
        </Button>
        <Card>
          <CardContent>
            <EmptyState
              icon={AlertTriangle}
              title="Ticket not found"
              description="This ticket may have been removed or you do not have access to it."
              action={
                <Button asChild>
                  <Link to="/employee/tickets">Go to ticket history</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const attachments = (ticket.attachments ?? []) as any[];
  const assignedAgent = ticket.assignedAgent;
  const overdue = isOverdue(
    ticket.slaDeadline != null ? String(ticket.slaDeadline) : undefined,
    ticket.status,
  );

  const infoRows = [
    { label: "Category", value: categoryName(BigInt(ticket.categoryId ?? 0n)) },
    { label: "Status", value: <StatusBadge status={ticket.status} /> },
    {
      label: "Priority",
      value: (
        <PriorityBadge
          priority={{
            name: priorityName(BigInt(ticket.priorityId ?? 0n)),
            level: priorityLevel(BigInt(ticket.priorityId ?? 0n)),
          }}
        />
      ),
    },
    {
      label: "Assigned agent",
      value: assignedAgent ? (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {initials(assignedAgent.toText())}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{String(assignedAgent.toText())}</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">Unassigned</span>
      ),
    },
    {
      label: "Created",
      value: (
        <span className="text-sm text-muted-foreground">
          {safeFormat(ticket.createdAt, "MMM d, yyyy · h:mm a")}
        </span>
      ),
    },
    {
      label: "Last updated",
      value: (
        <span className="text-sm text-muted-foreground">
          {safeFormat(ticket.updatedAt, "MMM d, yyyy · h:mm a")}
        </span>
      ),
    },
    {
      label: "Closed",
      value: ticket.closedAt ? (
        <span className="text-sm text-muted-foreground">
          {safeFormat(ticket.closedAt, "MMM d, yyyy · h:mm a")}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/employee/tickets" })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to tickets
      </Button>

      <PageHeader
        title={ticket.title}
        description={
          (
            <span className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground">
                #{String(ticket.id ?? id).slice(-6)}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge
                priority={{
                  name: priorityName(BigInt(ticket.priorityId ?? 0n)),
                  level: priorityLevel(BigInt(ticket.priorityId ?? 0n)),
                }}
              />
            </span>
          ) as any
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column: description + thread */}
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

          {/* Attachments */}
          {attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </CardTitle>
                <CardDescription>
                  {attachments.length} file{attachments.length === 1 ? "" : "s"}{" "}
                  attached to this ticket.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {attachments.map((a, idx) => {
                    const name =
                      a.name ?? a.fileName ?? `Attachment ${idx + 1}`;
                    const url = a.url ?? a.downloadUrl;
                    return (
                      <li
                        key={url ?? name ?? idx}
                        className="flex items-center gap-3 rounded-md border p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{name}</p>
                          {a.size != null && (
                            <p className="text-xs text-muted-foreground">
                              {(Number(a.size) / 1024).toFixed(1)} KB
                            </p>
                          )}
                        </div>
                        {url && (
                          <Button asChild variant="ghost" size="sm">
                            <a
                              href={url}
                              download={name}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Message thread */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversation
              </CardTitle>
              <CardDescription>
                Messages between you and the support team. Newest appear at the
                bottom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {msgsLoading ? (
                <TableSkeleton />
              ) : sortedMessages.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Start the conversation by posting a message below."
                />
              ) : (
                <ol className="space-y-4">
                  {sortedMessages.map((m) => {
                    const authorPrincipal = m.author as
                      | { toText: () => string }
                      | string
                      | undefined;
                    const authorText =
                      authorPrincipal && typeof authorPrincipal === "object"
                        ? authorPrincipal.toText()
                        : typeof authorPrincipal === "string"
                          ? authorPrincipal
                          : "Unknown";
                    const authorShort = authorText.slice(0, 8);
                    const role = (m.authorRole ?? "") as string;
                    const isAgent =
                      role === "l1_help_desk" ||
                      role === "l2_resolver" ||
                      role === "admin";
                    const roleLabel =
                      role === "l1_help_desk"
                        ? "L1 Agent"
                        : role === "l2_resolver"
                          ? "L2 Agent"
                          : role === "admin"
                            ? "Admin"
                            : "Employee";
                    const isMe = !isAgent;
                    return (
                      <li
                        key={String(
                          m.id ?? m.messageId ?? `${m.createdAt}-${authorText}`,
                        )}
                        className={`flex gap-3 ${isMe ? "flex-row-reverse text-right" : ""}`}
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-xs font-mono">
                            {authorShort.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`max-w-[80%] space-y-1 ${isMe ? "items-end" : ""}`}
                        >
                          <div
                            className={`flex items-center gap-2 text-xs ${isMe ? "justify-end" : ""}`}
                          >
                            <span className="font-mono font-medium text-foreground">
                              {authorShort}
                            </span>
                            <Badge variant="secondary" className="text-[10px]">
                              {roleLabel}
                            </Badge>
                            <span className="text-muted-foreground">
                              {safeFormat(
                                m.createdAt ?? m.timestamp,
                                "MMM d, h:mm a",
                              )}
                            </span>
                          </div>
                          <div
                            className={`inline-block rounded-lg px-3 py-2 text-sm ${
                              isMe
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-left">
                              {m.content ?? m.body ?? ""}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  <div ref={threadEndRef} />
                </ol>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/20">
              <div className="flex w-full items-end gap-2">
                <Textarea
                  placeholder="Type a message to the support team…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[60px] resize-y"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  aria-label="New message"
                />
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
              <p className="mt-2 w-full text-xs text-muted-foreground">
                Press ⌘/Ctrl + Enter to send.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar: ticket info + SLA + AI placeholder */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-3"
                >
                  <span className="text-sm text-muted-foreground">
                    {row.label}
                  </span>
                  <div className="text-right">{row.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SLA card */}
          <Card className={overdue ? "border-destructive/50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                SLA Deadline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ticket.slaDeadline ? (
                <>
                  <p className="text-sm font-medium">
                    {safeFormat(ticket.slaDeadline, "MMM d, yyyy · h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {safeFromNow(ticket.slaDeadline)}
                  </p>
                  {overdue ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Within SLA
                    </Badge>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No SLA deadline configured for this ticket.
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI assist placeholder */}
          <Card className="border-dashed bg-muted/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base">
                    AI assist coming soon
                  </CardTitle>
                  <CardDescription>
                    Smart help for this conversation.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Future AI-assist features for this ticket will include:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>
                    Suggested replies based on similar resolved tickets.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>Automatic summarization of long threads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>Knowledge-base article recommendations.</span>
                </li>
              </ul>
              <Separator />
              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                <span>AI features are disabled in this release.</span>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20">
              <Button disabled className="w-full" aria-disabled>
                <Sparkles className="mr-2 h-4 w-4" />
                AI assist (disabled)
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
