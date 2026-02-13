import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";
import { BadRequestError } from "../errors/bad-request.error";

type ValidationSchemas = {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
};

const validate =
  (schemas: ValidationSchemas) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const errors: { path: string; message: string }[] = [];
    try {
      if (schemas.body) await schemas.body.parseAsync(req.body);
      if (schemas.params) await schemas.params.parseAsync(req.params);
      if (schemas.query) await schemas.query.parseAsync(req.query);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        errors.push(
          ...error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        );

        throw new BadRequestError("Erro na validação", errors);
      }
      next(error);
    }
  };

export { validate };
