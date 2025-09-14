import "reflect-metadata";

import BetterSqlite3, { Database } from "better-sqlite3";
import { NotesRepository } from "../notes.repository";
import fs from "node:fs";
import path from "node:path";
import { CreateNoteSchema } from "../dtos/create-note.dto";
import { UpdateNoteSchema } from "../dtos/update-note.dto";
import { ConnectionManager } from "../../../database/pool";

xdescribe("TasksRepository Integration Tests", () => {
  let db: Database;
  let notesRepository: NotesRepository;

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
  });

  afterAll(() => {
    db.close();
  });

  beforeEach(() => {
    db.prepare(`DELETE FROM "notes"`).run();
  });

  it("should create a new note and find it by id", () => {
    const noteData: CreateNoteSchema = {
      title: "Test Note",
      description: "Test Description",
      importance: "baixo",
    };

    const newNote = notesRepository.create(noteData);
    const foundNote = notesRepository.findById(newNote.id);

    expect(newNote).toBeDefined();
    expect(typeof newNote.id).toBe("string");
    expect(newNote.title).toBe(noteData.title);
    expect(newNote.description).toBe(noteData.description);
    expect(foundNote).toBeDefined();
  });

  it("should return on empty array when no tasks exist", () => {
    const notes = notesRepository.getAll();

    expect(notes).toEqual([]);
  });

  it("should return all created notes", () => {
    const noteData1: CreateNoteSchema = {
      title: "Test Note 1",
      description: "Test Description 1",
      importance: "baixo",
    };
    const noteData2: CreateNoteSchema = {
      title: "Test Note 2",
      description: "Test Description 2",
      importance: "baixo",
    };

    const newNote1 = notesRepository.create(noteData1);
    const newNote2 = notesRepository.create(noteData2);
    const notes = notesRepository.getAll();

    const notesArray = [newNote1, newNote2];

    expect(notes).toHaveLength(2);
    expect(notes).toEqual(notesArray);
  });

  it("should update an existing note", () => {
    const noteData: CreateNoteSchema = {
      title: "Test Note 1",
      description: "Test Description 1",
      importance: "baixo",
    };

    const updatedData: UpdateNoteSchema = {
      title: "Updated Note",
      description: "Updated description",
      completed: 1,
    };

    const newNote = notesRepository.create(noteData);
    const updatedNote = notesRepository.update(newNote.id, updatedData);

    expect(updatedNote.title).toBe(updatedData.title);
    expect(updatedNote.description).toBe(updatedData.description);
    expect(updatedNote.completed).toBe(updatedData.completed);
  });

  it("sould delete a note", () => {
    const noteData: CreateNoteSchema = {
      title: "Test Note 1",
      description: "Test Description 1",
      importance: "baixo",
    };

    const newNote = notesRepository.create(noteData);
    notesRepository.delete(newNote.id);
    const foundNote = notesRepository.findById(newNote.id);

    expect(foundNote).toBeUndefined();
  });
});
