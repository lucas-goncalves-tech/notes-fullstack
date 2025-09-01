import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  const startTime = Date.now();

  res.on("finish", () => {
    const { statusCode } = res;
    const duration = Date.now() - startTime;

    console.log(
      `[${method}] | ${originalUrl} - status code: ${statusCode} | (${duration}ms)`,
    );
  });

  next();
}
