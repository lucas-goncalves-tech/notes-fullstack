import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { UsersRepository } from "../users/users.repository";
import { ConflictError } from "../../shared/erros/conflict.error";
import { LoginUserDTO } from "./dtos/login-user.dto";
import { UnauthorizedError } from "../../shared/erros/unauthorized.error";
import { userPayloadSchema } from "../users/dtos/user.dto";
import { InternalServerError } from "../../shared/erros/interval-server.error";

type JWTSIGNOPTIONS = "5m" | "10m" | "15m";

@injectable()
export class AuthService {
  private salt: number;
  private JWT_SECRET: string;
  private JWT_EXPIRES_IN: JWTSIGNOPTIONS;
  constructor(
    @inject("UsersRepository") private readonly userRepository: UsersRepository,
  ) {
    this.salt = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10");
    this.JWT_SECRET = process.env.JWT_SECRET ?? "";
    this.JWT_EXPIRES_IN =
      (process.env.JWT_EXPIRES_IN as JWTSIGNOPTIONS) ?? "5m";
  }

  register = async (credentials: RegisterUserDTO) => {
    const userExist = await this.userRepository.getByEmail(credentials.email);
    if (userExist) throw new ConflictError("Email already in use");

    const hashedPassword = await bcrypt.hash(credentials.password, this.salt);
    const newUser = {
      name: credentials.name,
      email: credentials.email,
      password_hash: hashedPassword,
    };

    return await this.userRepository.create(newUser);
  };

  /**
   *
   * @param credentials LoginUserDTO
   * @returns JWT
   */
  login = async (credentials: LoginUserDTO) => {
    const existingUser = await this.userRepository.getByEmail(
      credentials.email,
    );
    if (!existingUser) throw new UnauthorizedError("Email ou senha inválidos");

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      existingUser.password_hash,
    );
    if (!passwordMatch) throw new UnauthorizedError("Email ou senha inválidos");

    const payload = userPayloadSchema.safeParse(existingUser);
    if (payload.success) {
      return jwt.sign(payload.data, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      });
    } else {
      throw new InternalServerError();
    }
  };
}
