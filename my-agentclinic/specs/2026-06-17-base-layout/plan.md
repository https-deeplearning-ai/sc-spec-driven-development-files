# Plan — Phase 2: Base Layout

## 1. Serve static files

- Add `@hono/node-server/serve-static` import to `src/app.tsx`
- Register `serveStatic({ root: './public' })` middleware before route handlers
- Confirm `GET /style.css` resolves to `public/style.css` at runtime

## 2. Create the CSS foundation

- Create `public/style.css` with:
  - `:root` block defining custom properties: `--color-bg`, `--color-text`, `--color-accent`, `--color-muted`, `--spacing-*`, `--font-sans`
  - `*, *::before, *::after { box-sizing: border-box }` reset
  - `body` reset: `margin: 0`, `font-family: var(--font-sans)`, `background`, `color`, `line-height`
  - Baseline styles for `header`, `nav`, `main`, `footer` using the custom properties

## 3. Build the Layout component and its three subcomponents

- Create `src/components/Header.tsx` — renders `<header>` (site name) and `<nav>` (Home link)
- Create `src/components/Footer.tsx` — renders `<footer>` with tagline
- Create `src/components/Main.tsx` — accepts `{ children: any }` and renders `<main>{children}</main>`
- Create `src/components/Layout.tsx` — accepts `{ title: string; children: any }` props
  - Renders full HTML document: `<html>`, `<head>` (charset, viewport, title, `<link rel="stylesheet" href="/style.css" />`), `<body>`
  - Body composes `<Header />`, `<Main>{children}</Main>`, `<Footer />` as imported subcomponents

## 4. Wire Home page into Layout

- Update `src/pages/Home.tsx` to import and use `Layout`
- Remove the standalone `<html>/<head>/<body>` tags — Layout now owns those
- Home renders only its page-specific content inside Layout's `<main>`

## 5. Update tests

- Update `src/app.test.tsx` to also assert that the response body contains layout chrome: `<header>`, `<nav>`, `<footer>`
- Run `tsc --noEmit` — confirm zero errors
- Run `npm test` — confirm all tests pass
