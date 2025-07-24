import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import htmlSanitizer from "../../middlewares/utils/htmlSanitizer.js";
import validateSchema from "../../middlewares/joi/validateSchema.js";
import hashPassword from "../../middlewares/utils/hashPassword.js";
import { DataEncryptionService } from "../../middlewares/utils/dataEncryptionService.js";
import { AuthController } from "../controllers/authController.js";
import { createUserSchema } from "../../middlewares/joi/schemas/user.js";

export function createAuthRouter(
  controller: AuthController,
  encrypter: DataEncryptionService,
): Router {
  const router: Router = Router();

  router.post(
    "/register",
    validateUUID,
    htmlSanitizer,
    validateSchema(createUserSchema),
    encrypter.encryptData,
    hashPassword,
    (req, res, next) => {
      controller.register(req, res, next);
    },
  );

  return router;
}
