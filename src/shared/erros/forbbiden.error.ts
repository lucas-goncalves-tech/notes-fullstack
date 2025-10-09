import { BaseError } from "./base.error";

export class ForbbidenError extends BaseError {
  constructor(message = "Você não tem permissao para acessar esse conteudo") {
    super(403, message);
  }
}
