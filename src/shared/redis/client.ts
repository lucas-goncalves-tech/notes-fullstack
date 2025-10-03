import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Conectar ao Redis ao iniciar a aplicação.
// Você pode chamar redisClient.connect() no seu arquivo principal (server.ts).
export default redisClient;
