import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchUserCharactersEnriched from "../useFetchUserCharactersEnriched";

// ---------- Mocks axios ----------
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

// ---------- Mock CharacterService ----------
let mockGetAllEnrichedByUserId: any;

vi.mock("../../services/api/characterService", () => {
  return {
    CharacterService: vi.fn().mockImplementation(() => ({
      getAllEnrichedByUserId: (...args: any[]) =>
        mockGetAllEnrichedByUserId(...args),
    })),
  };
});

// ---------- Test utility ----------
function setupHook(
  user = { id: "user-1" },
  event = { server: { id: "server-1" } },
) {
  const ref = { current: null as any };

  function TestComponent({ user, event }: { user: any; event: any }) {
    ref.current = useFetchUserCharactersEnriched(user, event);
    return null;
  }

  const renderResult = render(<TestComponent user={user} event={event} />);

  return {
    ref,
    rerender: (newUser = user, newEvent = event) =>
      renderResult.rerender(<TestComponent user={newUser} event={newEvent} />),
  };
}

// ---------- Tests ----------
describe("useFetchUserCharactersEnriched hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must init with empty characters and isLoading true", () => {
    mockGetAllEnrichedByUserId = vi.fn().mockResolvedValue([]);

    const { ref } = setupHook();

    expect(ref.current.characters).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must fetch and filter characters by event server", async () => {
    const mockCharacters = [
      { id: 1, name: "char1", server_id: "server-1" },
      { id: 2, name: "char2", server_id: "server-2" },
      { id: 3, name: "char3", server_id: "server-1" },
    ];

    mockGetAllEnrichedByUserId = vi.fn().mockResolvedValue(mockCharacters);

    const { ref } = setupHook({ id: "user-1" }, { server: { id: "server-1" } });

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([
      { id: 1, name: "char1", server_id: "server-1" },
      { id: 3, name: "char3", server_id: "server-1" },
    ]);

    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must refetch characters when event server changes", async () => {
    const mockCharacters = [
      { id: 1, name: "char1", server_id: "server-1" },
      { id: 2, name: "char2", server_id: "server-2" },
    ];

    mockGetAllEnrichedByUserId = vi.fn().mockResolvedValue(mockCharacters);

    const { ref, rerender } = setupHook(
      { id: "user-1" },
      { server: { id: "server-1" } },
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([
      { id: 1, name: "char1", server_id: "server-1" },
    ]);

    await act(async () => {
      rerender({ id: "user-1" }, { server: { id: "server-2" } });
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([
      { id: 2, name: "char2", server_id: "server-2" },
    ]);

    expect(mockGetAllEnrichedByUserId).toHaveBeenCalledTimes(2);
  });

  it("Must refetch characters when user changes", async () => {
    mockGetAllEnrichedByUserId = vi.fn().mockResolvedValue([]);

    const { rerender } = setupHook(
      { id: "user-1" },
      { server: { id: "server-1" } },
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      rerender({ id: "user-2" }, { server: { id: "server-1" } });
      await Promise.resolve();
    });

    expect(mockGetAllEnrichedByUserId).toHaveBeenCalledTimes(2);
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error";
    mockGetAllEnrichedByUserId = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage));

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
    mockGetAllEnrichedByUserId = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage));

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
