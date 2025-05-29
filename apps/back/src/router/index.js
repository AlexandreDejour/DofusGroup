import { Router } from "express";
const router =  Router();

import { tagRouter } from "./tagRouter.js";
import { userRouter } from "./userRouter.js";
import { breedRouter } from "./breedRouter.js";
import { eventRouter } from "./eventRouter.js";
import { serverRouter } from "./serverRouter.js";
import { characterRouter } from "./characterRouter.js";

router.get("/", (_req, res) => {
    res.sendFile("index.html", {
        root: "../../../front"
    });
});

router.use(tagRouter);
router.use(userRouter);
router.use(breedRouter);
router.use(eventRouter);
router.use(serverRouter);
router.use(characterRouter);

export { router };