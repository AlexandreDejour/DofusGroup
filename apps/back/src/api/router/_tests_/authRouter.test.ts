import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import status from "http-status";
import jwt from "jsonwebtoken";

import { Config } from "../../../config/config.js";
import { setup, receivedReq } from "./mock-tools.js";
import { createAuthRouter } from "../authRouter.js";
import { AuthController } from "../../controllers/authController.js";
import { AuthService } from "../../../middlewares/utils/authService.js";
import { DataEncryptionService } from "../../../middlewares/utils/dataEncryptionService.js";
import { CryptoService } from "../../../middlewares/utils/cryptoService.js";
import { AuthRepository } from "../../../middlewares/repository/authRepository.js";

describe("authRouter", () => {
  const repository = {} as AuthRepository;
  const service = new AuthService();
  const controller = new AuthController(service, repository);
  const encrypter = new DataEncryptionService(new CryptoService());
  let app: ReturnType<typeof setup.App>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = setup.App<AuthController, [AuthService, DataEncryptionService]>(
      controller,
      createAuthRouter,
      {
        routerFactoryArgs: [service, encrypter],
      },
    );
  });

  const config = Config.getInstance();
  const secret = config.jwtSecret;
  const userId = "527be2f3-5903-4a98-a47d-e4bd593db73e";
  const token = jwt.sign({ id: userId }, secret, { expiresIn: "2h" });

  describe("POST /auth/register", () => {
    it("Propagate request to authController.register", async () => {
      //GIVEN
      controller.register = setup.mockSucessCall(status.CREATED);
      //WHEN
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: "toto",
          password: "!SuperS3cr3t",
          confirmPassword: "!SuperS3cr3t",
          mail: "mail@example.com",
        })
        .set("Content-Type", "application/json");
      //THEN
      expect(controller.register).toHaveBeenCalled();
      expect(res.status).toBe(status.CREATED);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.register = setup.mockNextCall();

      const res = await request(app)
        .post("/auth/register")
        .send({
          username: "toto",
          password: "!SuperS3cr3t",
          confirmPassword: "!SuperS3cr3t",
          mail: "mail@example.com",
        })
        .set("Content-Type", "application/json");

      expect(controller.register).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("POST /auth/login", () => {
    it("Propagate request to authController.login", async () => {
      //GIVEN
      controller.login = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app)
        .post("/auth/login")
        .send({
          username: "toto",
          password: "!SuperS3cr3t",
        })
        .set("Content-Type", "application/json");
      //THEN
      expect(controller.login).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.login = setup.mockNextCall();

      const res = await request(app)
        .post("/auth/login")
        .send({
          username: "toto",
          password: "!SuperS3cr3t",
        })
        .set("Content-Type", "application/json");

      expect(controller.login).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("POST /auth/logout", () => {
    it("Propagate request to authController.login", async () => {
      //GIVEN
      controller.logout = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app).post("/auth/logout");
      //THEN
      expect(controller.logout).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.logout = setup.mockNextCall();

      const res = await request(app).post("/auth/logout");

      expect(controller.logout).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /auth/me", () => {
    it("Propagate request to authController.apiMe", async () => {
      // GIVEN
      controller.apiMe = setup.mockSucessCall(status.OK);
      // WHEN
      const res = await request(app)
        .get("/auth/me")
        .set("Cookie", [`token=${token}`]);
      // THEN
      expect(controller.apiMe).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.apiMe = setup.mockNextCall();

      const res = await request(app)
        .get("/auth/me")
        .set("Cookie", [`token=${token}`]);

      expect(controller.apiMe).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("GET /auth/:userId/account", () => {
    it("Propagate request to authController.login", async () => {
      //GIVEN
      controller.getAccount = setup.mockSucessCall(status.OK);
      //WHEN
      const res = await request(app)
        .get(`/auth/${userId}/account`)
        .set("Cookie", [`token=${token}`]);
      //THEN
      expect(controller.getAccount).toHaveBeenCalled();
      expect(receivedReq?.params.userId).toBe(userId);
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.getAccount = setup.mockNextCall();

      const res = await request(app)
        .get(`/auth/${userId}/account`)
        .set("Cookie", [`token=${token}`]);

      expect(controller.getAccount).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });
});
