import { Router } from "express";
const breedRouter = Router();

import { breedController } from "../controllers/breedController.js";
import { validateInt } from "../middlewares/validateInt.js";


breedRouter.get("/breeds", breedController.getAll);
breedRouter.get("/breed/:id", validateInt, breedController.getOne);

export { breedRouter };
