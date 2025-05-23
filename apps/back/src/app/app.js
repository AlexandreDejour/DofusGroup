import "dotenv/config"
import express from "express";

const app = express();

app.set("port", process.env.PORT);
app.set("base_url", process.env.BASE_URL);

app.use(express.json());

export { app };