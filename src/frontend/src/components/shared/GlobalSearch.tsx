import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Search, Ticket, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useAuth } from "@/hooks/useAuth";
import {
  useAllTickets,
  useKnowledgeArticles,
  useUsers,
} from "@/hooks/useQueries";
import { isAdminRole } from "@/lib/roleHelpers";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  label: string;
  sublabel?: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

/**
 * GlobalSearch — command-palette-style overlay for searching tickets,
 * knowledge articles, and (admin only) users. Opens with Cmd/Ctrl+K.
 */
export function GlobalSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { role } = useAuth();
  const admin = isAdminRole(role);

  const { data: tickets } = useAllTickets();
  const { data: articles } = useKnowledgeArticles();
  // Users search is admin-only; pass the live query as the search term.
  const { data: users } = useUsers(
    admin && query.trim().length >= 2 ? query.trim() : null,
    null,
    { page: 1n, pageSize: 20n },
  );

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const q = query.trim().toLowerCase();

  const ticketResults = useMemo(() => {
    if (!tickets || q.length < 1) return [];
    return tickets
      .filter(
        (t) => t.title.toLowerCase().includes(q) || String(t.id).includes(q),
      )
      .slice(0, 6)
      .map((t) => {
        const route = admin
          ? "/admin/tickets/$id"
          : role === "employee"
            ? "/employee/tickets/$id"
            : "/agent/tickets/$id";
        return {
          id: `ticket-${t.id}`,
          label: `#${t.id} — ${t.title}`,
          sublabel: "Ticket",
          group: "Tickets",
          icon: Ticket,
          onSelect: () => {
            setOpen(false);
            void navigate({ to: route, params: { id: String(t.id) } });
          },
        } satisfies SearchResult;
      });
  }, [tickets, q, admin, role, navigate]);

  const articleResults = useMemo(() => {
    if (!articles || q.length < 1) return [];
    return articles
      .filter((a) => a.title.toLowerCase().includes(q))
      .slice(0, 5)
      .map(
        (a) =>
          ({
            id: `kb-${a.id}`,
            label: a.title,
            sublabel: "Knowledge Base",
            group: "Knowledge Base",
            icon: BookOpen,
            onSelect: () => {
              setOpen(false);
              void navigate({ to: "/admin/knowledge-base" });
            },
          }) satisfies SearchResult,
      );
  }, [articles, q, navigate]);

  const userResults = useMemo(() => {
    if (!admin || !users || q.length < 2) return [];
    return users
      .filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) ||
          (u.email ?? "").toLowerCase().includes(q),
      )
      .slice(0, 5)
      .map(
        (u) =>
          ({
            id: `user-${u.id.toText()}`,
            label: u.displayName,
            sublabel: u.email ?? u.id.toText().slice(0, 12),
            group: "Users",
            icon: User,
            onSelect: () => {
              setOpen(false);
              void navigate({ to: "/admin/users" });
            },
          }) satisfies SearchResult,
      );
  }, [users, q, admin, navigate]);

  const hasResults =
    ticketResults.length > 0 ||
    articleResults.length > 0 ||
    userResults.length > 0;

  return (
    <>
      <Button
        variant="outline"
        // biome-ignore lint/a11y/useSemanticElements: button triggers a command dialog, not a native select
        role="combobox"
        aria-expanded={open}
        aria-label="Global search"
        data-ocid="command_palette_open"
        className={cn(
          "h-9 w-full justify-start gap-2 bg-card/60 text-muted-foreground sm:w-64 lg:w-80",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search tickets, articles…</span>
        <span className="sm:hidden">Search…</span>
        <CommandShortcut className="ml-auto hidden sm:inline-flex">
          ⌘K
        </CommandShortcut>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Global Search"
        description="Search tickets, knowledge articles, and users."
        showCloseButton={false}
        className="shadow-command"
      >
        <Command shouldFilter={false} loop>
          <CommandInput
            placeholder="Search by ticket ID, title, article, or user…"
            value={query}
            onValueChange={setQuery}
            data-ocid="search_input"
          />
          <CommandList>
            {q.length === 0 ? (
              <CommandEmpty>
                Start typing to search across tickets, articles
                {admin ? ", and users" : ""}.
              </CommandEmpty>
            ) : !hasResults ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <>
                {ticketResults.length > 0 && (
                  <CommandGroup heading="Tickets">
                    {ticketResults.map((r) => (
                      <CommandItem
                        key={r.id}
                        value={r.id}
                        onSelect={r.onSelect}
                        data-ocid="search_result.ticket"
                      >
                        <r.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm">{r.label}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {articleResults.length > 0 && (
                  <CommandGroup heading="Knowledge Base">
                    {articleResults.map((r) => (
                      <CommandItem
                        key={r.id}
                        value={r.id}
                        onSelect={r.onSelect}
                        data-ocid="search_result.article"
                      >
                        <r.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm">{r.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {userResults.length > 0 && (
                  <CommandGroup heading="Users">
                    {userResults.map((r) => (
                      <CommandItem
                        key={r.id}
                        value={r.id}
                        onSelect={r.onSelect}
                        data-ocid="search_result.user"
                      >
                        <r.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm">{r.label}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {r.sublabel}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

export default GlobalSearch;
