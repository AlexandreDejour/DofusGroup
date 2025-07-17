import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

import status from "http-status";
import argon2 from "argon2";
import type { Request, Response } from "express";

import hashPassword from "../hashPassword.js";
import createHttpError from "http-errors";

describe("Password hasher middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  req = { body: {} };
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  vi.mock("argon2");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should hash password if exist in req.body", async () => {
    req.body = { username: "toto", password: "secret" };
    const mockHash = "hashedPassword";

    (argon2.hash as unknown as Mock).mockResolvedValue(mockHash);

    await hashPassword(req as Request, res as Response, next);

    expect(req.body.password).not.toBe("secret");
    expect(argon2.hash).toHaveBeenCalledWith("secret");
    expect(req.body.password).toBe(mockHash);
    expect(next).toHaveBeenCalled();
  });

  it("should call next without hashing if password not present", async () => {
    req.body = {};

    await hashPassword(req as Request, res as Response, next);

    expect(argon2.hash).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should call next with error if hashing fails", async () => {
    req.body.password = "secret";
    const error = createHttpError(
      status.INTERNAL_SERVER_ERROR,
      "Internal server error during password hashing",
    );

    (argon2.hash as unknown as Mock).mockRejectedValue(error);

    await hashPassword(req as Request, res as Response, next);

    expect(argon2.hash).toHaveBeenCalledWith("secret");
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Internal server error during password hashing",
        status: status.INTERNAL_SERVER_ERROR,
      }),
    );
  });
});
