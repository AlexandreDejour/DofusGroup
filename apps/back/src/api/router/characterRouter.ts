import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import { CharacterController } from "../controllers/characterController.js";

const characterRouter: Router = Router();
const controller: CharacterController = new CharacterController();

characterRouter.get("/user/:userId/characters", (req, res, next) => {
  validateUUID;
  controller.getAllByUserId(req, res, next);
});

characterRouter.get("/user/:userId/characters/enriched", (req, res, next) => {
  validateUUID;
  controller.getAllByUserIdEnriched(req, res, next);
});

characterRouter.post("/user/:userId/character", (req, res, next) => {
  validateUUID;
  controller.post(req, res, next);
});

characterRouter
  .route("/user/userId/character/:characterId")
  .get((req, res, next) => {
    validateUUID;
    controller.getOneByUserId(req, res, next);
  })
  .patch((req, res, next) => {
    validateUUID;
    controller.update(req, res, next);
  })
  .delete((req, res, next) => {
    validateUUID;
    controller.delete(req, res, next);
  });

characterRouter.get("/user/:userId/character/enriched", (req, res, next) => {
  validateUUID;
  controller.getOneByUserIdEnriched(req, res, next);
});

export default characterRouter;
