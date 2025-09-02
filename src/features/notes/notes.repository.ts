import { db } from "../../database/connection";

import { CreateNoteSchema } from "./dtos/create-note.dto";
import { UpdateNoteSchema } from "./dtos/update-note.dto";
import { INotes } from "./notes.interface";
import { randomUUID } from "crypto";

export class NotesRepository {
  getAll(): INotes[] {
    const sql = `SELECT * FROM notes;`;
    const stmt = db.prepare(sql);
    return stmt.all() as INotes[];
  }

  findById(id: string): INotes | undefined {
    const sql = `SELECT * FROM notes WHERE id = ?;`;
    const stmt = db.prepare(sql);
    return stmt.get(id) as INotes | undefined;
  }

  create(note: CreateNoteSchema): Pick<INotes, "id" | "content" | "title"> {
    const id = randomUUID();
    const sql = `INSERT INTO notes (id, title, content) VALUES (?, ?, ?)`;
    const stmt = db.prepare(sql);

    try {
      stmt.run(id, note.title, note.content);
      return {
        id,
        title: note.title,
        content: note.content,
      };
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    }
  }

  update(id: string, note: UpdateNoteSchema) {
    const fields = [];
    const values = [];

    if (note.title !== undefined) {
      fields.push("title = ?");
      values.push(note.title);
    }
    if (note.content !== undefined) {
      fields.push("content = ?");
      values.push(note.content);
    }

    const sql = `UPDATE notes 
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?`;

    const stmt = db.prepare(sql);
    try {
      stmt.run(...values, id);
      return note.title;
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    }
  }

  delete(id: string) {
    const sql = `DELETE FROM notes WHERE id = ?`;
    const stmt = db.prepare(sql);

    try {
      stmt.run(id);
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    }
  }
}
