import "express";
import { UserPayloadDTO } from "../../modules/users/dtos/user.dto";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayloadDTO;
  }
}
