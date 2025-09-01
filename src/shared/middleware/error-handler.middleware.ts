import { ErrorRequestHandler } from "express";
import { BaseError } from "../erros/base.error";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { error: err.details } : {}),
    });
  }

  return res.status(500).json({
    message: "Erro interno do servidor",
  });
};
