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

  /**
   * Create a new user
   * @param req Request with CreateUserSchema body
   * @param res Response with UserSchema
   */
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

  /**
   * Get all users
   * @param req Request
   * @param res Response with UserSchema array
   */
  getAll = async (req: Request, res: Response) => {
    // TODO: Task list for implementation
    // 1. Call service to get all users
    const AllUsers = await this.usersService.getAll();
    res.json(AllUsers);
  };

  /**
   * Get user by ID
   * @param req Request with UserParamsSchema params
   * @param res Response with UserSchema
   */
  getById = async (
    req: Request<UserParamsSchema>,
    res: Response<UserSchemaType>,
  ) => {
    // TODO: Task list for implementation
    // 1. Validate request params using userParamsSchema
    const { id } = req.params;
    const user = await this.usersService.getByID(id);
    res.json(user);
    // 2. Call service to get user by ID
    // 3. Handle validation errors
    // 4. Handle user not found case
    // 5. Return user with 200 status
    // 6. Handle any service errors
  };

  /**
   * Update user by ID
   * @param req Request with UserParamsSchema params and UpdateUserSchema body
   * @param res Response with UserSchema
   */
  update = async (
    req: Request<UserParamsSchema, UserSchemaType, UpdateUserSchema>,
    res: Response,
  ) => {
    // TODO: Task list for implementation
    const { id } = req.params;
    const updatedUserData = req.body;

    // 3. Call service to update user
    const updatedUser = await this.usersService.update(id, updatedUserData);
    res.json(updatedUser);
  };

  /**
   * Delete user by ID
   * @param req Request with UserParamsSchema params
   * @param res Response with no content
   */
  // delete = (req: Request<UserParamsSchema>, res: Response) => {
  //   // TODO: Task list for implementation
  //   // 1. Validate request params using userParamsSchema
  //   // 2. Call service to delete user
  //   // 3. Handle validation errors
  //   // 4. Handle user not found case
  //   // 5. Return 204 status (no content)
  //   // 6. Handle any service errors
  // };
}
