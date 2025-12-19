import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import { Tag } from "../../types/tag";
import type { Area, SubArea, Dungeon } from "../../types/dofusDB";

import useFetchDungeons from "../useFetchDungeons";
import { AxiosError } from "axios";

// Helpers
function setupHook(
  context: { tags: Tag[]; areas: Area[]; subAreas: SubArea[] },
  selection: { tag: string; area: string; subArea: string },
  service: any,
) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchDungeons(context, selection, service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchDungeons hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch dungeons successfully when tag is 'Donjon'", async () => {
    const tags: Tag[] = [{ id: "tag1", name: "Donjon", color: "#f0f" }];
    const areas: Area[] = [
      {
        id: 1,
        name: {
          id: "area1",
          de: "area1",
          en: "area1",
          es: "area1",
          fr: "area1",
          pt: "area1",
        },
      },
    ];
    const subAreas: SubArea[] = [
      {
        id: 1,
        name: {
          id: "subArea1",
          de: "subArea1",
          en: "subArea1",
          es: "subArea1",
          fr: "subArea1",
          pt: "subArea1",
        },
        dungeonId: 10,
      },
    ];
    const dungeons: Dungeon[] = [
      {
        id: 10,
        name: {
          id: "1",
          de: "Dungeon1",
          en: "Dungeon1",
          es: "Dungeon1",
          fr: "Dungeon1",
          pt: "Dungeon1",
        },
      },
    ];

    const mockService = {
      getDungeonsById: vi.fn().mockResolvedValue(dungeons),
      getSubAreas: vi.fn().mockResolvedValue(subAreas),
      getDungeons: vi.fn(),
    };

    const selection = { tag: "tag1", area: "area1", subArea: "subArea1" };
    const context = { tags, areas, subAreas };

    const result = setupHook(context, selection, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.dungeons).toEqual(dungeons);
    expect(result.current.isDungeon).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getDungeonsById).toHaveBeenCalledTimes(1);
    expect(mockService.getDungeonsById).toHaveBeenCalledWith([10]);
    expect(result.current.dungeons).toEqual(dungeons);
    expect(result.current.isDungeon).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should not fetch dungeons if tag is not 'Donjon'", async () => {
    const tags = [{ id: "tag1", name: "Raid", color: "#000" }];
    const areas: Area[] = [
      {
        id: 1,
        name: {
          id: "area1",
          de: "area1",
          en: "area1",
          es: "area1",
          fr: "area1",
          pt: "area1",
        },
      },
    ];
    const subAreas: SubArea[] = [
      {
        id: 1,
        name: {
          id: "subArea1",
          de: "subArea1",
          en: "subArea1",
          es: "subArea1",
          fr: "subArea1",
          pt: "subArea1",
        },
        dungeonId: 10,
      },
    ];

    const mockService = {
      getDungeonsById: vi.fn(),
      getSubAreas: vi.fn(),
      getDungeons: vi.fn(),
    };

    const selection = { tag: "tag1", area: "", subArea: "" };
    const context = { tags, areas, subAreas };

    const result = setupHook(context, selection, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isDungeon).toBe(false);
    expect(result.current.dungeons).toEqual([]);
    expect(mockService.getDungeonsById).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const tags = [{ id: "tag1", name: "Donjon", color: "#f0f" }];
    const areas: Area[] = [];
    const subAreas: SubArea[] = [];

    const axiosError = new AxiosError("Axios error");
    const mockService = {
      getDungeons: vi.fn().mockRejectedValue(axiosError),
      getDungeonsById: vi.fn(),
      getSubAreas: vi.fn(),
    };

    const selection = { tag: "tag1", area: "", subArea: "" };
    const context = { tags, areas, subAreas };

    const result = setupHook(context, selection, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Axios error");
    expect(result.current.dungeons).toEqual([]);
  });

  it("should set error when standard Error occurs", async () => {
    const tags = [{ id: "tag1", name: "Donjon", color: "#f0f" }];
    const areas: Area[] = [];
    const subAreas: SubArea[] = [];

    const error = new Error("Standard error");
    const mockService = {
      getDungeons: vi.fn().mockRejectedValue(error),
      getDungeonsById: vi.fn(),
      getSubAreas: vi.fn(),
    };

    const selection = { tag: "tag1", area: "", subArea: "" };
    const context = { tags, areas, subAreas };

    const result = setupHook(context, selection, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Standard error");
    expect(result.current.dungeons).toEqual([]);
  });

  it("should fetch all dungeons if no area or subArea is selected", async () => {
    const tags = [{ id: "tag1", name: "Donjon", color: "#f0f" }];
    const areas: Area[] = [];
    const subAreas: SubArea[] = [];
    const dungeons: Dungeon[] = [
      {
        id: 10,
        name: {
          id: "1",
          de: "Dungeon1",
          en: "Dungeon1",
          es: "Dungeon1",
          fr: "Dungeon1",
          pt: "Dungeon1",
        },
      },
    ];

    const mockService = {
      getDungeons: vi.fn().mockResolvedValue(dungeons),
      getDungeonsById: vi.fn(),
      getSubAreas: vi.fn(),
    };

    const selection = { tag: "tag1", area: "", subArea: "" };
    const context = { tags, areas, subAreas };

    const result = setupHook(context, selection, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getDungeons).toHaveBeenCalledTimes(1);
    expect(result.current.dungeons).toEqual(dungeons);
    expect(result.current.isDungeon).toBe(true);
  });
});
