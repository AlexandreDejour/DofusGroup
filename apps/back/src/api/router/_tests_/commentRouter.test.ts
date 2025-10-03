import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import status from "http-status";
import jwt from "jsonwebtoken";

import { Config } from "../../../config/config.js";
import { setup, receivedReq } from "./mock-tools.js";
import { AuthService } from "../../../middlewares/utils/authService.js";
import { createCommentRouter } from "../commentRouter.js";
import { CommentController } from "../../controllers/commentController.js";
import { CommentRepository } from "../../../middlewares/repository/commentRepository.js";

describe("commentRouter", () => {
  const repository = {} as CommentRepository;
  const controller = new CommentController(repository);
  const service = new AuthService();
  let app: ReturnType<typeof setup.App>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use((req, res, next) => {
      service.setAuthUserRequest(req, res, next);
    });
    app.use(createCommentRouter(controller, service));
    app.use((_req, res) => {
      res.status(status.NOT_FOUND).json({ called: "next" });
    });
  });

  const config = Config.getInstance();
  const secret = config.jwtSecret;
  const userId = "f0256483-0827-4cd5-923a-6bd10a135c4e";
  const commentId = "18d99a7c-1d47-4391-bacd-cc4848165768";
  const token = jwt.sign({ id: userId }, secret, { expiresIn: "2h" });

  describe("GET /user/:userId/comments", () => {
    it("Propagate request to commentController.getAllByUserId", async () => {
      //GIVEN
      controller.getAllByUserId = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/user/${userId}/comments`);
      //THEN
      expect(controller.getAllByUserId).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAllByUserId = setup.mockNextCall();

      const res = await request(app).get(`/user/${userId}/comments`);

      expect(controller.getAllByUserId).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/comments");

      expect(controller.getAllByUserId).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/comment/:commentId", () => {
    it("Propagate request to commentController.getOneByUserId", async () => {
      //GIVEN
      controller.getOneByUserId = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(
        `/user/${userId}/comment/${commentId}`,
      );
      //THEN
      expect(controller.getOneByUserId).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(receivedReq?.params.commentId).toBe(commentId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getOneByUserId = setup.mockNextCall();

      const res = await request(app).get(
        `/user/${userId}/comment/${commentId}`,
      );

      expect(controller.getOneByUserId).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/comment/toto");

      expect(controller.getOneByUserId).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/comments/enriched", () => {
    it("Propagate request to commentController.getAllByUserIdEnriched", async () => {
      //GIVEN
      controller.getAllEnrichedByUserId = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/user/${userId}/comments/enriched`);
      //THEN
      expect(controller.getAllEnrichedByUserId).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAllEnrichedByUserId = setup.mockNextCall();

      const res = await request(app).get(`/user/${userId}/comments/enriched`);

      expect(controller.getAllEnrichedByUserId).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/comments/enriched");

      expect(controller.getAllEnrichedByUserId).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /user/:userId/comment/enriched/:commentId", () => {
    it("Propagate request to commentController.getOneByUserIdEnriched", async () => {
      //GIVEN
      controller.getOneEnrichedByUserId = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(
        `/user/${userId}/comment/enriched/${commentId}`,
      );
      //THEN
      expect(controller.getOneEnrichedByUserId).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(receivedReq?.params.commentId).toBe(commentId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getOneEnrichedByUserId = setup.mockNextCall();

      const res = await request(app).get(
        `/user/${userId}/comment/enriched/${commentId}`,
      );

      expect(controller.getOneEnrichedByUserId).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/comment/enriched/toto");

      expect(controller.getOneEnrichedByUserId).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("POST /user/:userId/comment", () => {
    it("Propagate request to commentController.post", async () => {
      //GIVEN
      controller.post = setup.mockSucessCall(status.CREATED);
      //WHEN
      const res = await request(app)
        .post(`/user/${userId}/comment`)
        .set("Cookie", [`token=${token}`]);
      //THEN
      expect(controller.post).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.CREATED);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.post = setup.mockNextCall();

      const res = await request(app)
        .post(`/user/${userId}/comment`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.post).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app)
        .post("/user/1234/comment")
        .set("Cookie", [`token=${token}`]);

      expect(controller.post).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });

    it("Rejects unauthorized request when token userId ≠ params", async () => {
      const otherUserId = "9da844de-dcc1-4b39-a4cf-19d800f4c122";

      const res = await request(app)
        .post(`/user/${otherUserId}/comment`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.post).not.toHaveBeenCalled();
      expect(res.status).toBe(status.FORBIDDEN);
      expect(res.body).toEqual({ error: "Forbidden access" });
    });
  });

  describe("PATCH /user/:userId/comment/:commentId", () => {
    it("Propagate request to commentController.update", async () => {
      //GIVEN
      controller.update = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app)
        .patch(`/user/${userId}/comment/${commentId}`)
        .set("Cookie", [`token=${token}`]);
      //THEN
      expect(controller.update).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(receivedReq?.params.commentId).toBe(commentId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.update = setup.mockNextCall();

      const res = await request(app)
        .patch(`/user/${userId}/comment/${commentId}`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.update).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app)
        .patch("/user/1234/comment/toto")
        .set("Cookie", [`token=${token}`]);

      expect(controller.update).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });

    it("Rejects unauthorized request when token userId ≠ params", async () => {
      const otherUserId = "9da844de-dcc1-4b39-a4cf-19d800f4c122";

      const res = await request(app)
        .patch(`/user/${otherUserId}/comment/${commentId}`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.update).not.toHaveBeenCalled();
      expect(res.status).toBe(status.FORBIDDEN);
      expect(res.body).toEqual({ error: "Forbidden access" });
    });
  });

  describe("DELETE /user/:userId/comment/:commentId", () => {
    it("Propagate request to commentController.delete", async () => {
      //GIVEN
      controller.delete = setup.mockSucessCall(status.NO_CONTENT);
      //WHEN
      const res = await request(app)
        .delete(`/user/${userId}/comment/${commentId}`)
        .set("Cookie", [`token=${token}`]);
      //THEN
      expect(controller.delete).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(receivedReq?.params.commentId).toBe(commentId);
      expect(res.status).toBe(status.NO_CONTENT);
      expect(res.body).toEqual({});
    });

    it("Next is called at end route.", async () => {
      controller.delete = setup.mockNextCall();

      const res = await request(app)
        .delete(`/user/${userId}/comment/${commentId}`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.delete).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app)
        .delete("/user/1234/comment/toto")
        .set("Cookie", [`token=${token}`]);

      expect(controller.delete).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });

    it("Rejects unauthorized request when token userId ≠ params", async () => {
      const otherUserId = "9da844de-dcc1-4b39-a4cf-19d800f4c122";

      const res = await request(app)
        .delete(`/user/${otherUserId}/comment/${commentId}`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.delete).not.toHaveBeenCalled();
      expect(res.status).toBe(status.FORBIDDEN);
      expect(res.body).toEqual({ error: "Forbidden access" });
    });
  });
});
