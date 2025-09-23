import { UsersRepository } from "./users.repository";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { NotesRepository } from "../notes/notes.repository";
import { CreateNoteSchema } from "../notes/dtos/create-note.dto";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { ConflictError } from "../../shared/erros/conflict.error";
import { UserDTO } from "./dtos/user.dto";
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

  async createWithWelcomeNote(user: CreateUserDTO): Promise<UserDTO> {
    const db = this.connectionManager.acquire();
    try {
      const userExists = await this.usersRepository.getByEmail(user.email);
      if (userExists) {
        throw new ConflictError("Usuário já existe");
      }

      db.exec(`BEGIN TRANSACTION`);
      const createdUser = await this.usersRepository.create(user);
      const noteDate: CreateNoteSchema = {
        user_id: createdUser.id,
        title: "Bem vindo",
        description: "Seja bem-vindo ao NoteSphere",
        importance: "baixo",
      };

      await this.notesRepository.create(noteDate);

      db.exec(`COMMIT`);
      return createdUser;
    } catch (error) {
      if (error instanceof ConflictError) throw error;
      db.exec(`ROLLBACK`);
      throw error;
    } finally {
      this.connectionManager.release(db);
    }
  }

  async getAll(): Promise<UserDTO[]> {
    const allUsers = await this.usersRepository.getAll();
    if (!Array.isArray(allUsers)) {
      throw new InternalServerError();
    }
    return allUsers;
  }

  async getByID(id: string): Promise<UserDTO> {
    const user = await this.usersRepository.getByID(id);
    if (!user) {
      throw new NotFoundError("Usuário");
    }
    return user;
  }

  async update(id: string, user: UpdateUserSchema): Promise<UserDTO> {
    const userExists = await this.usersRepository.getByID(id);
    if (!userExists) {
      throw new NotFoundError("Usuário");
    }
    const updatedUser = this.usersRepository.update(id, user);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    try {
      const userExists = await this.usersRepository.getByID(id);
      if (!userExists) {
        throw new NotFoundError("Usuário");
      }
      await this.usersRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
