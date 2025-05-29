import { Router } from "express";
const tagRouter = Router();

import { tagController } from "../controllers/tagController.js";
import { validateInt } from "../middlewares/validateInt.js";


tagRouter.get("/tags", tagController.getAll);
tagRouter.get("/tag/:id", validateInt, tagController.getOne);

export { tagRouter };
