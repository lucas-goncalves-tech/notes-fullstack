import { Database } from "better-sqlite3";
import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { INote } from "./notes.interface";
import { randomUUID } from "crypto";

export class NotesRepository {
  constructor(private db: Database) {}

  getAll(): INote[] {
    const sql = `SELECT "id", "title", "description", "importance", "completed" FROM "notes";`;
    const stmt = this.db.prepare(sql);
    return stmt.all() as INote[];
  }

  findById(id: string): INote | undefined {
    const sql = `SELECT "id", "title", "description", "importance", "completed" FROM "notes" WHERE "id" = ?;`;
    const stmt = this.db.prepare(sql);
    return stmt.get(id) as INote | undefined;
  }

  create(
    note: CreateNoteSchema,
  ): Pick<INote, "id" | "description" | "title" | "importance" | "completed"> {
    const id = randomUUID();
    const sql = `INSERT INTO notes ("id", "title", "description", "importance") VALUES (?, ?, ?, ?);`;

    try {
      const stmt = this.db.prepare(sql);
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
    }
  }

  update(id: string, note: UpdateNoteSchema): INote {
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

    const stmt = this.db.prepare(sql);
    try {
      stmt.run(...values, id);

      // Return the updated note
      return this.findById(id)!;
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    }
  }

  delete(id: string): void {
    const sql = `DELETE FROM "notes" WHERE "id" = ?;`;
    const stmt = this.db.prepare(sql);

    try {
      stmt.run(id);
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    }
  }
}
