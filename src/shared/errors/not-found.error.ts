import { BaseError } from "./base.error";

export class NotFoundError extends BaseError {
  constructor(prefix = "Recurso") {
    super(404, `${prefix} não encontrado`);
  }
}
