import qs from "qs";
import { describe, it, beforeEach, vi, expect, Mock } from "vitest";

import { Dungeon } from "../../../types/dofusDB";

import { DofusDBService } from "../dofusDBService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("DofusDBService", () => {
  let apiClientMock: any;
  let dofusDBService: DofusDBService;

  beforeEach(() => {
    (handleApiError as unknown as Mock).mockReset();
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    dofusDBService = new DofusDBService(apiClientMock);
  });

  describe("getAreas", () => {
    it("fetches all areas from the API with pagination", async () => {
      const mockDataPage1 = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Area ${i + 1}`,
      }));
      const mockDataPage2 = Array.from({ length: 20 }, (_, i) => ({
        id: i + 51,
        name: `Area ${i + 51}`,
      }));

      apiClientMock.instance.get
        .mockResolvedValueOnce({ data: { data: mockDataPage1 } })
        .mockResolvedValueOnce({ data: { data: mockDataPage2 } });

      const areas = await dofusDBService.getAreas();

      expect(apiClientMock.instance.get).toHaveBeenCalledTimes(2);
      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/areas", {
        params: { $limit: 50, $skip: 0 },
      });
      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/areas", {
        params: { $limit: 50, $skip: 50 },
      });

      expect(areas).toHaveLength(70);
      expect(areas![0].name).toBe("Area 1");
      expect(areas![69].name).toBe("Area 70");
    });

    it("calls handleApiError and returns undefined on axios failure", async () => {
      const error = new Error("API network error");
      apiClientMock.instance.get.mockRejectedValue(error);

      // ensure handleApiError does not throw in this test
      (handleApiError as unknown as Mock).mockImplementation(() => undefined);

      const result = await dofusDBService.getAreas();

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getSubAreas", () => {
    const areaId = 123;
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      dungeonId: i % 2 === 0 ? 1 : null,
      name: `SubArea ${i + 1}`,
    }));

    it("fetches sub-areas for a given area ID", async () => {
      apiClientMock.instance.get.mockResolvedValue({
        data: { data: mockData },
      });

      const subAreas = await dofusDBService.getSubAreas(areaId);

      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/subareas", {
        params: { areaId, $limit: 50 },
      });
      expect(subAreas).toEqual(mockData);
    });

    it("calls handleApiError and returns undefined on axios failure", async () => {
      const error = new Error("API server error");
      apiClientMock.instance.get.mockRejectedValue(error);
      (handleApiError as unknown as Mock).mockImplementation(() => undefined);

      const result = await dofusDBService.getSubAreas(areaId);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getDungeons (paginated)", () => {
    it("fetches all dungeons with pagination when no ID is provided", async () => {
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
      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/dungeons", {
        params: { $limit: 50, $skip: 0 },
      });
      expect(apiClientMock.instance.get).toHaveBeenCalledWith("/dungeons", {
        params: { $limit: 50, $skip: 50 },
      });
      expect(dungeons).toHaveLength(65);
    });

    it("calls handleApiError and returns undefined on axios failure", async () => {
      const error = new Error("Dungeon API error");
      apiClientMock.instance.get.mockRejectedValue(error);
      (handleApiError as unknown as Mock).mockImplementation(() => undefined);

      const result = await dofusDBService.getDungeons();

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getDungeonsById", () => {
    it("fetches dungeons by array of ids using repeat paramsSerializer", async () => {
      const dungeonIds = [1, 2, 3];
      const mockDungeon: Dungeon[] = [
        { id: 1, name: { fr: "D1" } } as any,
        { id: 2, name: { fr: "D2" } } as any,
      ];
      apiClientMock.instance.get.mockResolvedValue({
        data: { data: mockDungeon },
      });

      const result = await dofusDBService.getDungeonsById(dungeonIds);

      // assert axios get called with params and a paramsSerializer function
      expect(apiClientMock.instance.get).toHaveBeenCalledTimes(1);
      const callArgs = apiClientMock.instance.get.mock.calls[0];
      expect(callArgs[0]).toBe("/dungeons");
      const options = callArgs[1];
      expect(options.params).toEqual({ id: dungeonIds });
      expect(typeof options.paramsSerializer).toBe("function");

      // verify paramsSerializer produces repeat format (qs.stringify with arrayFormat: 'repeat')
      const qsString = options.paramsSerializer({ id: dungeonIds });
      expect(qsString).toBe(
        qs.stringify({ id: dungeonIds }, { arrayFormat: "repeat" }),
      );

      // result mapping
      expect(result).toEqual(
        mockDungeon.map((d) => ({ id: d.id, name: d.name })),
      );
    });

    it("calls handleApiError and returns undefined on axios failure", async () => {
      const error = new Error("getDungeonsById error");
      apiClientMock.instance.get.mockRejectedValue(error);
      (handleApiError as unknown as Mock).mockImplementation(() => undefined);

      const result = await dofusDBService.getDungeonsById([1]);

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });
});
