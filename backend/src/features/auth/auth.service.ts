import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { UsersRepository } from "../users/users.repository";
import { ConflictError } from "../../shared/errors/conflict.error";
import { LoginPayloadDTO, LoginUserDTO } from "./dtos/login-user.dto";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { userMinimalSchema } from "../users/dtos/user.dto";
import { InternalServerError } from "../../shared/errors/interval-server.error";

@injectable()
export class AuthService {
  private salt: number;
  private JWT_SECRET: string;
  private JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"];
  constructor(
    @inject("UsersRepository") private readonly userRepository: UsersRepository,
  ) {
    this.salt = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10");
    this.JWT_SECRET = process.env.JWT_SECRET ?? "";
    this.JWT_EXPIRES_IN =
      (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) ?? "1d";
  }

  async register(credentials: RegisterUserDTO) {
    const userExist = await this.userRepository.getByEmail(credentials.email);
    if (userExist) throw new ConflictError("Email já foi cadastrado!");

    const hashedPassword = await bcrypt.hash(credentials.password, this.salt);
    const newUser = {
      name: credentials.name,
      email: credentials.email,
      password_hash: hashedPassword,
    };

    return await this.userRepository.create(newUser);
  }

  async login(credentials: LoginUserDTO): Promise<LoginPayloadDTO> {
    const existingUser = await this.userRepository.getByEmail(
      credentials.email,
    );
    if (!existingUser) throw new UnauthorizedError("Email ou senha inválidos");

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      existingUser.password_hash,
    );
    if (!passwordMatch) throw new UnauthorizedError("Email ou senha inválidos");

    const payload = userMinimalSchema.safeParse(existingUser);
    if (payload.success) {
      const accessToken = jwt.sign(payload.data, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      });
      return { accessToken };
    } else {
      throw new InternalServerError();
    }
  }
}
