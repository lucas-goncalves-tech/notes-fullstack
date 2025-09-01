import fs from "node:fs";
import path from "node:path";
import { db } from "./connection";
import { Migration } from "../shared/types/migration.type";

console.log("Running Migration... ");
const migrationDir = path.join(__dirname, "migrations");
const migrationFiles = fs.readdirSync(migrationDir).sort();
const appliedMigrations = (
  db.prepare(`SELECT filename FROM "_migrations"`).all() as Migration[]
).map((row) => row.filename);

for (const file of migrationFiles) {
  if (appliedMigrations.includes(file)) {
    console.log(`Migration already applied: ${file}`);
    continue;
  }
  const sql = fs.readFileSync(path.join(migrationDir, file), "utf-8");
  db.exec(sql);
  db.prepare(
    `INSERT INTO _migrations (filename, applied_at)
    VALUES (?, CURRENT_TIMESTAMP)`,
  ).run(file);

  console.log(`Migration applied: ${file}`);
}

console.log("All migrations applied successfully.");
