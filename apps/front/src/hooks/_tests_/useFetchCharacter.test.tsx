import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import useFetchCharacter from "../useFetchCharacter";

const updateTarget = vi.fn();

vi.mock("../../contexts/modalContext", () => ({
  useModal: () => ({
    updateTarget,
  }),
}));

// Helpers
function setupHook(id: string, service: any) {
  const ref = {
    current: null as any,
  };

  function TestComponent() {
    ref.current = useFetchCharacter(id, service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchCharacter hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch character successfully", async () => {
    const character = {
      id: "char-1",
      name: "Test Character",
      level: 200,
    };

    const mockService = {
      getOneEnriched: vi.fn().mockResolvedValue(character),
    };

    const result = setupHook("char-1", mockService);

    // état initial
    expect(result.current.isLoading).toBe(true);
    expect(result.current.character).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getOneEnriched).toHaveBeenCalledTimes(1);
    expect(mockService.getOneEnriched).toHaveBeenCalledWith("char-1");
    expect(result.current.character).toEqual(character);
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = {
      isAxiosError: true,
      message: "Axios error",
    };

    const mockService = {
      getOneEnriched: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook("char-1", mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.character).toBeNull();
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Standard error");

    const mockService = {
      getOneEnriched: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook("char-1", mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.character).toBeNull();
    expect(result.current.error).toBe("Standard error");
  });
});
