import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import status from "http-status";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { Config } from "../../../config/config.js";
import { setup, receivedReq } from "./mock-tools.js";
import { createAuthRouter } from "../authRouter.js";
import { AuthController } from "../../controllers/authController.js";
import { AuthService } from "../../../middlewares/utils/authService.js";
import { AuthRepository } from "../../../middlewares/repository/authRepository.js";
import { UserRepository } from "../../../middlewares/repository/userRepository.js";
import { MailService } from "../../../middlewares/nodemailer/nodemailer.js";

describe("authRouter", () => {
  const repository = {} as AuthRepository;
  const userRepository = {} as UserRepository;
  const service = new AuthService();
  const mailService = new MailService();
  const controller = new AuthController(
    service,
    repository,
    userRepository,
    mailService,
  );
  let app: ReturnType<typeof setup.App>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = setup.App<AuthController, [AuthService]>(
      controller,
      createAuthRouter,
      {
        routerFactoryArgs: [service],
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

  describe("GET /auth/verify-email", () => {
    const token = "fixed-token";

    it("Return 400 if token missing", async () => {
      controller.verifyEmail = setup.mockSucessCall(status.BAD_REQUEST);

      const res = await request(app).get("/auth/verify-email");

      expect(controller.verifyEmail).toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
      expect(res.body).toEqual("Success!");
    });

    it("Return 404 if user not found", async () => {
      controller.verifyEmail = setup.mockSucessCall(status.NOT_FOUND);

      const res = await request(app).get("/auth/verify-email").query({ token });

      expect(controller.verifyEmail).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual("Success!");
    });

    it("Return 400 if token expired", async () => {
      controller.verifyEmail = setup.mockSucessCall(status.BAD_REQUEST);

      const res = await request(app).get("/auth/verify-email").query({ token });

      expect(controller.verifyEmail).toHaveBeenCalled();
      expect(res.status).toBe(status.BAD_REQUEST);
      expect(res.body).toEqual("Success!");
    });

    it("Validate email if token valid", async () => {
      controller.verifyEmail = setup.mockSucessCall(status.OK);

      const res = await request(app).get("/auth/verify-email").query({ token });

      expect(controller.verifyEmail).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toEqual("Success!");
    });

    it("Next is called if controller throws", async () => {
      controller.verifyEmail = setup.mockNextCall();

      const res = await request(app).get("/auth/verify-email").query({ token });

      expect(controller.verifyEmail).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });

  describe("POST /auth/resend-email-token", () => {
    const email = "test@mail.com";
    const token = "fixed-token";
    const fixedNow = new Date("2025-11-03T14:18:43.000Z");

    beforeEach(() => {
      // Mock crypto.randomBytes pour toujours retourner un token fixe
      vi.spyOn(crypto, "randomBytes").mockImplementation((size: number) => {
        return Buffer.from(token, "hex"); // retourne toujours ton token fixe
      });

      vi.spyOn(Date, "now").mockReturnValue(fixedNow.getTime());

      // Clear mocks
      vi.clearAllMocks();
    });

    it("Return generic message if user not found", async () => {
      controller.resendMailToken = setup.mockSucessCall(status.OK);

      const res = await request(app)
        .post("/auth/resend-email-token")
        .send({ mail: "unknown@mail.com" })
        .set("Content-Type", "application/json");

      expect(controller.resendMailToken).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toEqual("Success!");
    });

    it("Send verification email if user exists", async () => {
      controller.resendMailToken = setup.mockSucessCall(status.OK);

      const res = await request(app)
        .post("/auth/resend-email-token")
        .send({ mail: email })
        .set("Content-Type", "application/json")
        .set("Accept-Language", "en-US,en;q=0.9");

      expect(controller.resendMailToken).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toEqual("Success!");
    });

    it("Call next if controller throws", async () => {
      controller.resendMailToken = setup.mockNextCall();

      const res = await request(app)
        .post("/auth/resend-email-token")
        .send({ mail: email })
        .set("Content-Type", "application/json");

      expect(controller.resendMailToken).toHaveBeenCalled();
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
          mail: "toto@mail.com",
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
          mail: "toto@mail.com",
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
        .set("Cookie", [`access_token=${token}`]);
      // THEN
      expect(controller.apiMe).toHaveBeenCalled();
      expect(res.status).toBe(status.OK);
      expect(res.body).toBe("Success!");
    });

    it("Next is called at end route.", async () => {
      controller.apiMe = setup.mockNextCall();

      const res = await request(app)
        .get("/auth/me")
        .set("Cookie", [`access_token=${token}`]);

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
        .set("Cookie", [`access_token=${token}`]);
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
        .set("Cookie", [`access_token=${token}`]);

      expect(controller.getAccount).toHaveBeenCalled();
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body).toEqual({ called: "next" });
    });
  });
});
