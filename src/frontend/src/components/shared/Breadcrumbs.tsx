import { Link } from "@tanstack/react-router";
import { useMatches } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/hooks/useAuth";
import { roleLabel } from "@/lib/roleHelpers";
import { cn } from "@/lib/utils";

/**
 * Static label map for the leading segment of each route prefix.
 * The role-aware section label is derived from the current role.
 */
const ROUTE_LABELS: Record<string, string> = {
  employee: "My Support",
  agent: "Agent Workspace",
  admin: "Administration",
};

/** Crumb descriptor derived from the current route path. */
interface Crumb {
  label: string;
  to?: string;
}

/**
 * Build a breadcrumb trail from the current route path and role.
 * Pattern: <Role Section> / <Area> / <Page or Detail>
 */
function buildCrumbs(pathname: string, roleLabel: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: roleLabel }];
  if (!pathname || pathname === "/") return crumbs;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return crumbs;

  const section = segments[0]; // employee | agent | admin
  const sectionLabel = ROUTE_LABELS[section] ?? section;
  crumbs.push({ label: sectionLabel });

  // Map known sub-paths to friendly labels.
  if (segments.length >= 2) {
    const area = segments[1];
    const areaLabels: Record<string, string> = {
      dashboard: "Dashboard",
      tickets: "Tickets",
      users: "Users",
      agents: "Agents",
      analytics: "Analytics",
      sla: "SLA Monitoring",
      "audit-logs": "Audit Logs",
      categories: "Categories",
      priorities: "Priorities",
      "knowledge-base": "Knowledge Base",
      settings: "Settings",
    };
    const areaLabel = areaLabels[area] ?? area;

    if (segments.length === 2) {
      // e.g. /employee/tickets  ->  Tickets is the page
      if (area === "dashboard") {
        // dashboard is the section page itself; don't add a duplicate
        return crumbs;
      }
      crumbs.push({ label: areaLabel });
    } else if (
      segments.length === 3 &&
      area === "tickets" &&
      segments[2] === "new"
    ) {
      crumbs.push({ label: "Tickets", to: `/${section}/tickets` });
      crumbs.push({ label: "New Ticket" });
    } else if (segments.length >= 3) {
      // Detail view: <Area> / <Detail>
      crumbs.push({ label: areaLabel, to: `/${section}/${area}` });
      if (area === "tickets") {
        crumbs.push({ label: `#${segments[segments.length - 1]}` });
      } else {
        crumbs.push({ label: "Details" });
      }
    }
  }

  return crumbs;
}

/**
 * Breadcrumbs — route-aware breadcrumb trail shown on every interior page.
 * Derives the trail from the current route + role context.
 */
export function Breadcrumbs({ className }: { className?: string }) {
  const { role } = useAuth();
  const matches = useMatches();
  const pathname = matches[matches.length - 1]?.pathname ?? "";
  const crumbs = buildCrumbs(pathname, roleLabel(role));

  return (
    <Breadcrumb className={cn("animate-breadcrumb-in", className)}>
      <BreadcrumbList>
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <BreadcrumbItem key={`${crumb.label}-${idx}`}>
              {idx > 0 && (
                <BreadcrumbSeparator className="breadcrumb-separator" />
              )}
              {isLast || !crumb.to ? (
                <BreadcrumbPage
                  className={cn(
                    "text-sm font-medium",
                    isLast
                      ? "text-[oklch(var(--breadcrumb-active))]"
                      : "text-[oklch(var(--breadcrumb-foreground))]",
                  )}
                >
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  asChild
                  className="text-[oklch(var(--breadcrumb-foreground))] text-sm"
                >
                  <Link to={crumb.to}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
