import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { randomUUID } from "crypto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { noteSchema, NoteSchemaType } from "./dtos/note.dto";

@injectable()
export class NotesRepository {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
  ) {}

  getAll(): NoteSchemaType[] {
    const db = this.connectionManager.acquire();
    try {
      const sql = `SELECT "id", "title", "description", "importance", "completed" FROM "notes";`;
      const stmt = db.prepare(sql);
      return stmt.all() as NoteSchemaType[];
    } finally {
      this.connectionManager.release(db);
    }
  }

  async getByID(id: string): Promise<NoteSchemaType | undefined> {
    const db = this.connectionManager.acquire();
    try {
      const sql = `SELECT * FROM "notes" WHERE "id" = ?;`;
      const stmt = db.prepare(sql);
      return stmt.get(id) as NoteSchemaType | undefined;
    } finally {
      this.connectionManager.release(db);
    }
  }

  async create(note: CreateNoteSchema): Promise<NoteSchemaType> {
    const db = this.connectionManager.acquire();
    const noteID = randomUUID();
    const sql = `INSERT INTO "notes" ("id", "title", "description", "importance", "user_id") VALUES (?, ?, ?, ?, ?);`;

    try {
      const stmt = db.prepare(sql);
      stmt.run(
        noteID,
        note.title,
        note.description,
        note.importance,
        note.userID,
      );
      return noteSchema.parseAsync(await this.getByID(noteID));
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    } finally {
      this.connectionManager.release(db);
    }
  }

  update(id: string, note: UpdateNoteSchema): NoteSchemaType {
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
      return noteSchema.parse(this.getByID(id));
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
