import { BaseError } from "./base.error";

export class BadRequestError extends BaseError {
  constructor(message = "Requisição inválida", details?: unknown) {
    super(400, message, details);
  }
}
