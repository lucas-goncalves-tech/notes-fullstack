import { UsersRepository } from "./users.repository";
import { NotesRepository } from "../notes/notes.repository";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
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
