# Phase 1 Validation — Hello Hono

## Definition of Done

All of the following must be true before this branch is merged.

### 1. TypeScript compiles cleanly

```
npm run typecheck
```

Must exit with code 0 and produce no errors or warnings.

### 2. Server starts

```
npm run dev
```

Must start without errors. The terminal should show the server is listening (port 3000 or logged port).

### 3. Route returns an HTML home page

```
curl -s http://localhost:3000
```

HTTP status must be `200 OK`. Response body must be HTML and must contain:

- An `<h1>` element with the text `AgentClinic`
- A tagline (any short descriptive text; exact wording is implementation choice)

### 4. Hono version is pinned

`package.json` must list `hono` without a `^` or `~` range prefix.

### 5. Strict TypeScript is on

`tsconfig.json` must contain `"strict": true`.

### 6. Test suite runs

```
npm test
```

Must exit with code 0. An empty suite (no `*.test.ts` files yet) is acceptable for this phase; the command must simply run cleanly.

### 7. Layout is responsive

```
curl -s http://localhost:3000
```

Response body must contain a `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag. `static/style.css` must contain no fixed-pixel breakpoint (e.g. `@media (min-width: ...px)`) required for the base layout to look correct — spacing should be fluid (`clamp()` or percentage-based) instead. Manually confirm in a browser at both a phone width (~375px) and desktop width that there is no horizontal scrollbar.

## Not Required

- No CI pipeline required
- No cross-browser matrix or automated visual regression testing — a manual resize check (see #7) is sufficient for this phase
