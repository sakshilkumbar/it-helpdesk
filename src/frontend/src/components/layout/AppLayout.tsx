import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  Clock,
  Flag,
  FolderTree,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  ScrollText,
  Settings,
  Sun,
  Ticket,
  UserCog,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import {
  ROLE_SHORT_LABELS,
  getInitials,
  isResolverRole,
  roleBadgeClass,
  roleHomePath,
  roleLabel,
  roleShortLabel,
} from "@/lib/roleHelpers";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ---------- Role-based navigation ----------

const employeeSections: NavSection[] = [
  {
    label: "My Support",
    items: [
      { label: "Dashboard", to: "/employee/dashboard", icon: LayoutDashboard },
      { label: "New Ticket", to: "/employee/tickets/new", icon: PlusCircle },
      { label: "My Tickets", to: "/employee/tickets", icon: ListChecks },
    ],
  },
];

const agentSections: NavSection[] = [
  {
    label: "Agent Workspace",
    items: [
      { label: "Dashboard", to: "/agent/dashboard", icon: LayoutDashboard },
      { label: "All Tickets", to: "/agent/tickets", icon: Ticket },
    ],
  },
];

const adminSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
      { label: "SLA Monitoring", to: "/admin/sla", icon: Clock },
      { label: "Audit Logs", to: "/admin/audit-logs", icon: ScrollText },
    ],
  },
  {
    label: "Tickets",
    items: [{ label: "All Tickets", to: "/admin/tickets", icon: Ticket }],
  },
  {
    label: "People",
    items: [
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Agents", to: "/admin/agents", icon: UserCog },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "Categories", to: "/admin/categories", icon: FolderTree },
      { label: "Priorities", to: "/admin/priorities", icon: Flag },
      { label: "Knowledge Base", to: "/admin/knowledge-base", icon: BookOpen },
      { label: "Settings", to: "/admin/settings", icon: Settings },
    ],
  },
];

function getSectionsForRole(role: AppRole | null): NavSection[] {
  if (role === "admin") return adminSections;
  if (isResolverRole(role)) return agentSections;
  return employeeSections;
}

// ---------- Brand mark ----------

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-subtle",
          compact ? "h-8 w-8" : "h-9 w-9",
        )}
      >
        <LifeBuoy className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">
          IT Helpdesk
        </span>
        <span className="text-[11px] text-muted-foreground">
          Enterprise Support
        </span>
      </div>
    </div>
  );
}

// ---------- Sidebar nav ----------

function NavList({
  sections,
  onNavigate,
}: {
  sections: NavSection[];
  onNavigate?: () => void;
}) {
  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to} onClick={onNavigate}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useAuth();
  const sections = getSectionsForRole(role);

  return (
    <>
      <SidebarHeader>
        <div className="px-2 py-3">
          <BrandMark />
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavList sections={sections} onNavigate={onNavigate} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 text-[11px] text-muted-foreground">
          <span>v1.0 · SLA monitored</span>
        </div>
      </SidebarFooter>
    </>
  );
}

// ---------- Theme toggle ----------

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

// ---------- User profile menu ----------

function UserMenu() {
  const { identity, role, user, clear } = useAuth();
  const navigate = useNavigate();
  const name = user?.displayName ?? "User";
  const principalText = identity?.getPrincipal().toText() ?? "";

  const handleSignOut = () => {
    clear();
    navigate({ to: "/login" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 gap-2 px-1.5 pr-2"
          aria-label="Account menu"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{name}</span>
          {role && (
            <Badge
              variant="outline"
              className={cn(
                "hidden text-[10px] font-medium md:inline-flex",
                roleBadgeClass(role),
              )}
            >
              {roleShortLabel(role)}
            </Badge>
          )}
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="font-medium">{name}</span>
          <span className="font-mono text-[11px] font-normal text-muted-foreground">
            {principalText.slice(0, 12)}…
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs text-muted-foreground">Role</span>
          {role ? (
            <Badge
              variant="outline"
              className={cn("text-xs", roleBadgeClass(role))}
            >
              {roleLabel(role)}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------- Top bar ----------

function TopBar() {
  const isMobile = useIsMobile();
  const { role } = useAuth();
  const home = roleHomePath(role);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[oklch(var(--topbar-border))] bg-[oklch(var(--topbar))] px-3 shadow-subtle sm:px-4">
      {isMobile && (
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              className="h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="px-4 py-3">
              <SheetTitle className="flex items-center gap-2">
                <BrandMark compact />
              </SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="px-2 py-2">
              <NavList
                sections={getSectionsForRole(role)}
                onNavigate={() => setMobileNavOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
      {!isMobile && <SidebarTrigger className="h-9 w-9" />}

      <Link to={home} className="flex items-center gap-2 sm:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <LifeBuoy className="h-4 w-4" />
        </div>
        <span className="text-base font-semibold tracking-tight">
          IT Helpdesk
        </span>
      </Link>

      <div className="hidden min-w-0 flex-1 items-center sm:flex">
        <Breadcrumbs />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden sm:block">
          <GlobalSearch />
        </div>
        <NotificationBell />
        <ThemeToggle />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <UserMenu />
      </div>
    </header>
  );
}

// ---------- Layout ----------

export function AppLayout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto w-full max-w-6xl px-4 py-6">
            <div className="mb-4 sm:hidden">
              <Breadcrumbs />
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppLayout;
