CREATE TABLE agent_ailments (
  agent_id INTEGER NOT NULL REFERENCES agents (id),
  ailment_id INTEGER NOT NULL REFERENCES ailments (id),
  UNIQUE (agent_id, ailment_id)
);
