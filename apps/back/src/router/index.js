import { Router } from "express";
const router =  Router();

import { serverRouter } from "./serverRouter.js";
import { tagRouter } from "./tagRouter.js";

router.get("/", (_req, res) => {
    res.sendFile("index.html", {
        root: "../../../front"
    });
});

router.use(serverRouter);
router.use(tagRouter);

export { router };