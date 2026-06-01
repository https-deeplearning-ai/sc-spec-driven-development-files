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

### 3. Automated tests pass

```
npm test
```

Must exit with code 0. This confirms the home page renders correctly and the app starts without errors.

### 4. Route returns an HTML home page

```
curl -s http://localhost:3000
```

HTTP status must be `200 OK`. Response body must be HTML and must contain:

- An `<h1>` element with the text `AgentClinic`
- A tagline (any short descriptive text; exact wording is implementation choice)

### 5. Hono version is pinned

`package.json` must list `hono` without a `^` or `~` range prefix.

### 6. Strict TypeScript is on

`tsconfig.json` must contain `"strict": true`.

## Not Required

- No CI pipeline required
- Browser rendering not checked (curl is sufficient)
