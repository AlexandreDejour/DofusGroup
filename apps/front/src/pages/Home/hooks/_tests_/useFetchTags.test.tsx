import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchTags from "../useFetchTags";

vi.mock("axios", () => {
  // fake axiosInstance return by axios.create()
  const axiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),

    // interceptors fully functional to avoid errors
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };

  // complete axios mock
  return {
    default: {
      create: vi.fn(() => axiosInstance),
    },

    // named mock
    isAxiosError: vi.fn(),
  };
});

vi.mock("../../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

let mockGetTags: any;

vi.mock("../../../../services/api/tagService", () => {
  return {
    TagService: vi.fn().mockImplementation(() => ({
      getTags: (...args: any[]) => mockGetTags(...args),
    })),
  };
});

// Utility function to test hook
function setupHook() {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchTags();
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchTags hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must be init with void state and isLoading true", () => {
    mockGetTags = vi.fn().mockResolvedValue([]);
    const ref = setupHook();

    expect(ref.current.tags).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must successfully fetch tags", async () => {
    const mockTags = [
      { id: 1, name: "tag1" },
      { id: 2, name: "tag2" },
    ];
    mockGetTags = vi.fn().mockResolvedValue(mockTags);

    const ref = setupHook();

    // await async effect
    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.tags).toEqual(mockTags);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error";
    mockGetTags = vi.fn().mockRejectedValue(new Error(errorMessage));

    // force isAxiosError to be true
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.tags).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const errorMessage = "Some error";
    mockGetTags = vi.fn().mockRejectedValue(new Error(errorMessage));

    // force isAxiosError to be false
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.tags).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
