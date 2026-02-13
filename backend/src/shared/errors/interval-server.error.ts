import { BaseError } from "./base.error";

export class InternalServerError extends BaseError {
  constructor(message = "Erro interno do servidor", details?: unknown) {
    super(500, message, details);
  }
}
