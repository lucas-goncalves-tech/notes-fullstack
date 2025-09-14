import "./database/migrate";
import "reflect-metadata";
import "./shared/config/container";

import express from "express";
import cors from "cors";

import router from "./routes";
import { requestLogger } from "./shared/middleware/logger.middleware";
import { errorHandler } from "./shared/middleware/error-handler.middleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./shared/config/swagger";

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

app.use(errorHandler);

export default app;
