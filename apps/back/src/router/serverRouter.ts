import { Router } from "express";
const serverRouter: Router = Router();

import validateInt from "../utils/validateInt.js";
import serverController from "../controllers/serverController.js";

serverRouter.get("/servers", serverController.getAll.bind(serverController));

serverRouter.get(
  "/server/:id",
  validateInt,
  serverController.getOne.bind(serverController),
);

export default serverRouter;
