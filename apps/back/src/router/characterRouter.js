import { Router } from "express";
const characterRouter = Router();

import { characterController } from "../controllers/characterController.js";
import { validateInt } from "../middlewares/validateInt.js";

characterRouter.post("/character", characterController.post);

characterRouter.route("/character/:id")
  .get(validateInt, characterController.getOne)
  .patch(validateInt, characterController.update)
  .delete(validateInt, characterController.delete);

export { characterRouter };
