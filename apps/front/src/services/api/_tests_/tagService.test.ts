import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { Tag } from "../../../types/tag";

import { ApiClient } from "../../client";
import { TagService } from "../tagService";

vi.mock("axios");

describe("TagService", () => {
  let apiClientMock: any;
  let tagService: TagService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    tagService = new TagService(apiClientMock as ApiClient);
    vi.mocked(axios.isAxiosError).mockReturnValue(false);
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

    it("should throw a specific error if response status is 204", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 204 },
      };

      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      await expect(tagService.getTags()).rejects.toThrow(
        "Aucun tag disponible.",
      );
    });

    it("should re-throw a generic error if it's not an AxiosError", async () => {
      const genericError = new Error("Network error");
      apiClientMock.instance.get.mockRejectedValue(genericError);

      await expect(tagService.getTags()).rejects.toThrow("Network error");
    });
  });
});
