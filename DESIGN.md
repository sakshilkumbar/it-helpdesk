# Design Brief

## Direction

Operative — an enterprise ITSM control surface with a deep petrol-teal identity, built for four roles (Employee, L1 Help Desk, L2 Resolver, Admin) navigating tickets, SLAs, audit trails, and role-split dashboards behind corporate II authentication.

## Tone

Refined corporate restraint — productivity-first density with a single warm/cool accent contrast (petrol-teal primary, amber SLA accent) that signals authority without the generic SaaS-blue cliché.

## Differentiation

Priority-coded left-border bars on every ticket row plus a three-hue SLA urgency scale (green/amber/red) that shifts as deadlines approach — status and urgency are readable at a glance without reading a single label.

## Color Palette

| Token          | OKLCH (light)        | Role                                          |
| -------------- | -------------------- | --------------------------------------------- |
| background      | 0.99 0.005 230       | cool off-white canvas                         |
| foreground      | 0.18 0.012 230       | primary text, slate with cool undertone        |
| card            | 1.0 0.003 230        | elevated surfaces, tables, dialogs             |
| primary         | 0.42 0.09 200        | petrol-teal — CTAs, active nav, links           |
| accent          | 0.72 0.15 65         | amber — highlights, SLA at-risk                |
| muted           | 0.96 0.006 230       | secondary backgrounds, skeletons               |
| success         | 0.55 0.14 155        | resolved tickets, SLA on-track, positive KPIs  |
| destructive     | 0.55 0.22 25         | critical priority, breached SLA, destructive   |
| warning         | 0.7 0.15 75          | pending status, caution badges                 |
| topbar          | 0.985 0.004 230      | top navigation surface, distinct from card      |
| sidebar         | 0.965 0.008 230      | left nav surface, slightly deeper than content  |

## SLA Urgency Scale

| State      | Token prefix        | OKLCH (light)        | Usage                              |
| ---------- | ------------------- | -------------------- | ---------------------------------- |
| On-track   | `--sla-on-track`    | 0.55 0.14 155        | green dot/chip, deadline healthy    |
| At-risk    | `--sla-at-risk`     | 0.72 0.15 65         | amber, pulse animation on dot      |
| Breached   | `--sla-breached`    | 0.55 0.22 25         | red, solid dot, no animation        |

## Badge Variants

| Status / Priority | Token prefix          | OKLCH (light)        |
| ----------------- | --------------------- | -------------------- |
| New               | `--badge-new`         | 0.55 0.12 230        |
| Open              | `--badge-open`        | 0.42 0.09 200        |
| In Progress       | `--badge-progress`    | 0.6 0.1 280          |
| Pending           | `--badge-pending`     | 0.7 0.13 75          |
| Resolved          | `--badge-resolved`    | 0.55 0.14 155        |
| Closed            | `--badge-closed`      | 0.5 0.012 230        |
| Escalated         | `--badge-escalated`   | 0.55 0.22 25         |
| Critical (priority)| `--destructive`      | 0.55 0.22 25         |
| High (priority)   | `--accent`            | 0.72 0.15 65         |
| Medium (priority) | `--primary`           | 0.42 0.09 200        |
| Low (priority)    | `--muted`             | 0.96 0.006 230       |

## Typography

- Display: Space Grotesk — headings, KPI numbers, nav labels (geometric, technical)
- Body: DM Sans — paragraphs, table cells, form labels (clean, high readability)
- Mono: JetBrains Mono — ticket IDs, audit log hashes (tabular numerals)
- Scale: hero `text-3xl font-bold tracking-tight`, h2 `text-xl font-semibold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-sm`/`text-base`

## Elevation & Depth

Layered surfaces via `bg-card` on `bg-background` with `border` separation; `shadow-card` for tables/dialogs, `shadow-elevated` for popovers/menus, `shadow-overlay` for command palette, `shadow-command` for global search overlay; no glow or neon.

## Structural Zones

| Zone           | Background              | Border            | Notes                                            |
| -------------- | ----------------------- | ----------------- | ------------------------------------------------ |
| Sidebar        | `bg-sidebar`            | `border-r`        | role-based nav, collapsible, logo + user, role pill |
| Top bar        | `bg-topbar`             | `border-b`        | global search trigger, notifications, avatar + role |
| Breadcrumbs    | `bg-background`         | —                 | `breadcrumb-in` animation, separator token        |
| Content        | `bg-background`         | —                 | alternate sections with `bg-muted/40`             |
| Command palette| `bg-command` (overlay)  | `border`          | `shadow-command`, `overlay-in` animation           |
| Login (brand)  | `bg-gradient-brand`     | —                 | petrol-teal gradient, II sign-in CTA, brand mark    |
| Login (form)   | `bg-login-form`         | `border`          | clean card, `shadow-login`, form fields            |
| Footer         | `bg-muted/40`           | `border-t`        | SLA status summary, version, legal                |

## Spacing & Rhythm

8px base grid; section gaps `gap-6`/`gap-8`; card padding `p-5`/`p-6`; table row height `h-14` for density; micro-spacing `gap-1.5`/`gap-2` for badges, chips, SLA dots.

## Component Patterns

- Buttons: 6px radius, `bg-primary text-primary-foreground` for primary; `bg-secondary` for secondary; `transition-smooth` hover
- Cards: `bg-card border rounded-md shadow-card`, no heavy radius — enterprise density
- Badges: pill-shaped `rounded-full`, color-coded by status (`--badge-*`) and priority (critical=destructive, high=accent, medium=primary, low=muted)
- Tables: `bg-card` with `border-b` rows, priority left-border bar via `priority-bar-*` utilities, pagination footer
- SLA chips: countdown with hue shift — green > amber (pulse) > red as deadline approaches; `sla-dot-*` ring utilities
- Breadcrumbs: `text-muted-foreground` with `breadcrumb-separator` chevron, last item `text-foreground`
- Command palette: `bg-command` overlay with `shadow-command`, `overlay-in` entrance, grouped results, `kbd` key hints
- Login: split layout — left `bg-gradient-brand` brand panel with mark + tagline, right `bg-login-form` form card with II sign-in

## Motion

- Entrance: `animate-fade-in` 0.25s on page/section mount; `animate-breadcrumb-in` 0.2s on breadcrumb
- Hover: `transition-smooth` (0.2s) on interactive elements, subtle bg shift
- Command palette: `animate-overlay-in` 0.18s on open
- Decorative: `animate-pulse-soft` on notification bell dot; `animate-sla-pulse` on at-risk SLA dots only; no other ambient motion

## Constraints

- No working AI features — only UI placeholders and data structures for future AI (classification, priority prediction, chatbot)
- No real-time SLA countdown timers — static SLA indicators computed at render, no periodic refresh
- No customizable dashboard widgets — fixed role-based dashboard layouts
- No email notifications — in-app notification bell only
- SLA monitoring uses per-priority policies, not per-category custom policies
- All colors via OKLCH tokens — no raw hex or arbitrary Tailwind classes in components
- Light mode primary; dark mode fully supported and tuned independently
- Four role dashboards: Employee, L1 Help Desk, L2 Resolver, Admin — each with role-appropriate KPIs and queues

## Signature Detail

Priority-coded 3px left-border bars on every ticket row (`.priority-bar-*` utilities) paired with a three-hue SLA urgency scale — the queue communicates urgency as a visual rhythm before a single word is read.
