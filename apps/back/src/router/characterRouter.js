import { Router } from "express";
const characterRouter = Router();

import { validateSchema } from "../joi/validateSchema.js";
import { createSchema, updateSchema } from "../joi/user.js";

import { validateInt } from "../middlewares/validateInt.js";
import { characterController } from "../controllers/characterController.js";

characterRouter.post("/character", validateSchema(createSchema), characterController.post);

characterRouter.route("/character/:id")
  .get(validateInt, characterController.getOne)
  .patch(validateInt, validateSchema(updateSchema), characterController.update)
  .delete(validateInt, characterController.delete);

export { characterRouter };
