import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import { ServerController } from "../controllers/serverController.js";

export function createServerRouter(controller: ServerController): Router {
  const router: Router = Router();

  router.get("/servers", (req, res, next) => {
    controller.getAll(req, res, next);
  });

  router.get("/server/:serverId", validateUUID, (req, res, next) => {
    controller.getOne(req, res, next);
  });

  return router;
}
