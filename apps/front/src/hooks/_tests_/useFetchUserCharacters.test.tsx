import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchUserCharacters from "../useFetchUserCharacters";

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

vi.mock("../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

let mockGetCharacters: any;

vi.mock("../../services/api/characterService", () => {
  return {
    CharacterService: vi.fn().mockImplementation(() => ({
      getAllByUserId: (...args: any[]) => mockGetCharacters(...args),
    })),
  };
});

vi.mock("../../contexts/authContext", () => ({
  __esModule: true,
  useAuth: () => ({
    user: {
      id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
      username: "toto",
      characters: [
        {
          id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
          name: "Chronos",
        },
      ],
      events: [
        {
          id: "ef9891a6-dcab-4846-8f9c-2044efe2096c",
          title: "Rafle perco",
        },
      ],
    },
    setUser: vi.fn(),
    isAuthLoading: false,
  }),
}));

const mockUser = {
  id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
  username: "toto",
};

// Utility function to test hook
function setupHook() {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchUserCharacters(mockUser.id);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchCharacters hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must be init with void state and isLoading true", () => {
    mockGetCharacters = vi.fn().mockResolvedValue([]);
    const ref = setupHook();

    expect(ref.current.characters).toEqual([]);
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must successfully fetch characters", async () => {
    const mockCharacters = [
      {
        id: "9f0eaa8c-eec1-4e85-9365-7653c1330325",
        name: "Chronos",
      },
    ];
    mockGetCharacters = vi.fn().mockResolvedValue(mockCharacters);

    const ref = setupHook();

    // await async effect
    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual(mockCharacters);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error";
    mockGetCharacters = vi.fn().mockRejectedValue(new Error(errorMessage));

    // force isAxiosError to be true
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const errorMessage = "Some error";
    mockGetCharacters = vi.fn().mockRejectedValue(new Error(errorMessage));

    // force isAxiosError to be false
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.characters).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
