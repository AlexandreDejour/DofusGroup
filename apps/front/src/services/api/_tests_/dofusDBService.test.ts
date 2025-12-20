import qs from "qs";
import { describe, it, beforeEach, expect, vi, Mock } from "vitest";

import type { ApiClient } from "../../client";
import type { Dungeon } from "../../../types/dofusDB";

import { DofusDBService } from "../dofusDBService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("DofusDBService", () => {
  let apiClientMock: {
    get: Mock;
  };

  let dofusDBService: DofusDBService;

  beforeEach(() => {
    vi.clearAllMocks();

    apiClientMock = {
      get: vi.fn(),
    };

    dofusDBService = new DofusDBService(apiClientMock as unknown as ApiClient);
  });

  describe("getAreas", () => {
    it("fetches all areas with pagination", async () => {
      const page1 = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Area ${i + 1}`,
      }));
      const page2 = Array.from({ length: 20 }, (_, i) => ({
        id: i + 51,
        name: `Area ${i + 51}`,
      }));

      apiClientMock.get
        .mockResolvedValueOnce({ data: { data: page1 } })
        .mockResolvedValueOnce({ data: { data: page2 } });

      const result = await dofusDBService.getAreas();

      expect(apiClientMock.get).toHaveBeenNthCalledWith(1, "/areas", {
        params: { $limit: 50, $skip: 0 },
      });
      expect(apiClientMock.get).toHaveBeenNthCalledWith(2, "/areas", {
        params: { $limit: 50, $skip: 50 },
      });

      expect(result).toHaveLength(70);
      expect(result?.[0].name).toBe("Area 1");
      expect(result?.[69].name).toBe("Area 70");
    });

    it("calls handleApiError and returns undefined on error", async () => {
      const error = new Error("API error");
      apiClientMock.get.mockRejectedValue(error);

      const result = await dofusDBService.getAreas();

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getSubAreas", () => {
    const areaId = 42;

    it("fetches sub areas for an area", async () => {
      const subAreas = [
        { id: 1, dungeonId: 2, name: "SubArea 1" },
        { id: 2, dungeonId: 3, name: "SubArea 2" },
      ];

      apiClientMock.get.mockResolvedValue({
        data: { data: subAreas },
      });

      const result = await dofusDBService.getSubAreas(areaId);

      expect(apiClientMock.get).toHaveBeenCalledWith("/subareas", {
        params: { areaId, $limit: 50 },
      });

      expect(result).toEqual(subAreas);
    });

    it("calls handleApiError and returns undefined on error", async () => {
      const error = new Error("SubAreas error");
      apiClientMock.get.mockRejectedValue(error);

      const result = await dofusDBService.getSubAreas(areaId);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getDungeons", () => {
    it("fetches all dungeons with pagination", async () => {
      const page1 = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Dungeon ${i + 1}`,
      }));
      const page2 = Array.from({ length: 10 }, (_, i) => ({
        id: i + 51,
        name: `Dungeon ${i + 51}`,
      }));

      apiClientMock.get
        .mockResolvedValueOnce({ data: { data: page1 } })
        .mockResolvedValueOnce({ data: { data: page2 } });

      const result = await dofusDBService.getDungeons();

      expect(apiClientMock.get).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(60);
    });

    it("calls handleApiError and returns undefined on error", async () => {
      const error = new Error("Dungeon error");
      apiClientMock.get.mockRejectedValue(error);

      const result = await dofusDBService.getDungeons();

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getDungeonsById", () => {
    it("fetches dungeons by ids using repeat paramsSerializer", async () => {
      const dungeonIds = [1, 2, 3];

      const apiResponse: Dungeon[] = [
        { id: 1, name: { fr: "D1" } } as any,
        { id: 2, name: { fr: "D2" } } as any,
      ];

      apiClientMock.get.mockResolvedValue({
        data: { data: apiResponse },
      });

      const result = await dofusDBService.getDungeonsById(dungeonIds);

      expect(apiClientMock.get).toHaveBeenCalledTimes(1);

      const [, options] = apiClientMock.get.mock.calls[0];
      expect(options.params).toEqual({ id: dungeonIds });
      expect(typeof options.paramsSerializer).toBe("function");

      const serialized = options.paramsSerializer({ id: dungeonIds });
      expect(serialized).toBe(
        qs.stringify({ id: dungeonIds }, { arrayFormat: "repeat" }),
      );

      expect(result).toEqual(
        apiResponse.map((d) => ({ id: d.id, name: d.name })),
      );
    });

    it("calls handleApiError and returns undefined on error", async () => {
      const error = new Error("getDungeonsById error");
      apiClientMock.get.mockRejectedValue(error);

      const result = await dofusDBService.getDungeonsById([1]);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });
});
