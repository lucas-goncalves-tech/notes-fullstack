import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorized.error";
import jwt, {
  JsonWebTokenError,
  Secret,
  TokenExpiredError,
} from "jsonwebtoken";
import { jwtPayloadSchema } from "../../features/auth/dtos/jwt-payload.dto";
import { InternalServerError } from "../errors/interval-server.error";

const JWT_SECRET = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não foi definido em .env");
}

export async function authMiddleware(
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
    const safePayload = jwtPayloadSchema.safeParse(payload);
    if (safePayload.success) {
      req.user = safePayload.data;
    } else {
      throw new InternalServerError();
    }
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      throw new UnauthorizedError();
    }
    throw err;
  }
}
