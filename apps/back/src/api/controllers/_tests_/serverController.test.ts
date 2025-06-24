import { describe, it, expect, vi, beforeEach } from "vitest";

import type { Request, Response, NextFunction } from "express";

import createHttpError, { HttpError } from "http-errors";

import { serverController } from "../serverController.js";
import Server, { IServer } from "../../../database/models/Server.js";

// Sequelize Server model mock
vi.mock("../../models/Server", () => ({
  default: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
  },
}));

describe("serverController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  // --- GET ALL ---
  describe("getAll", () => {
    it("Return servers if exist.", async () => {
      const mockServers: IServer[] = [
        { id: 1, name: "Dakal", mono_account: true },
      ];
      (Server.findAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockServers,
      );

      await serverController.getAll(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockServers);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("Return 404 if any server found.", async () => {
      (Server.findAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        [],
      );

      await serverController.getAll(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Any server found" });
    });

    it("Call next() in case of error.", async () => {
      const error: HttpError = createHttpError(500, "Internal error");

      (Server.findAll as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
        error,
      );

      await serverController.getAll(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ---
  describe("getOne", () => {
    it("Return server if exists", async () => {
      req.params = { id: "1" };
      const mockServer: IServer = { id: 1, name: "Dakal", mono_account: true };
      (
        Server.findByPk as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockServer);

      await serverController.getOne(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockServer);
    });

    it("Call next() if server doesn't exists.", async () => {
      req.params = { id: "99" };
      (
        Server.findByPk as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);

      await serverController.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("Call next() in case of error.", async () => {
      req.params = { id: "2" };

      const error: HttpError = createHttpError(500, "Internal Error");

      (
        Server.findByPk as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(error);

      await serverController.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
