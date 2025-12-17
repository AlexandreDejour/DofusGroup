import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchBreeds from "../useFetchBreeds";

// ---------- Mock axios ----------
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

// ---------- Mock config ----------
vi.mock("../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      backUrl: "http://localhost",
    }),
  },
}));

// ---------- Mock BreedService ----------
let mockGetBreeds: any;

vi.mock("../../services/api/breedService", () => {
  return {
    BreedService: vi.fn().mockImplementation(() => ({
      getBreeds: (...args: any[]) => mockGetBreeds(...args),
    })),
  };
});

// ---------- Test utility ----------
function setupHook() {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchBreeds();
    return null;
  }

  render(<TestComponent />);

  return { ref };
}

// ---------- Tests ----------
describe("useFetchBreeds hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must init with empty breeds and isLoading true", () => {
    mockGetBreeds = vi.fn().mockResolvedValue([]);

    const { ref } = setupHook();

    expect(ref.current.breeds).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must fetch breeds successfully", async () => {
    const mockBreeds = [
      { id: 1, name: "Breed 1" },
      { id: 2, name: "Breed 2" },
    ];

    mockGetBreeds = vi.fn().mockResolvedValue(mockBreeds);

    const { ref } = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.breeds).toEqual(mockBreeds);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error";
    mockGetBreeds = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const { ref } = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.breeds).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const errorMessage = "Unknown error";
    mockGetBreeds = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const { ref } = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.breeds).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
