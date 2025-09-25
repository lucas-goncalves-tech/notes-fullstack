import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../erros/unauthorized.error";
import jwt, {
  JsonWebTokenError,
  Secret,
  TokenExpiredError,
} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não foi definido em .env");
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }
  const jwt_token = token.split(" ")[1];

  try {
    const payload = jwt.verify(jwt_token, JWT_SECRET) as jwt.JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      throw new UnauthorizedError("Token inválido ou expirado!");
    }
    throw err;
  }
}
