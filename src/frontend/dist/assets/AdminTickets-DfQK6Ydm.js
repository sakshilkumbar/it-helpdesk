import { o as useNavigate, aa as useAllTickets, q as usePriorities, A as useCategories, j as jsxRuntimeExports, E as EmptyState, t as Link } from "./index-y0UiSxHL.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import { T as TableSkeleton } from "./LoadingSkeleton-DG4PwfTL.js";
import { S as StatusBadge } from "./StatusBadge-C3JOGEpV.js";
import { P as PriorityBadge } from "./PriorityBadge-B6E1CvT5.js";
import { D as DataTable } from "./DataTable-CYOHfKyl.js";
import "./input-BB_cSxD4.js";
import "./select-BrG4Wbfu.js";
import "./index-BDSHvDZP.js";
import "./table-DZqbOTYv.js";
import "./chevrons-up-down-PzKLsqQ3.js";
function AdminTicketsPage() {
  const navigate = useNavigate();
  const { data: tickets, isLoading } = useAllTickets();
  const { data: priorities } = usePriorities();
  const { data: categories } = useCategories();
  const priorityName = (id) => {
    var _a;
    return ((_a = priorities == null ? void 0 : priorities.find((p) => p.id === id)) == null ? void 0 : _a.name) ?? String(id);
  };
  const priorityLevel = (id) => {
    var _a;
    return Number(((_a = priorities == null ? void 0 : priorities.find((p) => p.id === id)) == null ? void 0 : _a.level) ?? 0n);
  };
  const categoryName = (id) => {
    var _a;
    return ((_a = categories == null ? void 0 : categories.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? String(id);
  };
  const formatDate = (ts) => {
    const d = new Date(Number(ts) / 1e6);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };
  const columns = [
    {
      key: "title",
      header: "Title",
      accessor: (row) => row.title,
      sortable: true,
      filterable: true,
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/admin/tickets/$id",
          params: { id: String(row.id) },
          className: "font-medium text-primary hover:underline",
          children: row.title
        }
      )
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => row.status,
      sortable: true,
      filterable: true,
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: row.status })
    },
    {
      key: "priority",
      header: "Priority",
      accessor: (row) => priorityName(BigInt(row.priorityId)),
      sortable: true,
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        PriorityBadge,
        {
          priority: {
            name: priorityName(BigInt(row.priorityId)),
            level: priorityLevel(BigInt(row.priorityId))
          }
        }
      )
    },
    {
      key: "category",
      header: "Category",
      accessor: (row) => categoryName(BigInt(row.categoryId)),
      sortable: true,
      filterable: true
    },
    {
      key: "assignedAgent",
      header: "Assigned Agent",
      accessor: (row) => row.assignedAgent ? row.assignedAgent.toText().slice(0, 8) : "Unassigned",
      sortable: true
    },
    {
      key: "createdAt",
      header: "Created",
      accessor: (row) => formatDate(BigInt(row.createdAt)),
      sortable: true
    }
  ];
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "All Tickets",
          description: "Manage all support tickets across the organization"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {})
    ] });
  }
  if (!tickets || tickets.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "All Tickets",
          description: "Manage all support tickets across the organization"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          title: "No tickets found",
          description: "There are no tickets in the system yet."
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "All Tickets",
        description: "Manage all support tickets across the organization"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        data: tickets,
        columns,
        searchKeys: ["title", "status"],
        rowKey: (row) => String(row.id),
        onRowClick: (row) => {
          navigate({
            to: "/admin/tickets/$id",
            params: { id: String(row.id) }
          });
        }
      }
    )
  ] });
}
export {
  AdminTicketsPage as default
};
