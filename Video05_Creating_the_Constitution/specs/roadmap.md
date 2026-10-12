# Roadmap

High-level implementation order. Each phase is small, ships something demoable and leaves the app working.

## Phase 0: Skeleton
- Replace the placeholder `src/index.ts` with a Next.js (App Router) + TypeScript app.
- Add Tailwind CSS and initialize shadcn/ui.
- Build an app shell with a header ("AgentClinic"), side navigation and a footer with a tagline.
- Wire SQLite with Drizzle: an empty schema, a migration script and the `db:reset` and `db:seed` scripts.
- Add one passing Vitest test and one Playwright smoke test that checks the home page loads.

## Phase 1: Agents (patients)
- Create an `agents` table with name, model, "employer" (their human) and intake date.
- Add a patient list page and a patient detail page.
- Add an intake form for registering a new agent.

## Phase 2: Ailments
- Create an `ailments` table with name, symptoms and human cause, plus a many-to-many link to agents.
- Add an ailment catalogue page.
- Let staff record a diagnosis on a patient.

## Phase 3: Therapies
- Create a `therapies` table with name, description and duration, and link therapies to the ailments they treat.
- Add a therapy catalogue page.
- Show recommended therapies on a patient's diagnosis.

## Phase 4: Appointment booking
- Create an `appointments` table linking agent, therapy and time slot.
- Add a booking form with a calendar picker, and prevent double booking.
- Let staff view, reschedule and cancel appointments.

## Phase 5: Staff dashboard
- Add a dashboard home with key counts: patients in care, top ailments and today's appointments.
- Add an upcoming-appointments table and a recent-intakes list.
- Add quick actions: admit an agent and book a session.

## Phase 6: Polish
- Write the satirical brochure copy across the site, plus empty states and success toasts.
- Add branding: a logo, a color palette, and dark mode.
- Do a responsive layout pass and an accessibility pass, and extend the Playwright coverage across browsers.
