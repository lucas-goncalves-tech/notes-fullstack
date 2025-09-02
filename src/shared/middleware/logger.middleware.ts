import { pinoHttp } from "pino-http";
import { logger } from "../logger";

// export function requestLogger(req: Request, res: Response, next: NextFunction) {
//   const { method, originalUrl } = req;
//   const startTime = Date.now();

//   res.on("finish", () => {
//     const { statusCode } = res;
//     const duration = Date.now() - startTime;

//     console.log(
//       `[${method}] | ${originalUrl} - status code: ${statusCode} | (${duration}ms)`,
//     );
//   });

//   next();
// }

export const requestLogger = pinoHttp(logger);
