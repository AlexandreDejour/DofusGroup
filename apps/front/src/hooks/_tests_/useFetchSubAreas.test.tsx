import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchSubAreas from "../useFetchSubAreas";

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
    default: {
      create: vi.fn(() => axiosInstance),
    },
    isAxiosError: vi.fn(),
  };
});

vi.mock("../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      dofusdbUrl: "http://localhost",
    }),
  },
}));

let mockGetSubAreas: any;

vi.mock("../../services/api/dofusDBService", () => {
  return {
    DofusDBService: vi.fn().mockImplementation(() => ({
      getSubAreas: (...args: any[]) => mockGetSubAreas(...args),
    })),
  };
});

// Mock i18n.language
vi.mock("i18next", () => ({
  __esModule: true,
  default: { language: "fr" },
}));

// Utility function to test hook
function setupHook(areas: any[], areaName: string) {
  const ref = { current: null as any };

  function TestComponent({ areas, area }: { areas: any[]; area: string }) {
    ref.current = useFetchSubAreas(areas, area);
    return null;
  }

  const renderResult = render(<TestComponent areas={areas} area={areaName} />);

  return {
    ref,
    rerender: (newAreas: any[], newArea: string) =>
      renderResult.rerender(<TestComponent areas={newAreas} area={newArea} />),
  };
}

describe("useFetchSubAreas hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must initialize with empty subAreas and isLoading true", () => {
    mockGetSubAreas = vi.fn().mockResolvedValue([]);

    const areas = [{ id: 1, name: { fr: "Zone1", en: "Zone1EN" } }];
    const { ref } = setupHook(areas, "Zone1");

    expect(ref.current.subAreas).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must successfully fetch subAreas", async () => {
    const areas = [{ id: 1, name: { fr: "Zone1", en: "Zone1EN" } }];
    const mockSubAreas = [
      { id: 1, name: "Sub1" },
      { id: 2, name: "Sub2" },
    ];

    mockGetSubAreas = vi.fn().mockResolvedValue(mockSubAreas);

    const { ref } = setupHook(areas, "Zone1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.subAreas).toEqual(mockSubAreas);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must return empty subAreas if area not found", async () => {
    const areas = [{ id: 1, name: { fr: "Zone1", en: "Zone1EN" } }];

    mockGetSubAreas = vi.fn(); // should not be called

    const { ref } = setupHook(areas, "ZoneNotExist");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.subAreas).toEqual([]);
    expect(mockGetSubAreas).not.toHaveBeenCalled();
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must handle axios error", async () => {
    const areas = [{ id: 1, name: { fr: "Zone1", en: "Zone1EN" } }];
    const errorMessage = "Axios error";

    mockGetSubAreas = vi.fn().mockRejectedValue(new Error(errorMessage));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const { ref } = setupHook(areas, "Zone1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.subAreas).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const areas = [{ id: 1, name: { fr: "Zone1", en: "Zone1EN" } }];
    const errorMessage = "Some error";

    mockGetSubAreas = vi.fn().mockRejectedValue(new Error(errorMessage));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const { ref } = setupHook(areas, "Zone1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.subAreas).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must refetch subAreas when areas or area changes", async () => {
    const areas1 = [{ id: 1, name: { fr: "Zone1", en: "Zone1EN" } }];
    const areas2 = [{ id: 2, name: { fr: "Zone2", en: "Zone2EN" } }];

    const mockSubAreas1 = [{ id: 1, name: "Sub1" }];
    const mockSubAreas2 = [{ id: 2, name: "Sub2" }];

    mockGetSubAreas = vi
      .fn()
      .mockResolvedValueOnce(mockSubAreas1)
      .mockResolvedValueOnce(mockSubAreas2);

    const { ref, rerender } = setupHook(areas1, "Zone1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.subAreas).toEqual(mockSubAreas1);

    await act(async () => {
      rerender(areas2, "Zone2");
      await Promise.resolve();
    });

    expect(ref.current.subAreas).toEqual(mockSubAreas2);
    expect(mockGetSubAreas).toHaveBeenCalledTimes(2);
  });
});
