import { Hono } from 'hono'
import { Home } from './pages/Home'

const app = new Hono()

app.get('/', (c) => c.html(<Home />))

export default app
