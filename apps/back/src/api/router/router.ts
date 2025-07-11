import { Router } from "express";
const router: Router = Router();

import { Request, Response } from "express";

import { createBreedRouter } from "./breedRouter.js";
import { BreedController } from "../controllers/breedController.js";
import { BreedRepository } from "../../middlewares/repository/breedRepository.js";
import { createServerRouter } from "./serverRouter.js";
import { ServerController } from "../controllers/serverController.js";
import { ServerRepository } from "../../middlewares/repository/serverRepository.js";
import { createCharacterRouter } from "./characterRouter.js";
import { CharacterController } from "../controllers/characterController.js";
import { CharacterRepository } from "../../middlewares/repository/characterRepository.js";

const breedController = new BreedController(new BreedRepository());
const serverController = new ServerController(new ServerRepository());
const characterController = new CharacterController(new CharacterRepository());

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello DofusGroup");
});

router.use(createBreedRouter(breedController));
router.use(createServerRouter(serverController));
router.use(createCharacterRouter(characterController));

export default router;
