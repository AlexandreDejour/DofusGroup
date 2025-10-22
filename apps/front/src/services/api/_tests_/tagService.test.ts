import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import { Tag } from "../../../types/tag";

import { ApiClient } from "../../client";
import { TagService } from "../tagService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("TagService", () => {
  let apiClientMock: any;
  let tagService: TagService;

  beforeEach(() => {
    (handleApiError as unknown as Mock).mockReset();
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    tagService = new TagService(apiClientMock as ApiClient);
  });

  describe("getTags", () => {
    it("should call axios.get with the correct URL on success", async () => {
      const mockTags: Tag[] = [
        { id: "123", name: "Donjon", color: "#0000" },
        { id: "456", name: "XP", color: "#ffff" },
      ];
      apiClientMock.instance.get.mockResolvedValue({ data: mockTags });

      const result = await tagService.getTags();

      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/tags");
      expect(result).toEqual(mockTags);
    });

    it("Throw specific error when any tag found (handleApiError throws)", async () => {
      const error = new Error("Any tag found.");
      apiClientMock.instance.get.mockRejectedValue(error);

      (handleApiError as unknown as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(tagService.getTags()).rejects.toThrow("Any tag found.");

      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
