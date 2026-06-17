import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { Home } from './pages/Home'
import { Agents, type Agent } from './pages/Agents'
import { db } from '../db/client'

const app = new Hono()

app.use('/style.css', serveStatic({ root: './public' }))

app.get('/', (c) => c.html(<Home />))

app.get('/agents', (c) => {
  const agents = db.prepare('SELECT * FROM agents').all() as Agent[]
  return c.html(<Agents agents={agents} />)
})

export default app
