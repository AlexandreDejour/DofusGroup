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
    vi.restoreAllMocks();

    cryptoService = new CryptoService();
    service = new DataEncryptionService(cryptoService);

    req = { body: {} };
    res = {};
    next = vi.fn();
  });

  it("should encrypt mail in req.body", () => {
    const encryptSpy = vi
      .spyOn(cryptoService, "encrypt")
      .mockImplementation((val) => `encrypted(${val})`);

    req.body = { mail: "user@example.com" };

    service.encryptData(req as Request, res as Response, next);

    expect(encryptSpy).toHaveBeenCalledWith("user@example.com");
    expect(req.body?.mail).toBe("encrypted(user@example.com)");
    expect(next).toHaveBeenCalled();
  });

  it("should skip encryption if mail is missing", () => {
    const encryptSpy = vi.spyOn(cryptoService, "encrypt");

    req.body = {}; // no mail

    service.encryptData(req as Request, res as Response, next);

    expect(encryptSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should call next with error if encryption throws", () => {
    const error = new Error("encryption failed");
    vi.spyOn(cryptoService, "encrypt").mockImplementation(() => {
      throw error;
    });

    req.body = { mail: "fail@example.com" };
    const nextMock = vi.fn();

    service.encryptData(req as Request, res as Response, nextMock);

    expect(nextMock).toHaveBeenCalledWith(error);
  });

  it("should skip decryption if mail is missing", () => {
    const decryptSpy = vi.spyOn(cryptoService, "decrypt");

    req.body = {}; // no mail

    service.decryptData(req as Request, res as Response, next);

    expect(decryptSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should decrypt field", () => {
    const decryptSpy = vi
      .spyOn(cryptoService, "decrypt")
      .mockImplementation((val) =>
        val.replace("encrypted(", "").replace(")", ""),
      );

    req.body = {
      mail: "encrypted(user@example.com)",
    };

    service.decryptData(req as Request, res as Response, next);

    expect(decryptSpy).toHaveBeenCalled();
    expect(req.body).toEqual({
      mail: "user@example.com",
    });
  });

  it("should call next with error if encryption throws", () => {
    const error = new Error("decryption failed");
    vi.spyOn(cryptoService, "decrypt").mockImplementation(() => {
      throw error;
    });

    req.body = { mail: "fail@example.com" };
    const nextMock = vi.fn();

    service.decryptData(req as Request, res as Response, nextMock);

    expect(nextMock).toHaveBeenCalledWith(error);
  });
});
