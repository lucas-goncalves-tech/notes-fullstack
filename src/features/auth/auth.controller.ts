import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AuthService } from "./auth.service";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { LoginUserDTO } from "./dtos/login-user.dto";

@injectable()
export class AuthController {
  constructor(@inject("AuthService") private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const user = req.body as RegisterUserDTO;
    const newUser = await this.authService.register(user);

    res.status(201).json(newUser);
  };

  login = async (req: Request, res: Response) => {
    const credentials = req.body as LoginUserDTO;

    const jwt_token = await this.authService.login(credentials);

    res.json({
      token: jwt_token,
    });
  };

  getProfile = (req: Request, res: Response) => {
    const userPayload = req.user;

    res.json(userPayload);
  };
}
