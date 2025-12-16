import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchUserCharacters from "../useFetchUserCharacters";

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
      backUrl: "http://localhost",
    }),
  },
}));

let mockGetAllByUserId: any;

vi.mock("../../services/api/characterService", () => {
  return {
    CharacterService: vi.fn().mockImplementation(() => ({
      getAllByUserId: (...args: any[]) => mockGetAllByUserId(...args),
    })),
  };
});

// Utility function to test hook
function setupHook(userId = "user-1", server = "") {
  const ref = { current: null as any };

  function TestComponent({ server }: { server: string }) {
    ref.current = useFetchUserCharacters(userId, server);
    return null;
  }

  const renderResult = render(<TestComponent server={server} />);

  return {
    ref,
    rerender: (newServer: string) =>
      renderResult.rerender(<TestComponent server={newServer} />),
  };
}

describe("useFetchUserCharacters hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must init with empty characters and isLoading true", () => {
    mockGetAllByUserId = vi.fn().mockResolvedValue([]);

    const { ref } = setupHook();

    expect(ref.current.characters).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must fetch all characters when server is empty", async () => {
    const mockCharacters = [
      { id: 1, name: "char1", server_id: "server1" },
      { id: 2, name: "char2", server_id: "server2" },
    ];

    mockGetAllByUserId = vi.fn().mockResolvedValue(mockCharacters);

    const { ref } = setupHook("user-1", "");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual(mockCharacters);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must filter characters by server when server is provided", async () => {
    const mockCharacters = [
      { id: 1, name: "char1", server_id: "server1" },
      { id: 2, name: "char2", server_id: "server2" },
      { id: 3, name: "char3", server_id: "server1" },
    ];

    mockGetAllByUserId = vi.fn().mockResolvedValue(mockCharacters);

    const { ref } = setupHook("user-1", "server1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([
      { id: 1, name: "char1", server_id: "server1" },
      { id: 3, name: "char3", server_id: "server1" },
    ]);

    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must refetch characters when server changes", async () => {
    const mockCharacters = [
      { id: 1, name: "char1", server_id: "server1" },
      { id: 2, name: "char2", server_id: "server2" },
    ];

    mockGetAllByUserId = vi.fn().mockResolvedValue(mockCharacters);

    const { ref, rerender } = setupHook("user-1", "server1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([
      { id: 1, name: "char1", server_id: "server1" },
    ]);

    await act(async () => {
      rerender("server2");
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([
      { id: 2, name: "char2", server_id: "server2" },
    ]);

    expect(mockGetAllByUserId).toHaveBeenCalledTimes(2);
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error";
    mockGetAllByUserId = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const { ref } = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const errorMessage = "Unknown error";
    mockGetAllByUserId = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const { ref } = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
