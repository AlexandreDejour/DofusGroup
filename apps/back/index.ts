import express from "express";
import { Express } from "express";

import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { Config } from "./src/config/config.js";
import router from "./src/api/router/router.js";
import logger from "./src/middlewares/utils/logger.js";
import { notFound } from "./src/middlewares/utils/errorHandler.js";
import { errorHandler } from "./src/middlewares/utils/errorHandler.js";

const app: Express = express();
const config = Config.getInstance();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    hsts: false,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(router);
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.info(`Listening on ${config.baseUrl}:${config.port}`);
});
