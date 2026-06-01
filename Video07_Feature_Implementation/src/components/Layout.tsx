import type { Child } from 'hono/jsx'
import { Header } from './Header'
import { Main } from './Main'
import { Footer } from './Footer'

export const Layout = ({ children }: { children: Child }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AgentClinic</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </body>
    </html>
  )
}
