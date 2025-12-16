import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchDungeons from "../useFetchDungeons";

vi.mock("axios", () => {
  const axiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };

  return {
    default: { create: vi.fn(() => axiosInstance) },
    isAxiosError: vi.fn(),
  };
});

vi.mock("../../config/config.ts", () => ({
  Config: { getInstance: () => ({ dofusdbUrl: "http://localhost" }) },
}));

let mockGetSubAreas: any;
let mockGetDungeonsById: any;
let mockGetDungeons: any;

vi.mock("../../services/api/dofusDBService", () => ({
  DofusDBService: vi.fn().mockImplementation(() => ({
    getSubAreas: (...args: any[]) => mockGetSubAreas(...args),
    getDungeonsById: (...args: any[]) => mockGetDungeonsById(...args),
    getDungeons: (...args: any[]) => mockGetDungeons(...args),
  })),
}));

vi.mock("i18next", () => ({ __esModule: true, default: { language: "fr" } }));

// Utility function
function setupHook(
  tags: any[],
  tag: string,
  areas: any[],
  area: string,
  subAreas: any[],
  subArea: string,
) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchDungeons(tags, tag, areas, area, subAreas, subArea);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchDungeons hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must initialize with empty dungeons, isLoading true and isDungeon false", () => {
    mockGetDungeons = vi.fn().mockResolvedValue([]);
    const tags = [{ id: "1", name: "Autre" }];
    const areas: any[] = [];
    const subAreas: any[] = [];

    const ref = setupHook(tags, "1", areas, "", subAreas, "");

    expect(ref.current.dungeons).toEqual([]);
    expect(ref.current.isDungeon).toBe(false);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must set isDungeon false and empty dungeons if tag is not 'Donjon'", async () => {
    const tags = [{ id: "1", name: "Autre" }];
    const ref = setupHook(tags, "1", [], "", [], "");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.isDungeon).toBe(false);
    expect(ref.current.dungeons).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
  });

  it("Must fetch dungeons by subArea if subArea provided", async () => {
    const tags = [{ id: "1", name: "Donjon" }];
    const subAreas = [{ id: 1, name: { fr: "Sub1" }, dungeonId: 42 }];
    const mockDungeons = [{ id: 42, name: "Dungeon42" }];
    mockGetDungeonsById = vi.fn().mockResolvedValue(mockDungeons);

    const ref = setupHook(tags, "1", [], "", subAreas, "Sub1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.isDungeon).toBe(true);
    expect(ref.current.dungeons).toEqual(mockDungeons);
  });

  it("Must fetch dungeons via area if area provided and subArea empty", async () => {
    const tags = [{ id: "1", name: "Donjon" }];
    const areas = [{ id: 1, name: { fr: "Area1" } }];
    const subAreasOfArea = [
      { id: 10, dungeonId: 5 },
      { id: 11, dungeonId: -1 },
    ];
    const mockDungeons = [{ id: 5, name: "Dungeon5" }];

    mockGetSubAreas = vi.fn().mockResolvedValue(subAreasOfArea);
    mockGetDungeonsById = vi.fn().mockResolvedValue(mockDungeons);

    const ref = setupHook(tags, "1", areas, "Area1", [], "");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.isDungeon).toBe(true);
    expect(ref.current.dungeons).toEqual(mockDungeons);
    expect(mockGetSubAreas).toHaveBeenCalledWith(1);
    expect(mockGetDungeonsById).toHaveBeenCalledWith([5]);
  });

  it("Must fetch all dungeons if area and subArea empty", async () => {
    const tags = [{ id: "1", name: "Donjon" }];
    const mockDungeons = [{ id: 1, name: "Dungeon1" }];
    mockGetDungeons = vi.fn().mockResolvedValue(mockDungeons);

    const ref = setupHook(tags, "1", [], "", [], "");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.isDungeon).toBe(true);
    expect(ref.current.dungeons).toEqual(mockDungeons);
    expect(mockGetDungeons).toHaveBeenCalled();
  });

  it("Must handle axios error", async () => {
    const tags = [{ id: "1", name: "Donjon" }];
    const subAreas = [{ id: 1, name: { fr: "Sub1" }, dungeonId: 42 }];
    const errorMessage = "Axios error";

    mockGetDungeonsById = vi.fn().mockRejectedValue(new Error(errorMessage));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook(tags, "1", [], "", subAreas, "Sub1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.dungeons).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const tags = [{ id: "1", name: "Donjon" }];
    const subAreas = [{ id: 1, name: { fr: "Sub1" }, dungeonId: 42 }];
    const errorMessage = "Some error";

    mockGetDungeonsById = vi.fn().mockRejectedValue(new Error(errorMessage));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook(tags, "1", [], "", subAreas, "Sub1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.dungeons).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
