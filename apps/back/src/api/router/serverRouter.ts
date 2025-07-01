import Express, { Router } from "express";

import validateInt from "../../middlewares/utils/validateInt.js";
import { ServerController } from "../controllers/serverController.js";

const serverRouter: Router = Router();
const controller: ServerController = new ServerController();

serverRouter.get("/servers", (req, res, next) => {
  controller.getAll(req, res, next);
});

serverRouter.get("/server/:id", (req, res, next) => {
  controller.getOne(req, res, next);
});

export default serverRouter;
