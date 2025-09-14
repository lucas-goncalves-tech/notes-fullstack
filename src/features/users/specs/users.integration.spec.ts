import "reflect-metadata";

import path from "node:path";
import fs from "node:fs";

import { UsersRepository } from "../users.repository";
import BetterSqlite3, { Database } from "better-sqlite3";
import { ConnectionManager } from "../../../database/pool";

describe("UserRepository Integration Tests", () => {
  let db: Database;
  let usersRepository: UsersRepository;

  beforeAll(() => {
    db = new BetterSqlite3(":memory:");
    const migrationDir = path.join(__dirname, "../../../database/migrations/");
    const migrationFiles = fs.readdirSync(migrationDir).sort();

    for (const file of migrationFiles) {
      const sql = fs.readFileSync(path.join(migrationDir, file), "utf-8");
      db.exec(sql);
    }
    const connectionManager = new ConnectionManager(db);
    usersRepository = new UsersRepository(connectionManager);
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(() => {
    db.prepare(`DELETE FROM "users"`).run();
  });

  it("should create a new user and find it by id", () => {
    const userData = {
      name: "John Doe",
      email: "xesquedele@test.com",
    };

    const user = usersRepository.create(userData);

    const foundUser = usersRepository.getByID(user.id);

    expect(foundUser).toBeDefined();
    expect(foundUser.name).toBe(userData.name);
    expect(foundUser.email).toBe(userData.email);
  });

  it("should return on empty array when no users exist", () => {
    const users = usersRepository.getAll();

    expect(users).toEqual([]);
  });
});
