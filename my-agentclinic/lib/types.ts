export interface Ailment {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  shortDescription: string;
  description: string;
  therapyIds: string[];
}

export interface Therapy {
  id: string;
  name: string;
  durationMinutes: number;
  description: string;
  ailmentIds: string[];
}

export interface Agent {
  id: string;
  name: string;
  species: string;
  operatorHandle: string;
}

export interface Appointment {
  id: string;
  agentId: string;
  therapyId: string;
  date: string;
  status: "upcoming" | "completed" | "cancelled";
}
