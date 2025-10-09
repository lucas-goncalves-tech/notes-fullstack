import { CreateUserDTO } from "./dtos/create-user.dto";
import { randomUUID } from "crypto";
import {
  UserDTO,
  UserMinimalSchema,
  userMinimalSchema,
  usersSchema,
} from "./dtos/user.dto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { UpdateUserSchema } from "./dtos/update-user.dto";

@injectable()
export class UsersRepository {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
  ) {}

  async getAll(): Promise<UserMinimalSchema[]> {
    const db = this.connectionManager.acquire();
    try {
      const stmt = db.prepare(`SELECT * FROM "users"`);
      const users = usersSchema.parse(stmt.all());
      return users;
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  async getByID(id: string): Promise<UserMinimalSchema | undefined> {
    const db = this.connectionManager.acquire();
    const sql = `SELECT * FROM "users" WHERE "id" = ?`;
    try {
      const stmt = db.prepare(sql);
      const user = userMinimalSchema.safeParse(stmt.get(id));
      if (user.success) {
        return user.data;
      } else {
        return undefined;
      }
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  async getByEmail(email: string): Promise<UserDTO | undefined> {
    const db = this.connectionManager.acquire();
    const sql = `SELECT * FROM "users" WHERE "email" = ?`;
    try {
      const stmt = db.prepare(sql);
      return stmt.get(email) as UserDTO | undefined;
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  async create(user: CreateUserDTO): Promise<UserMinimalSchema> {
    const db = this.connectionManager.acquire();
    const UUID = randomUUID();
    const sql = `INSERT INTO "users" ("id", "name", "email", "password_hash") VALUES(?,?,?,?)`;
    try {
      const stmt = db.prepare(sql);
      stmt.run(UUID, user.name, user.email, user.password_hash);

      return userMinimalSchema.parseAsync(await this.getByID(UUID));
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  async update(
    userIdToUpdate: string,
    updateUserData: UpdateUserSchema,
  ): Promise<UserMinimalSchema> {
    const db = this.connectionManager.acquire();
    const fields = [];
    const values = [];

    const fieldMap: Partial<UserDTO> = {
      name: "name",
    };

    for (const key in updateUserData) {
      const value = updateUserData[key as keyof UpdateUserSchema];
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
      stmt.run(...values, userIdToUpdate);

      // Return the updated note
      return (await this.getByID(userIdToUpdate))!;
    } catch (err) {
      if (err instanceof Error) console.error("SQL error: ", err.message);
      throw err;
    } finally {
      this.connectionManager.release(db);
    }
  }

  async delete(id: string): Promise<void> {
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
