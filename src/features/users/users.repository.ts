import { Database } from "better-sqlite3";
import { CreateUserSchema } from "./dtos/create-user.dto";
import { randomUUID } from "crypto";
import { UserSchema } from "./dtos/user.dto";

export class UsersRepository {
  constructor(private db: Database) {}

  create(user: CreateUserSchema): UserSchema["email"] {
    const UUID = randomUUID();
    try {
      const stmt = this.db.prepare(
        `INSERT INTO "users" ("id", "name", "email") VALUES(?,?,?)`,
      );
      stmt.run(UUID, user.name, user.email);

      return user.email as UserSchema["email"];
    } catch (error) {
      throw error;
    }
  }
}
