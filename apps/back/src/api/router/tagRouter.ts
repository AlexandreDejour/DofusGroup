import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import { TagController } from "../controllers/tagController.js";

export function createTagRouter(controller: TagController): Router {
  const router: Router = Router();

  router.get("/tags", (req, res, next) => {
    controller.getAll(req, res, next);
  });

  router.get("/tag/:tagId", validateUUID, (req, res, next) => {
    controller.getOne(req, res, next);
  });

  return router;
}
