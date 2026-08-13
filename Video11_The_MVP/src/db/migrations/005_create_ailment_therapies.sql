CREATE TABLE ailment_therapies (
  ailment_id INTEGER NOT NULL REFERENCES ailments(id),
  therapy_id INTEGER NOT NULL REFERENCES therapies(id),
  PRIMARY KEY (ailment_id, therapy_id)
);
