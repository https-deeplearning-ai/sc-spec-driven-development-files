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
        <header>
          <span class="site-name">AgentClinic</span>
        </header>
        <nav>
          <a href="/">Home</a>
        </nav>
        <main>{children}</main>
        <footer>
          A full-service wellness platform for AI agents.
        </footer>
      </body>
    </html>
  )
}
