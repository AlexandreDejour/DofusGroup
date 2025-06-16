import { Router, type Router as ExpressRouter } from "express";
const serverRouter: ExpressRouter = Router();

import serverController from "../controllers/serverController.js";

serverRouter.get("/servers", serverController.getAll.bind(serverController));
serverRouter.get("/server/:id", serverController.getOne.bind(serverController));

export default serverRouter;
