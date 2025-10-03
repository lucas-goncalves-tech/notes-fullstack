import { BaseError } from "./base.error";

export class UnauthorizedError extends BaseError {
  constructor(message = "Token inválido ou expirado!") {
    super(401, message);
  }
}
