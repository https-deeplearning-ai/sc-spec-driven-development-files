import express from 'express'
import path from 'path'
import { layout } from './components/layout'
import { Agent, AgentProfile, getAgentById, listAgents } from './data/agents'
import { Ailment, listAilments } from './data/ailments'
import { listTherapies, Therapy } from './data/therapies'
import {
  AppointmentStatus,
  createAppointment,
  getAppointmentById,
} from './data/appointments'
import { getDashboardData } from './data/dashboard'
import { escapeHtml, sanitizeInput } from './utils/sanitize'

const app = express()

const validStatuses: AppointmentStatus[] = ['scheduled', 'confirmed', 'completed', 'cancelled']

interface BookingFormState {
  therapistName: string
  appointmentAt: string
  status: AppointmentStatus
  notes: string
}

interface BookingValidation {
  values: BookingFormState
  errors: string[]
}

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`)
  })
  next()
})

app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '..', 'public')))

function validateBookingInput(body: Record<string, unknown>): BookingValidation {
  const therapistName = sanitizeInput(body.therapistName)
  const appointmentAt = sanitizeInput(body.appointmentAt)
  const statusRaw = sanitizeInput(body.status)
  const notes = sanitizeInput(body.notes)

  const status = validStatuses.includes(statusRaw as AppointmentStatus)
    ? (statusRaw as AppointmentStatus)
    : 'scheduled'

  const errors: string[] = []

  if (!therapistName) {
    errors.push('Therapist name is required.')
  }

  if (!appointmentAt) {
    errors.push('Appointment date and time are required.')
  } else if (Number.isNaN(Date.parse(appointmentAt))) {
    errors.push('Appointment date and time is invalid.')
  }

  if (!validStatuses.includes(statusRaw as AppointmentStatus)) {
    errors.push('Appointment status is invalid.')
  }

  return {
    values: {
      therapistName,
      appointmentAt,
      status,
      notes,
    },
    errors,
  }
}

export function renderAgentsContent(agents: Agent[]): string {
  if (agents.length === 0) {
    return `
      <section>
        <h2>Agents</h2>
        <p role="status">No agents are currently registered.</p>
      </section>
    `
  }

  const cards = agents
    .map((agent) => {
      return `
        <article class="agent-card">
          <h3><a href="/agents/${agent.id}">${escapeHtml(agent.name)}</a></h3>
          <p><strong>Model:</strong> ${escapeHtml(agent.modelType)}</p>
          <p><strong>Status:</strong> ${escapeHtml(agent.currentStatus)}</p>
          <p><strong>Presenting complaints:</strong> ${escapeHtml(agent.presentingComplaints)}</p>
        </article>
      `
    })
    .join('')

  return `
    <section>
      <h2>Agents</h2>
      <p>Current caseload across the clinic.</p>
      ${cards}
    </section>
  `
}

export function renderAgentProfileContent(agent: AgentProfile | null, id: number): string {
  if (!agent) {
    return `
      <section>
        <h2>Agent Not Found</h2>
        <p role="status">No agent exists with id ${id}.</p>
        <p><a href="/agents">Back to agents</a></p>
      </section>
    `
  }

  const ailments =
    agent.ailments.length > 0
      ? `<ul>${agent.ailments.map((ailment) => `<li>${escapeHtml(ailment)}</li>`).join('')}</ul>`
      : '<p>No ailments currently linked.</p>'

  return `
    <section>
      <p><a href="/agents">Back to agents</a></p>
      <h2>${escapeHtml(agent.name)}</h2>
      <p><strong>Model:</strong> ${escapeHtml(agent.modelType)}</p>
      <p><strong>Status:</strong> ${escapeHtml(agent.currentStatus)}</p>
      <p><strong>Presenting complaints:</strong> ${escapeHtml(agent.presentingComplaints)}</p>
      <h3>Linked ailments</h3>
      ${ailments}
    </section>
  `
}

function renderAppointmentForm(
  agentId: number,
  initialValues: BookingFormState,
  errors: string[],
): string {
  const errorHtml =
    errors.length > 0
      ? `<article class="error-panel"><h4>Booking validation</h4><ul>${errors
          .map((error) => `<li>${escapeHtml(error)}</li>`)
          .join('')}</ul></article>`
      : ''

  return `
    <section>
      <h3>Book appointment</h3>
      ${errorHtml}
      <form action="/agents/${agentId}/appointments" method="post">
        <label for="therapistName">Therapist name</label>
        <input id="therapistName" name="therapistName" value="${escapeHtml(initialValues.therapistName)}" required />

        <label for="appointmentAt">Appointment date and time</label>
        <input id="appointmentAt" type="datetime-local" name="appointmentAt" value="${escapeHtml(initialValues.appointmentAt)}" required />

        <label for="status">Status</label>
        <select id="status" name="status">
          ${validStatuses
            .map(
              (status) =>
                `<option value="${status}"${initialValues.status === status ? ' selected' : ''}>${status}</option>`,
            )
            .join('')}
        </select>

        <label for="notes">Notes</label>
        <textarea id="notes" name="notes" rows="4">${escapeHtml(initialValues.notes)}</textarea>

        <button type="submit">Book appointment</button>
      </form>
    </section>
  `
}

function renderAgentProfilePage(
  agent: AgentProfile | null,
  id: number,
  bookingState?: BookingValidation,
): string {
  const baseContent = renderAgentProfileContent(agent, id)
  if (!agent) {
    return baseContent
  }

  const formState = bookingState?.values ?? {
    therapistName: '',
    appointmentAt: '',
    status: 'scheduled',
    notes: '',
  }
  const errors = bookingState?.errors ?? []

  return `${baseContent}${renderAppointmentForm(agent.id, formState, errors)}`
}

export function renderTherapiesContent(therapies: Therapy[]): string {
  if (therapies.length === 0) {
    return `
      <section>
        <h2>Therapies</h2>
        <p role="status">No therapies are currently registered.</p>
      </section>
    `
  }

  const items = therapies
    .map((therapy) => {
      const mappedAilments =
        therapy.ailments.length > 0
          ? `<ul>${therapy.ailments.map((name) => `<li>${escapeHtml(name)}</li>`).join('')}</ul>`
          : '<p>No ailment mappings yet.</p>'

      return `
        <article class="therapy-card">
          <h3>${escapeHtml(therapy.name)}</h3>
          <p>${escapeHtml(therapy.description)}</p>
          <h4>Mapped ailments</h4>
          ${mappedAilments}
        </article>
      `
    })
    .join('')

  return `
    <section>
      <h2>Therapies</h2>
      <p>Evidence-based options available to the clinic.</p>
      ${items}
    </section>
  `
}

export function renderDashboardContent(): string {
  const dashboard = getDashboardData()

  const appointmentRows =
    dashboard.appointments.length > 0
      ? dashboard.appointments
          .map(
            (appointment) => `
            <tr>
              <td>${appointment.id}</td>
              <td>${escapeHtml(appointment.agentName)}</td>
              <td>${escapeHtml(appointment.therapistName)}</td>
              <td>${escapeHtml(appointment.status)}</td>
            </tr>
          `,
          )
          .join('')
      : '<tr><td colspan="4">No appointments yet.</td></tr>'

  return `
    <section>
      <h2>Dashboard</h2>
      <div class="summary-grid" role="list" aria-label="Clinic summary metrics">
        <article role="listitem"><h3>Agents</h3><p>${dashboard.summary.agentCount}</p></article>
        <article role="listitem"><h3>Open appointments</h3><p>${dashboard.summary.openAppointments}</p></article>
        <article role="listitem"><h3>Ailments in-flight</h3><p>${dashboard.summary.ailmentsInFlight}</p></article>
      </div>

      <h3>Recent appointments</h3>
      <figure>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Agent</th>
              <th>Therapist</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${appointmentRows}
          </tbody>
        </table>
      </figure>

      <h3>Agents</h3>
      <ul>
        ${dashboard.agents.map((agent) => `<li>${escapeHtml(agent.name)} (${escapeHtml(agent.currentStatus)})</li>`).join('')}
      </ul>

      <h3>Ailments</h3>
      <ul>
        ${dashboard.ailments.map((ailment) => `<li>${escapeHtml(ailment.name)} (${ailment.agentCount} linked)</li>`).join('')}
      </ul>
    </section>
  `
}

export function renderAilmentsContent(ailments: Ailment[]): string {
  if (ailments.length === 0) {
    return `
      <section>
        <h2>Ailments</h2>
        <p role="status">No ailments are currently registered.</p>
      </section>
    `
  }

  const items = ailments
    .map((ailment) => {
      return `
        <article class="ailment-card">
          <h3>${escapeHtml(ailment.name)}</h3>
          <p>${escapeHtml(ailment.description)}</p>
          <p><strong>Agents linked:</strong> ${ailment.agentCount}</p>
        </article>
      `
    })
    .join('')

  return `
    <section>
      <h2>Ailments</h2>
      <p>Common concerns currently tracked at AgentClinic.</p>
      ${items}
    </section>
  `
}

app.get('/', (req, res) => {
  res.send(layout('<p>AgentClinic is open for business</p>'))
})

app.get('/agents', (req, res) => {
  const agents = listAgents()
  res.send(layout(renderAgentsContent(agents), 'Agents | AgentClinic'))
})

app.get('/agents/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  if (Number.isNaN(id) || id <= 0) {
    res.status(404).send(layout(renderAgentProfilePage(null, 0), 'Agent Not Found | AgentClinic'))
    return
  }

  const agent = getAgentById(id)
  if (!agent) {
    res.status(404).send(layout(renderAgentProfilePage(null, id), 'Agent Not Found | AgentClinic'))
    return
  }

  res.send(layout(renderAgentProfilePage(agent, id), `${agent.name} | AgentClinic`))
})

app.post('/agents/:id/appointments', (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  if (Number.isNaN(id) || id <= 0) {
    res.status(404).send(layout(renderAgentProfilePage(null, 0), 'Agent Not Found | AgentClinic'))
    return
  }

  const agent = getAgentById(id)
  if (!agent) {
    res.status(404).send(layout(renderAgentProfilePage(null, id), 'Agent Not Found | AgentClinic'))
    return
  }

  const bookingState = validateBookingInput(req.body as Record<string, unknown>)
  if (bookingState.errors.length > 0) {
    res
      .status(400)
      .send(layout(renderAgentProfilePage(agent, id, bookingState), `${agent.name} | AgentClinic`))
    return
  }

  const appointmentId = createAppointment({
    agentId: id,
    therapistName: bookingState.values.therapistName,
    appointmentAt: bookingState.values.appointmentAt,
    status: bookingState.values.status,
    notes: bookingState.values.notes,
  })

  res.redirect(302, `/appointments/${appointmentId}/confirmation`)
})

app.get('/appointments/:id/confirmation', (req, res) => {
  const id = Number.parseInt(req.params.id, 10)
  if (Number.isNaN(id) || id <= 0) {
    res.status(404).send(layout('<h2>Appointment Not Found</h2>', 'Appointment Not Found | AgentClinic'))
    return
  }

  const appointment = getAppointmentById(id)
  if (!appointment) {
    res.status(404).send(layout('<h2>Appointment Not Found</h2>', 'Appointment Not Found | AgentClinic'))
    return
  }

  res.send(
    layout(
      `
        <section>
          <h2>Appointment confirmed</h2>
          <p><strong>Agent:</strong> ${escapeHtml(appointment.agentName)}</p>
          <p><strong>Therapist:</strong> ${escapeHtml(appointment.therapistName)}</p>
          <p><strong>When:</strong> ${escapeHtml(appointment.appointmentAt)}</p>
          <p><strong>Status:</strong> ${escapeHtml(appointment.status)}</p>
          <p><a href="/dashboard">View dashboard</a></p>
        </section>
      `,
      'Appointment Confirmation | AgentClinic',
    ),
  )
})

app.get('/ailments', (req, res) => {
  const ailments = listAilments()
  res.send(layout(renderAilmentsContent(ailments), 'Ailments | AgentClinic'))
})

app.get('/therapies', (req, res) => {
  const therapies = listTherapies()
  res.send(layout(renderTherapiesContent(therapies), 'Therapies | AgentClinic'))
})

app.get('/dashboard', (req, res) => {
  res.send(layout(renderDashboardContent(), 'Dashboard | AgentClinic'))
})

if (process.env.VITEST === 'true') {
  app.get('/__test/error', () => {
    throw new Error('Intentional test error')
  })
}

app.use((req, res) => {
  res.status(404).send(
    layout(
      `
        <section>
          <h2>Page Not Found</h2>
          <p>The page you requested does not exist.</p>
        </section>
      `,
      '404 | AgentClinic',
    ),
  )
})

app.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error)
  if (res.headersSent) {
    next(error)
    return
  }

  res.status(500).send(
    layout(
      `
        <section>
          <h2>Server Error</h2>
          <p>Something went wrong. Please try again.</p>
        </section>
      `,
      '500 | AgentClinic',
    ),
  )
})

export default app
