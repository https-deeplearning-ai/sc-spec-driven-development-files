CREATE TABLE IF NOT EXISTS appointments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id   INTEGER NOT NULL REFERENCES agents(id),
  therapist  TEXT NOT NULL,
  datetime   TEXT NOT NULL,
  notes      TEXT,
  status     TEXT NOT NULL DEFAULT 'scheduled'
);
