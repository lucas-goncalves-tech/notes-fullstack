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

    const { accessToken } = await this.authService.login(credentials);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(204).end();
  };

  me = (req: Request, res: Response) => {
    const userPayload = req.user;

    res.json(userPayload);
  };

  logout = (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    res.status(204).end();
  };
}
