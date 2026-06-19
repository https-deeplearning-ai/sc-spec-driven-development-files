# Plan — Phase 6: Therapies Catalog

## 1. Add migrations

- Create `db/migrations/005_create_therapies.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS therapies (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    description TEXT NOT NULL
  );
  ```
- Create `db/migrations/006_create_ailment_therapies.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS ailment_therapies (
    ailment_id  INTEGER NOT NULL REFERENCES ailments(id),
    therapy_id  INTEGER NOT NULL REFERENCES therapies(id),
    PRIMARY KEY (ailment_id, therapy_id)
  );
  ```
- Register both in `db/client.ts` (they use `CREATE TABLE IF NOT EXISTS` so no try/catch needed)

## 2. Seed therapies and ailment–therapy links

- In `db/seed.ts`, add a third block after ailments:
  - Insert the 6 therapies (skip if `therapies` table already has rows)
  - Insert the ailment–therapy mappings by looking up IDs by name
- Drop `agentclinic.db` and run `npm run seed` to confirm all rows

## 3. Build the Therapies list page

- Create `src/pages/Therapies.tsx` — export `type Therapy { id, name, description }`
- Render a `<table>` of all therapies inside `<Layout title="Therapies">`
- Therapy names link to `/therapies/:id`

## 4. Build the TherapyDetail page

- Create `src/pages/TherapyDetail.tsx`
- Props: `{ therapy: Therapy, ailments: Ailment[] }`
- Render inside `<Layout title={therapy.name}>`:
  - `<h1>{therapy.name}</h1>`
  - `<p>{therapy.description}</p>`
  - `<h2>Treats</h2>` + `<ul>` of ailment names linking to `/ailments/:id`
  - `← Back to Therapies` link

## 5. Update AilmentDetail to show recommended therapies

- In `src/pages/AilmentDetail.tsx`, accept an additional `therapies: Therapy[]` prop
- After "Affected Agents", add:
  - `<h2>Recommended Therapies</h2>`
  - `<ul>` of therapy names linking to `/therapies/:id`, or `<p>None recommended</p>` if empty

## 6. Add routes

In `src/app.tsx`:
- `GET /therapies` — query all therapies, render `<Therapies>`
- `GET /therapies/:id` — query therapy + its ailments via join, render `<TherapyDetail>`; 404 if not found
- Update `GET /ailments/:id` — also query the ailment's therapies via join, pass to `<AilmentDetail>`

## 7. Update Header nav

- In `src/components/Header.tsx`, add `<li><a href="/therapies">Therapies</a></li>`

## 8. Update tests

- Add `GET /therapies` test: 200, contains therapy name and `<table`
- Add `GET /therapies/:id` test: 200, contains therapy name and a linked ailment name
- Add `GET /therapies/9999` test: 404
- Update `GET /ailments/:id` test: response contains a therapy name
- Run `tsc --noEmit` and `npm test` — all pass
