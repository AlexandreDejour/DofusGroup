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
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
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

  // GET ACCOUNT //
  describe("getAccount", () => {
    it("Return user if valid userId and user exists", async () => {
      const req: Partial<AuthenticatedRequest> = { userId: "123" };

      const mockUser: AuthUser = {
        id: "123",
        username: "user1",
        password: "hashedpass",
        mail: "user1@example.com",
      };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId: "123" },
        error: undefined,
      });
      mockFindById.mockResolvedValue(mockUser);

      await underTest.getAccount(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(mockFindById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId is missing or invalid", async () => {
      const req: Partial<AuthenticatedRequest> = { userId: undefined };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId: "123" },
        error: undefined,
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
      const req: Partial<AuthenticatedRequest> = { userId: "non-existent-id" };

      (authUserSchema.validate as Mock).mockReturnValue({
        value: { userId: "123" },
        error: undefined,
      });
      mockFindById.mockResolvedValue(null);

      await underTest.getAccount(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(mockFindById).toHaveBeenCalledWith("non-existent-id");
      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });
});
