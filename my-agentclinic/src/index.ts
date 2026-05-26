import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { Main } from './components/Main'
import { Layout } from './layout'

const app = new Hono()
const port = Number(process.env.PORT) || 3000

app.get('/styles.css', serveStatic({ path: './public/styles.css' }))

app.get('/', (c) => c.html(Layout(Main())))

serve({
  fetch: app.fetch,
  port,
})

console.log(`AgentClinic is running at http://localhost:${port}`)
