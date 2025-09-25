import { Request, Response } from "express";
import { UserDTO } from "./dtos/user.dto";
import { inject, injectable } from "tsyringe";
import { UsersService } from "./users.service";
import { UserParamsSchema } from "./dtos/user-params.dto";
import { UpdateUserSchema } from "./dtos/update-user.dto";

@injectable()
export class UsersController {
  constructor(@inject("UsersService") private usersService: UsersService) {}

  getAll = async (req: Request, res: Response) => {
    // TODO: Task list for implementation
    // 1. Call service to get all users
    const AllUsers = await this.usersService.getAll();
    res.json(AllUsers);
  };

  getById = async (req: Request<UserParamsSchema>, res: Response<UserDTO>) => {
    // TODO: Task list for implementation
    // 1. Validate request params using userParamsSchema
    const { id } = req.params;
    const user = await this.usersService.getByID(id);
    res.json(user);
  };

  update = async (
    req: Request<UserParamsSchema, UserDTO, UpdateUserSchema>,
    res: Response,
  ) => {
    // TODO: Task list for implementation
    const { id } = req.params;
    const updatedUserData = req.body;

    // 3. Call service to update user
    const updatedUser = await this.usersService.update(id, updatedUserData);
    res.json(updatedUser);
  };

  delete = async (req: Request<UserParamsSchema>, res: Response) => {
    try {
      // TODO: Task list for implementation
      const { id } = req.params;

      // 2. Call service to delete user
      await this.usersService.delete(id);
      res.status(204).send();
    } catch (error) {
      throw error;
    }
  };
}
