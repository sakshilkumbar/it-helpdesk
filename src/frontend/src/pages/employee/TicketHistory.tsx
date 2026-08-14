import { SortOrder, Variant_createdAt_updatedAt_priority } from "@/backend";
import {
  EmptyState,
  PageHeader,
  PriorityBadge,
  StatusBadge,
  TableSkeleton,
} from "@/components/shared";
import { type Column, DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories, useMyTickets, usePriorities } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import { format, isValid } from "date-fns";
import { ChevronLeft, ChevronRight, Inbox, Plus, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type SortField = "createdAt" | "updatedAt" | "priority";
type SortDir = "asc" | "desc";

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

function priorityRank(p: any): number {
  if (!p) return 0;
  const name = (typeof p === "string" ? p : String(p)).toLowerCase();
  if (name.includes("crit") || name.includes("urgent")) return 4;
  if (name.includes("high")) return 3;
  if (name.includes("med")) return 2;
  if (name.includes("low")) return 1;
  return 0;
}

export function TicketHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, isFetching } = useMyTickets({
    page: { page: BigInt(page), pageSize: BigInt(pageSize) },
    search,
    sortBy:
      sortField === "priority"
        ? Variant_createdAt_updatedAt_priority.priority
        : sortField === "createdAt"
          ? Variant_createdAt_updatedAt_priority.createdAt
          : Variant_createdAt_updatedAt_priority.updatedAt,
    sortOrder: sortDir === "asc" ? SortOrder.asc : SortOrder.desc,
  });

  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();

  const priorityName = useCallback(
    (id: bigint) => priorities?.find((p) => p.id === id)?.name ?? String(id),
    [priorities],
  );
  const priorityLevel = useCallback(
    (id: bigint) => {
      const p = priorities?.find((pr) => pr.id === id);
      return p ? Number(p.level) : 0;
    },
    [priorities],
  );
  const categoryName = useCallback(
    (id: bigint) => categories?.find((c) => c.id === id)?.name ?? String(id),
    [categories],
  );

  const rawTickets = (Array.isArray(data) ? data : []) as any[];
  const totalCount = rawTickets.length;

  const tickets = useMemo(() => {
    let list = [...rawTickets];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) =>
        String(t.title ?? "")
          .toLowerCase()
          .includes(q),
      );
    }
    list.sort((a, b) => {
      let av: number;
      let bv: number;
      if (sortField === "priority") {
        av = priorityRank(a.priorityId);
        bv = priorityRank(b.priorityId);
      } else {
        av = (toDate(a[sortField] ?? a.createdAt) ?? new Date(0)).getTime();
        bv = (toDate(b[sortField] ?? b.createdAt) ?? new Date(0)).getTime();
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [rawTickets, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const columns: Column<any>[] = useMemo(
    () => [
      {
        key: "id",
        accessor: (t: any) => String(t.id ?? ""),
        header: "Ticket",
        render: (t) => (
          <Link
            to="/employee/tickets/$id"
            params={{ id: String(t.id ?? t.ticketId ?? "") }}
            className="group flex flex-col"
          >
            <span className="font-mono text-xs text-muted-foreground">
              #{String(t.id ?? t.ticketId ?? "").slice(-6)}
            </span>
            <span className="font-medium text-primary group-hover:underline">
              {t.title}
            </span>
          </Link>
        ),
      },
      {
        key: "category",
        accessor: (t: any) => String(t.categoryId ?? ""),
        header: "Category",
        render: (t) => (
          <span className="text-sm text-muted-foreground">
            {categoryName(BigInt(t.categoryId ?? 0n))}
          </span>
        ),
      },
      {
        key: "priority",
        accessor: (t: any) => String(t.priorityId ?? ""),
        header: "Priority",
        render: (t) => (
          <PriorityBadge
            priority={{
              name: priorityName(BigInt(t.priorityId ?? 0n)),
              level: priorityLevel(BigInt(t.priorityId ?? 0n)),
            }}
          />
        ),
      },
      {
        key: "status",
        accessor: (t: any) => String(t.status ?? ""),
        header: "Status",
        render: (t) => <StatusBadge status={t.status} />,
      },
      {
        key: "createdAt",
        accessor: (t: any) => String(t.createdAt ?? ""),
        header: "Created",
        render: (t) => (
          <span className="text-sm text-muted-foreground">
            {safeFormat(t.createdAt, "MMM d, yyyy")}
          </span>
        ),
      },
      {
        key: "updatedAt",
        accessor: (t: any) => String(t.updatedAt ?? ""),
        header: "Last updated",
        render: (t) => (
          <span className="text-sm text-muted-foreground">
            {safeFormat(t.updatedAt, "MMM d, yyyy · h:mm a")}
          </span>
        ),
      },
    ],
    [priorityName, priorityLevel, categoryName],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tickets"
        description="Search, sort, and review every support ticket you have submitted."
        actions={
          <Button onClick={() => navigate({ to: "/employee/tickets/new" })}>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        }
      />

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-1">
            <CardTitle>Ticket History</CardTitle>
            <CardDescription>
              {totalCount > 0
                ? `${totalCount} ticket${totalCount === 1 ? "" : "s"} total`
                : "You have not submitted any tickets yet."}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
                aria-label="Search tickets by title"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={sortField}
                onValueChange={(v) => setSortField(v as SortField)}
              >
                <SelectTrigger className="w-[160px]" aria-label="Sort field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Last updated</SelectItem>
                  <SelectItem value="createdAt">Created date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortDir}
                onValueChange={(v) => setSortDir(v as SortDir)}
              >
                <SelectTrigger
                  className="w-[120px]"
                  aria-label="Sort direction"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <EmptyState
              icon={Inbox}
              title="Unable to load tickets"
              description="There was a problem fetching your tickets. Please try again later."
            />
          ) : tickets.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={search ? "No matching tickets" : "No tickets yet"}
              description={
                search
                  ? "Try adjusting your search query."
                  : "Submit your first support ticket to get started."
              }
              action={
                !search ? (
                  <Button
                    onClick={() => navigate({ to: "/employee/tickets/new" })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create a ticket
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={tickets}
              rowKey={(t) => String(t.id ?? t.ticketId ?? "")}
              onRowClick={(t) =>
                navigate({
                  to: "/employee/tickets/$id",
                  params: { id: String(t.id ?? t.ticketId ?? "") },
                })
              }
            />
          )}

          {!isLoading && !isError && tickets.length > 0 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(page - 1) * pageSize + 1}
                </span>
                –
                <span className="font-medium text-foreground">
                  {Math.min(page * pageSize, totalCount)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalCount}
                </span>
                {isFetching && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    · loading…
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TicketHistory;
