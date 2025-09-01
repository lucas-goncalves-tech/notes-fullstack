import { BaseError } from "./base.error";

export class UnauthorizedError extends BaseError {
  constructor() {
    super(401, "Acesso não autorizado");
  }
}
