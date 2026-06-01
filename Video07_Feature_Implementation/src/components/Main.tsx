import type { Child } from 'hono/jsx'

export const Main = ({ children }: { children: Child }) => {
  return (
    <main>
      {children}
    </main>
  )
}
