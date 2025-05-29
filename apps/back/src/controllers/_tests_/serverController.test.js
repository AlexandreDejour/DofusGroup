import { describe, it, expect, vi, beforeEach } from "vitest";

import { Server } from "../../models/Server.js";
import { serverController } from "../serverController.js";

vi.mock("../../models/Server.js", () => ({
  Server: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
  }
}));

describe("serverController", () => {

  let res; 
  let next;

  beforeEach(() => {
    res = {
      json: vi.fn(),
      params: {},
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should respond with all servers", async () => {
      const mockServers = [{ id: 1, name: "Oshimo" }, { id: 2, name: "Ilyzaelle" }];
      Server.findAll.mockResolvedValue(mockServers);

      await serverController.getAll({}, res, next);

      expect(Server.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockServers);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if no servers are found", async () => {
      Server.findAll.mockResolvedValue(null);

      await serverController.getAll({}, res, next);

      expect(Server.findAll).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("getOne", () => {
    it("should respond with one server if found", async () => {
      const mockServer = { id: 1, name: "Oshimo" };
      res.params.id = 1;
      Server.findByPk.mockResolvedValue(mockServer);

      await serverController.getOne({}, res, next);

      expect(Server.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockServer);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if server is not found", async () => {
      res.params.id = 42;
      Server.findByPk.mockResolvedValue(null);

      await serverController.getOne({}, res, next);

      expect(Server.findByPk).toHaveBeenCalledWith(42);
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

});
