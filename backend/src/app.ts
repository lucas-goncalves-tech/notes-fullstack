import "./database/migrate";
import "reflect-metadata";
import "./shared/config/container";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routes";
import { requestLogger } from "./shared/middleware/logger.middleware";
import { errorHandler } from "./shared/middleware/error-handler.middleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./shared/config/swagger";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

app.use(errorHandler);

export default app;
