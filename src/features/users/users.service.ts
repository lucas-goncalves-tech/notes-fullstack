import { UsersRepository } from "./users.repository";
import { CreateUserSchema } from "./dtos/create-user.dto";
import { NotesRepository } from "../notes/notes.repository";
import { CreateNoteSchema } from "../notes/dtos/create-note.dto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";

@injectable()
export class UsersService {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
    @inject("UsersRepository") private usersRepository: UsersRepository,
    @inject("NotesRepository") private notesRepository: NotesRepository,
  ) {}

  createWithWelcomeNote(user: CreateUserSchema) {
    const db = this.connectionManager.acquire();
    const noteDate: CreateNoteSchema = {
      title: "Bem vindo",
      description: "Seja bem-vindo ao NoteSphere",
      importance: "baixo",
    };
    try {
      db.exec(`BEGIN TRANSACTION`);

      this.usersRepository.create(user);
      this.notesRepository.create(noteDate);

      db.exec(`COMMIT`);
    } catch (error) {
      db.exec(`ROLLBACK`);
      throw error;
    }
  }
}
