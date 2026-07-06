# Validation — Phase 1: Hello Express

## How We Know It's Done

All of the following must pass before this branch is merged.

---

## 1. TypeScript Compiles Clean

```bash
npx tsc --noEmit
```

Expected: **zero errors or warnings**.

---

## 2. Dev Server Starts

```bash
npm run dev
```

Expected console output includes a line confirming the server is listening on port `3000`.

---

## 3. Root Route — Manual Check

```bash
curl http://localhost:3000/
```

Expected response body (exact string):

```
AgentClinic is open for business
```

Optionally confirm in the browser at `http://localhost:3000/`.

---

## 4. Vitest Integration Test

Install Vitest if not already present:

```bash
npm install --save-dev vitest
```

Create `src/__tests__/root.test.ts` (or equivalent):

```ts
import { describe, it, expect } from 'vitest'
import request from 'supertest'   // npm install --save-dev supertest @types/supertest
import app from '../app'           // app exported separately from listen() call

describe('GET /', () => {
  it('returns the welcome message', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.text).toBe('AgentClinic is open for business')
  })
})
```

> **Note:** For this test to work, refactor `src/index.ts` to export the `app` object from a separate `src/app.ts` module, keeping `listen()` only in `index.ts`. This is a clean separation that all future phases will benefit from.

Run tests:

```bash
npx vitest run
```

Expected: **1 test, 1 passed, 0 failed**.

---

## Merge Checklist

- [ ] `tsc --noEmit` passes with zero errors
- [ ] `npm run dev` starts on port 3000 with confirmation log
- [ ] `curl http://localhost:3000/` returns exact welcome string
- [ ] Vitest integration test passes
- [ ] No `any` types introduced in `src/index.ts` or `src/app.ts`
- [ ] PR reviewed and approved
