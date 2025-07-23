import { Router } from "express";

import validateUUID from "../../middlewares/utils/validateUUID.js";
import htmlSanitizer from "../../middlewares/utils/htmlSanitizer.js";
import validateSchema from "../../middlewares/joi/validateSchema.js";
import { CommentController } from "../controllers/commentController.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../../middlewares/joi/schemas/comment.js";

export function createCommentRouter(controller: CommentController): Router {
  const router: Router = Router();

  router.get("/user/:userId/comments", validateUUID, (req, res, next) => {
    controller.getAllByUserId(req, res, next);
  });

  router.get(
    "/user/:userId/comments/enriched",
    validateUUID,
    (req, res, next) => {
      controller.getAllEnrichedByUserId(req, res, next);
    },
  );

  router.post(
    "/user/:userId/comment",
    validateUUID,
    htmlSanitizer,
    validateSchema(createCommentSchema),
    (req, res, next) => {
      controller.post(req, res, next);
    },
  );

  router
    .route("/user/:userId/comment/:commentId")
    .get(validateUUID, (req, res, next) => {
      controller.getOneByUserId(req, res, next);
    })
    .patch(
      validateUUID,
      htmlSanitizer,
      validateSchema(updateCommentSchema),
      (req, res, next) => {
        controller.update(req, res, next);
      },
    )
    .delete(validateUUID, (req, res, next) => {
      controller.delete(req, res, next);
    });

  router.get(
    "/user/:userId/comment/enriched/:commentId",
    validateUUID,
    (req, res, next) => {
      controller.getOneEnrichedByUserId(req, res, next);
    },
  );

  return router;
}
