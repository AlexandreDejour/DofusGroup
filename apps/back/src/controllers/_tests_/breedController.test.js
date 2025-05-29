import { describe, it, expect, vi, beforeEach } from "vitest";

import { Breed } from "../../models/Breed.js";
import { breedController } from "../breedController.js";

vi.mock("../../models/Breed.js", () => ({
  Breed: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
  }
}));

describe("breedController", () => {

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
    it("should respond with all breeds", async () => {
      const mockServers = [{ id: 1, name: "Ecaflip" }, { id: 2, name: "Eliotrope" }];
      Breed.findAll.mockResolvedValue(mockServers);

      await breedController.getAll({}, res, next);

      expect(Breed.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockServers);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if no breeds are found", async () => {
      Breed.findAll.mockResolvedValue(null);

      await breedController.getAll({}, res, next);

      expect(Breed.findAll).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("getOne", () => {
    it("should respond with one breed if found", async () => {
      const mockServer = { id: 1, name: "Ecaflip" };
      res.params.id = 1;
      Breed.findByPk.mockResolvedValue(mockServer);

      await breedController.getOne({}, res, next);

      expect(Breed.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockServer);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if breed is not found", async () => {
      res.params.id = 42;
      Breed.findByPk.mockResolvedValue(null);

      await breedController.getOne({}, res, next);

      expect(Breed.findByPk).toHaveBeenCalledWith(42);
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

});
