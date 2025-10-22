import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import axios from "axios";
import { t } from "../../../i18n/i18n-helper";

import { CreateCharacterForm } from "../../../types/form";
import { Character, CharacterEnriched } from "../../../types/character";

import { ApiClient } from "../../client";
import { CharacterService } from "../characterService";
import handleApiError from "../../utils/handleApiError";

vi.mock("axios");

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

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
    server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
  };

  const mockCharacterEnriched: CharacterEnriched = {
    id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
    name: "Chronos",
    sex: "M",
    level: 50,
    alignment: "Neutre",
    stuff: "https://d-bk.net/fr/d/1QVjw",
    server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
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
    (handleApiError as unknown as Mock).mockReset();
    apiClientMock = {
      instance: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      },
    };
    characterService = new CharacterService(apiClientMock as ApiClient);
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

    it("should call handleApiError for a 204 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 204 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      const result = await characterService.getAllByUserId(
        "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
      );

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.get.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(
        characterService.getAllByUserId("fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588"),
      ).rejects.toThrow("Unknown error");

      expect(handleApiError).toHaveBeenCalledWith(genericError);
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

    it("should call handleApiError for a 204 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 204 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      const result = await characterService.getAllEnrichedByUserId(
        "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
      );

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.get.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(
        characterService.getAllEnrichedByUserId(
          "fcdb0dd1-7f7e-44bd-9a9b-c4daf6cb1588",
        ),
      ).rejects.toThrow("Unknown error");

      expect(handleApiError).toHaveBeenCalledWith(genericError);
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

      const result = await characterService.getOneEnriched(
        "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
      );

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.get.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(
        characterService.getOneEnriched("cfff40b3-9625-4f0a-854b-d8d6d6b4b667"),
      ).rejects.toThrow("Unknown error");

      expect(handleApiError).toHaveBeenCalledWith(genericError);
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
      ).rejects.toThrow(t("validation.level.rules"));
    });

    it("should throw an error if level is more than 200", async () => {
      const invalidData = { ...validData, level: 201 } as any;
      await expect(
        characterService.create(userId, invalidData),
      ).rejects.toThrow(t("validation.level.rules"));
    });

    it("should throw an error for an invalid DofusBook URL", async () => {
      const invalidData = {
        ...validData,
        stuff: "https://invalid-url.com",
      } as any;
      await expect(
        characterService.create(userId, invalidData),
      ).rejects.toThrow(t("validation.url.rules"));
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

    it("should call handleApiError for a 401 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      const result = await characterService.create(userId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should call handleApiError for a 403 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      const result = await characterService.create(userId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.post.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(characterService.create(userId, validData)).rejects.toThrow(
        "Unknown error",
      );

      expect(handleApiError).toHaveBeenCalledWith(genericError);
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
      ).rejects.toThrow(t("validation.level.rules"));
    });

    it("should throw error for invalid stuff URL", async () => {
      const invalidData = { ...validData, stuff: "https://invalid.com" } as any;
      await expect(
        characterService.update(userId, charId, invalidData),
      ).rejects.toThrow(t("validation.url.rules"));
    });

    it("should call handleApiError for a 401 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      const result = await characterService.update(userId, charId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should call handleApiError for a 403 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      const result = await characterService.update(userId, charId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should call handleApiError for a 404 status code and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.patch.mockRejectedValue(axiosError);

      const result = await characterService.update(userId, charId, validData);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.patch.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(
        characterService.update(userId, charId, validData),
      ).rejects.toThrow("Unknown error");

      expect(handleApiError).toHaveBeenCalledWith(genericError);
    });
  });

  describe("delete", () => {
    const userId = "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e";
    const charId = "cfff40b3-9625-4f0a-854b-d8d6d6b4b667";

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

    it("should call handleApiError for response 400, 401, or 403 and not throw", async () => {
      const statusCodes = [400, 401, 403];
      for (const statusCode of statusCodes) {
        const axiosError = {
          isAxiosError: true,
          response: { status: statusCode },
        };
        vi.mocked(axios.isAxiosError).mockReturnValue(true);
        apiClientMock.instance.delete.mockRejectedValue(axiosError);

        const result = await characterService.delete(userId, charId);

        expect(handleApiError).toHaveBeenCalledWith(axiosError);
        expect(result).toBeUndefined();
      }
    });

    it("should call handleApiError for response 404 and not throw", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.delete.mockRejectedValue(axiosError);

      const result = await characterService.delete(userId, charId);

      expect(handleApiError).toHaveBeenCalledWith(axiosError);
      expect(result).toBeUndefined();
    });

    it("should rethrow if handleApiError throws (generic error case)", async () => {
      const genericError = new Error("Unknown error");
      apiClientMock.instance.delete.mockRejectedValue(genericError);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw genericError;
      });

      await expect(characterService.delete(userId, charId)).rejects.toThrow(
        "Unknown error",
      );
      expect(handleApiError).toHaveBeenCalledWith(genericError);
    });
  });
});
