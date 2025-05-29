import "dotenv/config"
import express from "express";

const app = express();

app.set("port", process.env.PORT);
app.set("base_url", process.env.BASE_URL);
app.set("pg_url", process.env.PG_URL);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

export { app };
