import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchAuthUser from "../useFetchAuthUser";

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

// ---------- Mock AuthService ----------
let mockApiMe: any;

vi.mock("../../services/api/authService", () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    apiMe: (...args: any[]) => mockApiMe(...args),
  })),
}));

// ---------- Test utility ----------
function setupHook() {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchAuthUser();
    return null;
  }

  render(<TestComponent />);

  return { ref };
}

// ---------- Tests ----------
describe("useFetchAuthUser hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must init with null user and isLoading true", () => {
    mockApiMe = vi.fn().mockResolvedValue(null);

    const { ref } = setupHook();

    expect(ref.current.user).toBeNull();
    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("Must fetch user successfully", async () => {
    const mockUser = { id: "123", username: "toto" };

    mockApiMe = vi.fn().mockResolvedValue(mockUser);

    const { ref } = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.user).toEqual(mockUser);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error";
    mockApiMe = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const { ref } = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.user).toBeNull();
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle general error", async () => {
    const errorMessage = "Unknown error";
    mockApiMe = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const { ref } = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.user).toBeNull();
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
