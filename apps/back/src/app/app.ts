import "dotenv/config";
import express from "express";
import { Express } from "express";

const app: Express = express();

app.set("port", process.env.PORT ?? "3000");
app.set("base_url", process.env.BASE_URL ?? "");
app.set("pg_url", process.env.PG_URL ?? "");

app.use(express.json());

export { app };
