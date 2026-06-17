import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { Home } from './pages/Home'

const app = new Hono()

app.use('/style.css', serveStatic({ root: './public' }))

app.get('/', (c) => c.html(<Home />))

export default app
