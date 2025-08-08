import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import htmlSanitizer from "../../middlewares/utils/htmlSanitizer.js";
import validateSchema from "../../middlewares/joi/validateSchema.js";
import { AuthService } from "../../middlewares/utils/authService.js";
import { EventController } from "../controllers/eventController.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../../middlewares/joi/schemas/event.js";

export function createEventRouter(
  controller: EventController,
  authService: AuthService,
): Router {
  const router: Router = Router();

  router.get("/events", (req, res, next) => {
    controller.getAll(req, res, next);
  });

  router.get("/events/enriched", (req, res, next) => {
    controller.getAllEnriched(req, res, next);
  });

  router.get("/event/:eventId", validateUUID, (req, res, next) => {
    controller.getOne(req, res, next);
  });

  router.get("/event/:eventId/enriched", validateUUID, (req, res, next) => {
    controller.getOneEnriched(req, res, next);
  });

  router.post(
    "/user/:userId/event",
    validateUUID,
    authService.checkPermission,
    htmlSanitizer,
    validateSchema(createEventSchema),
    (req, res, next) => {
      controller.post(req, res, next);
    },
  );

  router.post(
    "/event/:eventId/addCharacters",
    validateUUID,
    htmlSanitizer,
    (req, res, next) => {
      controller.addCharactersToEvent(req, res, next);
    },
  );

  router.post(
    "/event/:eventId/removeCharacters",
    validateUUID,
    htmlSanitizer,
    (req, res, next) => {
      controller.removeCharactersFromEvent(req, res, next);
    },
  );

  router
    .route("/user/:userId/event/:eventId")
    .patch(
      validateUUID,
      authService.checkPermission,
      htmlSanitizer,
      validateSchema(updateEventSchema),
      (req, res, next) => {
        controller.update(req, res, next);
      },
    )
    .delete(validateUUID, authService.checkPermission, (req, res, next) => {
      controller.delete(req, res, next);
    });

  return router;
}
