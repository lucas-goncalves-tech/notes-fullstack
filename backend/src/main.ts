import app from "./app";
import { Server } from "http";

const PORT = process.env.PORT || 3333;

const server: Server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`[${signal}] Received. Shutting down gracefully...`);
  server.close(() => {
    console.log("Http server closed.");
    process.exit(0);
  });
  server.closeAllConnections();
  setTimeout(() => {
    console.log("Forçando fechamento do servidor...");
    process.exit(1);
  }, 5000).unref();
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
