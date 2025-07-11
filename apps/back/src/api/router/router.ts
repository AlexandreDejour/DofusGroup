import { Router } from "express";
const router: Router = Router();

import { Request, Response } from "express";

import serverRouter from "./serverRouter.js";
import { createCharacterRouter } from "./characterRouter.js";
import { CharacterController } from "../controllers/characterController.js";
import { CharacterRepository } from "../../middlewares/repository/characterRepository.js";

const characterController = new CharacterController(new CharacterRepository());

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello DofusGroup");
});

router.use(serverRouter);
router.use(createCharacterRouter(characterController));

export default router;
