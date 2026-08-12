CREATE TABLE agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  model_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('intake', 'in treatment', 'discharged'))
);
