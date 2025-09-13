import { Database } from "better-sqlite3";
import { UsersRepository } from "./users.repository";
import { CreateUserSchema } from "./dtos/create-user.dto";
import { NotesRepository } from "../notes/notes.repository";
import { CreateNoteSchema } from "../notes/dtos/create-note.dto";

export class UsersService {
  constructor(
    private db: Database,
    private usersRepository: UsersRepository,
    private notesRepository: NotesRepository,
  ) {}

  createWithWelcomeNote(user: CreateUserSchema) {
    const noteDate: CreateNoteSchema = {
      title: "Bem vindo",
      description: "Seja bem-vindo ao NoteSphere",
      importance: "baixo",
    };
    try {
      this.db.exec(`BEGIN TRANSACTION`);

      this.usersRepository.create(user);
      this.notesRepository.create(noteDate);

      this.db.exec(`COMMIT`);
    } catch (error) {
      this.db.exec(`ROLLBACK`);
      throw error;
    }
  }
}
