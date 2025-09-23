import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { RegisterUserDTO } from "./dtos/register-user.dto";

@injectable()
export class AuthController {
  constructor(@inject("AuthService") private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const user = req.body as RegisterUserDTO;
    const newUser = await this.authService.register(user);

    res.status(201).json(newUser);
  };
}
