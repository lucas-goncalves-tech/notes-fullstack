import { inject, injectable } from "tsyringe";
import { RegisterUserDTO } from "./dtos/register-user.dto";
import { UsersRepository } from "../users/users.repository";
import { ConflictError } from "../../shared/erros/conflict.error";
import bcrypt from "bcrypt";

@injectable()
export class AuthService {
  private salt: number;
  constructor(
    @inject("UsersRepository") private readonly userRepository: UsersRepository,
  ) {
    this.salt = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10");
  }

  register = async (user: RegisterUserDTO) => {
    const userExist = await this.userRepository.getByEmail(user.email);
    if (userExist) throw new ConflictError("Email already in use");

    const hashedPassword = await bcrypt.hash(user.password, this.salt);
    const newUser = {
      name: user.name,
      email: user.email,
      password_hash: hashedPassword,
    };

    return await this.userRepository.create(newUser);
  };
}
