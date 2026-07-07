import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('POST /agents/:id/appointments', () => {
  it('creates an appointment and redirects to confirmation page', async () => {
    const createRes = await request(app)
      .post('/agents/1/appointments')
      .type('form')
      .send({
        therapistName: 'Dr. Turing',
        appointmentAt: '2026-07-06T14:30',
        status: 'scheduled',
        notes: 'Initial consultation',
      })

    expect(createRes.status).toBe(302)
    expect(createRes.headers.location).toMatch(/^\/appointments\/\d+\/confirmation$/)

    const confirmationRes = await request(app).get(createRes.headers.location)
    expect(confirmationRes.status).toBe(200)
    expect(confirmationRes.text).toContain('Appointment confirmed')
    expect(confirmationRes.text).toContain('Dr. Turing')
  })

  it('returns 400 with validation errors for invalid payload', async () => {
    const res = await request(app)
      .post('/agents/1/appointments')
      .type('form')
      .send({
        therapistName: '',
        appointmentAt: 'not-a-date',
        status: 'unknown-status',
        notes: 'x',
      })

    expect(res.status).toBe(400)
    expect(res.text).toContain('Booking validation')
    expect(res.text).toContain('Therapist name is required.')
    expect(res.text).toContain('Appointment date and time is invalid.')
    expect(res.text).toContain('Appointment status is invalid.')
  })
})
