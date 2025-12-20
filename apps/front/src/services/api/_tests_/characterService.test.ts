import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import { t } from "../../../i18n/i18n-helper";

import type { ApiClient } from "../../client";
import type { CreateCharacterForm } from "../../../types/form";
import type { Character, CharacterEnriched } from "../../../types/character";

import { CharacterService } from "../characterService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("CharacterService", () => {
  let apiClientMock: {
    get: Mock;
    post: Mock;
    patch: Mock;
    delete: Mock;
  };

  let characterService: CharacterService;

  beforeEach(() => {
    vi.clearAllMocks();

    apiClientMock = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    characterService = new CharacterService(
      apiClientMock as unknown as ApiClient,
    );
  });

  describe("getAllByUserId", () => {
    it("returns characters on success", async () => {
      const characters: Character[] = [
        { id: "1", name: "Iop", level: 200 },
      ] as Character[];

      apiClientMock.get.mockResolvedValue({ data: characters });

      const result = await characterService.getAllByUserId("user-id");

      expect(apiClientMock.get).toHaveBeenCalledWith(
        "/user/user-id/characters",
      );
      expect(result).toEqual(characters);
    });

    it("calls handleApiError and returns undefined", async () => {
      const error = new Error("Server error");
      apiClientMock.get.mockRejectedValue(error);

      const result = await characterService.getAllByUserId("user-id");

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getAllEnrichedByUserId", () => {
    it("returns enriched characters", async () => {
      const characters: CharacterEnriched[] = [
        { id: "1", name: "Cra", level: 200 },
      ] as CharacterEnriched[];

      apiClientMock.get.mockResolvedValue({ data: characters });

      const result = await characterService.getAllEnrichedByUserId("user-id");

      expect(apiClientMock.get).toHaveBeenCalledWith(
        "/user/user-id/characters/enriched",
      );
      expect(result).toEqual(characters);
    });
  });

  describe("getOneEnriched", () => {
    it("returns one enriched character", async () => {
      const character = {
        id: "char-id",
        name: "Eni",
        level: 150,
      } as CharacterEnriched;

      apiClientMock.get.mockResolvedValue({ data: character });

      const result = await characterService.getOneEnriched("char-id");

      expect(apiClientMock.get).toHaveBeenCalledWith(
        "/character/char-id/enriched",
      );
      expect(result).toEqual(character);
    });
  });

  describe("create", () => {
    const validData: CreateCharacterForm = {
      name: "Night-Hunter",
      sex: "M",
      level: 200,
      alignment: "Bonta",
      stuff: undefined,
      breed_id: "brd-1",
      server_id: "srv-1",
    };

    it("throws if level is invalid", async () => {
      await expect(
        characterService.create("user-id", {
          ...validData,
          level: 300,
        }),
      ).rejects.toThrow(t("validation.level.rules"));

      expect(apiClientMock.post).not.toHaveBeenCalled();
    });

    it("throws if stuff url is invalid", async () => {
      await expect(
        characterService.create("user-id", {
          ...validData,
          stuff: "https://invalid.url",
        }),
      ).rejects.toThrow(t("validation.url.rules"));
    });

    it("creates character on success", async () => {
      const character: Character = {
        id: "1",
        name: "Iop",
        level: 200,
      } as Character;

      apiClientMock.post.mockResolvedValue({ data: character });

      const result = await characterService.create("user-id", validData);

      expect(apiClientMock.post).toHaveBeenCalledWith(
        "/user/user-id/character",
        validData,
        { withCredentials: true },
      );
      expect(result).toEqual(character);
    });

    it("calls handleApiError on error", async () => {
      const error = new Error("Server error");
      apiClientMock.post.mockRejectedValue(error);

      const result = await characterService.create("user-id", validData);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("update", () => {
    it("updates character on success", async () => {
      const data: CreateCharacterForm = {
        name: "Night-Hunter",
        sex: "M",
        level: 200,
        alignment: "Bonta",
        stuff: undefined,
        breed_id: "brd-1",
        server_id: "srv-1",
      };

      const character = {
        id: "char-id",
        name: "Cra",
        level: 180,
      } as CharacterEnriched;

      apiClientMock.patch.mockResolvedValue({ data: character });

      const result = await characterService.update("user-id", "char-id", data);

      expect(apiClientMock.patch).toHaveBeenCalledWith(
        "/user/user-id/character/char-id",
        data,
        { withCredentials: true },
      );
      expect(result).toEqual(character);
    });
  });

  describe("delete", () => {
    it("deletes character on success", async () => {
      apiClientMock.delete.mockResolvedValue({ status: 204 });

      const result = await characterService.delete("user-id", "char-id");

      expect(apiClientMock.delete).toHaveBeenCalledWith(
        "/user/user-id/character/char-id",
        { withCredentials: true },
      );
      expect(result).toEqual({ status: 204 });
    });
  });
});
