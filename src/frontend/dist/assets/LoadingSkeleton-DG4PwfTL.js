import { j as jsxRuntimeExports, bf as Skeleton, g as cn } from "./index-y0UiSxHL.js";
function TableSkeleton({
  rows = 6,
  cols = 5,
  className
}) {
  const colKeys = Array.from({ length: cols }, (_, i) => `col-${i}`);
  const rowKeys = Array.from({ length: rows }, (_, i) => `row-${i}`);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "output",
    {
      className: cn(
        "overflow-hidden rounded-lg border bg-card shadow-subtle",
        className
      ),
      "data-ocid": "loading_state",
      "aria-label": "Loading table",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: colKeys.map((ck) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 flex-1" }, ck)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: rowKeys.map((rk, r) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: colKeys.map((ck, c) => {
          const maxW = `${60 + (r + c) % 5 * 8}%`;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: "h-4 flex-1",
              style: { maxWidth: maxW }
            },
            `${rk}-${ck}`
          );
        }) }) }, rk)) })
      ]
    }
  );
}
function ListRowSkeleton({
  rows = 4,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "output",
    {
      className: cn(
        "divide-y divide-border rounded-lg border bg-card",
        className
      ),
      "data-ocid": "loading_state",
      "aria-label": "Loading list",
      children: Array.from({ length: rows }).map((_, r) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 shrink-0 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 shrink-0 rounded-full" })
        ] }, r)
      ))
    }
  );
}
export {
  ListRowSkeleton as L,
  TableSkeleton as T
};
