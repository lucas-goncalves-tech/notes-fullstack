import { NextFunction, Request, Response } from "express";
import chalk from "chalk";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const statusColor =
      status >= 500 ? chalk.red : status >= 400 ? chalk.yellow : chalk.green;

    console.log(
      `${chalk.gray(new Date().toISOString())} | ${chalk.cyan(method)} ${chalk.white(
        originalUrl,
      )} | ${statusColor(status)} | ${duration}ms`,
    );
  });

  next();
}
