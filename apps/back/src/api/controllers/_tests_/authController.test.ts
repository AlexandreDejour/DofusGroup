import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

import status from "http-status";
import argon2 from "argon2";
import type { Request, Response } from "express";

import { AuthUser } from "../../../types/user.js";
import {
  AuthenticatedRequest,
  AuthService,
} from "../../../middlewares/utils/authService.js";
import { authUserSchema } from "../../../middlewares/joi/schemas/auth.js";
import { AuthController } from "../authController.js";
import { AuthRepository } from "../../../middlewares/repository/authRepository.js";

describe("AuthController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/authRepository.js");
  const mockFindById = vi.spyOn(AuthRepository.prototype, "findOneById");
  const mockFindByUsername = vi.spyOn(
    AuthRepository.prototype,
    "findOneByUsername",
  );
  const mockFindByMail = vi.spyOn(AuthRepository.prototype, "findOneByMail");
  const mockRegister = vi.spyOn(AuthRepository.prototype, "register");

  vi.mock("../../../middlewares/utils/authService.js");
  const mockGenerateAccessToken = vi.spyOn(
    AuthService.prototype,
    "generateAccessToken",
  );
  const mockGenerateRefreshToken = vi.spyOn(
    AuthService.prototype,
    "generateRefreshToken",
  );

  vi.mock("../../../middlewares/joi/schemas/auth.js", () => ({
    authUserSchema: {
      validate: vi.fn(),
    },
  }));

  vi.mock("argon2", () => ({
    default: {
      hash: vi.fn(),
      verify: vi.fn(),
    },
  }));

  req = {};
  res = {
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  let jwtVerifyMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock jwt.verify
    jwtVerifyMock = vi.spyOn(require("jsonwebtoken"), "verify");
  });

  const underTest: AuthController = new AuthController(
    new AuthService(),
    new AuthRepository(),
  );

  // --- REGISTER ---
  describe("register", () => {
    it("Return user if create.", async () => {
      // GIVEN
      req.body = {
        username: "toto",
        mail: "toto@exemple.com",
        password: "secret",
      };

      const mockNewUser: AuthUser = {
        id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        username: "toto",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$PBffc9eGthziVC938nRg+Q$8dpZXWhHPGfBj0tEp/vwSpfsm2pZK1dYRb8OSObg4gE",
        mail: "b4abae35a472f9eaffc89dbc:c5658303f02fa2ea7f7d6a0650af502e:9dcdd7b46a2907c4635293da74621854",
      };

      mockRegister.mockResolvedValue(mockNewUser);
      // WHEN
      await underTest.register(req as Request, res as Response, next);
      //THEN
      expect(mockRegister).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockNewUser);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 409 if username ever exists.", async () => {
      req.body = {
        username: "toto",
        mail: "toto@exemple.com",
        password: "secret",
      };

      const mockEverExist = {
        id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        username: "toto",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$PBffc9eGthziVC938nRg+Q$8dpZXWhHPGfBj0tEp/vwSpfsm2pZK1dYRb8OSObg4gE",
        mail: "b4abae35a472f9eaffc89dbc:c5658303f02fa2ea7f7d6a0650af502e:9dcdd7b46a2907c4635293da74621854",
      };

      mockFindByUsername.mockResolvedValue(mockEverExist);

      await underTest.register(req as Request, res as Response, next);

      expect(mockFindByUsername).toHaveBeenCalledWith("toto");
      expect(mockRegister).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.CONFLICT,
          message: "Username forbidden",
        }),
      );
    });
  });

  // --- LOGIN   ---
  describe("login", () => {
    it("Return user and cookie if login.", async () => {
      // GIVEN
      req.body = {
        mail: "toto@mail.com",
        password: "secret",
      };

      const mockUser = {
        id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        username: "toto",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$PBffc9eGthziVC938nRg+Q$8dpZXWhHPGfBj0tEp/vwSpfsm2pZK1dYRb8OSObg4gE",
        mail: "toto@mail.com",
      };

      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNWZmNDZiNS02MGYzLTRlODYtOThiYy1kYThmY2FhM2UyOWUiLCJpYXQiOjE3NTM2MzgxMjEsImV4cCI6MTc1MzY0NTMyMX0.L2D0FnDtNKSyv0_TaHXyznnD_08MJWeJaOw35BxWAUg";

      const { password: _password, ...userWithoutPassword } = mockUser;

      (argon2.verify as Mock).mockResolvedValue(true);
      mockGenerateAccessToken.mockResolvedValue(mockToken);
      mockFindByMail.mockResolvedValue(mockUser);
      // WHEN
      await underTest.login(req as Request, res as Response, next);
      //THEN
      expect(mockFindByMail).toHaveBeenCalledWith("toto@mail.com");
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        mockToken,
        expect.any(Object),
      );
      expect(res.json).toHaveBeenCalledWith(userWithoutPassword);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 401 if mail not found.", async () => {
      req.body = {
        mail: "tata@mail.com",
        password: "secret",
      };

      mockFindByMail.mockResolvedValue(null);
      await underTest.login(req as Request, res as Response, next);

      expect(mockFindByMail).toHaveBeenCalledWith("tata@mail.com");
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.UNAUTHORIZED,
          message: "Email or password unavailable",
        }),
      );
    });

    it("Return 401 if password not match.", async () => {
      req.body = {
        mail: "tata@mail.com",
        password: "secret",
      };

      (argon2.verify as Mock).mockResolvedValue(false);
      await underTest.login(req as Request, res as Response, next);

      expect(mockFindByMail).toHaveBeenCalledWith("tata@mail.com");
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.UNAUTHORIZED,
          message: "Email or password unavailable",
        }),
      );
    });
  });

  // --- API ME ---
  describe("apiMe", () => {
    const mockUser = {
      id: "3521dd0c-c303-4239-a545-10e5476abe2a",
      username: "user",
      password: "hashedpass",
      mail: "user@mail.com",
    };
    const userWithoutPassword = {
      id: "3521dd0c-c303-4239-a545-10e5476abe2a",
      username: "user",
      mail: "user@mail.com",
    };

    it("Return 401 any token exist", async () => {
      req.cookies = {};

      await underTest.apiMe(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        user: null,
        message: "No token, please login",
      });
    });

    it("Return 400 in case of invalid token (payload string)", async () => {
      req.cookies = { access_token: "invalid.token" };

      jwtVerifyMock.mockReturnValue("invalid_payload");

      await underTest.apiMe(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.BAD_REQUEST,
          message: "Invalid token payload",
        }),
      );
    });

    it("Return 404 if user not found", async () => {
      req.cookies = { access_token: "valid.token" };

      jwtVerifyMock.mockReturnValue({
        id: "3521dd0c-c303-4239-a545-10e5476abe2a",
      });
      mockFindById.mockResolvedValue(null);

      await underTest.apiMe(req as Request, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith("access_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      expect(res.clearCookie).toHaveBeenCalledWith("refresh_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("Return user without password in case of valid token", async () => {
      req.cookies = { access_token: "valid.token" };

      jwtVerifyMock.mockReturnValue({
        id: "3521dd0c-c303-4239-a545-10e5476abe2a",
      });
      mockFindById.mockResolvedValue(mockUser);

      await underTest.apiMe(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(userWithoutPassword);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.status).not.toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.status).not.toHaveBeenCalledWith(status.UNAUTHORIZED);
    });

    it("Call next(error) in case of exception", async () => {
      req.cookies = { access_token: "valid.token" };
      const error = new Error("jwt error");

      jwtVerifyMock.mockImplementation(() => {
        throw error;
      });

      await underTest.apiMe(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- REFRESH TOKEN ---
  describe("refreshToken", () => {
    it("Return 401 if refresh token missing", async () => {
      req.cookies = {};

      await underTest.refreshToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: "No refresh token" });
    });

    it("Renew access token and set cookie when refresh token valid", async () => {
      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNWZmNDZiNS02MGYzLTRlODYtOThiYy1kYThmY2FhM2UyOWUiLCJpYXQiOjE3NTM2MzgxMjEsImV4cCI6MTc1MzY0NTMyMX0.L2D0FnDtNKSyv0_TaHXyznnD_08MJWeJaOw35BxWAUg";

      const userId = "user-123";
      req.cookies = { refresh_token: "valid.token" };

      jwtVerifyMock.mockReturnValue({ id: userId });
      mockGenerateAccessToken.mockResolvedValue(mockToken);

      await underTest.refreshToken(req as Request, res as Response);

      expect(mockGenerateAccessToken).toHaveBeenCalledWith(userId);
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        mockToken,
        expect.any(Object),
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Access token renewed",
      });
    });

    it("Clear refresh cookie and return 401 when token invalid/expired", async () => {
      req.cookies = { refresh_token: "bad.token" };

      jwtVerifyMock.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await underTest.refreshToken(req as Request, res as Response);

      expect(res.clearCookie).toHaveBeenCalledWith(
        "refresh_token",
        expect.any(Object),
      );
      expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired refresh token",
      });
    });
  });

  // --- IS PASSWORD MATCH ---
  describe("isPasswordMatch", () => {
    const userId = "3521dd0c-c303-4239-a545-10e5476abe2a";
    const mockUser: AuthUser = {
      id: userId,
      username: "user",
      password: "hashedpass",
      mail: "user@mail.com",
    };

    it("Call next() directly if password not provided", async () => {
      const req: Partial<AuthenticatedRequest> = {
        body: {},
      };

      await underTest.isPasswordMatch(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("Return 400 if userId invalid", async () => {
      const req: Partial<AuthenticatedRequest> = {
        body: { password: "newpass", oldPassword: "oldpass" },
        userId: "invalid-id",
      };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: {},
        error: { message: "Invalid or missing user ID" },
      });

      await underTest.isPasswordMatch(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.BAD_REQUEST,
          message: "Invalid or missing user ID",
        }),
      );
    });

    it("Return 404 if user not found", async () => {
      const req: Partial<AuthenticatedRequest> = {
        body: { password: "newpass", oldPassword: "oldpass" },
        userId,
      };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId },
        error: undefined,
      });
      mockFindById.mockResolvedValue(null);

      await underTest.isPasswordMatch(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "User not found",
        }),
      );
    });

    it("Return 401 if old password doesn't match", async () => {
      const req: Partial<AuthenticatedRequest> = {
        body: { password: "newpass", oldPassword: "wrongpass" },
        userId,
      };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId },
        error: undefined,
      });
      mockFindById.mockResolvedValue(mockUser);
      (argon2.verify as Mock).mockResolvedValue(false);

      await underTest.isPasswordMatch(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.UNAUTHORIZED,
          message: "Old password doesn't match current password",
        }),
      );
    });

    it("Call next() if old password matches", async () => {
      const req: Partial<AuthenticatedRequest> = {
        body: { password: "newpass", oldPassword: "correctpass" },
        userId,
      };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId },
        error: undefined,
      });
      mockFindById.mockResolvedValue(mockUser);
      (argon2.verify as Mock).mockResolvedValue(true);

      await underTest.isPasswordMatch(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("Call next(error) if exception thrown", async () => {
      const req: Partial<AuthenticatedRequest> = {
        body: { password: "newpass", oldPassword: "correctpass" },
        userId,
      };
      const error = new Error("DB error");

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId },
        error: undefined,
      });
      mockFindById.mockRejectedValue(error);

      await underTest.isPasswordMatch(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ACCOUNT ---
  describe("getAccount", () => {
    it("Return user if valid userId and user exists", async () => {
      const req: Partial<AuthenticatedRequest> = {
        userId: "3521dd0c-c303-4239-a545-10e5476abe2a",
      };

      const mockUser: AuthUser = {
        id: "3521dd0c-c303-4239-a545-10e5476abe2a",
        username: "user1",
        password: "hashedpass",
        mail: "user1@example.com",
      };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId: "3521dd0c-c303-4239-a545-10e5476abe2a" },
        error: undefined,
      });
      mockFindById.mockResolvedValue(mockUser);

      await underTest.getAccount(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(mockFindById).toHaveBeenCalledWith(
        "3521dd0c-c303-4239-a545-10e5476abe2a",
      );
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId is missing or invalid", async () => {
      const req: Partial<AuthenticatedRequest> = { userId: "123" };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId: "123" },
        error: {
          details: [
            {
              message: "User id must be UUID V4",
              path: ["userId"],
              type: "string.guid",
              context: {
                label: "userId",
                key: "userId",
              },
            },
          ],
        },
      });

      await underTest.getAccount(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(mockFindById).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.BAD_REQUEST,
          message: "Invalid or missing user ID",
        }),
      );
    });

    it("Return 404 if user not found", async () => {
      const req: Partial<AuthenticatedRequest> = {
        userId: "3521dd0c-c303-4239-a545-10e5476abe2a",
      };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId: "3521dd0c-c303-4239-a545-10e5476abe2a" },
        error: undefined,
      });
      mockFindById.mockResolvedValue(null);

      await underTest.getAccount(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(mockFindById).toHaveBeenCalledWith(
        "3521dd0c-c303-4239-a545-10e5476abe2a",
      );
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "User not found",
        }),
      );
    });
  });

  // --- LOGOUT ---
  describe("logout", () => {
    it("Return empty cookie", () => {
      underTest.logout(req as Request, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith("access_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      expect(res.clearCookie).toHaveBeenCalledWith("refresh_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      expect(res.json).toHaveBeenCalledWith({ message: "Successfully logout" });
    });
  });
});
