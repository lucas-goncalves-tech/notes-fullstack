import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import "./database/migrate";
import router from "./routes";
import { requestLogger } from "./shared/middleware/logger.middleware";
import { errorHandler } from "./shared/middleware/error-handler.middleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./shared/config/swagger";

dotenv.config();

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

app.use(errorHandler);

export default app;
