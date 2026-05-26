import { html } from 'hono/html'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

export const Layout = (content: unknown) => html`<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>AgentClinic</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      ${Header()} ${content} ${Footer()}
    </body>
  </html>`
