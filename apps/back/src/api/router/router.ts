import { Router } from "express";
const router: Router = Router();

import { Request, Response } from "express";

import { models, initAssociations } from "../../database/models/initModels.js";

import { createTagRouter } from "./tagRouter.js";
import { TagController } from "../controllers/tagController.js";
import { TagRepository } from "../../middlewares/repository/tagRepository.js";
import { createUserRouter } from "./userRouter.js";
import { UserController } from "../controllers/userController.js";
import { UserRepository } from "../../middlewares/repository/userRepository.js";
import { createEventRouter } from "./eventRouter.js";
import { EventController } from "../controllers/eventController.js";
import { EventRepository } from "../../middlewares/repository/eventRepository.js";
import { createBreedRouter } from "./breedRouter.js";
import { BreedController } from "../controllers/breedController.js";
import { BreedRepository } from "../../middlewares/repository/breedRepository.js";
import { createServerRouter } from "./serverRouter.js";
import { ServerController } from "../controllers/serverController.js";
import { ServerRepository } from "../../middlewares/repository/serverRepository.js";
import { createCharacterRouter } from "./characterRouter.js";
import { CharacterController } from "../controllers/characterController.js";
import { CharacterRepository } from "../../middlewares/repository/characterRepository.js";

import { CryptoService } from "../../middlewares/utils/cryptoService.js";
import { DataEncryptionService } from "../../middlewares/utils/dataEncryptionService.js";

initAssociations(models);

const tagController = new TagController(new TagRepository());
const userController = new UserController(new UserRepository());
const eventController = new EventController(new EventRepository());
const breedController = new BreedController(new BreedRepository());
const serverController = new ServerController(new ServerRepository());
const characterController = new CharacterController(new CharacterRepository());

const dataEncryptionService = new DataEncryptionService(new CryptoService());

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello DofusGroup");
});

router.use(createTagRouter(tagController));
router.use(createUserRouter(userController, dataEncryptionService));
router.use(createEventRouter(eventController));
router.use(createBreedRouter(breedController));
router.use(createServerRouter(serverController));
router.use(createCharacterRouter(characterController));

export default router;
