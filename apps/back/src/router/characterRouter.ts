import { Router } from "express";
const characterRouter: Router = Router();

import validateInt from "../utils/validateInt.js";
import htmlSanitizer from "../utils/htmlSanitizer.js";
import validateSchema from "../joi/validateSchema.js";
import {
  createCharacterSchema,
  updateCharacterSchema,
} from "../joi/character.js";
import { characterController } from "../controllers/characterController.js";

characterRouter.get(
  "/user/:userId/characters",
  validateInt,
  characterController.getAllByUserId.bind(characterController),
);

characterRouter.get(
  "/user/:userId/characters/enriched",
  validateInt,
  characterController.getAllByUserIdEnriched.bind(characterController),
);

characterRouter.post(
  "/user/:userId/character",
  validateInt,
  htmlSanitizer,
  validateSchema(createCharacterSchema),
  characterController.post.bind(characterController),
);

characterRouter
  .route("/user/:userId/character/:characterId")
  .get(
    validateInt,
    characterController.getOneByUserId.bind(characterController),
  )
  .patch(
    validateInt,
    htmlSanitizer,
    validateSchema(updateCharacterSchema),
    characterController.update.bind(characterController),
  )
  .delete(validateInt, characterController.delete.bind(characterController));

characterRouter.get(
  "/user/:userId/character/:characterId/enriched",
  validateInt,
  characterController.getOneByUserIdEnriched.bind(characterController),
);

export default characterRouter;
