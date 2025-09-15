import { UsersRepository } from "./users.repository";
import { CreateUserSchema } from "./dtos/create-user.dto";
import { NotesRepository } from "../notes/notes.repository";
import { CreateNoteSchema } from "../notes/dtos/create-note.dto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { ConflictError } from "../../shared/erros/conflict.error";
import { UserSchemaType } from "./dtos/user.dto";
import { InternalServerError } from "../../shared/erros/interval-server.error";
import { NotFoundError } from "../../shared/erros/not-found.error";
import { UpdateUserSchema } from "./dtos/update-user.dto";

@injectable()
export class UsersService {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
    @inject("UsersRepository") private usersRepository: UsersRepository,
    @inject("NotesRepository") private notesRepository: NotesRepository,
  ) {}

  async createWithWelcomeNote(user: CreateUserSchema): Promise<UserSchemaType> {
    const db = this.connectionManager.acquire();
    try {
      const userExists = this.usersRepository.getByEmail(user.email);
      if (userExists) {
        throw new ConflictError("Usuário já existe");
      }

      db.exec(`BEGIN TRANSACTION`);
      const createdUser = await this.usersRepository.create(user);
      const noteDate: CreateNoteSchema = {
        userID: createdUser.id,
        title: "Bem vindo",
        description: "Seja bem-vindo ao NoteSphere",
        importance: "baixo",
      };

      await this.notesRepository.create(noteDate);

      db.exec(`COMMIT`);
      return createdUser;
    } catch (error) {
      db.exec(`ROLLBACK`);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  getAll(): UserSchemaType[] {
    const allUsers = this.usersRepository.getAll();
    if (!Array.isArray(allUsers)) {
      throw new InternalServerError();
    }
    return allUsers;
  }

  getByID(id: string): UserSchemaType {
    const user = this.usersRepository.getByID(id);
    if (!user) {
      throw new NotFoundError("Usuário");
    }
    return user;
  }

  update(id: string, user: UpdateUserSchema): UserSchemaType {
    const userExists = this.usersRepository.getByID(id);
    if (!userExists) {
      throw new NotFoundError("Usuário");
    }
    const updatedUser = this.usersRepository.update(id, user);
    return updatedUser;
  }

  delete(id: string): void {
    try {
      const userExists = this.usersRepository.getByID(id);
      if (!userExists) {
        throw new NotFoundError("Usuário");
      }
      this.usersRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
