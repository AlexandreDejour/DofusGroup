import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchAreas from "../useFetchAreas";

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

let mockGetAreas: any;

vi.mock("../../services/api/dofusDBService", () => {
  return {
    DofusDBService: vi.fn().mockImplementation(() => ({
      getAreas: (...args: any[]) => mockGetAreas(...args),
    })),
  };
});

// Utility function to test hook
function setupHook() {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchAreas();
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchAreas hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must initialize with empty areas and isLoading true", () => {
    mockGetAreas = vi.fn().mockResolvedValue([]);

    const ref = setupHook();

    expect(ref.current.areas).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must successfully fetch areas", async () => {
    const mockAreas = [
      { id: 1, name: "Area1" },
      { id: 2, name: "Area2" },
    ];

    mockGetAreas = vi.fn().mockResolvedValue(mockAreas);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.areas).toEqual(mockAreas);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error";
    mockGetAreas = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.areas).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const errorMessage = "Some error";
    mockGetAreas = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.areas).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
