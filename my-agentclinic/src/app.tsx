import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { Home } from './pages/Home'
import { Agents, type Agent } from './pages/Agents'
import { AgentDetail } from './pages/AgentDetail'
import { db } from '../db/client'

const app = new Hono()

app.use('/style.css', serveStatic({ root: './public' }))

app.get('/', (c) => c.html(<Home />))

app.get('/agents', (c) => {
  const agents = db.prepare('SELECT * FROM agents').all() as Agent[]
  return c.html(<Agents agents={agents} />)
})

app.get('/agents/:id', (c) => {
  const id = Number(c.req.param('id'))
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
  if (!agent) return c.text('Agent not found', 404)
  return c.html(<AgentDetail agent={agent} />)
})

export default app
