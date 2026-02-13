import { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error:
      "Muitas tentativas a partir deste IP. Por favor, tente novamente após 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const protectedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    error:
      "Muitas requisições. Por favor, aguarde um pouco antes de continuar.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req: Request) => {
    if (req.user && typeof req.user.id === "string") {
      return req.user.id;
    }
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    return ipKeyGenerator(ip);
  },
});
