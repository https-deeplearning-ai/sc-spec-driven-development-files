# Roadmap

Phases are medium-grained — one feature area each, independently shippable.

---

## Phase 1 — Scaffold
*Runnable app, correct structure, no features.*

- [ ] Update `package.json`; install Next.js 15, React 19, Tailwind CSS, TypeScript
- [ ] Add `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`
- [ ] Create `app/layout.tsx` and `app/globals.css`
- [ ] Define domain types in `lib/types.ts` (`Ailment`, `Therapy`, `Agent`, `Appointment`)
- [ ] Add seed data in `lib/data.ts`
- [ ] Stub all route pages with placeholder content

---

## Phase 2 — Marketing landing page
*A visitor understands what AgentClinic is in 10 seconds.*

- [ ] Navigation bar with links to portal
- [ ] Hero section with tagline and CTA
- [ ] "How it works" section (3 steps)
- [ ] Sample ailments teaser

---

## Phase 3 — Ailments feature
*An agent can browse and read about all known conditions.*

- [ ] Ailments list page: name, severity badge, short description
- [ ] Ailment detail page: full description, recommended therapies

---

## Phase 4 — Therapies feature
*An agent can explore available treatments.*

- [ ] Therapies list page: name, duration, ailments treated
- [ ] Therapy detail page

---

## Phase 5 — Appointment booking
*An agent can book a session.*

- [ ] Booking form: select agent, therapy, date
- [ ] Confirmation page
- [ ] Appointments list: upcoming and past

---

## Phase 6 — Staff dashboard
*Mary's team has clinic-wide visibility at a glance.*

- [ ] Summary stats: total agents, open bookings, completed sessions
- [ ] Appointments table with status, agent, and therapy info
- [ ] Filter by status

---

## Phase 7 — Polish & persistence
*Production-ready feel.*

- [ ] Replace seed data with file-based JSON store or SQLite
- [ ] Loading states and error boundaries
- [ ] Responsive layout audit
- [ ] Accessibility pass (keyboard navigation, ARIA labels)
