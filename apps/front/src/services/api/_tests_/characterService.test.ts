import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { ApiClient } from "../../client";
import { CharacterService } from "../characterService";

vi.mock("axios");

describe("CharacterService", () => {
  let apiClientMock: any;
  let characterService: CharacterService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
        delete: vi.fn(),
      },
    };
    characterService = new CharacterService(apiClientMock as ApiClient);
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

    it("Throw specific error if response if 400", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 400 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.delete.mockRejectedValue(axiosError);

      await expect(
        characterService.delete("user123", "character456"),
      ).rejects.toThrow("Cette action est impossible.");
    });

    it("Throw specific error if response if 404", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.delete.mockRejectedValue(axiosError);

      await expect(
        characterService.delete("user123", "character456"),
      ).rejects.toThrow("Ce personnage n'existe plus.");
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      (axios.isAxiosError as any).mockReturnValue(false);
      apiClientMock.instance.delete.mockRejectedValue(error);

      await expect(
        characterService.delete("user123", "character456"),
      ).rejects.toThrow("Unknown error");
    });
  });
});
