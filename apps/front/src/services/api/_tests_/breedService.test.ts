import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import { Breed } from "../../../types/breed";

import { ApiClient } from "../../client";
import { BreedService } from "../breedService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("BreedService", () => {
  let apiClientMock: {
    get: Mock;
  };

  let breedService: BreedService;

  beforeEach(() => {
    (handleApiError as unknown as Mock).mockReset();

    apiClientMock = {
      get: vi.fn(),
    };

    breedService = new BreedService(apiClientMock as unknown as ApiClient);
  });

  describe("getBreeds", () => {
    it("returns breeds when request is successful", async () => {
      const mockBreeds: Breed[] = [
        { id: "6dd98471-3445-4e80-87ae-c82174fccfeb", name: "Iop" },
        { id: "3606e7c7-035a-47e1-a662-cc0ee58ed621", name: "Cra" },
      ];

      apiClientMock.get.mockResolvedValue({ data: mockBreeds });

      const result = await breedService.getBreeds();

      expect(apiClientMock.get).toHaveBeenCalledWith("/breeds");
      expect(result).toEqual(mockBreeds);
    });

    it("calls handleApiError and rethrows if it throws", async () => {
      const error = new Error("Any breed found.");
      apiClientMock.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementationOnce(() => {
        throw error;
      });

      await expect(breedService.getBreeds()).rejects.toThrow(
        "Any breed found.",
      );

      expect(handleApiError).toHaveBeenCalledWith(error);
    });

    it("returns undefined when handleApiError does not throw", async () => {
      const error = new Error("Server error");
      apiClientMock.get.mockRejectedValue(error);

      const result = await breedService.getBreeds();

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });
});
