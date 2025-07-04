import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import { CharacterController } from "../controllers/characterController.js";

const characterRouter: Router = Router();
const controller: CharacterController = new CharacterController();

characterRouter.get(
  "/user/:userId/characters",
  validateUUID,
  (req, res, next) => {
    controller.getAllByUserId(req, res, next);
  },
);

characterRouter.get(
  "/user/:userId/characters/enriched",
  validateUUID,
  (req, res, next) => {
    controller.getAllByUserIdEnriched(req, res, next);
  },
);

characterRouter.post(
  "/user/:userId/character",
  validateUUID,
  (req, res, next) => {
    controller.post(req, res, next);
  },
);

characterRouter
  .route("/user/:userId/character/:characterId")
  .get(validateUUID, (req, res, next) => {
    controller.getOneByUserId(req, res, next);
  })
  .patch(validateUUID, (req, res, next) => {
    controller.update(req, res, next);
  })
  .delete(validateUUID, (req, res, next) => {
    controller.delete(req, res, next);
  });

characterRouter.get(
  "/user/:userId/character/enriched/:characterId",
  validateUUID,
  (req, res, next) => {
    controller.getOneByUserIdEnriched(req, res, next);
  },
);

export default characterRouter;
