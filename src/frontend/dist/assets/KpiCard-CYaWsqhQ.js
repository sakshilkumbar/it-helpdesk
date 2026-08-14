import { c as createLucideIcon, j as jsxRuntimeExports, g as cn, B as Button } from "./index-y0UiSxHL.js";
import { T as TriangleAlert } from "./triangle-alert-DxxnH3Y-.js";
import { R as RefreshCw } from "./refresh-cw-PhAmOQ-J.js";
import { C as Card, d as CardContent } from "./card-xP9BGQcP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m7 7 10 10", key: "1fmybs" }],
  ["path", { d: "M17 7v10H7", key: "6fjiku" }]
];
const ArrowDownRight = createLucideIcon("arrow-down-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again in a moment.",
  onRetry,
  retryLabel = "Try again",
  icon: Icon = TriangleAlert,
  className,
  size = "default"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 text-center",
        size === "default" ? "px-6 py-16" : "px-6 py-10",
        className
      ),
      "data-ocid": "error_state",
      role: "alert",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5",
              size === "default" ? "h-14 w-14" : "h-11 w-11"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: size === "default" ? "h-7 w-7" : "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h3",
            {
              className: cn(
                "font-semibold text-foreground",
                size === "default" ? "text-base" : "text-sm"
              ),
              children: title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "mx-auto max-w-sm text-muted-foreground",
                size === "default" ? "text-sm" : "text-xs"
              ),
              children: description
            }
          )
        ] }),
        onRetry && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: size === "default" ? "default" : "sm",
            onClick: onRetry,
            "data-ocid": "error_state.retry_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
              retryLabel
            ]
          }
        )
      ]
    }
  );
}
const TONE_CHIP = {
  primary: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary",
  accent: "bg-accent/15 text-accent-foreground dark:bg-accent/20 dark:text-accent-foreground",
  info: "bg-info/10 text-info dark:bg-info/15 dark:text-info",
  success: "bg-[oklch(var(--sla-on-track)/0.12)] text-[oklch(var(--sla-on-track))] dark:bg-[oklch(var(--sla-on-track)/0.18)]",
  warning: "bg-[oklch(var(--sla-at-risk)/0.14)] text-[oklch(var(--sla-at-risk))] dark:bg-[oklch(var(--sla-at-risk)/0.2)]",
  danger: "bg-[oklch(var(--sla-breached)/0.12)] text-[oklch(var(--sla-breached))] dark:bg-[oklch(var(--sla-breached)/0.18)]",
  neutral: "bg-muted text-muted-foreground"
};
const TREND_CFG = {
  up: { icon: ArrowUpRight, className: "text-[oklch(var(--sla-on-track))]" },
  down: {
    icon: ArrowDownRight,
    className: "text-[oklch(var(--sla-breached))]"
  },
  neutral: { icon: Minus, className: "text-muted-foreground" }
};
function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  trendLabel,
  tone = "neutral",
  onClick,
  className
}) {
  const trendCfg = trend ? TREND_CFG[trend] : null;
  const TrendIcon = trendCfg == null ? void 0 : trendCfg.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: cn(
        "overflow-hidden shadow-subtle transition-smooth",
        onClick && "cursor-pointer hover:border-primary/40 hover:shadow-elevated",
        className
      ),
      onClick,
      "data-ocid": "kpi_card",
      "data-ocid-label": label,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-start justify-between gap-3 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-semibold tracking-tight tabular-nums text-foreground", children: value }),
            trendCfg && TrendIcon && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  trendCfg.className
                ),
                "aria-label": trend === "up" ? `Trending up${trendLabel ? `: ${trendLabel}` : ""}` : trend === "down" ? `Trending down${trendLabel ? `: ${trendLabel}` : ""}` : `No change${trendLabel ? `: ${trendLabel}` : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendIcon, { className: "h-3.5 w-3.5", "aria-hidden": true }),
                  trendLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: trendLabel })
                ]
              }
            )
          ] }),
          hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: hint })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
              TONE_CHIP[tone]
            ),
            "aria-hidden": true,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" })
          }
        )
      ] })
    }
  );
}
export {
  ArrowRight as A,
  ErrorState as E,
  KpiCard as K
};
