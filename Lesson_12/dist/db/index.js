import Database from "better-sqlite3";
export function createDb(path = "agentclinic.db") {
    const db = new Database(path);
    db.pragma("foreign_keys = ON");
    return db;
}
export function getAllFeedback(db) {
    return db.prepare("SELECT * FROM feedback ORDER BY created_at DESC, id DESC").all();
}
export function createFeedback(db, data) {
    const result = db
        .prepare("INSERT INTO feedback (name, email, message, rating) VALUES (?, ?, ?, ?)")
        .run(data.name, data.email, data.message, data.rating);
    return db
        .prepare("SELECT * FROM feedback WHERE id = ?")
        .get(result.lastInsertRowid);
}
