export interface Agent {
  id: number;
  name: string;
  model_type: string;
  status: string;
  created_at: string;
}

export interface Ailment {
  id: number;
  name: string;
  description: string;
}

export interface Therapy {
  id: number;
  name: string;
  description: string;
}

export interface AilmentWithTherapies extends Ailment {
  therapies: Therapy[];
}

export const APPOINTMENT_STATUSES = [
  "requested",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface Appointment {
  id: number;
  agent_id: number;
  therapist_name: string;
  therapy_id: number | null;
  scheduled_at: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  agent_name: string;
  therapy_name: string | null;
}
