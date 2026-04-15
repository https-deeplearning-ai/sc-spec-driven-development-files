import Database from "better-sqlite3";
export function createDb(path = "agentclinic.db") {
    const db = new Database(path);
    db.pragma("foreign_keys = ON");
    return db;
}
