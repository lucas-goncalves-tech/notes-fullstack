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

    const tokens = await this.authService.login(credentials);

    res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        accessToken: tokens.accessToken,
      });
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    const accessToken = await this.authService.refreshToken(refreshToken);

    res.json({
      accessToken: accessToken,
    });
  };

  me = (req: Request, res: Response) => {
    const userPayload = req.user;

    res.json(userPayload);
  };

  logout = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    await this.authService.logout(token);

    res.clearCookie("refreshToken").status(204).end();
  };
}
