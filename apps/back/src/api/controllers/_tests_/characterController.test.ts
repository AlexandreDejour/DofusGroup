import { describe, it, expect, vi, beforeEach } from "vitest";

import type { Request, Response } from "express";

import {
  Character,
  CharacterBodyData,
  CharacterEnriched,
} from "../../../types/character.js";
import { CharacterController } from "../characterController.js";
import { CharacterRepository } from "../../../middlewares/repository/characterRepository.js";

describe("CharacterController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/characterRepository.js");
  const mockGetAll = vi.spyOn(CharacterRepository.prototype, "getAllByUserId");
  const mockGetOne = vi.spyOn(CharacterRepository.prototype, "getOneByUserId");
  const mockGetAllEnriched = vi.spyOn(
    CharacterRepository.prototype,
    "getAllByUserIdEnriched",
  );
  const mockGetOneEnriched = vi.spyOn(
    CharacterRepository.prototype,
    "getOneByUserIdEnriched",
  );
  const mockPost = vi.spyOn(CharacterRepository.prototype, "post");
  const mockUpdate = vi.spyOn(CharacterRepository.prototype, "update");
  const mockDelete = vi.spyOn(CharacterRepository.prototype, "delete");

  req = {};
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const underTest: CharacterController = new CharacterController();

  // --- GET ALL ---
  describe("getAllByUserId", () => {
    it("Return character if exist.", async () => {
      // GIVEN
      req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };
      const mockCharacters: Character[] = [
        {
          id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
          name: "Night-Hunter",
          sex: "M",
          level: 190,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1EFhw",
          default_character: true,
        },
      ];

      mockGetAll.mockResolvedValue(mockCharacters);
      // WHEN
      await underTest.getAllByUserId(req as Request, res as Response, next);
      //THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCharacters);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("Return 404 if any character found.", async () => {
      req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };
      const mockCharacters: Character[] = [];

      mockGetAll.mockResolvedValue(mockCharacters);
      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Any character found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAll.mockRejectedValue(error);
      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ---
  describe("getOneByUserId", () => {
    it("Return character if exists", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        characterId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
      };
      const mockCharacter: Character = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
      };

      mockGetOne.mockResolvedValue(mockCharacter);
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockCharacter);
    });

    it("Call next() if character doesn't exists.", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        characterId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
      };

      mockGetOne.mockResolvedValue(null);
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Character not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL ENRICHED ---
  describe("getAllByUserIdEnriched", () => {
    it("Return character if exist.", async () => {
      // GIVEN
      req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };
      const mockCharactersEnriched: CharacterEnriched[] = [
        {
          id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
          name: "Night-Hunter",
          sex: "M",
          level: 190,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1EFhw",
          default_character: true,
          user: {
            id: "436d798e-b084-454c-8f78-593e966a9a66",
            username: "Goldorak",
          },
          breed: { id: "9a252130-3af3-4e5c-a957-a04a6f23c59a", name: "Sram" },
          server: {
            id: "c3e35f15-d01a-439e-98ed-4a15ff39dae2",
            name: "Dakal",
            mono_account: true,
          },
          events: [],
        },
      ];

      mockGetAllEnriched.mockResolvedValue(mockCharactersEnriched);
      // WHEN
      await underTest.getAllByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );
      //THEN
      expect(mockGetAllEnriched).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCharactersEnriched);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("Return 404 if any character found.", async () => {
      req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };
      const mockCharactersEnriched: CharacterEnriched[] = [];

      mockGetAllEnriched.mockResolvedValue(mockCharactersEnriched);
      await underTest.getAllByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Any character found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAllEnriched.mockRejectedValue(error);
      await underTest.getAllByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ENRICHED ---
  describe("getOneByUserIdEnriched", () => {
    it("Return character if exists", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        characterId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
      };
      const mockCharacterEnriched: CharacterEnriched = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
        user: {
          id: "436d798e-b084-454c-8f78-593e966a9a66",
          username: "Goldorak",
        },
        breed: { id: "9a252130-3af3-4e5c-a957-a04a6f23c59a", name: "Sram" },
        server: {
          id: "c3e35f15-d01a-439e-98ed-4a15ff39dae2",
          name: "Dakal",
          mono_account: true,
        },
        events: [],
      };

      mockGetOneEnriched.mockResolvedValue(mockCharacterEnriched);
      await underTest.getOneByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(res.json).toHaveBeenCalledWith(mockCharacterEnriched);
    });

    it("Call next() if character doesn't exists.", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        characterId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
      };

      mockGetOneEnriched.mockResolvedValue(null);
      await underTest.getOneByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Character not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOneEnriched.mockRejectedValue(error);
      await underTest.getOneByUserIdEnriched(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- POST ---
  describe("post", () => {
    it("Return character if create.", async () => {
      // GIVEN
      req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };
      req.body = {
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
        breed_id: "eb09dc14-37a4-417c-aaab-7416e5ffb0c2",
        server_id: "f62cf8c1-0394-4255-ab6b-a2d255d1b923",
      };
      const mockDatas: CharacterBodyData = {
        ...req.body,
        user_id: req.params.userId,
      };
      const mockNewCharacter: CharacterEnriched = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
        user: {
          id: "436d798e-b084-454c-8f78-593e966a9a66",
          username: "Goldorak",
        },
        breed: { id: "9a252130-3af3-4e5c-a957-a04a6f23c59a", name: "Sram" },
        server: {
          id: "c3e35f15-d01a-439e-98ed-4a15ff39dae2",
          name: "Dakal",
          mono_account: true,
        },
        events: [],
      };

      mockPost.mockResolvedValue(mockNewCharacter);
      // WHEN
      await underTest.post(req as Request, res as Response, next);
      //THEN
      expect(mockPost).toHaveBeenCalledWith(mockDatas);
      expect(res.json).toHaveBeenCalledWith(mockNewCharacter);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("Return 400 if userId isn't define.", async () => {
      req.params = {};

      await underTest.post(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User ID is required" });
    });

    it("Call next() in case of error.", async () => {
      req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };
      req.body = {
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
        user_id: "436d798e-b084-454c-8f78-593e966a9a66",
        breed_id: "eb09dc14-37a4-417c-aaab-7416e5ffb0c2",
        server_id: "f62cf8c1-0394-4255-ab6b-a2d255d1b923",
      };
      const error = new Error();

      mockPost.mockRejectedValue(error);
      await underTest.post(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- PATCH ---
  describe("update", () => {
    it("Return character if updated.", async () => {
      // GIVEN
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        characterId: "3aa64b38-e41c-44ae-94ea-3b75082fb8fb",
      };
      req.body = {
        level: 200,
        alignment: "Brakmar",
        default_character: false,
      };
      const mockDatas: CharacterBodyData = req.body;
      const mockCharacterToUpdate: CharacterEnriched = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
        default_character: true,
        user: {
          id: "436d798e-b084-454c-8f78-593e966a9a66",
          username: "Goldorak",
        },
        breed: { id: "9a252130-3af3-4e5c-a957-a04a6f23c59a", name: "Sram" },
        server: {
          id: "c3e35f15-d01a-439e-98ed-4a15ff39dae2",
          name: "Dakal",
          mono_account: true,
        },
        events: [],
      };
      const mockUpdatedCharacter = { ...mockCharacterToUpdate, ...mockDatas };

      mockUpdate.mockResolvedValue(mockUpdatedCharacter);
      // WHEN
      await underTest.update(req as Request, res as Response, next);
      //THEN
      expect(mockUpdatedCharacter.level).toBe(200);
      expect(mockUpdatedCharacter.alignment).toBe("Brakmar");
      expect(mockUpdatedCharacter.default_character).toBe(false);
      expect(mockUpdate).toHaveBeenCalledWith(mockDatas);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedCharacter);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("Return 400 if userId isn't define.", async () => {
      req.params = {};

      await underTest.update(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User ID is required" });
    });

    it("Call next() if character doesn't exists.", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        characterId: "3aa64b38-e41c-44ae-94ea-3b75082fb8fb",
      };
      req.body = {
        level: 200,
        alignment: "Brakmar",
        default_character: false,
      };

      mockUpdate.mockResolvedValue(null);
      await underTest.update(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Character not found" });
    });

    it("Call next() in case of error.", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        characterId: "3aa64b38-e41c-44ae-94ea-3b75082fb8fb",
      };
      req.body = {
        level: 200,
        alignment: "Brakmar",
        default_character: false,
      };
      const error = new Error();

      mockUpdate.mockRejectedValue(error);
      await underTest.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- DELETE ---
  describe("delete", () => {
    it("Return 204 if character is delete.", async () => {
      // GIVEN
      req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };

      mockDelete.mockResolvedValue(true);
      // WHEN
      await underTest.delete(req as Request, res as Response, next);
      //THEN
      expect(mockDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("Call next() if character doesn't exists.", async () => {
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
      };

      mockDelete.mockResolvedValue(false);
      await underTest.delete(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Character not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockDelete.mockRejectedValue(error);
      await underTest.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
