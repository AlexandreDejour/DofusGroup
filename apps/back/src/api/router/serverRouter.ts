import { Router } from "express";

import validateInt from "../../middlewares/utils/validateInt.js";
import { ServerController } from "../controllers/serverController.js";

const serverRouter: Router = Router();
const controller: ServerController = new ServerController();

serverRouter.get("/servers", controller.getAll);

serverRouter.get("/server/:id", validateInt, controller.getOne);

export default serverRouter;
