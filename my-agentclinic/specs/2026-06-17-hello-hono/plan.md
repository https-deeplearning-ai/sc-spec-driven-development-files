# Plan — Phase 1: Hello Hono

## 1. Install dependencies
- Add `hono` and `@hono/node-server` to `dependencies` in package.json
- Add `tsx` and `vitest` to `devDependencies` in package.json
- Add scripts: `"dev": "tsx watch src/index.tsx"`, `"typecheck": "tsc --noEmit"`, `"test": "vitest run --passWithNoTests"`
- Update `tsconfig.json`: target ES2022, module ESNext, moduleResolution Bundler, jsx react-jsx, jsxImportSource hono/jsx
- Run `npm install`

## 2. Wire up the Hono app
- Create `src/app.tsx` — Hono instance with routes, exported for testing
- Create `src/index.tsx` — imports app, calls `serve()` to start the HTTP server on port 3000
- `GET /` renders the Home page component

## 3. Build the Home page
- Create `src/pages/Home.tsx` — JSX component returning a full HTML document
- Page includes the headline "AgentClinic is open for business" and a short tagline
- No shared layout or CSS yet (Phase 2)

## 4. Test and verify types
- Create `src/app.test.tsx` — Vitest test that calls `app.request('/')` and asserts status 200 and expected content
- Run `tsc --noEmit` and confirm zero errors
- Run `npm test` and confirm all tests pass
