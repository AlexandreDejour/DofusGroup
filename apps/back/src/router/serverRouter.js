import { Router } from "express";
const serverRouter = Router();

import { serverController } from "../controllers/serverController.js";
import { validateInt } from "../middlewares/validateInt.js";


serverRouter.get("/servers", serverController.getAll);
serverRouter.get("/server/:id", validateInt, serverController.getOne);

export { serverRouter };
