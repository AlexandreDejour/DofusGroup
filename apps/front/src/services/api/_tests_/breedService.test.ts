import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import { Breed } from "../../../types/breed";

import { ApiClient } from "../../client";
import { BreedService } from "../breedService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("BreedService", () => {
  let apiClientMock: any;
  let breedService: BreedService;

  beforeEach(() => {
    (handleApiError as unknown as Mock).mockReset();
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    breedService = new BreedService(apiClientMock as ApiClient);
  });

  describe("getBreeds", () => {
    it("should call axios.get with the correct URL on success", async () => {
      const mockBreeds: Breed[] = [
        { id: "6dd98471-3445-4e80-87ae-c82174fccfeb", name: "Iop" },
        { id: "3606e7c7-035a-47e1-a662-cc0ee58ed621", name: "Cra" },
      ];
      apiClientMock.instance.get.mockResolvedValue({ data: mockBreeds });

      const result = await breedService.getBreeds();

      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/breeds");
      expect(result).toEqual(mockBreeds);
    });

    it("Throw specific error when any breed found (handleApiError throws)", async () => {
      const error = new Error("Any breed found.");
      apiClientMock.instance.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(breedService.getBreeds()).rejects.toThrow(
        "Any breed found.",
      );

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
