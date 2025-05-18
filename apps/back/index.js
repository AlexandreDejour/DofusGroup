import express from "express";
import "dotenv/config";

const app = express();

const port = process.env.PORT;

app.get("/", (req, res, next) => {
    res.send("Hello DofusGroup");
});

app.listen(port, () => {
    console.log(`server listening on: http://localhost:${port}`);
});