export type AgentStatus = "intake" | "in treatment" | "discharged";

export interface Agent {
  id: number;
  name: string;
  model_type: string;
  status: AgentStatus;
}

export interface Ailment {
  id: number;
  name: string;
  description: string;
}
