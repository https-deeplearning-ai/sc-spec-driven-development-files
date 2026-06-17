import { Header } from './Header'
import { Main } from './Main'
import { Footer } from './Footer'

type LayoutProps = {
  title: string
  children: any
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — AgentClinic</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </body>
    </html>
  )
}
