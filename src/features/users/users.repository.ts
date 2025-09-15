import { CreateUserSchema } from "./dtos/create-user.dto";
import { randomUUID } from "crypto";
import { userSchema, UserSchemaType } from "./dtos/user.dto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { UpdateUserSchema } from "./dtos/update-user.dto";

@injectable()
export class UsersRepository {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
  ) {}

  getAll(): UserSchemaType[] {
    const db = this.connectionManager.acquire();
    try {
      const stmt = db.prepare(`SELECT * FROM "users"`);
      return stmt.all() as UserSchemaType[];
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  getByID(id: string): UserSchemaType | undefined {
    const db = this.connectionManager.acquire();
    const sql = `SELECT * FROM "users" WHERE "id" = ?`;
    try {
      const stmt = db.prepare(sql);
      return stmt.get(id) as UserSchemaType | undefined;
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  getByEmail(email: string): UserSchemaType | undefined {
    const db = this.connectionManager.acquire();
    const sql = `SELECT * FROM "users" WHERE "email" = ?`;
    try {
      const stmt = db.prepare(sql);
      return stmt.get(email) as UserSchemaType | undefined;
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  create(user: CreateUserSchema): UserSchemaType {
    const db = this.connectionManager.acquire();
    const UUID = randomUUID();
    const sql = `INSERT INTO "users" ("id", "name", "email") VALUES(?,?,?)`;
    try {
      const stmt = db.prepare(sql);
      stmt.run(UUID, user.name, user.email);

      return userSchema.parse(this.getByID(UUID));
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  async update(id: string, user: UpdateUserSchema): Promise<UserSchemaType> {
    const db = this.connectionManager.acquire();
    const fields = [];
    const values = [];

    const fieldMap: Partial<UserSchemaType> = {
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

    const sql = `UPDATE "users" 
      SET ${fields.join(", ")} 
      WHERE "id" = ?;`;

    try {
      const stmt = db.prepare(sql);
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
