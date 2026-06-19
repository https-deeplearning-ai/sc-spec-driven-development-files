CREATE TABLE IF NOT EXISTS agent_ailments (
  agent_id   INTEGER NOT NULL REFERENCES agents(id),
  ailment_id INTEGER NOT NULL REFERENCES ailments(id),
  PRIMARY KEY (agent_id, ailment_id)
);
