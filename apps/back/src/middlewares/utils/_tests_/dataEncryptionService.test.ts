import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

import { DataEncryptionService } from "../dataEncryptionService.js";
import { CryptoService } from "../cryptoService.js";

describe("DataEncryptionService with spyOn", () => {
  let cryptoService: CryptoService;
  let service: DataEncryptionService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    cryptoService = new CryptoService();
    service = new DataEncryptionService(cryptoService);

    req = { body: {} };
    res = {};
    next = vi.fn();

    vi.restoreAllMocks();
  });

  it("should encrypt email in req.body", () => {
    const encryptSpy = vi
      .spyOn(cryptoService, "encrypt")
      .mockImplementation((val) => `encrypted(${val})`);

    req.body = { email: "user@example.com" };

    service.encryptData(req as Request, res as Response, next);

    expect(encryptSpy).toHaveBeenCalledWith("user@example.com");
    expect(req.body?.email).toBe("encrypted(user@example.com)");
    expect(next).toHaveBeenCalled();
  });

  it("should skip encryption if email is missing", () => {
    const encryptSpy = vi.spyOn(cryptoService, "encrypt");

    req.body = {}; // no email

    service.encryptData(req as Request, res as Response, next);

    expect(encryptSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should call next with error if encryption throws", () => {
    const error = new Error("encryption failed");
    vi.spyOn(cryptoService, "encrypt").mockImplementation(() => {
      throw error;
    });

    req.body = { email: "fail@example.com" };
    const nextMock = vi.fn();

    service.encryptData(req as Request, res as Response, nextMock);

    expect(nextMock).toHaveBeenCalledWith(error);
  });

  it("should decrypt multiple fields", () => {
    const decryptSpy = vi
      .spyOn(cryptoService, "decrypt")
      .mockImplementation((val) =>
        val.replace("encrypted(", "").replace(")", ""),
      );

    const encryptedFields = {
      email: "encrypted(user@example.com)",
      phone: "encrypted(0600000000)",
    };

    const result = service.decryptData(encryptedFields);

    expect(decryptSpy).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      email: "user@example.com",
      phone: "0600000000",
    });
  });

  it("should throw error if decryption fails", () => {
    vi.spyOn(cryptoService, "decrypt").mockImplementation(() => {
      throw new Error("bad data");
    });

    expect(() => service.decryptData({ email: "invalid" })).toThrowError(
      'Decryption failed for field "email": bad data',
    );
  });
});
