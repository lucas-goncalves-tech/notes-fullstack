import { UsersRepository } from "./users.repository";
import { NotesRepository } from "../notes/notes.repository";
import { inject, injectable } from "tsyringe";
import { ConnectionManager } from "../../database/pool";
import { UserMinimalSchema } from "./dtos/user.dto";
import { InternalServerError } from "../../shared/erros/interval-server.error";
import { NotFoundError } from "../../shared/erros/not-found.error";
import { UpdateUserSchema } from "./dtos/update-user.dto";
import { ForbbidenError } from "../../shared/erros/forbbiden.error";
import { JWTPayloadDTO } from "../auth/dtos/jwt-payload.dto";

@injectable()
export class UsersService {
  constructor(
    @inject("ConnectionManager") private connectionManager: ConnectionManager,
    @inject("UsersRepository") private usersRepository: UsersRepository,
    @inject("NotesRepository") private notesRepository: NotesRepository,
  ) {}

  async getAll(): Promise<UserMinimalSchema[]> {
    const allUsers = await this.usersRepository.getAll();
    if (!Array.isArray(allUsers)) {
      throw new InternalServerError();
    }
    return allUsers;
  }

  async getByID(id: string): Promise<UserMinimalSchema> {
    const user = await this.usersRepository.getByID(id);
    if (!user) {
      throw new NotFoundError("Usuário");
    }
    return user;
  }

  async update(
    autheticaedUser: JWTPayloadDTO | undefined,
    userIdToUpdate: string,
    updateUserData: UpdateUserSchema,
  ): Promise<UserMinimalSchema> {
    const userExists = await this.usersRepository.getByID(userIdToUpdate);
    if (!autheticaedUser || !userExists) throw new NotFoundError("Usuário");
    if (
      autheticaedUser.role !== "admin" &&
      userIdToUpdate !== autheticaedUser.id
    ) {
      throw new ForbbidenError();
    }
    const updatedUser = await this.usersRepository.update(
      userIdToUpdate,
      updateUserData,
    );
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
