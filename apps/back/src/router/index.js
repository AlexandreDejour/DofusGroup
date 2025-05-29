import { Router } from "express";
const router =  Router();

import { tagRouter } from "./tagRouter.js";
import { breedRouter } from "./breedRouter.js";
import { serverRouter } from "./serverRouter.js";

router.get("/", (_req, res) => {
    res.sendFile("index.html", {
        root: "../../../front"
    });
});

router.use(tagRouter);
router.use(breedRouter);
router.use(serverRouter);

export { router };