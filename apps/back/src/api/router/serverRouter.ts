import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import { ServerController } from "../controllers/serverController.js";

const serverRouter: Router = Router();
const controller: ServerController = new ServerController();

serverRouter.get("/servers", (req, res, next) => {
  controller.getAll(req, res, next);
});

serverRouter.get("/server/:id", validateUUID, (req, res, next) => {
  controller.getOne(req, res, next);
});

export default serverRouter;
