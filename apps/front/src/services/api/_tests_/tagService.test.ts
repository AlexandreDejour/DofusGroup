import { describe, it, beforeEach, expect, vi, type Mock } from "vitest";

import type { Tag } from "../../../types/tag";
import type { ApiClient } from "../../client";

import { TagService } from "../tagService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("TagService", () => {
  let apiClientMock: {
    get: Mock;
  };

  let tagService: TagService;

  beforeEach(() => {
    vi.clearAllMocks();

    apiClientMock = {
      get: vi.fn(),
    };

    tagService = new TagService(apiClientMock as unknown as ApiClient);
  });

  describe("getTags", () => {
    it("calls apiClient.get and returns sorted tags", async () => {
      const mockTags: Tag[] = [
        { id: "456", name: "XP", color: "#ffff" },
        { id: "123", name: "Donjon", color: "#0000" },
      ];

      apiClientMock.get.mockResolvedValue({ data: mockTags });

      const result = await tagService.getTags();

      expect(apiClientMock.get).toHaveBeenCalledWith("/tags");

      // sorted alphabetically by name
      expect(result).toEqual([
        { id: "123", name: "Donjon", color: "#0000" },
        { id: "456", name: "XP", color: "#ffff" },
      ]);
    });

    it("calls handleApiError and rethrows if it throws", async () => {
      const error = new Error("Any tag found.");
      apiClientMock.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(tagService.getTags()).rejects.toThrow("Any tag found.");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });

    it("calls handleApiError and returns undefined if it does not throw", async () => {
      const error = new Error("API error");
      apiClientMock.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => undefined);

      const result = await tagService.getTags();

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });
});
