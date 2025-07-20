import express from "express";
import { Express } from "express";

import { Config } from "./src/config/config.js";
import router from "./src/api/router/router.js";
import { notFound } from "./src/middlewares/utils/errorHandler.js";
import { errorHandler } from "./src/middlewares/utils/errorHandler.js";

const app: Express = express();
const config = Config.getInstance();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.info(`Listening on ${config.baseUrl}:${config.port}`);
});
