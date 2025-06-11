import { Router } from "express";

import { Request, Response } from "express";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello DofusGroup");
});

export { router };
