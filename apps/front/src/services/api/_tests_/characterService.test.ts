import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { Character, CharacterEnriched } from "../../../types/character";
import { CreateCharacterForm } from "../../../types/form";

import { ApiClient } from "../../client";
import { CharacterService } from "../characterService";

vi.mock("axios");

describe("CharacterService", () => {
  let apiClientMock: any;
  let characterService: CharacterService;

  const mockCharacter: Character = {
    id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
    name: "Chronos",
    sex: "M",
    level: 50,
    alignment: "Neutre",
    stuff: "https://d-bk.net/fr/d/1QVjw",
    default_character: false,
  };

  const mockCharacterEnriched: CharacterEnriched = {
    id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
    name: "Chronos",
    sex: "M",
    level: 50,
    alignment: "Neutre",
    stuff: "https://d-bk.net/fr/d/1QVjw",
    default_character: false,
    server: {
      id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
      name: "Dakal",
      mono_account: true,
    },
    breed: {
      id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
      name: "Cra",
    },
    events: [],
    user: {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
    },
  };

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    };
    characterService = new CharacterService(apiClientMock as ApiClient);
    vi.mocked(axios.isAxiosError).mockReturnValue(false); // Réinitialiser le mock
  });

  describe("getAllByUserId", () => {
    it("should call axios.get with the correct URL", async () => {
      const mockCharacters: Character[] = [mockCharacter];
      apiClientMock.instance.get.mockResolvedValue({ data: mockCharacters });

      const result = await characterService.getAllByUserId(
        "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
      );

      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        "/user/fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588/characters",
      );
      expect(result).toEqual(mockCharacters);
    });

    it("should throw a specific error for a 204 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 204 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      await expect(
        characterService.getAllByUserId("fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588"),
      ).rejects.toThrow("Vous n'avez créé aucun personnage sur votre compte.");
    });

    it("should rethrow a generic error if not an AxiosError", async () => {
      const genericError = new Error("Network error");
      apiClientMock.instance.get.mockRejectedValue(genericError);

      await expect(
        characterService.getAllByUserId("fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588"),
      ).rejects.toThrow("Network error");
    });
  });

  describe("getAllEnrichedByUserId", () => {
    it("should call axios.get with correct URL and return data", async () => {
      const mockData: CharacterEnriched[] = [mockCharacterEnriched];
      apiClientMock.instance.get.mockResolvedValue({ data: mockData });

      const result = await characterService.getAllEnrichedByUserId(
        "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
      );

      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        "/user/fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588/characters/enriched",
      );
      expect(result).toEqual(mockData);
    });

    it("should throw specific error on 204", async () => {
      const axiosError = { isAxiosError: true, response: { status: 204 } };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      await expect(
        characterService.getAllEnrichedByUserId(
          "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
        ),
      ).rejects.toThrow("Vous n'avez créé aucun personnage sur votre compte.");
    });
  });

  describe("getOneEnriched", () => {
    it("should call axios.get and return character", async () => {
      apiClientMock.instance.get.mockResolvedValue({
        data: mockCharacterEnriched,
      });

      const result = await characterService.getOneEnriched(
        "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
      );

      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        "/character/cfff40b3-9625-4f0a-854b-d8d6d6b4b667/enriched",
      );
      expect(result).toEqual(mockCharacterEnriched);
    });

    it("should throw error on axios error with response status", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
        message: "Not found",
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      await expect(
        characterService.getOneEnriched("cfff40b3-9625-4f0a-854b-d8d6d6b4b667"),
      ).rejects.toThrow("Not found");
    });
  });

  describe("create", () => {
    const userId = "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588";
    const validData: CreateCharacterForm = {
      name: "ValidChar",
      level: 150,
      sex: "F",
      alignment: "Bonta",
      stuff: "https://d-bk.net/fr/d/ABCDE",
      default_character: false,
      server_id: "server1",
      breed_id: "breed1",
    };

    it("should call axios.post with correct params on success", async () => {
      const mockResponse = {
        data: { id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667", ...validData },
      };
      apiClientMock.instance.post.mockResolvedValue(mockResponse);

      const result = await characterService.create(userId, validData);

      expect(apiClientMock.instance.post).toHaveBeenCalledWith(
        `/user/${userId}/character`,
        validData,
        { withCredentials: true },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if level is less than 1", async () => {
      const invalidData = { ...validData, level: 0 } as any;
      await expect(
        characterService.create(userId, invalidData),
      ).rejects.toThrow(
        "Le niveau de votre personnage doit être compris entre 1 et 200.",
      );
    });

    it("should throw an error if level is more than 200", async () => {
      const invalidData = { ...validData, level: 201 } as any;
      await expect(
        characterService.create(userId, invalidData),
      ).rejects.toThrow(
        "Le niveau de votre personnage doit être compris entre 1 et 200.",
      );
    });

    it("should throw an error for an invalid DofusBook URL", async () => {
      const invalidData = {
        ...validData,
        stuff: "https://invalid-url.com",
      } as any;
      await expect(
        characterService.create(userId, invalidData),
      ).rejects.toThrow(
        "Seules les URL provenant de DofusBook sont acceptées.",
      );
    });

    it("should not throw an error if stuff is null", async () => {
      const validDataWithNullStuff = { ...validData, stuff: null } as any;
      apiClientMock.instance.post.mockResolvedValue({
        data: {
          id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
          ...validDataWithNullStuff,
        },
      });

      await expect(
        characterService.create(userId, validDataWithNullStuff),
      ).resolves.not.toThrow();
    });

    it("should throw a specific error for a 400 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 400 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      await expect(characterService.create(userId, validData)).rejects.toThrow(
        "Les informations transmises sont érronées ou incomplètes.",
      );
    });

    it("should throw a specific error for a 401 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      await expect(characterService.create(userId, validData)).rejects.toThrow(
        "Vous devez être connecter pour créer un personnage.",
      );
    });

    it("should throw a specific error for a 403 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      await expect(characterService.create(userId, validData)).rejects.toThrow(
        "La création de personnage est réservée à votre compte.",
      );
    });

    it("should rethrow a generic error if not an AxiosError", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.post.mockRejectedValue(genericError);

      await expect(characterService.create(userId, validData)).rejects.toThrow(
        "Unknown error",
      );
    });
  });

  describe("update", () => {
    const userId = "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e";
    const charId = "cfff40b3-9625-4f0a-854b-d8d6d6b4b667";
    const validData: CreateCharacterForm = {
      name: "ValidChar",
      level: 150,
      sex: "F",
      alignment: "Bonta",
      stuff: "https://d-bk.net/fr/d/ABCDE",
      default_character: false,
      server_id: "server1",
      breed_id: "breed1",
    };

    it("should call axios.patch with correct params and return data", async () => {
      const mockResponse = { data: { id: charId, ...validData } };
      apiClientMock.instance.patch.mockResolvedValue(mockResponse);

      const result = await characterService.update(userId, charId, validData);

      expect(apiClientMock.instance.patch).toHaveBeenCalledWith(
        `/user/${userId}/character/${charId}`,
        validData,
        { withCredentials: true },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error for invalid level", async () => {
      const invalidData = { ...validData, level: 0 } as any;
      await expect(
        characterService.update(userId, charId, invalidData),
      ).rejects.toThrow(
        "Le niveau de votre personnage doit être compris entre 1 et 200.",
      );
    });

    it("should throw error for invalid stuff URL", async () => {
      const invalidData = { ...validData, stuff: "https://invalid.com" } as any;
      await expect(
        characterService.update(userId, charId, invalidData),
      ).rejects.toThrow(
        "Seules les URL provenant de DofusBook sont acceptées.",
      );
    });
  });

  describe("delete", () => {
    it("Call axios.delete with correct params", async () => {
      const mockResponse = { status: 200 };
      apiClientMock.instance.delete.mockResolvedValue(mockResponse);

      const result = await characterService.delete(
        "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
        "character456",
      );

      expect(apiClientMock.instance.delete).toHaveBeenCalledWith(
        "/user/fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588/character/character456",
        { withCredentials: true },
      );
      expect(result).toBe(mockResponse);
    });

    it("Throw specific error if response is 400, 401, or 403", async () => {
      const statusCodes = [400, 401, 403];
      for (const status of statusCodes) {
        const axiosError = {
          isAxiosError: true,
          response: { status: status },
        };
        vi.mocked(axios.isAxiosError).mockReturnValue(true);
        apiClientMock.instance.delete.mockRejectedValue(axiosError);

        await expect(
          characterService.delete(
            "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
            "character456",
          ),
        ).rejects.toThrow("Cette action n'est pas autorisée.");
      }
    });

    it("Throw specific error if response is 404", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.delete.mockRejectedValue(axiosError);

      await expect(
        characterService.delete(
          "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
          "character456",
        ),
      ).rejects.toThrow("Ce personnage n'existe plus.");
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      apiClientMock.instance.delete.mockRejectedValue(error);

      await expect(
        characterService.delete(
          "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
          "character456",
        ),
      ).rejects.toThrow("Unknown error");
    });
  });
});
