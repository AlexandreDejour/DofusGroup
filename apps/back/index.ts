import express from "express";
import { Express } from "express";

import { Config } from "./src/config/config.js";
import router from "./src/api/router/router.js";

const app: Express = express();
const config = Config.getInstance();

app.use(express.json());

app.use(router);

app.listen(config.port, () => {
  console.info(`Listening on ${config.baseUrl}:${config.port}`);
});
