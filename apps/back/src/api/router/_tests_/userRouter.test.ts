import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import status from "http-status";
import jwt from "jsonwebtoken";

import { Config } from "../../../config/config.js";
import { setup, receivedReq } from "./mock-tools.js";
import { createUserRouter } from "../userRouter.js";
import { UserController } from "../../controllers/userController.js";
import { AuthService } from "../../../middlewares/utils/authService.js";
import { UserRepository } from "../../../middlewares/repository/userRepository.js";
import { AuthController } from "../../controllers/authController.js";
import { AuthRepository } from "../../../middlewares/repository/authRepository.js";
import { MailService } from "../../../middlewares/nodemailer/nodemailer.js";

describe("userRouter", () => {
  const repository = {} as UserRepository;
  const authRepository = {} as AuthRepository;
  const service = new AuthService();
  const controller = new UserController(repository);
  const mailService = new MailService();
  const authController = new AuthController(
    service,
    authRepository,
    repository,
    mailService,
  );
  let app: ReturnType<typeof setup.App>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = setup.App<UserController, [AuthController, AuthService]>(
      controller,
      createUserRouter,
      {
        routerFactoryArgs: [authController, service],
      },
    );
  });

  const config = Config.getInstance();
  const secret = config.jwtSecret;
  const userId = "527be2f3-5903-4a98-a47d-e4bd593db73e";
  const token = jwt.sign({ id: userId }, secret, { expiresIn: "2h" });

  describe("GET /users", () => {
    it("Propagate request to userController.getAll", async () => {
      //GIVEN
      controller.getAll = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/users`);
      //THEN
      expect(controller.getAll).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAll = setup.mockNextCall();

      const res = await request(app).get(`/users`);

      expect(controller.getAll).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /user/:userId", () => {
    it("Propagate request to userController.getOne", async () => {
      //GIVEN
      controller.getOne = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/user/${userId}`);
      //THEN
      expect(controller.getOne).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getOne = setup.mockNextCall();

      const res = await request(app).get(`/user/${userId}`);

      expect(controller.getOne).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234");

      expect(controller.getOne).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("GET /users/enriched", () => {
    it("Propagate request to userController.getAllEnriched", async () => {
      //GIVEN
      controller.getAllEnriched = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/users/enriched`);
      //THEN
      expect(controller.getAllEnriched).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAllEnriched = setup.mockNextCall();

      const res = await request(app).get(`/users/enriched`);

      expect(controller.getAllEnriched).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /user/:userId/enriched", () => {
    it("Propagate request to userController.getOneEnriched", async () => {
      //GIVEN
      controller.getOneEnriched = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).get(`/user/${userId}/enriched`);
      //THEN
      expect(controller.getOneEnriched).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getOneEnriched = setup.mockNextCall();

      const res = await request(app).get(`/user/${userId}/enriched`);

      expect(controller.getOneEnriched).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app).get("/user/1234/enriched");

      expect(controller.getOneEnriched).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });
  });

  describe("PATCH /user/:userId", () => {
    it("Propagate request to userController.update", async () => {
      //GIVEN
      authController.isPasswordMatch = setup.mockNextCall();
      controller.update = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app)
        .patch(`/user/${userId}`)
        .send({
          password: "!SuperS3cr3t",
          confirmPassword: "!SuperS3cr3t",
          oldPassword: "!0ldPassword",
          mail: "mail@example.com",
        })
        .set("Content-Type", "application/json")
        .set("Cookie", [`access_token=${token}`]);
      //THEN
      expect(controller.update).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      authController.isPasswordMatch = setup.mockNextCall();
      controller.update = setup.mockNextCall();

      const res = await request(app)
        .patch(`/user/${userId}`)
        .send({
          password: "!SuperS3cr3t",
          confirmPassword: "!SuperS3cr3t",
          oldPassword: "!0ldPassword",
          mail: "mail@example.com",
        })
        .set("Content-Type", "application/json")
        .set("Cookie", [`access_token=${token}`]);

      expect(controller.update).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app)
        .patch("/user/1234")
        .set("Cookie", [`token=${token}`]);

      expect(controller.update).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });

    it("Rejects unauthorized request when token userId ≠ params", async () => {
      const otherUserId = "9da844de-dcc1-4b39-a4cf-19d800f4c122";

      const res = await request(app)
        .patch(`/user/${otherUserId}`)
        .set("Cookie", [`access_token=${token}`]);

      expect(controller.update).not.toHaveBeenCalled();
      expect(res.status).toBe(status.FORBIDDEN);
      expect(res.body).toEqual({ error: "Forbidden access" });
    });
  });

  describe("DELETE /user/:userId", () => {
    it("Propagate request to userController.delete", async () => {
      //GIVEN
      controller.delete = setup.mockSucessCall(status.NO_CONTENT);
      //WHEN
      const res = await request(app)
        .delete(`/user/${userId}`)
        .set("Cookie", [`access_token=${token}`]);
      //THEN
      expect(controller.delete).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.NO_CONTENT);
      expect(res.body).toEqual({});
    });

    it("Next is called at end route.", async () => {
      controller.delete = setup.mockNextCall();

      const res = await request(app)
        .delete(`/user/${userId}`)
        .set("Cookie", [`access_token=${token}`]);

      expect(controller.delete).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });

    it("Excluded bad request when id isn't a UUID.", async () => {
      const res = await request(app)
        .delete("/user/1234")
        .set("Cookie", [`access_token=${token}`]);

      expect(controller.delete).not.toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
    });

    it("Rejects unauthorized request when token userId ≠ params", async () => {
      const otherUserId = "9da844de-dcc1-4b39-a4cf-19d800f4c122";

      const res = await request(app)
        .delete(`/user/${otherUserId}`)
        .set("Cookie", [`access_token=${token}`]);

      expect(controller.delete).not.toHaveBeenCalled();
      expect(res.status).toBe(status.FORBIDDEN);
      expect(res.body).toEqual({ error: "Forbidden access" });
    });
  });
});
