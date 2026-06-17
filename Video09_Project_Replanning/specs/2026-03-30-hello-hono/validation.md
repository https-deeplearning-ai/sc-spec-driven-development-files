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

### 6. Responsive layout

The viewport meta tag must be present in the rendered HTML:

```
curl -s http://localhost:3000 | grep 'viewport'
```

Must return a line containing `width=device-width`.

CSS gutters must use `clamp()` so spacing is fluid. Verify `static/style.css` contains at least one `clamp(` call.

### 7. Tests pass

```
npm test
```

Must exit with code 0. The Vitest suite for this phase (`src/app.test.tsx`) must contain at minimum:

- A test that `GET /` returns HTTP 200
- A test that the response body contains `AgentClinic` and an `<h1>` element

## Not Required

- No CI pipeline required
- Browser rendering not checked (curl is sufficient)
