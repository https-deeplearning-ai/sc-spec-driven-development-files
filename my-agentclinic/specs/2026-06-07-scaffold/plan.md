# Plan — Phase 1: Scaffold

Numbered task groups in dependency order. Complete each group before starting the next.

---

## 1. Package setup

- Update `package.json`: name, scripts (`dev`, `build`, `start`, `lint`)
- Install runtime deps: `next`, `react`, `react-dom`
- Install dev deps: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`
- Confirm `npm run build` is a known script (will fail until config files exist — that's expected)

## 2. Config files

- `tsconfig.json` — strict mode, paths alias `@/*` → `./`, target ES2017+
- `next.config.ts` — minimal config (no extra plugins needed for Phase 1)
- `tailwind.config.ts` — content paths covering `app/**` and `components/**`; extend theme with clinic color tokens (primary, accent, neutral) and chosen Google Font family
- `postcss.config.js` — standard Tailwind + autoprefixer setup

## 3. Root layout and global styles

- `app/globals.css` — Tailwind `@base`, `@components`, `@utilities` directives; import Google Font via `@import` or Next.js font module
- `app/layout.tsx` — `<html lang="en">`, `<body>` with font class applied; metadata export (`title: "AgentClinic"`, `description` from mission)

## 4. Domain types and seed data

- `lib/types.ts` — TypeScript interfaces:
  - `Ailment`: `id`, `name`, `severity` (`"mild" | "moderate" | "severe"`), `shortDescription`, `description`, `therapyIds`
  - `Therapy`: `id`, `name`, `durationMinutes`, `description`, `ailmentIds`
  - `Agent`: `id`, `name`, `species` (model family), `operatorHandle`
  - `Appointment`: `id`, `agentId`, `therapyId`, `date`, `status` (`"upcoming" | "completed" | "cancelled"`)
- `lib/data.ts` — export `ailments`, `therapies`, `agents`, `appointments` arrays, 3–5 items each; use absurdist but plausible content matching mission tone

## 5. Route stubs

Create each file with: a single server component, an `<h1>` stub heading, and a short placeholder paragraph. No imports from `lib/` needed at this stage.

- `app/page.tsx`
- `app/(portal)/ailments/page.tsx`
- `app/(portal)/ailments/[id]/page.tsx`
- `app/(portal)/therapies/page.tsx`
- `app/(portal)/therapies/[id]/page.tsx`
- `app/(portal)/appointments/page.tsx`
- `app/(portal)/appointments/new/page.tsx`
- `app/dashboard/page.tsx`

## 6. Verify

- Run `npm run build` — must exit 0 with no TypeScript errors
- Confirm zero type errors reported in the build output
- Open `npm run dev` briefly to confirm no 404s on any stub route
