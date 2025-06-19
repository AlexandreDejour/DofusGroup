import { describe, it, expect, beforeEach, vi } from "vitest";

import { Request, Response, NextFunction } from "express";

import createHttpError, { HttpError } from "http-errors";

import Character from "../../models/Character.js";
import { characterController } from "../characterController.js";
import type {
  ICharacter,
  ICharacterEnriched,
} from "../../models/types/Character.js";
import type {
  IPostCharacterBody,
  ICharacterParams,
} from "../types/character.js";

vi.mock("../../models/Character", () => ({
  default: {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  },
}));

describe("characterController", () => {
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

  // --- GET ALL BY USER ID ---
  describe("getAllByUserId", () => {
    it("should return characters for a user if they exist", async () => {
      const mockCharacters: ICharacter[] = [
        {
          id: 1,
          name: "Night-hunter",
          sex: "M",
          level: 190,
          alignment: "Bonta",
          stuff: "",
          default_character: true,
          user_id: 1,
          breed_id: 15,
          server_id: 1,
        },
      ];
      (
        Character.findAll as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCharacters);
      req.params = { userId: "1" };

      await characterController.getAllByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.json).toHaveBeenCalledWith(mockCharacters);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("should return 404 if any characters found for the user", async () => {
      (
        Character.findAll as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue([]);
      req.params = { userId: "1" };

      await characterController.getAllByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "No characters found for this user",
      });
    });

    it("should call next() in case of error", async () => {
      const error: HttpError = createHttpError(500, "Internal error");
      (
        Character.findAll as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(error);
      req.params = { userId: "1" };

      await characterController.getAllByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL BY USER ID ENRICHED ---
  describe("getAllByUserIdEnriched", () => {
    it("should return enriched characters for a user if they exist", async () => {
      const mockCharacters: ICharacterEnriched[] = [
        {
          id: 1,
          name: "Night-hunter",
          sex: "M",
          level: 190,
          alignment: "Bonta",
          stuff: "",
          default_character: true,
          user: {
            id: 1,
            username: "Vonspliffeh",
            mail: "vonsliffeh@gmail.com",
          },
          breed: {
            id: 15,
            name: "Sram",
          },
          server: {
            id: 1,
            name: "Dakal",
            mono_account: true,
          },
          events: [],
        },
      ];
      (
        Character.findAll as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCharacters);
      req.params = { userId: "1" };

      await characterController.getAllByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(res.json).toHaveBeenCalledWith(mockCharacters);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("should return 404 if any enriched characters found for the user", async () => {
      (
        Character.findAll as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue([]);
      req.params = { userId: "1" };

      await characterController.getAllByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "No characters found for this user",
      });
    });

    it("should call next() in case of error", async () => {
      const error: HttpError = createHttpError(500, "Internal error");
      (
        Character.findAll as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(error);
      req.params = { userId: "1" };

      await characterController.getAllByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE BY USER ID ---
  describe("getOneByUserId", () => {
    it("should return a character for a user if it exists", async () => {
      const mockCharacter: ICharacter = {
        id: 1,
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
      };
      (
        Character.findOne as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCharacter);
      req.params = { userId: "1", characterId: "1" };
      await characterController.getOneByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.json).toHaveBeenCalledWith(mockCharacter);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("should return 404 if character not found for the user", async () => {
      (
        Character.findOne as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);
      req.params = { userId: "1", characterId: "1" };

      await characterController.getOneByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Character not found for this user",
      });
    });

    it("should call next() in case of error", async () => {
      const error: HttpError = createHttpError(500, "Internal error");
      (
        Character.findOne as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(error);
      req.params = { userId: "1", characterId: "1" };

      await characterController.getOneByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE BY USER ID ENRICHED ---
  describe("getOneByUserIdEnriched", () => {
    it("should return an enriched character for a user if it exists", async () => {
      const mockCharacter: ICharacterEnriched = {
        id: 1,
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "",
        default_character: true,
        user: {
          id: 1,
          username: "Vonspliffeh",
          mail: "vonsliffeh@gmail.com",
        },
        breed: {
          id: 15,
          name: "Sram",
        },
        server: {
          id: 1,
          name: "Dakal",
          mono_account: true,
        },
        events: [],
      };
      (
        Character.findOne as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCharacter);
      req.params = { userId: "1", characterId: "1" };
      await characterController.getOneByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(res.json).toHaveBeenCalledWith(mockCharacter);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });
    it("should return 404 if character not found for the user", async () => {
      (
        Character.findOne as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);
      req.params = { userId: "1", characterId: "1" };

      await characterController.getOneByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Character not found for this user",
      });
    });
    it("should call next() in case of error", async () => {
      const error: HttpError = createHttpError(500, "Internal error");
      (
        Character.findOne as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(error);
      req.params = { userId: "1", characterId: "1" };

      await characterController.getOneByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- POST CHARACTER ---
  describe("postCharacter", () => {
    it("should create a new character and return it", async () => {
      const mockCharacter: IPostCharacterBody = {
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
      };
      (
        Character.create as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCharacter);
      req.body = mockCharacter;
      req.params = { userId: "1" };
      await characterController.post(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockCharacter);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("should call next() in case of error", async () => {
      const error: HttpError = createHttpError(500, "Internal error");
      (
        Character.create as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(error);
      req.body = {
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
      };
      req.params = { userId: "1" };
      await characterController.post(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- PATCH CHARACTER ---
  describe("patchCharacter", () => {
    it("should update a character and return it", async () => {
      function updateMock(
        this: ICharacter,
        updates: IPostCharacterBody,
      ): Promise<ICharacter> {
        Object.assign(this, updates);
        return Promise.resolve(this);
      }

      type ICharacterMock = ICharacter & {
        update: typeof updateMock;
      };

      const mockCharacter: ICharacterMock = {
        id: 1,
        name: "Night-hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "",
        default_character: true,
        user_id: 1,
        breed_id: 15,
        server_id: 1,
        events: [],
        update: updateMock,
      };

      const mockUpdates: Partial<IPostCharacterBody> = {
        level: 200,
        alignment: "Bonta",
        default_character: false,
      };

      const mockUpdatedCharacter: ICharacterMock = {
        ...mockCharacter,
        ...mockUpdates,
      };

      (
        Character.findOne as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockCharacter);

      req.params = { userId: "1", characterId: "1" };
      req.body = mockUpdates;

      await characterController.update(
        req as Request<ICharacterParams, unknown, Partial<IPostCharacterBody>>,
        res as Response,
        next,
      );

      expect(res.json).toHaveBeenCalledWith(mockUpdatedCharacter);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("should return 404 if character not found for the user", async () => {
      (
        Character.findOne as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(null);
      req.params = { userId: "1", characterId: "1" };

      await characterController.getOneByUserId(
        req as Request,
        res as Response,
        next,
      );

      await characterController.update(
        req as Request<ICharacterParams, unknown, Partial<IPostCharacterBody>>,
        res as Response,
        next,
      );

      expect(vi.spyOn(characterController, "update")).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Character not found for this user",
      });
    });

    it("should call next() in case of error", async () => {
      const error: HttpError = createHttpError(500, "Internal error");
      (
        Character.update as unknown as ReturnType<typeof vi.fn>
      ).mockRejectedValue(error);

      await characterController.getOneByUserId(
        req as Request,
        res as Response,
        next,
      );

      await characterController.update(
        req as Request<ICharacterParams, unknown, Partial<IPostCharacterBody>>,
        res as Response,
        next,
      );

      expect(vi.spyOn(characterController, "update")).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
