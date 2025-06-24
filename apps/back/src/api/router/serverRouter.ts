import { Router } from "express";

import validateInt from "../../middlewares/utils/validateInt.js";
import { serverController } from "../controllers/serverController.js";

const serverRouter: Router = Router();
const ServerController = serverController;

serverRouter.get("/servers", ServerController.getAll);

serverRouter.get("/server/:id", validateInt, ServerController.getOne);

export default serverRouter;
