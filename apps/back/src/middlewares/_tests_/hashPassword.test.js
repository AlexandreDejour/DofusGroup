import { describe, it, expect, vi, beforeEach } from "vitest";

import argon2 from "argon2";
import { hashPassword } from "../hashPassword.js";

vi.mock("argon2");

describe("hashPassword middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should hash password if present and call next", async () => {
    req.body.password = "MySecret123!";
    argon2.hash.mockResolvedValue("hashedPassword");

    await hashPassword(req, res, next);

    expect(argon2.hash).toHaveBeenCalledWith("MySecret123!");
    expect(req.body.password).toBe("hashedPassword");
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // called without error
  });

  it("should call next without hashing if password not present", async () => {
    await hashPassword(req, res, next);

    expect(argon2.hash).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // no error
  });

  it("should call next with error if hashing fails", async () => {
    req.body.password = "MySecret123!";
    const error = new Error("Hashing failed");
    argon2.hash.mockRejectedValue(error);

    await hashPassword(req, res, next);

    expect(argon2.hash).toHaveBeenCalledWith("MySecret123!");
    expect(next).toHaveBeenCalledTimes(1);
    // Next should be called with an error object
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe("Internal server error during password hashing.");
  });
});
