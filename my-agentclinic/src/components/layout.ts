import { header } from './header'
import { footer } from './footer'

export function layout(content: string, title = 'AgentClinic'): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    ${header()}
    <main>
      ${content}
    </main>
    ${footer()}
  </body>
</html>`
}
