import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import htmlSanitizer from "../../middlewares/utils/htmlSanitizer.js";
import validateSchema from "../../middlewares/joi/validateSchema.js";
import { UserController } from "../controllers/userController.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../../middlewares/joi/schemas/user.js";

export function createUserRouter(controller: UserController): Router {
  const router: Router = Router();

  router.get("/users", validateUUID, (req, res, next) => {
    controller.getAll(req, res, next);
  });

  router.get("/users/enriched", validateUUID, (req, res, next) => {
    controller.getAllEnriched(req, res, next);
  });

  router.post(
    "/user",
    validateUUID,
    htmlSanitizer,
    validateSchema(createUserSchema),
    (req, res, next) => {
      controller.post(req, res, next);
    },
  );

  router
    .route("/user/:userId")
    .get(validateUUID, (req, res, next) => {
      controller.getOne(req, res, next);
    })
    .patch(
      validateUUID,
      htmlSanitizer,
      validateSchema(updateUserSchema),
      (req, res, next) => {
        controller.update(req, res, next);
      },
    )
    .delete(validateUUID, (req, res, next) => {
      controller.delete(req, res, next);
    });

  router.get("/user/:userId/enriched", validateUUID, (req, res, next) => {
    controller.getOneEnriched(req, res, next);
  });

  return router;
}
