import { Router } from "express";
const eventRouter = Router();

import { validateSchema } from "../joi/validateSchema.js";
import { createSchema, updateSchema } from "../joi/character.js";

import { validateInt } from "../middlewares/validateInt.js";
import { eventController } from "../controllers/eventController.js";

eventRouter.get("/events", eventController.getAll)

eventRouter.post("/event", validateSchema(createSchema), eventController.post);

eventRouter.route("/event/:id")
  .get(validateInt, eventController.getOne)
  .patch(validateInt, validateSchema(updateSchema), eventController.update)
  .delete(validateInt, eventController.delete);

export { eventRouter };
