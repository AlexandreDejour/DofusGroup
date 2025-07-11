import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import type { Request, Response } from "express";

import { Server } from "../../../types/server.js";
import { ServerController } from "../serverController.js";
import { ServerRepository } from "../../../middlewares/repository/serverRepository.js";

describe("ServerController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/serverRepository.js");
  const mockGetAll = vi.spyOn(ServerRepository.prototype, "getAll");
  const mockGetOne = vi.spyOn(ServerRepository.prototype, "getOne");

  req = {};
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const underTest: ServerController = new ServerController();

  // --- GET ALL ---
  describe("getAll", () => {
    it("Return servers if exist.", async () => {
      // GIVEN
      const mockServers: Server[] = [
        {
          id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
          name: "Dakal",
          mono_account: true,
        },
      ];

      mockGetAll.mockResolvedValue(mockServers);
      // WHEN
      await underTest.getAll(req as Request, res as Response, next);
      //THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockServers);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if any server found.", async () => {
      const mockServers: Server[] = [];

      mockGetAll.mockResolvedValue(mockServers);
      await underTest.getAll(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Any server found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAll.mockRejectedValue(error);
      await underTest.getAll(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ---
  describe("getOne", () => {
    it("Return server if exists", async () => {
      req.params = { id: "1" };
      const mockServer: Server = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Dakal",
        mono_account: true,
      };

      mockGetOne.mockResolvedValue(mockServer);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockServer);
    });

    it("Call next() if server doesn't exists.", async () => {
      req.params = { id: "99" };

      mockGetOne.mockResolvedValue(null);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Server not found" });
    });

    it("Call next() in case of error.", async () => {
      req.params = { id: "2" };

      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
