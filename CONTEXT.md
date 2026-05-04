# GTMer Frontend — Project Context

> This file provides persistent context for AI assistants across conversations.
> Always read this file at the start of a new session to understand the project.

---

## What is GTMer?

GTMer is an **autonomous GTM (Go-To-Market) execution platform**. It uses AI agents to find, enrich, engage, and book meetings with target prospects — autonomously. The platform handles:

- **Lead sourcing** from 100+ data sources (YC batches, LinkedIn, Crunchbase, G2 Intent, Apollo, etc.)
- **Data enrichment** with company info, education, LinkedIn profiles, intent signals
- **Personalized outreach** via AI-generated email sequences
- **Pipeline management** with real-time funnel tracking
- **Meeting scheduling** with automated follow-ups

### Contact Info (for the Contact section and any references)

- **Email**: akshat@gtmer.ai
- **Phone (Primary)**: +91 8989 606 740
- **Phone (Alternate)**: +91 8291 111 188
- **LinkedIn**: https://www.linkedin.com/company/gtmer-ai
- **Demo bookings**: Direct contact via email or phone (no self-serve scheduling yet)

---

## Tech Stack

| Layer        | Technology                                    |
|-------------|----------------------------------------------|
| Framework   | React 19 + TypeScript 5.7                     |
| Build       | Vite 6.3                                      |
| Styling     | CSS Modules (`.module.css`) — NO Tailwind     |
| Fonts       | Inter (sans), JetBrains Mono (mono) — Google Fonts |
| State       | React `useState` / `useEffect` (no Redux/Zustand) |
| Routing     | View-based (`activeView` state in `App.tsx`) — no React Router |
| Dev server  | `npm run dev` → `http://localhost:3000`       |
| Deps        | Zero external UI libraries — everything custom |

---

## Design System — "Blueprint Engineering"

The entire site uses a **dark blueprint paper aesthetic** inspired by engineering drawings. This is the core visual identity.

### Color Palette (CSS variables in `src/styles/global.css`)

```
Background:     #143a62 (blueprint paper blue)
Surface:        #0a1f35
Elevated:       #0d2847
Accent:         #4da8da (primary blue highlight)
Accent Neon:    #7dd3fc (bright headings)
Text Primary:   #e8f0f8
Text Secondary: #8ba4bd
Text Muted:     #4a6a8a
Border:         rgba(77, 168, 218, 0.12)
Glass BG:       rgba(10, 31, 53, 0.6)
```

### Typography

- **Headings**: `var(--font-sans)` → Inter, weight 600-700, letter-spacing: -0.03em
- **Body**: Inter, weight 300-400, line-height: 1.7
- **Mono/Labels**: `var(--font-mono)` → JetBrains Mono, uppercase, letter-spacing: 0.08-0.15em
- **Section labels**: Mono, 0.65rem, accent color, uppercase, wide tracking

### Border Radius

Keep it tight — `4px` (`--radius-sm`) to `8px` (`--radius-lg`). NO rounded/pill shapes except status indicators and badges.

### Key Visual Elements

- **Blueprint grid**: Faded engineering paper grid lines on `body::before` (80px major, 20px minor)
- **Vignette**: Darkened edges on `body::after` simulating aged paper
- **Window chrome**: Terminal-style cards with red/yellow/green dots and mono-font titles
- **Section dividers**: `linear-gradient(90deg, transparent, rgba(120, 190, 240, 0.15), transparent)` — subtle centered lines
- **Glass cards**: `rgba(10, 31, 53, 0.65)` background + `backdrop-filter: blur(8px)` + accent border
- **Status dots**: Small colored circles with pulse animations for live indicators
- **Geometric icons**: ◎ ⬡ △ ◇ ⊞ ⊕ — used as section identifiers

### Animation Conventions

- **Scroll reveal**: IntersectionObserver via `useScrollReveal` hook — fade up 28px
- **Staggered entrances**: Each child delayed by 80-100ms via `animation-delay`
- **Typewriter**: Variable-speed character-by-character typing in terminal components
- **Hover effects**: `translateY(-2px)` lift + border-color brightening + subtle box-shadow
- **Page transitions**: `scale(0.98) → scale(1)` with `translateY(12px) → 0` over 0.5s

---

## Architecture

### Routing Pattern

No React Router. `App.tsx` uses a view-based state pattern:

```tsx
type ActiveView = 'main' | 'agents' | 'data-engine' | 'product'
const [activeView, setActiveView] = useState<ActiveView>('main')
```

- `'main'` → renders: Hero → HowItWorks → Numbers → Pipeline → Contact
- `'agents'` → renders: `<Agents onBack={goHome} />`
- `'data-engine'` → renders: `<DataEngine onBack={goHome} />`
- `'product'` → renders: `<ProductDashboard onBack={goHome} />`

The `Navbar` dropdown triggers view changes via callback props (`onAgentsClick`, `onDataEngineClick`, `onProductClick`).

### Component Structure

Every component lives in `src/components/<Name>/` with two files:
- `<Name>.tsx` — React component
- `<Name>.module.css` — CSS module (scoped styles)

### File Map

```
src/
├── App.tsx                          # Root — view router
├── main.tsx                         # Entry point
├── hooks/
│   └── useScrollReveal.ts           # IntersectionObserver scroll reveal hook
├── styles/
│   └── global.css                   # Design tokens + blueprint grid + reset
├── components/
│   ├── Navbar/                      # Fixed top bar — logo, dropdown, Contact/Login/CTA
│   ├── Hero/                        # Landing hero — headline, CTAs, terminal animation
│   ├── LogoAnimation/               # Typewriter terminal animation (used in Hero)
│   ├── HowItWorks/                  # 4-step pipeline explanation
│   ├── Numbers/                     # Metrics section (10×, 18%, 70%, 100%, 48h)
│   ├── Pipeline/                    # Kanban board visualization (Sales Pipeline)
│   ├── Contact/                     # Contact section — email, phones, LinkedIn
│   ├── Agents/                      # /gtmer-agents subpage — hero + 6 agent cards
│   ├── DataEngine/                  # /gtmer-data-engine subpage — enrichment visual
│   └── ProductDashboard/            # Product subpage — text + white dashboard card
public/
├── logo-dark.jpg                    # Dark logo (used in navbar)
├── logo-light.jpg                   # Light logo variant
├── logo-white.jpg / .svg            # White logo variants
```

---

## Components — Detailed

### Navbar (`src/components/Navbar/`)
- Fixed top bar with glassmorphism background
- Logo button (top-left) opens dropdown: Product, Docs, /gtmer-agents, /gtmer-data-engine, About
- Right side: Contact link, Login link, "Start Automating" CTA
- All CTA/Contact buttons scroll to `#contact` section
- Props: `onAgentsClick`, `onDataEngineClick`, `onProductClick`

### Hero (`src/components/Hero/`)
- Full-viewport section with centered content
- System status badge ("SYSTEM ONLINE — AGENTS DEPLOYED")
- Headline: "Define intent. **Agents execute.**"
- Two CTAs: "Start Automating" → scrolls to #contact, "See How It Works" → scrolls to #how-it-works
- Embeds `<LogoAnimation />` (terminal typewriter)
- Bottom activity indicators (3 agents running, 847 leads enriched, etc.)

### LogoAnimation (`src/components/LogoAnimation/`)
- Terminal window with blueprint frame and corner markers
- Typewriter effect cycling through 3 commands + 3 outputs
- Uses `useCallback` + `setTimeout` chain for character-by-character typing
- Auto-resets after 4s pause at end
- Variable typing speed (32ms base + random variance) for realism

### HowItWorks (`src/components/HowItWorks/`)
- 4-step horizontal pipeline: Define → Scout → Engage → Convert
- Cards with icon, title, and description for each step
- Scroll-revealed with stagger

### Numbers (`src/components/Numbers/`)
- Integration ticker strip (scrolling logos: G2, Bombora, LinkedIn, Clearbit, Salesforce, etc.)
- 5 metric cards: 10× Faster Pipeline, 18% Reply Rate, 70% Lower CAC, 100% Follow-up Rate, 48h Time to Live

### Pipeline (`src/components/Pipeline/`)
- Text left: "Track every conversation"
- Visual right: Kanban board with 4 columns (New Lead → Contacted → Replied → Qualified)
- Cards showing lead names, companies, and status
- Window chrome styling, drag-and-drop hint text

### Contact (`src/components/Contact/`)
- Text left: "Let's talk." + demo booking note
- Visual right: Window card with 4 contact methods (email, 2 phones, LinkedIn)
- Each method is a clickable `<a>` card with hover slide effect
- Footer: "Typically respond within a few hours" with green pulse

### Agents (`src/components/Agents/`)
- Subpage (replaces main content) — `/gtmer-agents`
- Hero section + 3×2 grid of AI agent types
- Network visualization canvas
- Back button returns to main view

### DataEngine (`src/components/DataEngine/`)
- Subpage — `/gtmer-data-engine`
- Text explaining data enrichment
- Visual card showing enriched contact record with field list
- Capability checklist

### ProductDashboard (`src/components/ProductDashboard/`)
- Subpage — `/product`
- Text left: Product explanation + CTA
- Visual right: White-themed mini dashboard card showing:
  - Metrics (Leads, Enriched, Sent, Booked)
  - Pipeline funnel bars
  - Mini data table with leads
  - Agent activity feed
- Bottom: Feature checklist + 2×3 capabilities grid

---

## Shared Patterns

### Page-style Subpages (Agents, DataEngine, ProductDashboard)

All subpages follow the same pattern:
1. **Back button**: `← Back to /gtmer` — calls `onBack()` to return to main view
2. **Hero section**: Two-column grid — text left, visual card right
3. **Bottom section**: Additional features/capabilities grid
4. **Scroll-reveal animations**: Using `useScrollReveal` hook

### Section Layout Pattern

Most landing page sections use a consistent structure:
```
Section label (mono, accent, uppercase)
Headline (large, sans-serif)
Subtext (lighter weight, secondary color)
[Visual element / card]
```

### Window Chrome Pattern

Used across Pipeline, Contact, ProductDashboard:
```tsx
<div className={styles.windowHeader}>
  <div className={styles.windowDot} />  {/* red */}
  <div className={styles.windowDot} />  {/* yellow */}
  <div className={styles.windowDot} />  {/* green */}
  <span className={styles.windowTitle}>gtmer / section-name</span>
</div>
```

### CSS Module Naming Convention

- Root: `.section` or `.page`
- Layout: `.layout`, `.heroSection`, `.dualPanel`
- Blocks: `.textBlock`, `.vizBlock`, `.cardsBlock`
- Elements: `.headline`, `.subtext`, `.label`, `.badge`
- Variants: `.visible` (for scroll reveal)
- Animation states: `.metricVisible`, `.bucketRowVisible`

---

## Development Notes

### Running the project
```bash
cd /home/cloudsek/Desktop/akshat-gtmer/gtmer-face-ui
npm run dev
# Opens at http://localhost:3000
```

### Adding a new section to the main page
1. Create `src/components/NewSection/NewSection.tsx` + `NewSection.module.css`
2. Import in `App.tsx` and add to the `activeView === 'main'` block
3. Use `useScrollReveal` for entrance animations
4. Follow the section label → headline → subtext → visual pattern

### Adding a new subpage
1. Create component with `onBack: () => void` prop
2. Add new value to `ActiveView` type in `App.tsx`
3. Add handler in `App.tsx` + conditional render
4. Add dropdown item in `Navbar.tsx` with click handler
5. Use the back button pattern: `← Back to /gtmer`

### Things to avoid
- ❌ No Tailwind — use CSS Modules only
- ❌ No external UI libraries (no MUI, Chakra, Radix)
- ❌ No React Router — use the `activeView` state pattern
- ❌ No rounded corners beyond 8px
- ❌ No bright/saturated colors that clash with the blueprint palette
- ❌ No placeholder images — generate real assets if needed

### Things to prefer
- ✅ CSS custom properties from `global.css`
- ✅ `useScrollReveal` for scroll animations
- ✅ Window chrome cards for visual elements
- ✅ Mono font for labels and technical text
- ✅ Glass cards with blur for elevated surfaces
- ✅ Staggered animations via `animation-delay`
