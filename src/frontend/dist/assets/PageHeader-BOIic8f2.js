import { j as jsxRuntimeExports, g as cn } from "./index-y0UiSxHL.js";
function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  breadcrumbs,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          breadcrumbs && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: breadcrumbs }),
          eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: eyebrow }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl", children: title }),
            description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-2xl text-sm text-muted-foreground", children: description })
          ] })
        ] }),
        actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2", children: actions })
      ]
    }
  );
}
export {
  PageHeader as P
};
