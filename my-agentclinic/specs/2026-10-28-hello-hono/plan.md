# Phase 1 Plan — Hello Hono

## Group 1 — Package Setup & Configuration

1. Install `hono` and `@hono/node-server` pinned to exact versions (without `^` or `~`).
2. Install `tsx` as a dev dependency pinned to an exact version.
3. Review and ensure `tsconfig.json` has `"strict": true` and appropriate Node module resolution settings.

## Group 2 — Application Entry Point

4. Replace placeholder code in `src/index.ts` with a minimal Hono server application.
5. Define a `GET /` route returning `"AgentClinic is open for business"`.
6. Bind the application to port 3000 using `serve` from `@hono/node-server` with a listening log message.

## Group 3 — NPM Scripts

7. Add `"dev": "tsx watch src/index.ts"` to `package.json` scripts for auto-reloading development.
8. Add `"typecheck": "tsc --noEmit"` to `package.json` scripts for type verification.

## Group 4 — Verification

9. Run `npm run typecheck` to confirm zero TypeScript compilation errors.
10. Start the server with `npm run dev` and confirm it listens on port 3000.
11. Send a request to `http://localhost:3000/` and verify that it returns status `200` with body `"AgentClinic is open for business"`.

