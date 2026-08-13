CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL REFERENCES agents(id),
  therapist_name TEXT NOT NULL,
  therapy_id INTEGER REFERENCES therapies(id),
  scheduled_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')) DEFAULT 'requested',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
