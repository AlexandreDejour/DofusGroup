import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { Breed } from "../../../types/breed";

import { ApiClient } from "../../client";
import { BreedService } from "../breedService";

vi.mock("axios");

describe("BreedService", () => {
  let apiClientMock: any;
  let breedService: BreedService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    breedService = new BreedService(apiClientMock as ApiClient);
    vi.mocked(axios.isAxiosError).mockReturnValue(false);
  });

  describe("getBreeds", () => {
    it("should call axios.get with the correct URL on success", async () => {
      // Données de mock pour une réponse réussie
      const mockBreeds: Breed[] = [
        { id: "123", name: "Iop" } as Breed,
        { id: "456", name: "Cra" } as Breed,
      ];
      apiClientMock.instance.get.mockResolvedValue({ data: mockBreeds });

      const result = await breedService.getBreeds();

      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/breeds");
      expect(result).toEqual(mockBreeds);
    });

    it("should throw a specific error if response status is 204", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 204 },
      };

      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      await expect(breedService.getBreeds()).rejects.toThrow(
        "Aucune classe disponible.",
      );
    });

    it("should re-throw a generic error if it's not an AxiosError", async () => {
      const genericError = new Error("Network error");
      apiClientMock.instance.get.mockRejectedValue(genericError);

      await expect(breedService.getBreeds()).rejects.toThrow("Network error");
    });
  });
});
