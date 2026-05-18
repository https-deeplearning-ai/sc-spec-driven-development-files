import { Header } from './Header'
import { Footer } from './Footer'

type Props = {
  children: any
}

export function Layout({ children }: Props) {
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
        {children}
        <Footer />
      </body>
    </html>
  )
}
