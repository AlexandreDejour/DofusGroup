import * as dotenv from "dotenv";
dotenv.config({ path: import.meta.dirname + "/../../.env" });

import express from "express";
import { Express } from "express";

import router from "../router/index.js";
import { notFound, errorHandler } from "../utils/errorHandler.js";

const app: Express = express();

app.set("port", process.env.PORT);
app.set("base_url", process.env.BASE_URL);
app.set("pg_url", process.env.PG_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.use(notFound);
app.use(errorHandler);

export default app;
