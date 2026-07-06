import express from 'express'
import path from 'path'
import { layout } from './components/layout'

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
  res.send(layout('<p>AgentClinic is open for business</p>'))
})

export default app
