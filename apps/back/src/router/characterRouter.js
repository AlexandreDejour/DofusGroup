import { Router } from "express";
const characterRouter = Router();

import { validateSchema } from "../joi/validateSchema.js";
import { createSchema, updateSchema } from "../joi/character.js";

import { validateInt } from "../middlewares/validateInt.js";
import { htmlSanitizer } from "../middlewares/htmlSanitizer.js";
import { characterController } from "../controllers/characterController.js";

characterRouter.post("/character",
    htmlSanitizer,
    validateSchema(createSchema),
    characterController.post
);

characterRouter.route("/character/:id")
  .get(validateInt, characterController.getOne)
  .patch(validateInt, htmlSanitizer, validateSchema(updateSchema), characterController.update)
  .delete(validateInt, characterController.delete);

export { characterRouter };
