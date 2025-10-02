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
  const mockRegister = vi.spyOn(AuthRepository.prototype, "register");

  vi.mock("../../../middlewares/utils/authService.js");
  const mockSetRequest = vi.spyOn(AuthService.prototype, "setAuthUserRequest");
  const mockCheckPermission = vi.spyOn(
    AuthService.prototype,
    "checkPermission",
  );
  const mockGenerateAcessToken = vi.spyOn(
    AuthService.prototype,
    "generateAccessToken",
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
    clearCookie: vi.fn(),
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
      expect(res.json).toHaveBeenCalledWith({ error: "Username forbidden" });
      expect(res.status).toHaveBeenCalledWith(status.CONFLICT);
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  // --- LOGIN   ---
  describe("login", () => {
    it("Return user and cookie if login.", async () => {
      // GIVEN
      req.body = {
        username: "toto",
        password: "secret",
      };

      const mockUser = {
        id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        username: "toto",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$PBffc9eGthziVC938nRg+Q$8dpZXWhHPGfBj0tEp/vwSpfsm2pZK1dYRb8OSObg4gE",
        mail: "b4abae35a472f9eaffc89dbc:c5658303f02fa2ea7f7d6a0650af502e:9dcdd7b46a2907c4635293da74621854",
      };

      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNWZmNDZiNS02MGYzLTRlODYtOThiYy1kYThmY2FhM2UyOWUiLCJpYXQiOjE3NTM2MzgxMjEsImV4cCI6MTc1MzY0NTMyMX0.L2D0FnDtNKSyv0_TaHXyznnD_08MJWeJaOw35BxWAUg";

      const { password: _password, ...userWithoutPassword } = mockUser;

      (argon2.verify as Mock).mockResolvedValue(true);
      mockGenerateAcessToken.mockResolvedValue(mockToken);
      mockFindByUsername.mockResolvedValue(mockUser);
      // WHEN
      await underTest.login(req as Request, res as Response, next);
      //THEN
      expect(mockFindByUsername).toHaveBeenCalledWith("toto");
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        mockToken,
        expect.any(Object),
      );
      expect(res.json).toHaveBeenCalledWith(userWithoutPassword);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 401 if username not found.", async () => {
      req.body = {
        username: "tata",
        password: "secret",
      };

      mockFindByUsername.mockResolvedValue(null);
      await underTest.login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: "Username or password unavailable",
      });
    });

    it("Return 401 if username and password not match.", async () => {
      req.body = {
        username: "tata",
        password: "secret",
      };

      (argon2.verify as Mock).mockResolvedValue(false);
      await underTest.login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: "Username or password unavailable",
      });
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
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized access" });
    });

    it("Return 400 in case of invalid token (payload string)", async () => {
      req.cookies = { token: "invalid.token" };

      jwtVerifyMock.mockReturnValue("invalid_payload");

      await underTest.apiMe(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid token payload",
      });
    });

    it("Return 404 if user not found", async () => {
      req.cookies = { token: "valid.token" };

      jwtVerifyMock.mockReturnValue({
        id: "3521dd0c-c303-4239-a545-10e5476abe2a",
      });
      mockFindById.mockResolvedValue(null);

      await underTest.apiMe(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("Return user without password in case of valid token", async () => {
      req.cookies = { token: "valid.token" };

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
      req.cookies = { token: "valid.token" };
      const error = new Error("jwt error");

      jwtVerifyMock.mockImplementation(() => {
        throw error;
      });

      await underTest.apiMe(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
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

      expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing user ID",
      });
      expect(next).not.toHaveBeenCalled();
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

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      expect(next).not.toHaveBeenCalled();
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

      expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: "Old password doesn't match current password",
      });
      expect(next).not.toHaveBeenCalled();
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

      expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or missing user ID",
      });
      expect(mockFindById).not.toHaveBeenCalled();
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
      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });

  // --- LOGOUT ---
  describe("logout", () => {
    it("Return empty cookie", () => {
      underTest.logout(req as Request, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      expect(res.json).toHaveBeenCalledWith({ message: "Successfully logout" });
    });
  });
});
