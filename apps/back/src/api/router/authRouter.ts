import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import hashPassword from "../../middlewares/utils/hashPassword.js";
import htmlSanitizer from "../../middlewares/utils/htmlSanitizer.js";
import validateSchema from "../../middlewares/joi/validateSchema.js";
import { AuthService } from "../../middlewares/utils/authService.js";
import { AuthController } from "../controllers/authController.js";
import { createUserSchema } from "../../middlewares/joi/schemas/user.js";
import { loginSchema } from "../../middlewares/joi/schemas/auth.js";
import { requestLimiter } from "../../middlewares/utils/requestLimiter.js";

export function createAuthRouter(
  controller: AuthController,
  authService: AuthService,
): Router {
  const router: Router = Router();

  router.post(
    "/auth/register",
    htmlSanitizer,
    validateSchema(createUserSchema),
    hashPassword,
    (req, res, next) => {
      controller.register(req, res, next);
    },
  );

  router.post(
    "/auth/login",
    requestLimiter,
    htmlSanitizer,
    validateSchema(loginSchema),
    (req, res, next) => {
      controller.login(req, res, next);
    },
  );

  router.post("/auth/logout", (req, res, next) => {
    controller.logout(req, res, next);
  });

  router.get("/auth/me", (req, res, next) => {
    controller.apiMe(req, res, next);
  });

  router.post("/auth/refresh-token", (req, res) => {
    controller.refreshToken(req, res);
  });

  router.get(
    "/auth/:userId/account",
    validateUUID,
    authService.checkPermission,
    (req, res, next) => {
      controller.getAccount(req, res, next);
    },
  );

  return router;
}
