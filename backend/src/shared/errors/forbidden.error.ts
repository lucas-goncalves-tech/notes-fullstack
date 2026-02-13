import { BaseError } from "./base.error";

export class ForbiddenError extends BaseError {
  constructor(message = "Você não tem permissao para acessar esse conteudo") {
    super(403, message);
  }
}
