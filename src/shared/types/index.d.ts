import "express";
import { JWTPayloadDTO } from "../../features/auth/dtos/jwt-payload.dto";

declare module "express-serve-static-core" {
  interface Request {
    user?: JWTPayloadDTO;
  }
}
