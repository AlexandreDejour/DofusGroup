import { vi, Mock } from "vitest";
import { isAxiosError } from "axios";
import { render } from "@testing-library/react";

import useUserCharactersChecker from "../useUserCharactersChecker";

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

vi.mock("../../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      backUrl: "http://localhost",
    }),
  },
}));

let mockGetOneEnriched: any;

vi.mock("../../../../services/api/userService", () => ({
  UserService: vi.fn().mockImplementation(() => ({
    getOneEnriched: (...args: any[]) => mockGetOneEnriched(...args),
  })),
}));

function setupHook(user: any) {
  const ref = { current: null as any };

  const showError = vi.fn();
  const t = vi.fn((key: string) => key);

  function TestComponent() {
    ref.current = useUserCharactersChecker(user, showError, t);
    ref.current._mocks = { showError, t };
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useUserCharactersChecker hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Returns immediately if user is null", async () => {
    const ref = setupHook(null);

    const result = await ref.current();

    expect(result).toBeUndefined(); // no return, no error
    expect(mockGetOneEnriched).toBeUndefined(); // never called
    expect(ref.current._mocks.showError).not.toHaveBeenCalled();
  });

  it("Calls showError if user has no characters", async () => {
    mockGetOneEnriched = vi.fn().mockResolvedValue({
      characters: [],
    });

    const ref = setupHook({ id: 42 });

    const result = await ref.current();

    expect(mockGetOneEnriched).toHaveBeenCalledWith(42);
    expect(result).toBe(false);

    expect(ref.current._mocks.showError).toHaveBeenCalledWith(
      "common.minimalCondition",
      "character.error.required",
    );
  });

  it("Returns true if user has characters", async () => {
    mockGetOneEnriched = vi.fn().mockResolvedValue({
      characters: [{ id: 1, name: "Yugo" }],
    });

    const ref = setupHook({ id: 88 });

    const result = await ref.current();

    expect(mockGetOneEnriched).toHaveBeenCalledWith(88);
    expect(result).toBe(true);

    expect(ref.current._mocks.showError).not.toHaveBeenCalled();
  });

  it("Handles axios error gracefully", async () => {
    mockGetOneEnriched = vi.fn().mockRejectedValue(new Error("Axios oops"));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook({ id: 1 });

    await expect(ref.current()).resolves.not.toThrow();

    expect(ref.current._mocks.showError).not.toHaveBeenCalled();
  });

  it("Handles non-axios error gracefully", async () => {
    mockGetOneEnriched = vi.fn().mockRejectedValue(new Error("General oops"));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook({ id: 1 });

    await expect(ref.current()).resolves.not.toThrow();

    expect(ref.current._mocks.showError).not.toHaveBeenCalled();
  });
});
