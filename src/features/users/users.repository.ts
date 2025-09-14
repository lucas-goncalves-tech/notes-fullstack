import { CreateUserSchema } from "./dtos/create-user.dto";
import { randomUUID } from "crypto";
import { UserSchema } from "./dtos/user.dto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";

@injectable()
export class UsersRepository {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
  ) {}

  create(user: CreateUserSchema): UserSchema["email"] {
    const db = this.connectionManager.acquire();
    const UUID = randomUUID();
    try {
      const stmt = db.prepare(
        `INSERT INTO "users" ("id", "name", "email") VALUES(?,?,?)`,
      );
      stmt.run(UUID, user.name, user.email);

      return user.email as UserSchema["email"];
    } catch (error) {
      if (error instanceof Error) console.error("SQL error: ", error.message);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }
}
