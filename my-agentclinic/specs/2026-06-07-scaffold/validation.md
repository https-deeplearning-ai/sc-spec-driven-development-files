# Validation — Phase 1: Scaffold

Phase 1 is complete and mergeable when every check below passes.

---

## 1. Production build is clean

```bash
npm run build
```

- Exit code 0
- Zero TypeScript errors in build output
- Zero ESLint errors (if lint is wired into the build)
- No `any` type suppressions added to pass the build

## 2. All routes resolve

Start `npm run dev` and confirm each URL returns a page (not a 404 or crash):

| URL | Expected stub content |
|-----|-----------------------|
| `/` | Marketing landing stub |
| `/ailments` | Ailments list stub |
| `/ailments/[any-id]` | Ailment detail stub |
| `/therapies` | Therapies list stub |
| `/therapies/[any-id]` | Therapy detail stub |
| `/appointments` | Appointments list stub |
| `/appointments/new` | Booking form stub |
| `/dashboard` | Staff dashboard stub |

## 3. Domain types are complete

- `lib/types.ts` exports all four interfaces: `Ailment`, `Therapy`, `Agent`, `Appointment`
- `lib/data.ts` exports `ailments`, `therapies`, `agents`, `appointments` — each with 3–5 items
- No `any`, no `// @ts-ignore`, no missing required fields in seed data

## 4. Config files are present and correct

- `tsconfig.json` has `"strict": true`
- `tailwind.config.ts` content paths cover `app/**` and `components/**`
- `postcss.config.js` includes `tailwindcss` and `autoprefixer`

## 5. Brand tokens are defined

- At least one Google Font is wired through the root layout
- Tailwind theme extends `colors` with at least: `primary`, `accent`, `neutral` tokens
- `app/globals.css` uses Tailwind directives (not raw CSS resets)

## Merge checklist

- [ ] `npm run build` exits 0 with no type errors
- [ ] All 8 stub routes resolve in `npm run dev`
- [ ] `lib/types.ts` has all four domain types, strict and complete
- [ ] `lib/data.ts` has 3–5 seeded items per type
- [ ] Tailwind color tokens defined in theme
- [ ] Google Font applied in root layout
- [ ] No placeholder `any` types left in the codebase

## What is NOT a blocker

- Stub pages look unstyled — Phase 2 owns the landing page, Phase 3 owns ailments UI
- Seed data copy is rough/placeholder — content is not validated at this phase
- No nav bar — deferred to Phase 2
