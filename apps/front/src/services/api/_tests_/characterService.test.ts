import { describe, it, beforeEach, expect, vi } from "vitest";
import axios from "axios";
import { ApiClient } from "../../client";
import { CharacterService } from "../characterService";
import { Character } from "../../../types/character";
import { CreateCharacterForm } from "../../../types/form";

vi.mock("axios");

describe("CharacterService", () => {
  let apiClientMock: any;
  let characterService: CharacterService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
      },
    };
    characterService = new CharacterService(apiClientMock as ApiClient);
    vi.mocked(axios.isAxiosError).mockReturnValue(false); // Réinitialiser le mock
  });

  // Tests for the getAllByUserId method
  describe("getAllByUserId", () => {
    it("should call axios.get with the correct URL", async () => {
      const mockCharacters: Character[] = [
        { id: "1", name: "TestChar" } as Character,
      ];
      apiClientMock.instance.get.mockResolvedValue({ data: mockCharacters });

      const result = await characterService.getAllByUserId("user123");

      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        "/user/user123/characters",
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

      await expect(characterService.getAllByUserId("user123")).rejects.toThrow(
        "Vous n'avez créé aucun personnage sur votre compte.",
      );
    });

    it("should rethrow a generic error if not an AxiosError", async () => {
      const genericError = new Error("Network error");
      apiClientMock.instance.get.mockRejectedValue(genericError);

      await expect(characterService.getAllByUserId("user123")).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("create", () => {
    const userId = "user123";
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
      const mockResponse = { data: { id: "char456", ...validData } };
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
        data: { id: "char456", ...validDataWithNullStuff },
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

  describe("delete", () => {
    it("Call axios.delete with correct params", async () => {
      const mockResponse = { status: 200 };
      apiClientMock.instance.delete.mockResolvedValue(mockResponse);

      const result = await characterService.delete("user123", "character456");

      expect(apiClientMock.instance.delete).toHaveBeenCalledWith(
        "/user/user123/character/character456",
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
          characterService.delete("user123", "character456"),
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
        characterService.delete("user123", "character456"),
      ).rejects.toThrow("Ce personnage n'existe plus.");
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      apiClientMock.instance.delete.mockRejectedValue(error);

      await expect(
        characterService.delete("user123", "character456"),
      ).rejects.toThrow("Unknown error");
    });
  });
});
