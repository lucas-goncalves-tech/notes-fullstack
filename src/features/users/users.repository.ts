import { CreateUserSchema } from "./dtos/create-user.dto";
import { randomUUID } from "crypto";
import { UserSchema } from "./dtos/user.dto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { UpdateUserSchema } from "./dtos/update-user.dto";

@injectable()
export class UsersRepository {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
  ) {}

  getAll(): UserSchema[] {
    const db = this.connectionManager.acquire();
    try {
      const stmt = db.prepare(`SELECT * FROM "users"`);
      return stmt.all() as UserSchema[];
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  getByID(id: string): UserSchema {
    const db = this.connectionManager.acquire();
    const sql = `SELECT * FROM "users" WHERE "id" = ?`;
    try {
      const stmt = db.prepare(sql);
      return stmt.get(id) as UserSchema;
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  create(user: CreateUserSchema): UserSchema {
    const db = this.connectionManager.acquire();
    const UUID = randomUUID();
    const sql = `INSERT INTO "users" ("id", "name", "email") VALUES(?,?,?)`;
    try {
      const stmt = db.prepare(sql);
      stmt.run(UUID, user.name, user.email);

      return this.getByID(UUID);
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  update(id: string, user: UpdateUserSchema): UserSchema {
    const db = this.connectionManager.acquire();
    const fields = [];
    const values = [];

    const fieldMap: Partial<UserSchema> = {
      name: "name",
      email: "email",
    };

    for (const key in user) {
      const value = user[key as keyof UpdateUserSchema];
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
      return this.getByID(id)!;
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    } finally {
      this.connectionManager.release(db);
    }
  }

  delete(id: string): void {
    const db = this.connectionManager.acquire();
    const sql = `DELETE FROM "users" WHERE "id" = ?`;
    try {
      const stmt = db.prepare(sql);
      stmt.run(id);
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }
}
