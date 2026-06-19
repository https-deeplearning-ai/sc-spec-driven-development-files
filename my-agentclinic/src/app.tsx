import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { Home } from './pages/Home'
import { Agents, type Agent } from './pages/Agents'
import { AgentDetail } from './pages/AgentDetail'
import { Ailments, type Ailment } from './pages/Ailments'
import { AilmentDetail } from './pages/AilmentDetail'
import { Therapies, type Therapy } from './pages/Therapies'
import { TherapyDetail } from './pages/TherapyDetail'
import { BookAppointment, type Appointment } from './pages/BookAppointment'
import { AppointmentConfirmation } from './pages/AppointmentConfirmation'
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
  const ailments = db.prepare(
    `SELECT a.* FROM ailments a
     JOIN agent_ailments aa ON aa.ailment_id = a.id
     WHERE aa.agent_id = ?`
  ).all(id) as Ailment[]
  return c.html(<AgentDetail agent={agent} ailments={ailments} />)
})

app.get('/agents/:id/appointments/new', (c) => {
  const id = Number(c.req.param('id'))
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
  if (!agent) return c.text('Agent not found', 404)
  return c.html(<BookAppointment agent={agent} />)
})

app.post('/agents/:id/appointments', async (c) => {
  const id = Number(c.req.param('id'))
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent | undefined
  if (!agent) return c.text('Agent not found', 404)

  const body = await c.req.parseBody()
  const therapist = String(body.therapist ?? '').trim()
  const datetime  = String(body.datetime  ?? '').trim()
  const notes     = String(body.notes     ?? '').trim() || null

  if (!therapist || !datetime) {
    return c.html(
      <BookAppointment
        agent={agent}
        error="Therapist and date/time are required."
        values={{ therapist, datetime, notes: notes ?? '' }}
      />,
      422
    )
  }

  const result = db.prepare(
    'INSERT INTO appointments (agent_id, therapist, datetime, notes) VALUES (?, ?, ?, ?)'
  ).run(id, therapist, datetime, notes)

  return c.redirect(`/appointments/${result.lastInsertRowid}/confirmation`)
})

app.get('/appointments/:id/confirmation', (c) => {
  const id = Number(c.req.param('id'))
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as Appointment | undefined
  if (!appointment) return c.text('Appointment not found', 404)
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(appointment.agent_id) as Agent
  return c.html(
    <AppointmentConfirmation
      appointment={appointment}
      agentName={agent.name}
      agentId={agent.id}
    />
  )
})

app.get('/ailments', (c) => {
  const ailments = db.prepare('SELECT * FROM ailments').all() as Ailment[]
  return c.html(<Ailments ailments={ailments} />)
})

app.get('/ailments/:id', (c) => {
  const id = Number(c.req.param('id'))
  const ailment = db.prepare('SELECT * FROM ailments WHERE id = ?').get(id) as Ailment | undefined
  if (!ailment) return c.text('Ailment not found', 404)
  const agents = db.prepare(
    `SELECT ag.* FROM agents ag
     JOIN agent_ailments aa ON aa.agent_id = ag.id
     WHERE aa.ailment_id = ?`
  ).all(id) as Agent[]
  const therapies = db.prepare(
    `SELECT t.* FROM therapies t
     JOIN ailment_therapies at ON at.therapy_id = t.id
     WHERE at.ailment_id = ?`
  ).all(id) as Therapy[]
  return c.html(<AilmentDetail ailment={ailment} agents={agents} therapies={therapies} />)
})

app.get('/therapies', (c) => {
  const therapies = db.prepare('SELECT * FROM therapies').all() as Therapy[]
  return c.html(<Therapies therapies={therapies} />)
})

app.get('/therapies/:id', (c) => {
  const id = Number(c.req.param('id'))
  const therapy = db.prepare('SELECT * FROM therapies WHERE id = ?').get(id) as Therapy | undefined
  if (!therapy) return c.text('Therapy not found', 404)
  const ailments = db.prepare(
    `SELECT a.* FROM ailments a
     JOIN ailment_therapies at ON at.ailment_id = a.id
     WHERE at.therapy_id = ?`
  ).all(id) as Ailment[]
  return c.html(<TherapyDetail therapy={therapy} ailments={ailments} />)
})

export default app
