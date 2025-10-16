import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita cada IP a 10 requisições por janela de tempo
  message:
    "Muitas tentativas de login a partir deste IP, por favor, tente novamente após 15 minutos",
  standardHeaders: true, // Retorna a informação do limite nos cabeçalhos `RateLimit-*`
  legacyHeaders: false, // Desativa os cabeçalhos `X-RateLimit-*` (legado)
});
