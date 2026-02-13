import { randomUUID } from "crypto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { UserDTO, userMinimalSchema, UserMinimalSchema } from "./dtos/user.dto";
import { CreateUserDTO } from "./dtos/create-user.dto";

@injectable()
export class UsersRepository {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
  ) {}

  async getByID(id: string): Promise<UserDTO | undefined> {
    const db = this.connectionManager.acquire();
    const sql = `SELECT * FROM "users" WHERE "id" = ?`;
    try {
      const stmt = db.prepare(sql);
      return stmt.get(id) as UserDTO | undefined;
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
}
