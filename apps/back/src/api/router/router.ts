import { Router } from "express";
const router: Router = Router();

import { Request, Response } from "express";

import serverRouter from "./serverRouter.js";

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello DofusGroup");
});

router.use(serverRouter);

export default router;
