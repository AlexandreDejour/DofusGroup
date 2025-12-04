import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchServers from "../useFetchServers";

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

let mockGetServers: any;

vi.mock("../../../../services/api/serverService", () => {
  return {
    ServerService: vi.fn().mockImplementation(() => ({
      getServers: (...args: any[]) => mockGetServers(...args),
    })),
  };
});

// Utility function to test hook
function setupHook() {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchServers();
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchServers hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must be init with void state and isLoading true", () => {
    mockGetServers = vi.fn().mockResolvedValue([]);
    const ref = setupHook();

    expect(ref.current.servers).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must successfully fetch servers", async () => {
    const mockServers = [
      { id: 1, name: "server1" },
      { id: 2, name: "server2" },
    ];
    mockGetServers = vi.fn().mockResolvedValue(mockServers);

    const ref = setupHook();

    // await async effect
    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.servers).toEqual(mockServers);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error";
    mockGetServers = vi.fn().mockRejectedValue(new Error(errorMessage));

    // force isAxiosError to be true
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.servers).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const errorMessage = "Some error";
    mockGetServers = vi.fn().mockRejectedValue(new Error(errorMessage));

    // force isAxiosError to be false
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.servers).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
