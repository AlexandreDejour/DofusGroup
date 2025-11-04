import { Router } from "express";
const router: Router = Router();

import { models, initAssociations } from "../../database/models/initModels.js";

import { createTagRouter } from "./tagRouter.js";
import { TagController } from "../controllers/tagController.js";
import { TagRepository } from "../../middlewares/repository/tagRepository.js";
import { createAuthRouter } from "./authRouter.js";
import { AuthController } from "../controllers/authController.js";
import { AuthRepository } from "../../middlewares/repository/authRepository.js";
import { MailService } from "../../middlewares/nodemailer/nodemailer.js";
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
import { createCommentRouter } from "./commentRouter.js";
import { CommentRepository } from "../../middlewares/repository/commentRepository.js";
import { CommentController } from "../controllers/commentController.js";
import { CharacterController } from "../controllers/characterController.js";
import { CharacterRepository } from "../../middlewares/repository/characterRepository.js";
import { EventUtils } from "../../middlewares/repository/utils/eventUtils.js";
import { AuthService } from "../../middlewares/utils/authService.js";
import { profanityCleaner } from "../../middlewares/profanity/profanity.js";

initAssociations(models);

const authService = new AuthService();

const tagController = new TagController(new TagRepository());
const authController = new AuthController(
  authService,
  new AuthRepository(),
  new UserRepository(),
  new MailService(),
);
const userController = new UserController(new UserRepository());
const eventController = new EventController(
  new EventRepository(new EventUtils()),
);
const breedController = new BreedController(new BreedRepository());
const serverController = new ServerController(new ServerRepository());
const commentController = new CommentController(new CommentRepository());
const characterController = new CharacterController(new CharacterRepository());

router.use((req, res, next) => {
  authService.setAuthUserRequest(req, res, next);
});

router.use((req, res, next) => profanityCleaner(req, res, next));

router.use(createTagRouter(tagController));
router.use(createAuthRouter(authController, authService));
router.use(createUserRouter(userController, authController, authService));
router.use(createEventRouter(eventController, authService));
router.use(createBreedRouter(breedController));
router.use(createServerRouter(serverController));
router.use(createCommentRouter(commentController, authService));
router.use(createCharacterRouter(characterController, authService));

export default router;
