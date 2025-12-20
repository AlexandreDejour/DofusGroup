import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import useFetchBreeds from "../useFetchBreeds";

// Helpers
function setupHook(service: any) {
  const ref = {
    current: null as any,
  };

  function TestComponent() {
    ref.current = useFetchBreeds(service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchBreeds hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch breeds successfully", async () => {
    const breeds = [
      { id: 1, name: "Iop" },
      { id: 2, name: "Cra" },
    ];

    const mockService = {
      getBreeds: vi.fn().mockResolvedValue(breeds),
    };

    const result = setupHook(mockService);

    // initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.breeds).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getBreeds).toHaveBeenCalledTimes(1);
    expect(result.current.breeds).toEqual(breeds);
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = {
      isAxiosError: true,
      message: "Axios error",
    };

    const mockService = {
      getBreeds: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.breeds).toEqual([]);
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Standard error");

    const mockService = {
      getBreeds: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.breeds).toEqual([]);
    expect(result.current.error).toBe("Standard error");
  });
});
