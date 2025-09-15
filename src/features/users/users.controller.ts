import { Request, Response } from "express";
import { CreateUserSchema } from "./dtos/create-user.dto";
//import { UpdateUserSchema } from "./dtos/update-user.dto";
//import { UserParamsSchema } from "./dtos/user-params.dto";
import { UserSchemaType } from "./dtos/user.dto";
import { inject, injectable } from "tsyringe";
import { UsersService } from "./users.service";
import { UserParamsSchema } from "./dtos/user-params.dto";
import { UpdateUserSchema } from "./dtos/update-user.dto";

@injectable()
export class UsersController {
  constructor(@inject("UsersService") private usersService: UsersService) {}

  create = async (
    req: Request<object, UserSchemaType, CreateUserSchema>,
    res: Response,
  ) => {
    // TODO: Task list for implementation
    const user = req.body;
    // 2. Call service to create user with welcome note
    const createduser = await this.usersService.createWithWelcomeNote(user);
    res.status(201).json(createduser);
  };

  getAll = (req: Request, res: Response) => {
    // TODO: Task list for implementation
    // 1. Call service to get all users
    const AllUsers = this.usersService.getAll();
    res.json(AllUsers);
  };

  getById = (req: Request<UserParamsSchema>, res: Response<UserSchemaType>) => {
    // TODO: Task list for implementation
    // 1. Validate request params using userParamsSchema
    const { id } = req.params;
    const user = this.usersService.getByID(id);
    res.json(user);
  };

  update = (
    req: Request<UserParamsSchema, UserSchemaType, UpdateUserSchema>,
    res: Response,
  ) => {
    // TODO: Task list for implementation
    const { id } = req.params;
    const updatedUserData = req.body;

    // 3. Call service to update user
    const updatedUser = this.usersService.update(id, updatedUserData);
    res.json(updatedUser);
  };

  delete = (req: Request<UserParamsSchema>, res: Response) => {
    try {
      // TODO: Task list for implementation
      const { id } = req.params;

      // 2. Call service to delete user
      this.usersService.delete(id);
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  };
}
