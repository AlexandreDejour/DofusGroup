import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import hashPassword from "../../middlewares/utils/hashPassword.js";
import htmlSanitizer from "../../middlewares/utils/htmlSanitizer.js";
import validateSchema from "../../middlewares/joi/validateSchema.js";
import { AuthService } from "../../middlewares/utils/authService.js";
import { DataEncryptionService } from "../../middlewares/utils/dataEncryptionService.js";
import { UserController } from "../controllers/userController.js";
import { AuthController } from "../controllers/authController.js";
import { updateUserSchema } from "../../middlewares/joi/schemas/user.js";

export function createUserRouter(
  controller: UserController,
  authController: AuthController,
  authService: AuthService,
  encrypter: DataEncryptionService,
): Router {
  const router: Router = Router();

  router.get("/users", (req, res, next) => {
    controller.getAll(req, res, next);
  });

  router.get("/users/enriched", (req, res, next) => {
    controller.getAllEnriched(req, res, next);
  });

  router
    .route("/user/:userId")
    .get(validateUUID, (req, res, next) => {
      controller.getOne(req, res, next);
    })
    .patch(
      validateUUID,
      authService.checkPermission,
      htmlSanitizer,
      validateSchema(updateUserSchema),
      (req, res, next) => {
        authController.isPasswordMatch(req, res, next);
      },
      encrypter.encryptData,
      hashPassword,
      (req, res, next) => {
        controller.update(req, res, next);
      },
    )
    .delete(validateUUID, authService.checkPermission, (req, res, next) => {
      controller.delete(req, res, next);
    });

  router.get("/user/:userId/enriched", validateUUID, (req, res, next) => {
    controller.getOneEnriched(req, res, next);
  });

  return router;
}
