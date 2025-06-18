import { Router } from "express";
const characterRouter: Router = Router();

import validateInt from "../utils/validateInt.js";
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
  validateSchema(createCharacterSchema),
  characterController.postCharacter.bind(characterController),
);

characterRouter
  .route("/user/:userId/character/:characterId")
  .get(
    validateInt,
    characterController.getOneByUserId.bind(characterController),
  )
  .patch(
    validateInt,
    validateSchema(updateCharacterSchema),
    characterController.patchCharacter.bind(characterController),
  )
  .delete(
    validateInt,
    characterController.deleteCharacter.bind(characterController),
  );

characterRouter.get(
  "/user/:userId/character/:characterId/enriched",
  validateInt,
  characterController.getOneByUserIdEnriched.bind(characterController),
);

export default characterRouter;
