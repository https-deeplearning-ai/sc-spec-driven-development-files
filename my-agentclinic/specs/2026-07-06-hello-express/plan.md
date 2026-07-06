# Plan — Phase 1: Hello Express

## 1. Dependencies

- [x] `npm install express`
- [x] `npm install --save-dev @types/express tsx`
- [x] Verify `package.json` reflects new dependencies

## 2. Dev Server Script

- [x] Add `"dev": "tsx --watch src/index.ts"` to `package.json` scripts
- [x] Add `"start": "node dist/index.js"` for production parity (optional but tidy)

## 3. Express Server Setup

- [x] Replace the stub in `src/index.ts` with an Express app
- [x] Import `express` and create an `app` instance
- [x] Set port to `3000` (hardcoded constant)
- [x] Add `app.listen(port, ...)` with a console log confirming the port

## 4. Root Route

- [x] Add `app.get('/', (req, res) => { res.send('AgentClinic is open for business') })`
- [x] Confirm TypeScript infers `req` and `res` types correctly (no `any` warnings)

## 6. Main Layout Component

- [x] Create `src/components/header.ts` — returns an HTML string for the `<header>` element
- [x] Create `src/components/footer.ts` — returns an HTML string for the `<footer>` element
- [x] Create `src/components/layout.ts` — wraps `header`, `<main>`, and `footer` into a full HTML page shell
- [x] Create `public/styles.css` with base styles using CSS custom properties
- [x] Configure Express to serve `public/` as static files (`express.static`)
- [x] Add a `<link rel="stylesheet">` pointing to `/styles.css` inside `layout.ts`
- [x] Update the root route in `src/app.ts` to render via the layout component

## 5. Smoke Test & Validation

- [x] Run `npm run dev` and confirm the server starts cleanly
- [x] `curl http://localhost:3000/` returns the expected string
- [x] Visit `http://localhost:3000/` in the browser and confirm the same
- [x] Run `tsc --noEmit` and confirm zero TypeScript errors
- [x] Write and run a Vitest integration test (see `validation.md`)
