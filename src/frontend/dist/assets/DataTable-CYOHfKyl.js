import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, H as Search, g as cn, B as Button, i as ChevronRight } from "./index-y0UiSxHL.js";
import { I as Input } from "./input-BB_cSxD4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DZqbOTYv.js";
import { a as ChevronsUpDown, C as ChevronLeft } from "./chevrons-up-down-PzKLsqQ3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode);
const DEFAULT_TABLE_STATE = {
  search: "",
  filters: {},
  dateFilters: {},
  sort: null,
  page: 1,
  pageSize: 10
};
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
function alignClass(align) {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}
function DataTable({
  columns,
  data,
  searchKeys,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  emptyMessage = "No records found.",
  onRowClick,
  rowKey,
  className,
  isLoading,
  zebra = false,
  state: controlledState,
  onStateChange,
  stickyHeader = false
}) {
  const isControlled = controlledState !== void 0 && !!onStateChange;
  const [localState, setLocalState] = reactExports.useState({
    ...DEFAULT_TABLE_STATE,
    pageSize: defaultPageSize
  });
  const state = isControlled ? controlledState : localState;
  const setState = reactExports.useCallback(
    (next) => {
      if (isControlled) onStateChange(next);
      else setLocalState(next);
    },
    [isControlled, onStateChange]
  );
  const update = reactExports.useCallback(
    (patch) => {
      setState({ ...state, ...patch });
    },
    [state, setState]
  );
  const { search, filters, dateFilters, sort, page, pageSize } = state;
  reactExports.useEffect(() => {
    if (page !== 1) update({ page: 1 });
  }, [search, filters, dateFilters, page, update]);
  const processed = reactExports.useMemo(() => {
    let rows = [...data];
    if (search && (searchKeys == null ? void 0 : searchKeys.length)) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) => searchKeys.some((k) => {
          const val = typeof k === "function" ? k(r) : String(r[k] ?? "");
          return val.toLowerCase().includes(q);
        })
      );
    }
    for (const [key, value] of Object.entries(filters)) {
      if (!value || value === "all") continue;
      const col = columns.find((c) => c.key === key);
      if (!col) continue;
      rows = rows.filter((r) => String(col.accessor(r) ?? "") === value);
    }
    for (const [key, range] of Object.entries(dateFilters)) {
      const col = columns.find((c) => c.key === key);
      if (!col) continue;
      const from = range.from ? new Date(range.from).getTime() : null;
      const to = range.to ? new Date(range.to).getTime() + 864e5 : null;
      rows = rows.filter((r) => {
        const raw = col.accessor(r);
        if (raw == null) return false;
        const ts = new Date(String(raw)).getTime();
        if (Number.isNaN(ts)) return false;
        if (from !== null && ts < from) return false;
        if (to !== null && ts > to) return false;
        return true;
      });
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col) {
        rows.sort((a, b) => {
          const av = col.accessor(a);
          const bv = col.accessor(b);
          if (av == null && bv == null) return 0;
          if (av == null) return 1;
          if (bv == null) return -1;
          if (typeof av === "number" && typeof bv === "number") {
            return sort.dir === "asc" ? av - bv : bv - av;
          }
          return sort.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });
      }
    }
    return rows;
  }, [data, search, searchKeys, filters, dateFilters, sort, columns]);
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = processed.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const toggleSort = (key) => {
    update({
      sort: !sort || sort.key !== key ? { key, dir: "asc" } : sort.dir === "asc" ? { key, dir: "desc" } : null
    });
  };
  const filterableCols = columns.filter(
    (c) => c.filterable && c.filterOptions && c.filterType !== "dateRange"
  );
  const dateCols = columns.filter((c) => c.filterType === "dateRange");
  const hasFilters = filterableCols.length > 0 || dateCols.length > 0;
  const start = processed.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, processed.length);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("space-y-3", className), "data-ocid": "table", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
      (searchKeys == null ? void 0 : searchKeys.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full lg:max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: search,
            onChange: (e) => update({ search: e.target.value }),
            placeholder: "Search...",
            className: "pl-9",
            "aria-label": "Search table",
            "data-ocid": "table.search_input"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
      hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        filterableCols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filters[c.key] ?? "all",
            onValueChange: (v) => update({ filters: { ...filters, [c.key]: v } }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-[160px]",
                  "aria-label": `Filter by ${c.header}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: c.header })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", children: [
                  "All ",
                  c.header
                ] }),
                c.filterOptions.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value))
              ] })
            ]
          },
          c.key
        )),
        dateCols.map((c) => {
          var _a, _b;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: ((_a = dateFilters[c.key]) == null ? void 0 : _a.from) ?? "",
                onChange: (e) => {
                  var _a2;
                  return update({
                    dateFilters: {
                      ...dateFilters,
                      [c.key]: {
                        from: e.target.value,
                        to: ((_a2 = dateFilters[c.key]) == null ? void 0 : _a2.to) ?? ""
                      }
                    }
                  });
                },
                "aria-label": `${c.header} from date`,
                className: "w-[150px]",
                "data-ocid": `table.date_from.${c.key}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "–" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: ((_b = dateFilters[c.key]) == null ? void 0 : _b.to) ?? "",
                onChange: (e) => {
                  var _a2;
                  return update({
                    dateFilters: {
                      ...dateFilters,
                      [c.key]: {
                        from: ((_a2 = dateFilters[c.key]) == null ? void 0 : _a2.from) ?? "",
                        to: e.target.value
                      }
                    }
                  });
                },
                "aria-label": `${c.header} to date`,
                className: "w-[150px]",
                "data-ocid": `table.date_to.${c.key}`
              }
            )
          ] }, c.key);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border bg-card shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableHeader,
        {
          className: cn(stickyHeader && "sticky top-0 z-10 bg-card"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { className: "border-b hover:bg-transparent", children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableHead,
            {
              className: cn(
                "h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                alignClass(c.align),
                c.headerClassName
              ),
              children: c.sortable ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => toggleSort(c.key),
                  className: cn(
                    "inline-flex items-center gap-1 rounded px-0.5 py-0.5 transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    alignClass(c.align) === "text-right" && "flex-row-reverse",
                    (sort == null ? void 0 : sort.key) === c.key && "text-foreground"
                  ),
                  "aria-label": `Sort by ${c.header}`,
                  "data-ocid": `table.sort.${c.key}`,
                  children: [
                    c.header,
                    (sort == null ? void 0 : sort.key) === c.key ? sort.dir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3.5 w-3.5 opacity-40" })
                  ]
                }
              ) : c.header
            },
            c.key
          )) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: Math.min(pageSize, 8) }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { className: "border-b", children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: c.className, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-full max-w-[140px] animate-pulse rounded bg-muted" }) }, c.key)) }, `sk-${i}`)
      )) : pageRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { className: "border-b hover:bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          colSpan: columns.length,
          className: "h-24 text-center text-sm text-muted-foreground",
          children: emptyMessage
        }
      ) }) : pageRows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableRow,
        {
          onClick: onRowClick ? () => onRowClick(row) : void 0,
          "data-ocid": `table.row.${i}`,
          className: cn(
            "border-b transition-smooth",
            zebra && i % 2 === 1 && "bg-muted/30",
            onRowClick && "cursor-pointer hover:bg-primary/5 focus-visible:bg-primary/5"
          ),
          children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              className: cn("py-3", alignClass(c.align), c.className),
              children: c.render ? c.render(row) : String(c.accessor(row) ?? "")
            },
            c.key
          ))
        },
        rowKey ? rowKey(row) : i
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: processed.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Showing",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: start }),
          "–",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: end }),
          " of",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: processed.length })
        ] }) : "No records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Rows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: String(pageSize),
              onValueChange: (v) => update({ pageSize: Number(v), page: 1 }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 w-[72px]",
                    "aria-label": "Page size",
                    "data-ocid": "table.page_size",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: pageSizeOptions.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(n), children: n }, n)) })
              ]
            }
          )
        ] })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => update({ page: Math.max(1, currentPage - 1) }),
            disabled: currentPage === 1,
            "aria-label": "Previous page",
            "data-ocid": "table.pagination_prev",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 px-1", children: buildPageList(currentPage, totalPages).map(
          (p, idx) => p === "..." ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "px-1.5 text-sm text-muted-foreground",
              children: "…"
            },
            `gap-${idx}`
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => update({ page: p }),
              "aria-label": `Page ${p}`,
              "aria-current": p === currentPage ? "page" : void 0,
              "data-ocid": `table.page.${p}`,
              className: cn(
                "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                p === currentPage ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              ),
              children: p
            },
            p
          )
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => update({ page: Math.min(totalPages, currentPage + 1) }),
            disabled: currentPage === totalPages,
            "aria-label": "Next page",
            "data-ocid": "table.pagination_next",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] });
}
function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  const add = (n) => pages.push(n);
  add(1);
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    add(p);
  }
  if (current < total - 2) pages.push("...");
  add(total);
  return pages;
}
export {
  DataTable as D
};
