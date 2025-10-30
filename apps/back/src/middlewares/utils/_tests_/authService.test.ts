import { vi, describe, it, expect, beforeEach } from "vitest";
import { NextFunction } from "express";
import Joi, { ValidationError } from "joi";
import jwt from "jsonwebtoken";
import status from "http-status";

import { AuthService } from "../authService.js";

vi.mock("../../../config/config.js", () => ({
  Config: {
    getInstance: () => ({
      jwtSecret: "test-secret",
      refreshSecret: "test-refresh",
    }),
  },
}));

vi.mock("../../joi/schemas/auth.js", () => ({
  jwtSchema: {
    validate: vi.fn((payload) => ({ value: payload, error: undefined })),
  },
}));

describe("AuthService", () => {
  let authService: AuthService;
  let req: any;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    vi.restoreAllMocks();
    authService = new AuthService();
    req = { cookies: {}, params: {}, userId: undefined };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  describe("setAuthUserRequest", () => {
    it("Call next() if any token exist", async () => {
      await authService.setAuthUserRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.userId).toBeUndefined();
    });

    it("Define req.userId if token is valid", async () => {
      const token = jwt.sign({ id: "user123" }, "test-secret");
      req.cookies.access_token = token;

      await authService.setAuthUserRequest(req, res, next);

      expect(req.userId).toBe("user123");
      expect(next).toHaveBeenCalled();
    });

    it("Call next(error) if Joi schema returns error", async () => {
      const token = jwt.sign({ id: "user123" }, "test-secret");
      req.cookies.access_token = token;
      // Joi schema return error
      const { jwtSchema } = await import("../../joi/schemas/auth.js");
      jwtSchema.validate = vi.fn(() => ({
        value: null,
        error: new Joi.ValidationError(
          "Joi error",
          [],
          null,
        ) as ValidationError,
      }));

      await authService.setAuthUserRequest(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("Call next(error) if jwt.verify throw errro", async () => {
      req.cookies.access_token = "invalid.token";
      vi.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("jwt error");
      });

      await authService.setAuthUserRequest(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("checkPermission", () => {
    it("Return 401 if req.userId is missing", async () => {
      req.userId = undefined;

      await authService.checkPermission(req, res, next);

      expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ error: "Unautorized access" });
      expect(next).not.toHaveBeenCalled();
    });

    it("Return 403 if userId not equal to params.userId", async () => {
      req.userId = "user1";
      req.params.userId = "user2";

      await authService.checkPermission(req, res, next);

      expect(res.status).toHaveBeenCalledWith(status.FORBIDDEN);
      expect(res.json).toHaveBeenCalledWith({ error: "Forbidden access" });
      expect(next).not.toHaveBeenCalled();
    });

    it("Call next() if userId is equal to params.userId", async () => {
      req.userId = "user1";
      req.params.userId = "user1";

      await authService.checkPermission(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("generateAccessToken", () => {
    it("Generate valid token", async () => {
      const token = await authService.generateAccessToken("user123");
      const payload = jwt.verify(token, "test-secret");

      expect(payload).toMatchObject({ id: "user123" });
    });

    it("throw error if jwtSecret is missing", async () => {
      authService["jwtSecret"] = undefined as any;

      await expect(authService.generateAccessToken("user123")).rejects.toThrow(
        "JWT_SECRET is not set",
      );
    });
  });

  describe("generateRefreshToken", () => {
    it("Generate valid token", async () => {
      const token = await authService.generateRefreshToken("user123");
      const payload = jwt.verify(token, "test-refresh");

      expect(payload).toMatchObject({ id: "user123" });
    });

    it("throw error if refreshSecret is missing", async () => {
      authService["refreshSecret"] = undefined as any;

      await expect(authService.generateRefreshToken("user123")).rejects.toThrow(
        "REFRESH_SECRET is not set",
      );
    });
  });
});
