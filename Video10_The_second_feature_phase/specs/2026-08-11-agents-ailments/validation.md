# Phase 2 Validation — Agents & Ailments

## Definition of Done

All of the following must be true before this branch is merged.

### 1. TypeScript compiles cleanly

```
npm run typecheck
```

Must exit with code 0 and produce no errors or warnings.

### 2. Migrations and seeding run cleanly, and idempotently

```
npm run migrate
npm run seed
npm run migrate
npm run seed
```

All four commands must exit 0. The second `migrate`/`seed` pair must not error and must not duplicate rows (row counts in `agents`, `ailments`, and `agent_ailments` stay the same as after the first run).

### 3. Agents list page

```
curl -s http://localhost:3000/agents
```

HTTP status `200`. Response body is HTML containing the name of every seeded agent, and each name links to that agent's `/agents/:id` page.

### 4. Agent detail page — valid id

```
curl -s http://localhost:3000/agents/1
```

HTTP status `200`. Response body contains the agent's name, model type, and status, plus the names of its linked ailments (presenting complaints). At least one seeded agent must have 2+ ailments, and that agent's page must list all of them — this is the proof the many-to-many relationship actually works, not just that the schema allows it.

### 5. Agent detail page — unknown id

```
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/agents/99999
```

Must return `404`. Response body (checked separately) contains a plain "Agent not found" message — genuinely minimal markup, **not** routed through `<Layout>`: no `<nav>`, no header/footer, no PicoCSS-styled chrome. No crash, no unhandled exception, no styled error page (that's Phase 7).

### 6. Ailments list page

```
curl -s http://localhost:3000/ailments
```

HTTP status `200`. Response body is HTML containing the name and description of every seeded ailment.

### 7. Navigation is present

The rendered HTML of every real page (`/`, `/agents`, `/agents/:id` for a valid id, `/ailments`) includes a `<nav>` with links to Home, Agents, and Ailments. (The `/agents/:id` unknown-id response is exempt — see #5.)

### 8. PicoCSS (classless build) is integrated and responsive CSS still holds

`static/pico.min.css` exists — vendored from `@picocss/pico/css/pico.classless.min.css` (the classless build, not the default one), not a CDN link — and is served successfully:

```
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/pico.min.css
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/style.css
```

Both must return `200`. `Layout.tsx` must link `pico.min.css` before `style.css`. `static/style.css` must actually override at least one Pico `--pico-*` custom property (at minimum the `--pico-primary*` family, for the AgentClinic brand color) rather than only defining its own unrelated tokens, plus hold the nav/list/detail rules Pico doesn't cover. Mobile-first responsiveness (base styles for small screens, `min-width` breakpoints for larger ones) must hold for the page as rendered — provided by Pico's classless build; `static/style.css` is not required to duplicate a `min-width` query of its own.

### 9. Hono and Pico versions stay pinned

`package.json` still lists `hono`, `better-sqlite3`, and `@picocss/pico` without a `^` or `~` range prefix.

### 10. Automated tests pass

```
npm test
```

Must exit with code 0, and must include (at minimum):

- DB-layer unit tests for `listAgents`, `getAgentById`, `listAilments`, `getAilmentsForAgent`
- Route tests for `GET /agents`, `GET /agents/:id` (both a valid id and an unknown id → 404), and `GET /ailments`

## Not Required

- No styled 404/500 error pages (Phase 7)
- No input sanitization or logging middleware (Phase 7)
- No therapies, appointments, or dashboard functionality (Phases 3–5)
- Browser rendering not checked — `curl` plus automated tests are sufficient
