import { Router } from "express";
const eventRouter = Router();

import { eventController } from "../controllers/eventController.js";
import { validateInt } from "../middlewares/validateInt.js";

eventRouter.get("/events", eventController.getAll)

eventRouter.post("/event", eventController.post);

eventRouter.route("/event/:id")
  .get(validateInt, eventController.getOne)
  .patch(validateInt, eventController.update)
  .delete(validateInt, eventController.delete);

export { eventRouter };
