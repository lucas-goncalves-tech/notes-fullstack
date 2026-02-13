import Database from "better-sqlite3";
import { configDotenv } from "dotenv";
import path from "node:path";

configDotenv();

const rawPath = process.env.DATABASE_PATH;
if (!rawPath) {
  throw new Error("DB PATH not defined!");
}
const dbPath = path.resolve(rawPath);
const db = new Database(dbPath);

db.exec(`PRAGMA foreign_keys = ON`);

db.exec(`
  CREATE TABLE IF NOT EXISTS _migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE NOT NULL,
    applied_at TEXT NOT NULL
  )
`);

export { db };
