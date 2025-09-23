import "reflect-metadata";

import fs from "node:fs";
import path from "node:path";
import BetterSqlite3, { Database } from "better-sqlite3";
import { NotesRepository } from "../notes.repository";
import { UsersRepository } from "../../users/users.repository";

import { CreateNoteSchema } from "../dtos/create-note.dto";
import { UpdateNoteSchema } from "../dtos/update-note.dto";
import { ConnectionManager } from "../../../database/pool";

describe("TasksRepository Integration Tests", () => {
  let db: Database;
  let notesRepository: NotesRepository;
  let usersRepository: UsersRepository;
  let testUserID: string;

  beforeAll(() => {
    db = new BetterSqlite3(":memory:");
    const migrationDir = path.join(__dirname, "../../../database/migrations/");
    const migrationFiles = fs.readdirSync(migrationDir).sort();

    for (const file of migrationFiles) {
      const sql = fs.readFileSync(path.join(migrationDir, file), "utf-8");
      db.exec(sql);
    }
    const connectionManager = new ConnectionManager(db);
    notesRepository = new NotesRepository(connectionManager);
    usersRepository = new UsersRepository(connectionManager);
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(async () => {
    db.prepare(`DELETE FROM "notes"`).run();
    db.prepare(`DELETE FROM "users"`).run();

    const user = await usersRepository.create({
      email: "test@example.com",
      name: "Ronaldinho",
    });

    testUserID = user.id;
  });

  it("should create a new note and find it by id", async () => {
    const noteData: CreateNoteSchema = {
      user_id: testUserID,
      title: "Test Note",
      description: "Test Description",
      importance: "baixo",
    };

    const newNote = await notesRepository.create(noteData);
    const foundNote = await notesRepository.getByID(newNote.id);

    expect(newNote).toBeDefined();
    expect(typeof newNote.id).toBe("string");
    expect(newNote.title).toBe(noteData.title);
    expect(newNote.description).toBe(noteData.description);
    expect(foundNote).toBeDefined();
  });

  it("should return on empty array when no tasks exist", async () => {
    const notes = await notesRepository.getAll();

    expect(notes).toEqual([]);
  });

  it("should return all created notes", async () => {
    const noteData1: CreateNoteSchema = {
      user_id: testUserID,
      title: "Test Note 1",
      description: "Test Description 1",
      importance: "baixo",
    };
    const noteData2: CreateNoteSchema = {
      user_id: testUserID,
      title: "Test Note 2",
      description: "Test Description 2",
      importance: "baixo",
    };

    const newNote1 = await notesRepository.create(noteData1);
    const newNote2 = await notesRepository.create(noteData2);
    const notes = await notesRepository.getAll();

    const notesArray = [newNote1, newNote2];

    expect(notes).toHaveLength(2);
    expect(notes).toEqual(notesArray);
  });

  it("should update an existing note", async () => {
    const noteData: CreateNoteSchema = {
      user_id: testUserID,
      title: "Test Note 1",
      description: "Test Description 1",
      importance: "baixo",
    };

    const updatedData: UpdateNoteSchema = {
      user_id: testUserID,
      title: "Updated Note",
      description: "Updated description",
      completed: 1,
    };

    const newNote = await notesRepository.create(noteData);
    const updatedNote = await notesRepository.update(newNote.id, updatedData);

    expect(updatedNote).toBeDefined();
    expect(updatedNote!.title).toBe(updatedData.title);
    expect(updatedNote!.description).toBe(updatedData.description);
    expect(updatedNote!.completed).toBe(updatedData.completed);
  });

  it("sould delete a note", async () => {
    const noteData: CreateNoteSchema = {
      user_id: testUserID,
      title: "Test Note 1",
      description: "Test Description 1",
      importance: "baixo",
    };

    const newNote = await notesRepository.create(noteData);
    await notesRepository.delete(newNote.id);
    const foundNote = await notesRepository.getByID(newNote.id);

    expect(foundNote).toBeUndefined();
  });
});
