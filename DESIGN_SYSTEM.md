# Ravenshaw Moments — Enterprise Design System (DESIGN_SYSTEM.md)

This document serves as the authoritative developer reference and architecture guide for the **Ravenshaw Moments** user interface design system. Every visual component across all 130+ routes adheres strictly to these design tokens, layout patterns, and semantic guidelines.

---

## 1. Core Brand & Color Tokens

Our design language is rooted in Ravenshaw University's rich academic heritage and institutional prestige, expressed through a refined palette of **Dark Maroon**, **Warm Ivory/Cream**, and **Gold accents**.

### CSS Custom Properties (`index.css`)
| Token Name | Hex Value | Semantic Meaning & Usage |
| :--- | :--- | :--- |
| `--color-heritage-maroon` | `#8F0028` | Primary brand identity, primary CTA background, deep maroon borders/accents |
| `--color-heritage-maroon-light` | `#A8183A` | Hover states for primary actions, subtle gradients |
| `--color-heritage-maroon-dark` | `#5A0016` | Deep hero section backgrounds, high-contrast dark accents |
| `--color-heritage-gold` | `#D4AF37` | Institutional prestige accents, verified badges, active rings, star ratings |
| `--color-heritage-gold-light` | `#EADFCF` | Subtle borders, light card highlights, soft ivory dividers |
| `--color-heritage-cream` | `#FFFDF8` | Light mode page background, high-readability warm ivory contrast |
| `--color-rm-glass-bg` | `rgba(255, 253, 248, 0.85)` | Glassmorphism card backgrounds in light mode |
| `--color-rm-glass-border` | `rgba(143, 0, 40, 0.12)` | Subtle maroon borders for cards and containers |

### Tailwind Semantic Mapping
In `tailwind.config.ts` and component classes, use semantic tokens whenever possible:
- `bg-background` / `text-foreground`: Page base backgrounds and body copy.
- `bg-card` / `text-card-foreground`: Card containers (`rounded-2xl` / `rounded-3xl`).
- `bg-primary` (`#8F0028`) / `text-primary-foreground`: Primary interactive elements, buttons, badges.
- `border-border` / `border-border/80`: Standard card and section borders.
- `text-muted-foreground`: Secondary descriptions, timestamps, subheadings.

---

## 2. Typography & Layout Hierarchy

### Font Families
1. **Serif (Headings & Institutional Titles)**: `font-serif` (Playfair Display / Georgia) — Used for hero titles, section headings (`h1`, `h2`), and formal certificates/ID cards.
2. **Sans-Serif (Body & UI Logic)**: `font-sans` (Inter / System Sans) — Used for body copy, form fields, navigation items, buttons, and badges.
3. **Monospace (Codes & Stats)**: `font-mono` — Used for ID numbers, verification codes, QR details, and numerical counters.

### Border Radius Standard
- **Standard Cards (`rounded-2xl` / `16px`)**: Used across all module cards, stats cards, dashboard widgets, directory list cards, and modal dialogs.
- **Hero & Large Containers (`rounded-3xl` / `24px`)**: Used for prominent hero banners, directory highlights, and feature showcases.
- **Pills & Badges (`rounded-full`)**: Used for filter tags, status badges, avatars, and search inputs.

---

## 3. Reusable UI Components & Widget Ecosystem

### Dashboard Widget System (`src/features/shared/components/dashboard/Widget.tsx`)
The `Widget` family provides a modular, accessible, and structured container for all administrative and user dashboard views.
```tsx
import { Widget, WidgetHeader, WidgetBody, WidgetFooter } from "@/features/shared/components/dashboard/Widget";

<Widget variant="default" isLoading={false}>
  <WidgetHeader
    icon={<ShieldCheck className="size-5 text-[#D4AF37]" />}
    title="Admin Control Center"
    subtitle="Manage campus operations and data"
    actions={<Button size="sm">Add New</Button>}
  />
  <WidgetBody className="space-y-4">
    {/* Content */}
  </WidgetBody>
  <WidgetFooter>
    <span className="text-xs text-muted-foreground">Last updated just now</span>
  </WidgetFooter>
</Widget>
```
**Variants**:
- `default`: Clean surface (`bg-card`) with subtle border (`border-border/80`) and `shadow-sm`.
- `glass`: Frosted glass (`glass-card`) effect with backdrop blur.
- `maroon`: Deep heritage maroon (`heritage-card`) container with white text and gold highlights.
- `elevated`: High-contrast card with `shadow-md` and emphasized border.

### Statistics Grid & Cards (`src/features/shared/components/statistics/StatGrid.tsx` & `StatCard.tsx`)
Used across Admin Overview, Community metrics, and departmental stats.
```tsx
import { StatGrid } from "@/features/shared/components/statistics/StatGrid";
import { StatCard } from "@/features/shared/components/statistics/StatCard";

<StatGrid cols={4}>
  <StatCard
    title="Total Users"
    value="12,450"
    label="Registered students & alumni"
    icon={<Users className="size-5" />}
    trend={{ value: 12, isPositive: true }}
  />
</StatGrid>
```

---

## 4. Navigation & Directory Patterns

### Filter Pills & Search (`FilterPills.tsx`, `SearchInput.tsx`)
All directories (Departments, Hostels, Organizations, Competitions, Alumni) maintain a consistent search and filtering bar:
- **SearchInput**: `rounded-full` or `rounded-2xl` with leading magnifying glass icon and clear button (`X`).
- **FilterPills**: Horizontally scrollable pill container. Active pills use `bg-primary text-primary-foreground font-bold shadow-xs`, while inactive pills use `bg-card text-muted-foreground border border-border/80 hover:border-primary/40`.

---

## 5. Coding Guidelines & Quality Enforcement

1. **Strict Scope**: Never alter business logic, database tables, or API endpoints while styling components.
2. **Zero Hardcoded Ad-hoc Colors**: Always reference established CSS custom properties or semantic Tailwind tokens (`#8F0028`, `#D4AF37`, `text-primary`, `bg-card`).
3. **Accessibility (a11y)**:
   - Ensure interactive cards have `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.
   - All `Image` elements must include descriptive `alt` tags and proper `sizes` attributes.
4. **Responsive Integrity**:
   - Test all layouts across `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
   - Prevent text overflow with `truncate` or `line-clamp-2` / `line-clamp-3`.
