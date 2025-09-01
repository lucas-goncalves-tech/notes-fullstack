import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(__dirname, "..", "..", "database.sqlite");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS _migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE NOT NULL,
    applied_at TEXT NOT NULL
  )
`);

export { db };
