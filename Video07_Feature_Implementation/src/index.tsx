import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Home } from './pages/Home'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => {
  return c.html(<Home />)
})

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('AgentClinic running on http://localhost:3000')
})
