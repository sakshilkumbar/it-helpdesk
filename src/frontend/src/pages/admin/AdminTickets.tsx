import {
  DataTable,
  EmptyState,
  PageHeader,
  PriorityBadge,
  StatusBadge,
  TableSkeleton,
} from "@/components/shared";
import type { Column } from "@/components/shared";
import {
  useAllTickets,
  useCategories,
  usePriorities,
} from "@/hooks/useQueries";
import type { Ticket } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";

export default function AdminTicketsPage() {
  const navigate = useNavigate();
  const { data: tickets, isLoading } = useAllTickets();
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();

  const priorityName = (id: bigint) =>
    priorities?.find((p) => p.id === id)?.name ?? String(id);
  const priorityLevel = (id: bigint) =>
    Number(priorities?.find((p) => p.id === id)?.level ?? 0n);
  const categoryName = (id: bigint) =>
    categories?.find((c) => c.id === id)?.name ?? String(id);
  const formatDate = (ts: bigint) => {
    const d = new Date(Number(ts) / 1e6);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  const columns: Column<Ticket>[] = [
    {
      key: "title",
      header: "Title",
      accessor: (row) => row.title,
      sortable: true,
      filterable: true,
      render: (row) => (
        <Link
          to="/admin/tickets/$id"
          params={{ id: String(row.id) }}
          className="font-medium text-primary hover:underline"
        >
          {row.title}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => row.status,
      sortable: true,
      filterable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "priority",
      header: "Priority",
      accessor: (row) => priorityName(BigInt(row.priorityId)),
      sortable: true,
      render: (row) => (
        <PriorityBadge
          priority={{
            name: priorityName(BigInt(row.priorityId)),
            level: priorityLevel(BigInt(row.priorityId)),
          }}
        />
      ),
    },
    {
      key: "category",
      header: "Category",
      accessor: (row) => categoryName(BigInt(row.categoryId)),
      sortable: true,
      filterable: true,
    },
    {
      key: "assignedAgent",
      header: "Assigned Agent",
      accessor: (row) =>
        row.assignedAgent
          ? row.assignedAgent.toText().slice(0, 8)
          : "Unassigned",
      sortable: true,
    },
    {
      key: "createdAt",
      header: "Created",
      accessor: (row) => formatDate(BigInt(row.createdAt)),
      sortable: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="All Tickets"
          description="Manage all support tickets across the organization"
        />
        <TableSkeleton />
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="All Tickets"
          description="Manage all support tickets across the organization"
        />
        <EmptyState
          title="No tickets found"
          description="There are no tickets in the system yet."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Tickets"
        description="Manage all support tickets across the organization"
      />
      <DataTable
        data={tickets}
        columns={columns}
        searchKeys={["title", "status"]}
        rowKey={(row) => String(row.id)}
        onRowClick={(row) => {
          navigate({
            to: "/admin/tickets/$id",
            params: { id: String(row.id) },
          });
        }}
      />
    </div>
  );
}
