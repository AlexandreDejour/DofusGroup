import { Router } from "express";
const router: Router = Router();

import { Request, Response } from "express";

import serverRouter from "./serverRouter.js";
import characterRouter from "./characterRouter.js";

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello DofusGroup");
});

router.use(serverRouter);
router.use(characterRouter);

export default router;
