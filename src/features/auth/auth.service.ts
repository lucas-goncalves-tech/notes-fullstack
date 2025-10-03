import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { UsersRepository } from "../users/users.repository";
import { ConflictError } from "../../shared/erros/conflict.error";
import { LoginPayloadDTO, LoginUserDTO } from "./dtos/login-user.dto";
import { UnauthorizedError } from "../../shared/erros/unauthorized.error";
import { userMinimalSchema } from "../users/dtos/user.dto";
import { InternalServerError } from "../../shared/erros/interval-server.error";
import { RefreshTokenDTO } from "./dtos/refresh-token.dto";
import { NotFoundError } from "../../shared/erros/not-found.error";
import { jwtPayloadSchema } from "./dtos/jwt-payload.dto";
import { BlackListService } from "../../shared/serves/blacklist.service";

type JWTSIGNOPTIONS = "5m" | "10m" | "15m";

@injectable()
export class AuthService {
  private salt: number;
  private JWT_SECRET: string;
  private JWT_EXPIRES_IN: JWTSIGNOPTIONS;
  private JWT_REFRESH_SECRET: string;
  private JWT_REFRESH_EXPIRES_IN: JWTSIGNOPTIONS;
  constructor(
    @inject("UsersRepository") private readonly userRepository: UsersRepository,
  ) {
    this.salt = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10");
    this.JWT_SECRET = process.env.JWT_SECRET ?? "";
    this.JWT_EXPIRES_IN =
      (process.env.JWT_EXPIRES_IN as JWTSIGNOPTIONS) ?? "5m";
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "";
    this.JWT_REFRESH_EXPIRES_IN =
      (process.env.JWT_REFRESH_EXPIRES_IN as JWTSIGNOPTIONS) ?? "10m";
  }

  async register(credentials: RegisterUserDTO) {
    const userExist = await this.userRepository.getByEmail(credentials.email);
    if (userExist) throw new ConflictError("Email already in use");

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
      const refresh_payload: RefreshTokenDTO = {
        UUID: crypto.randomUUID(),
        user_id: payload.data.id,
      };
      const accessToken = jwt.sign(payload.data, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
      });
      const refreshToken = jwt.sign(refresh_payload, this.JWT_REFRESH_SECRET, {
        expiresIn: this.JWT_REFRESH_EXPIRES_IN,
      });

      return { accessToken, refreshToken };
    } else {
      throw new InternalServerError();
    }
  }

  async refreshToken(refreshToken: string | undefined) {
    if (!refreshToken) throw new UnauthorizedError();

    try {
      const refreshPayload = jwt.verify(
        refreshToken,
        this.JWT_REFRESH_SECRET,
      ) as RefreshTokenDTO;
      const userExist = await this.userRepository.getByID(
        refreshPayload.user_id,
      );
      if (!userExist) throw new NotFoundError("Usuário");

      const payload = userMinimalSchema.safeParse(userExist);
      if (payload.success) {
        const accessToken = jwt.sign(payload.data, this.JWT_SECRET, {
          expiresIn: this.JWT_EXPIRES_IN,
        });

        return accessToken;
      } else {
        throw new InternalServerError();
      }
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  }

  async logout(accessToken: string | undefined) {
    if (!accessToken) throw new UnauthorizedError();
    try {
      const payload = jwtPayloadSchema.safeParse(jwt.decode(accessToken));

      if (payload.success) {
        const expiresIn = payload.data.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
          const blackList = new BlackListService();
          blackList.addToBlackList(accessToken, expiresIn);
        }
      } else {
        throw new InternalServerError();
      }
    } catch (error) {
      throw error;
    }
  }
}
