import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { INote } from "./notes.interface";
import { randomUUID } from "crypto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";

@injectable()
export class NotesRepository {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
  ) {}

  getAll(): INote[] {
    const db = this.connectionManager.acquire();
    try {
      const sql = `SELECT "id", "title", "description", "importance", "completed" FROM "notes";`;
      const stmt = db.prepare(sql);
      return stmt.all() as INote[];
    } finally {
      this.connectionManager.release(db);
    }
  }

  findById(id: string): INote | undefined {
    const db = this.connectionManager.acquire();
    try {
      const sql = `SELECT "id", "title", "description", "importance", "completed" FROM "notes" WHERE "id" = ?;`;
      const stmt = db.prepare(sql);
      return stmt.get(id) as INote | undefined;
    } finally {
      this.connectionManager.release(db);
    }
  }

  create(note: CreateNoteSchema): Omit<INote, "updated_at" | "created_at"> {
    const db = this.connectionManager.acquire();
    const id = randomUUID();
    const sql = `INSERT INTO "notes" ("id", "title", "description", "importance") VALUES (?, ?, ?, ?);`;

    try {
      const stmt = db.prepare(sql);
      stmt.run(id, note.title, note.description, note.importance);
      return {
        id,
        title: note.title,
        description: note.description,
        importance: note.importance,
        completed: 0,
      };
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    } finally {
      this.connectionManager.release(db);
    }
  }

  update(id: string, note: UpdateNoteSchema): INote {
    const db = this.connectionManager.acquire();
    const fields = [];
    const values = [];

    const fieldMap = {
      title: "title",
      description: "description",
      importance: "importance",
      completed: "completed",
    };

    for (const key in note) {
      const value = note[key as keyof UpdateNoteSchema];
      if (value !== undefined) {
        fields.push(`${fieldMap[key as keyof typeof fieldMap]} = ?`);
        values.push(value);
      }
    }

    // Always update the updated_at timestamp
    fields.push("updated_at = CURRENT_TIMESTAMP");

    const sql = `UPDATE "notes" 
    SET ${fields.join(", ")} 
    WHERE "id" = ?;`;

    const stmt = db.prepare(sql);
    try {
      stmt.run(...values, id);

      // Return the updated note
      return this.findById(id)!;
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    } finally {
      this.connectionManager.release(db);
    }
  }

  delete(id: string): void {
    const db = this.connectionManager.acquire();
    const sql = `DELETE FROM "notes" WHERE "id" = ?;`;
    const stmt = db.prepare(sql);

    try {
      stmt.run(id);
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    } finally {
      this.connectionManager.release(db);
    }
  }
}
