import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: { label: string; value: string }[];
  /** When true, renders a date-range filter (two date inputs) instead of a select. */
  filterType?: "select" | "dateRange";
  accessor: (row: T) => string | number | null | undefined;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  /** Right-align numeric columns. */
  align?: "left" | "right" | "center";
}

export type SortDirection = "asc" | "desc";

export interface TableSort {
  key: string;
  dir: SortDirection;
}

export interface TableState {
  search: string;
  filters: Record<string, string>;
  dateFilters: Record<string, { from: string; to: string }>;
  sort: TableSort | null;
  page: number;
  pageSize: number;
}

export const DEFAULT_TABLE_STATE: TableState = {
  search: "",
  filters: {},
  dateFilters: {},
  sort: null,
  page: 1,
  pageSize: 10,
};

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKeys?: (keyof T | ((row: T) => string))[];
  /** Default page size when uncontrolled. */
  pageSize?: number;
  /** Available page size options for the selector. */
  pageSizeOptions?: number[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string | number;
  className?: string;
  isLoading?: boolean;
  /** Enable zebra striping on body rows. */
  zebra?: boolean;
  /**
   * Controlled state — when provided, the table is fully controlled and the
   * parent owns the state (typically synced to the URL for shareable/refresh-
   * safe filters). When omitted, the table manages its own local state.
   */
  state?: TableState;
  onStateChange?: (next: TableState) => void;
  /** Sticky table header within the scroll container. */
  stickyHeader?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function alignClass(align?: "left" | "right" | "center") {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

export function DataTable<T>({
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
  stickyHeader = false,
}: DataTableProps<T>) {
  const isControlled = controlledState !== undefined && !!onStateChange;

  const [localState, setLocalState] = useState<TableState>({
    ...DEFAULT_TABLE_STATE,
    pageSize: defaultPageSize,
  });

  const state = isControlled ? controlledState! : localState;
  const setState = useCallback(
    (next: TableState) => {
      if (isControlled) onStateChange!(next);
      else setLocalState(next);
    },
    [isControlled, onStateChange],
  );

  const update = useCallback(
    (patch: Partial<TableState>) => {
      setState({ ...state, ...patch });
    },
    [state, setState],
  );

  const { search, filters, dateFilters, sort, page, pageSize } = state;

  // Reset to page 1 when filters/search change.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally react to search/filters/dateFilters changes; page and update are read inside
  useEffect(() => {
    if (page !== 1) update({ page: 1 });
  }, [search, filters, dateFilters, page, update]);

  const processed = useMemo(() => {
    let rows = [...data];

    // Search
    if (search && searchKeys?.length) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        searchKeys.some((k) => {
          const val =
            typeof k === "function"
              ? k(r)
              : String((r as Record<string, unknown>)[k as string] ?? "");
          return val.toLowerCase().includes(q);
        }),
      );
    }

    // Select filters
    for (const [key, value] of Object.entries(filters)) {
      if (!value || value === "all") continue;
      const col = columns.find((c) => c.key === key);
      if (!col) continue;
      rows = rows.filter((r) => String(col.accessor(r) ?? "") === value);
    }

    // Date-range filters
    for (const [key, range] of Object.entries(dateFilters)) {
      const col = columns.find((c) => c.key === key);
      if (!col) continue;
      const from = range.from ? new Date(range.from).getTime() : null;
      const to = range.to ? new Date(range.to).getTime() + 86_400_000 : null;
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

    // Sort
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
          return sort.dir === "asc"
            ? String(av).localeCompare(String(bv))
            : String(bv).localeCompare(String(av));
        });
      }
    }

    return rows;
  }, [data, search, searchKeys, filters, dateFilters, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = processed.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const toggleSort = (key: string) => {
    update({
      sort:
        !sort || sort.key !== key
          ? { key, dir: "asc" }
          : sort.dir === "asc"
            ? { key, dir: "desc" }
            : null,
    });
  };

  const filterableCols = columns.filter(
    (c) => c.filterable && c.filterOptions && c.filterType !== "dateRange",
  );
  const dateCols = columns.filter((c) => c.filterType === "dateRange");
  const hasFilters = filterableCols.length > 0 || dateCols.length > 0;

  const start = processed.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, processed.length);

  return (
    <div className={cn("space-y-3", className)} data-ocid="table">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {searchKeys?.length ? (
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder="Search..."
              className="pl-9"
              aria-label="Search table"
              data-ocid="table.search_input"
            />
          </div>
        ) : (
          <div />
        )}
        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {filterableCols.map((c) => (
              <Select
                key={c.key}
                value={filters[c.key] ?? "all"}
                onValueChange={(v) =>
                  update({ filters: { ...filters, [c.key]: v } })
                }
              >
                <SelectTrigger
                  className="w-[160px]"
                  aria-label={`Filter by ${c.header}`}
                >
                  <SelectValue placeholder={c.header} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {c.header}</SelectItem>
                  {c.filterOptions!.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
            {dateCols.map((c) => (
              <div key={c.key} className="flex items-center gap-1">
                <Input
                  type="date"
                  value={dateFilters[c.key]?.from ?? ""}
                  onChange={(e) =>
                    update({
                      dateFilters: {
                        ...dateFilters,
                        [c.key]: {
                          from: e.target.value,
                          to: dateFilters[c.key]?.to ?? "",
                        },
                      },
                    })
                  }
                  aria-label={`${c.header} from date`}
                  className="w-[150px]"
                  data-ocid={`table.date_from.${c.key}`}
                />
                <span className="text-xs text-muted-foreground">–</span>
                <Input
                  type="date"
                  value={dateFilters[c.key]?.to ?? ""}
                  onChange={(e) =>
                    update({
                      dateFilters: {
                        ...dateFilters,
                        [c.key]: {
                          from: dateFilters[c.key]?.from ?? "",
                          to: e.target.value,
                        },
                      },
                    })
                  }
                  aria-label={`${c.header} to date`}
                  className="w-[150px]"
                  data-ocid={`table.date_to.${c.key}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card shadow-subtle">
        <Table>
          <TableHeader
            className={cn(stickyHeader && "sticky top-0 z-10 bg-card")}
          >
            <TableRow className="border-b hover:bg-transparent">
              {columns.map((c) => (
                <TableHead
                  key={c.key}
                  className={cn(
                    "h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    alignClass(c.align),
                    c.headerClassName,
                  )}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded px-0.5 py-0.5 transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        alignClass(c.align) === "text-right" &&
                          "flex-row-reverse",
                        sort?.key === c.key && "text-foreground",
                      )}
                      aria-label={`Sort by ${c.header}`}
                      data-ocid={`table.sort.${c.key}`}
                    >
                      {c.header}
                      {sort?.key === c.key ? (
                        sort.dir === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    c.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: Math.min(pageSize, 8) }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
                <TableRow key={`sk-${i}`} className="border-b">
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : pageRows.length === 0 ? (
              <TableRow className="border-b hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, i) => (
                <TableRow
                  key={rowKey ? rowKey(row) : i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  data-ocid={`table.row.${i}`}
                  className={cn(
                    "border-b transition-smooth",
                    zebra && i % 2 === 1 && "bg-muted/30",
                    onRowClick &&
                      "cursor-pointer hover:bg-primary/5 focus-visible:bg-primary/5",
                  )}
                >
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn("py-3", alignClass(c.align), c.className)}
                    >
                      {c.render ? c.render(row) : String(c.accessor(row) ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {processed.length > 0 ? (
              <>
                Showing{" "}
                <span className="font-medium text-foreground">{start}</span>–
                <span className="font-medium text-foreground">{end}</span> of{" "}
                <span className="font-medium text-foreground">
                  {processed.length}
                </span>
              </>
            ) : (
              "No records"
            )}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Rows</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => update({ pageSize: Number(v), page: 1 })}
            >
              <SelectTrigger
                className="h-8 w-[72px]"
                aria-label="Page size"
                data-ocid="table.page_size"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => update({ page: Math.max(1, currentPage - 1) })}
              disabled={currentPage === 1}
              aria-label="Previous page"
              data-ocid="table.pagination_prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 px-1">
              {buildPageList(currentPage, totalPages).map((p, idx) =>
                p === "..." ? (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: pagination gap marker
                    key={`gap-${idx}`}
                    className="px-1.5 text-sm text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    key={p}
                    onClick={() => update({ page: p })}
                    aria-label={`Page ${p}`}
                    aria-current={p === currentPage ? "page" : undefined}
                    data-ocid={`table.page.${p}`}
                    className={cn(
                      "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      p === currentPage
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                update({ page: Math.min(totalPages, currentPage + 1) })
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              data-ocid="table.pagination_next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Build a compact page list with ellipses, e.g. 1 2 … 5 6 7 … 20 21. */
function buildPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const add = (n: number) => pages.push(n);
  add(1);
  if (current > 3) pages.push("...");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    add(p);
  }
  if (current < total - 2) pages.push("...");
  add(total);
  return pages;
}
