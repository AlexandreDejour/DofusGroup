import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import htmlSanitizer from "../../middlewares/utils/htmlSanitizer.js";
import validateSchema from "../../middlewares/joi/validateSchema.js";
import { CharacterController } from "../controllers/characterController.js";
import {
  createCharacterSchema,
  updateCharacterSchema,
} from "../../middlewares/joi/schemas/character.js";

const characterRouter: Router = Router();
const controller: CharacterController = new CharacterController();

characterRouter.get(
  "/user/:userId/characters",
  validateUUID,
  (req, res, next) => {
    controller.getAllByUserId(req, res, next);
  },
);

characterRouter.get(
  "/user/:userId/characters/enriched",
  validateUUID,
  (req, res, next) => {
    controller.getAllByUserIdEnriched(req, res, next);
  },
);

characterRouter.post(
  "/user/:userId/character",
  validateUUID,
  htmlSanitizer,
  validateSchema(createCharacterSchema),
  (req, res, next) => {
    controller.post(req, res, next);
  },
);

characterRouter
  .route("/user/:userId/character/:characterId")
  .get(validateUUID, (req, res, next) => {
    controller.getOneByUserId(req, res, next);
  })
  .patch(
    validateUUID,
    htmlSanitizer,
    validateSchema(updateCharacterSchema),
    (req, res, next) => {
      controller.update(req, res, next);
    },
  )
  .delete(validateUUID, (req, res, next) => {
    controller.delete(req, res, next);
  });

characterRouter.get(
  "/user/:userId/character/enriched/:characterId",
  validateUUID,
  (req, res, next) => {
    controller.getOneByUserIdEnriched(req, res, next);
  },
);

export default characterRouter;
