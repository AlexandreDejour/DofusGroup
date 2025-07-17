import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import htmlSanitizer from "../../middlewares/utils/htmlSanitizer.js";
import validateSchema from "../../middlewares/joi/validateSchema.js";
import { EventController } from "../controllers/eventController.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../../middlewares/joi/schemas/event.js";

export function createEventRouter(controller: EventController): Router {
  const router: Router = Router();

  router.get("/events", (req, res, next) => {
    controller.getAll(req, res, next);
  });

  router.get("events/enriched", (req, res, next) => {
    controller.getAllEnriched(req, res, next);
  });

  router.get("/user/:userId/events", validateUUID, (req, res, next) => {
    controller.getAllByUserId(req, res, next);
  });

  router.get(
    "/user/:userId/events/enriched",
    validateUUID,
    (req, res, next) => {
      controller.getAllEnrichedByUserId(req, res, next);
    },
  );

  router.post(
    "/user/:userId/event",
    validateUUID,
    htmlSanitizer,
    validateSchema(createEventSchema),
    (req, res, next) => {
      controller.post(req, res, next);
    },
  );

  router
    .route("/user/:userId/event/:eventId")
    .get(validateUUID, (req, res, next) => {
      controller.getOneByUserId(req, res, next);
    })
    .patch(
      validateUUID,
      htmlSanitizer,
      validateSchema(updateEventSchema),
      (req, res, next) => {
        controller.update(req, res, next);
      },
    )
    .delete(validateUUID, (req, res, next) => {
      controller.delete(req, res, next);
    });

  router.get(
    "/user/:userId/event/enriched/:eventId",
    validateUUID,
    (req, res, next) => {
      controller.getOneEnrichedByUserId(req, res, next);
    },
  );

  return router;
}
