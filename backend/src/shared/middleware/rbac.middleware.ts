import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors/forbidden.error";

type IAllowedRoles = "user" | "admin";

export const authorize =
  (roles: IAllowedRoles[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (userRole && roles.includes(userRole)) {
      next();
    } else {
      throw new ForbiddenError();
    }
  };
