import { describe, it, expect, vi, beforeEach } from "vitest";

import { Character } from "../../models/Character.js";
import { characterController } from "../../controllers/characterController.js";

vi.mock("../../models/Character.js", () => ({
  Character: {
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  }
}));

describe("characterController", () => {
  let res;
  let next;
  let req;

  beforeEach(() => {
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
      params: {},
    };
    req = {
      params: {},
      body: {},
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe("getOne", () => {
    it("should respond with one user if found", async () => {
      const mockCharacter = { id: 2, name: "grumpy", sex: "female", level: 190, alignment: "bontarien" };
      const req = { params: { id: 2 } };
      Character.findByPk.mockResolvedValue(mockCharacter);

      await characterController.getOne(req, res, next);

      expect(Character.findByPk).toHaveBeenCalledWith(2);
      expect(res.json).toHaveBeenCalledWith(mockCharacter);
    });

    it("should call next() if user not found", async () => {
      const req = { params: { id: 404 } };
      Character.findByPk.mockResolvedValue(null);

      await characterController.getOne(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("post", () => {
    it("should create and return a new user", async () => {
        const inputData = {
            name: "chronos",
            sex: "male",
            level: 180,
            alignment: "bontarien"
        };

        const mockCreatedCharacter = {
            id: 3,
            ...inputData
        };

        req.body = inputData;
        Character.create.mockResolvedValue(mockCreatedCharacter);

        await characterController.post(req, res);

        expect(Character.create).toHaveBeenCalledWith(inputData);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockCreatedCharacter);
        });
    });

  describe("update", () => {
    it("should update and return the updated character", async () => {
      req.params.id = 5;
      req.body = {
        name: "chronos-trigger",
        sex: "male",
        level: 190,
      };

      const mockCharacter = {
        id: 5,
        name: "old-name",
        sex: "female",
        level: 180,
        update: vi.fn().mockResolvedValue({
          id: 5,
          name: "chronos-trigger",
          sex: "male",
          level: 190
        }),
      };

      Character.findByPk.mockResolvedValue(mockCharacter);

      await characterController.update(req, res, next);

      expect(Character.findByPk).toHaveBeenCalledWith(5);
      expect(mockCharacter.update).toHaveBeenCalledWith({
        name: "chronos-trigger",
        sex: "male",
        level: 190
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 5,
        name: "chronos-trigger",
        sex: "male",
        level: 190
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if character not found", async () => {
      req.params.id = 12;
      Character.findByPk.mockResolvedValue(null);

      await characterController.update(req, res, next);

      expect(next).toHaveBeenCalled();
    });

  });

  describe("delete", () => {
    it("should delete user if found", async () => {
      req.params.id = 7;
      const mockCharacter = { id: 7 };
      Character.findByPk.mockResolvedValue(mockCharacter);

      await characterController.delete(req, res, next);

      expect(Character.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it("should call next() if user not found", async () => {
      req.params.id = 88;
      Character.findByPk.mockResolvedValue(null);

      await characterController.delete(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
