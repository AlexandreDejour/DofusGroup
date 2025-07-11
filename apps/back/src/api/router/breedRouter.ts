import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import { BreedController } from "../controllers/breedController.js";

export function createBreedRouter(controller: BreedController): Router {
  const router: Router = Router();

  router.get("/breeds", (req, res, next) => {
    controller.getAll(req, res, next);
  });

  router.get("/breed/:breedId", validateUUID, (req, res, next) => {
    controller.getOne(req, res, next);
  });

  return router;
}
