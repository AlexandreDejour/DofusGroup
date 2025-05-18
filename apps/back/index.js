import express from "express";
import "dotenv/config";

import { router } from "./src/router/index.js";

const app = express();

app.use(router);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server listening on: http://localhost:${port}`);
});