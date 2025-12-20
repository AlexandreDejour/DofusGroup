import { vi } from "vitest";
import { render } from "@testing-library/react";
import { AxiosError } from "axios";

import useUserCharactersChecker from "../useUserCharactersChecker";
import { User } from "../../types/user";

const showError = vi.fn();

vi.mock("../../contexts/notificationContext", () => ({
  useNotification: () => ({
    showError,
  }),
}));

// Helpers
function setupHook(user: User | null, service: any) {
  let checker: any;

  function TestComponent() {
    checker = useUserCharactersChecker(user, service);
    return null;
  }

  render(<TestComponent />);
  return checker;
}

describe("useUserCharactersChecker hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return undefined if user is null", async () => {
    const mockService = {
      getOneEnriched: vi.fn(),
    };

    const checkUserCharacters = setupHook(null, mockService);

    const result = await checkUserCharacters();

    expect(result).toBeUndefined();
    expect(mockService.getOneEnriched).not.toHaveBeenCalled();
    expect(showError).not.toHaveBeenCalled();
  });

  it("should return true if user has characters", async () => {
    const user: User = {
      id: "user-1",
      username: "toto",
    };

    const mockService = {
      getOneEnriched: vi.fn().mockResolvedValue({
        id: "user-1",
        characters: [{ id: "char-1" }],
      }),
    };

    const checkUserCharacters = setupHook(user, mockService);

    const result = await checkUserCharacters();

    expect(mockService.getOneEnriched).toHaveBeenCalledTimes(1);
    expect(mockService.getOneEnriched).toHaveBeenCalledWith("user-1");
    expect(result).toBe(true);
    expect(showError).not.toHaveBeenCalled();
  });

  it("should show error and return false if user has no characters", async () => {
    const user: User = {
      id: "user-1",
      username: "toto",
    };

    const mockService = {
      getOneEnriched: vi.fn().mockResolvedValue({
        id: "user-1",
        characters: [],
      }),
    };

    const checkUserCharacters = setupHook(user, mockService);

    const result = await checkUserCharacters();

    expect(result).toBe(false);
    expect(showError).toHaveBeenCalled();
  });

  it("should handle axios error", async () => {
    const user: User = {
      id: "user-1",
      username: "toto",
    };

    const axiosError = new AxiosError("Axios error");

    const mockService = {
      getOneEnriched: vi.fn().mockRejectedValue(axiosError),
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const checkUserCharacters = setupHook(user, mockService);

    const result = await checkUserCharacters();

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith("Axios error:", "Axios error");

    consoleSpy.mockRestore();
  });

  it("should handle standard Error", async () => {
    const user: User = {
      id: "user-1",
      username: "toto",
    };

    const error = new Error("Standard error");

    const mockService = {
      getOneEnriched: vi.fn().mockRejectedValue(error),
    };

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const checkUserCharacters = setupHook(user, mockService);

    const result = await checkUserCharacters();

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith("General error:", "Standard error");

    consoleSpy.mockRestore();
  });
});
