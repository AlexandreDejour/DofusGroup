import { describe, it, beforeEach, vi, expect } from "vitest";
import { DofusDBService } from "../dofusDBService";
import { ApiClient } from "../../client";
import { Area, Dungeon, SubArea } from "../../../types/dofusDB";

vi.mock("axios");

describe("DofusDBService", () => {
  let apiClientMock: any;
  let dofusDBService: DofusDBService;
  const baseUrl = "https://api.dofusdb.fr";

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    dofusDBService = new DofusDBService(apiClientMock);
  });

  describe("getAreas", () => {
    it("should fetch all areas from the API with pagination", async () => {
      const mockDataPage1 = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Area ${i + 1}`,
      }));
      const mockDataPage2 = Array.from({ length: 20 }, (_, i) => ({
        id: i + 51,
        name: `Area ${i + 51}`,
      }));

      apiClientMock.instance.get.mockResolvedValueOnce({
        data: { data: mockDataPage1 },
      });
      apiClientMock.instance.get.mockResolvedValueOnce({
        data: { data: mockDataPage2 },
      });

      const areas = await dofusDBService.getAreas();

      expect(apiClientMock.instance.get).toHaveBeenCalledTimes(2);
      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        `${baseUrl}/areas`,
        { params: { $limit: 50, $skip: 0 } },
      );
      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        `${baseUrl}/areas`,
        { params: { $limit: 50, $skip: 50 } },
      );

      expect(areas.length).toBe(70);
      expect(areas[0].name).toBe("Area 1");
      expect(areas[69].name).toBe("Area 70");
    });

    it("should handle API errors and rethrow them", async () => {
      const error = new Error("API network error");
      apiClientMock.instance.get.mockRejectedValue(error);

      await expect(dofusDBService.getAreas()).rejects.toThrow(
        "API network error",
      );
    });
  });

  describe("getSubAreas", () => {
    const areaId = 123;
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      dungeonId: i % 2 === 0 ? 1 : null,
      name: `SubArea ${i + 1}`,
    }));

    it("should fetch sub-areas for a given area ID", async () => {
      apiClientMock.instance.get.mockResolvedValue({
        data: { data: mockData },
      });

      const subAreas = await dofusDBService.getSubAreas(areaId);

      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        `${baseUrl}/subareas`,
        { params: { areaId, $limit: 50 } },
      );
      expect(subAreas).toEqual(mockData);
    });

    it("should handle API errors and rethrow them", async () => {
      const error = new Error("API server error");
      apiClientMock.instance.get.mockRejectedValue(error);

      await expect(dofusDBService.getSubAreas(areaId)).rejects.toThrow(
        "API server error",
      );
    });
  });

  describe("getDungeons", () => {
    it("should fetch a specific dungeon by ID", async () => {
      const dungeonId = 42;
      const mockDungeon: Dungeon[] = [
        {
          id: dungeonId,
          name: {
            id: "123",
            en: "Bouftou Dungeon",
            es: "Mazmorra de Bouftou",
            pt: "Calabouço Bouftou",
            de: "Bouftou-Dungeon",
            fr: "Donjon Bouftou",
          },
        },
      ];
      apiClientMock.instance.get.mockResolvedValue({
        data: { data: mockDungeon },
      });

      const dungeons = await dofusDBService.getDungeons(dungeonId);

      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        `${baseUrl}/dungeons`,
        { params: { id: dungeonId } },
      );
      expect(dungeons).toEqual(mockDungeon);
    });

    it("should fetch all dungeons with pagination when no ID is provided", async () => {
      const mockDataPage1 = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Dungeon ${i + 1}`,
      }));
      const mockDataPage2 = Array.from({ length: 15 }, (_, i) => ({
        id: i + 51,
        name: `Dungeon ${i + 51}`,
      }));

      apiClientMock.instance.get
        .mockResolvedValueOnce({ data: { data: mockDataPage1 } })
        .mockResolvedValueOnce({ data: { data: mockDataPage2 } });

      const dungeons = await dofusDBService.getDungeons();

      expect(apiClientMock.instance.get).toHaveBeenCalledTimes(2);
      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        `${baseUrl}/dungeons`,
        { params: { $limit: 50, $skip: 0 } },
      );
      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        `${baseUrl}/dungeons`,
        { params: { $limit: 50, $skip: 50 } },
      );
      expect(dungeons.length).toBe(65);
    });

    it("should handle API errors and rethrow them", async () => {
      const error = new Error("Dungeon API error");
      apiClientMock.instance.get.mockRejectedValue(error);

      await expect(dofusDBService.getDungeons(1)).rejects.toThrow(
        "Dungeon API error",
      );
    });
  });
});
