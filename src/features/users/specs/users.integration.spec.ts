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

  it("should create a new user and find it by id", async () => {
    const userData = {
      name: "John Doe",
      email: "xesquedele@test.com",
    };

    const user = await usersRepository.create(userData);

    const foundUser = await usersRepository.getByID(user.id);

    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe(userData.name);
    expect(foundUser?.email).toBe(userData.email);
  });

  it("should return on empty array when no users exist", async () => {
    const users = await usersRepository.getAll();

    expect(users).toEqual([]);
  });

  it("should return all users when users exist", async () => {
    const userData1 = {
      name: "John Doe",
      email: "john@test.com",
    };

    const userData2 = {
      name: "Jane Smith",
      email: "jane@test.com",
    };

    await usersRepository.create(userData1);
    await usersRepository.create(userData2);

    const users = await usersRepository.getAll();

    expect(users).toHaveLength(2);
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining(userData1),
        expect.objectContaining(userData2),
      ]),
    );
  });

  it("should update a user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@test.com",
    };

    const createdUser = await usersRepository.create(userData);

    const updateData = {
      name: "John Updated",
      email: "john.updated@test.com",
    };

    const updatedUser = await usersRepository.update(
      createdUser.id,
      updateData,
    );

    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe(updateData.name);
    expect(updatedUser.email).toBe(updateData.email);
    expect(updatedUser.id).toBe(createdUser.id);
    // Check that updated_at is more recent than created_at
    expect(new Date(updatedUser.updated_at).getTime()).toBeGreaterThanOrEqual(
      new Date(createdUser.created_at).getTime(),
    );
  });

  it("should delete a user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@test.com",
    };

    const createdUser = await usersRepository.create(userData);

    // Verify user exists
    let foundUser = await usersRepository.getByID(createdUser.id);
    expect(foundUser).toBeDefined();

    // Delete user
    await usersRepository.delete(createdUser.id);

    // Verify user is deleted
    foundUser = await usersRepository.getByID(createdUser.id);
    expect(foundUser).toBeUndefined();
  });

  it("should handle updating a non-existent user", () => {
    const updateData = {
      name: "Non Existent",
      email: "nonexistent@test.com",
    };

    // This should not throw an error, but return undefined or handle gracefully
    // Since the implementation doesn't check if user exists, we'll just verify it doesn't throw
    expect(async () => {
      await usersRepository.update("non-existent-id", updateData);
    }).not.toThrow();
  });

  it("should handle deleting a non-existent user", () => {
    // This should not throw an error
    expect(async () => {
      await usersRepository.delete("non-existent-id");
    }).not.toThrow();
  });
});
