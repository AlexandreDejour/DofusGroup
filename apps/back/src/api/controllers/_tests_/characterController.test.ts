import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
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
  const mockGetOne = vi.spyOn(CharacterRepository.prototype, "getOne");
  const mockGetAllEnriched = vi.spyOn(
    CharacterRepository.prototype,
    "getAllEnrichedByUserId",
  );
  const mockGetOneEnriched = vi.spyOn(
    CharacterRepository.prototype,
    "getOneEnriched",
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

  const underTest: CharacterController = new CharacterController(
    new CharacterRepository(),
  );

  // --- GET ALL ---
  describe("getAllByUserId", () => {
    req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };

    it("Return characters if exist.", async () => {
      // GIVEN
      const mockCharacters: Character[] = [
        {
          id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
          name: "Night-Hunter",
          sex: "M",
          level: 190,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1EFhw",
        },
      ];

      mockGetAll.mockResolvedValue(mockCharacters);
      // WHEN
      await underTest.getAllByUserId(req as Request, res as Response, next);
      // THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCharacters);
      expect(res.status).not.toHaveBeenCalledWith(status.NO_CONTENT);
    });

    it("Return 204 if any character found.", async () => {
      const mockCharacters: Character[] = [];

      mockGetAll.mockResolvedValue(mockCharacters);
      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NO_CONTENT,
          message: "Any character found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAll.mockRejectedValue(error);
      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ---
  describe("getOne", () => {
    req.params = {
      userId: "436d798e-b084-454c-8f78-593e966a9a66",
      characterId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
    };

    it("Return character if exists", async () => {
      const mockCharacter: Character = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
      };

      mockGetOne.mockResolvedValue(mockCharacter);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockCharacter);
    });

    it("Return 404 if any character found.", async () => {
      mockGetOne.mockResolvedValue(null);
      await underTest.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Character not found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL ENRICHED ---
  describe("getAllByUserIdEnriched", () => {
    req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };

    it("Return characters if exist.", async () => {
      // GIVEN
      const mockCharactersEnriched: CharacterEnriched[] = [
        {
          id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
          name: "Night-Hunter",
          sex: "M",
          level: 190,
          alignment: "Bonta",
          stuff: "https://d-bk.net/fr/d/1EFhw",
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
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );
      //THEN
      expect(mockGetAllEnriched).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCharactersEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 204 if any character found.", async () => {
      const mockCharactersEnriched: CharacterEnriched[] = [];

      mockGetAllEnriched.mockResolvedValue(mockCharactersEnriched);
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NO_CONTENT,
          message: "Any character found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAllEnriched.mockRejectedValue(error);
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ENRICHED ---
  describe("getOneByUserIdEnriched", () => {
    req.params = {
      userId: "436d798e-b084-454c-8f78-593e966a9a66",
      characterId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
    };

    it("Return character if exists", async () => {
      const mockCharacterEnriched: CharacterEnriched = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
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
      await underTest.getOneEnriched(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockCharacterEnriched);
    });

    it("Return 204 if any character found.", async () => {
      mockGetOneEnriched.mockResolvedValue(null);
      await underTest.getOneEnriched(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NO_CONTENT,
          message: "Any character found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOneEnriched.mockRejectedValue(error);
      await underTest.getOneEnriched(req as Request, res as Response, next);

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
      const mockNewCharacter: Character = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
      };
      const mockNewCharacterEnriched: CharacterEnriched = {
        id: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
        name: "Night-Hunter",
        sex: "M",
        level: 190,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1EFhw",
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
      mockGetOneEnriched.mockResolvedValue(mockNewCharacterEnriched);
      // WHEN
      await underTest.post(req as Request, res as Response, next);
      //THEN
      expect(mockPost).toHaveBeenCalledWith(mockDatas);
      expect(res.json).toHaveBeenCalledWith(mockNewCharacterEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });
  });

  // --- PATCH ---
  describe("update", () => {
    it("Return character if updated.", async () => {
      // GIVEN
      req.params = {
        userId: "436d798e-b084-454c-8f78-593e966a9a66",
        characterId: "0f309e32-2281-4b46-bb2e-bc2a7248e39b",
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
      mockGetOneEnriched.mockResolvedValue(mockUpdatedCharacter);
      // WHEN
      await underTest.update(req as Request, res as Response, next);
      //THEN
      expect(mockUpdatedCharacter.level).toBe(200);
      expect(mockUpdatedCharacter.alignment).toBe("Brakmar");
      expect(mockUpdate).toHaveBeenCalledWith(
        req.params.userId,
        req.params.characterId,
        mockDatas,
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedCharacter);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId isn't define.", async () => {
      req.params = {};

      await underTest.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.BAD_REQUEST,
          message: "User ID is required",
        }),
      );
    });

    it("Return 404 if any character found.", async () => {
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

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Character not found",
        }),
      );
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
    req.params = { userId: "436d798e-b084-454c-8f78-593e966a9a66" };

    it("Return 204 if character is delete.", async () => {
      // GIVEN
      mockDelete.mockResolvedValue(true);
      // WHEN
      await underTest.delete(req as Request, res as Response, next);
      //THEN
      expect(mockDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Call next() if character doesn't exists.", async () => {
      mockDelete.mockResolvedValue(false);
      await underTest.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Character not found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockDelete.mockRejectedValue(error);
      await underTest.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
