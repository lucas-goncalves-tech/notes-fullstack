import app from "./app";
import { Server } from "http";

const PORT = process.env.PORT || 3333;

const server: Server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`[${signal}] Received. Shutting down gracefully...`);
  server.close(() => {
    console.log("Http server closed.");
    // Aqui você fecharia outras conexões, como com o banco de dados.
    process.exit(0);
  });
};

// Lidar com o sinal de interrupção (Ctrl+C)
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Lidar com o sinal de término (padrão do Docker/K8s)
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Lidar com exceções não capturadas para evitar que o servidor quebre
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // É uma boa prática desligar o servidor após uma exceção não capturada
  // pois o estado da aplicação pode estar corrompido.
  process.exit(1);
});
