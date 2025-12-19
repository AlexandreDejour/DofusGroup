import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import useFetchAreas from "../useFetchAreas";

// Helpers
function setupHook(service: any) {
  const ref = {
    current: null as any,
  };

  function TestComponent() {
    ref.current = useFetchAreas(service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchAreas hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch areas successfully", async () => {
    const areas = [
      { id: 1, name: "Area 1" },
      { id: 2, name: "Area 2" },
    ];

    const mockService = {
      getAreas: vi.fn().mockResolvedValue(areas),
    };

    const result = setupHook(mockService);

    // initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.areas).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getAreas).toHaveBeenCalledTimes(1);
    expect(result.current.areas).toEqual(areas);
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = {
      isAxiosError: true,
      message: "Axios error",
    };

    const mockService = {
      getAreas: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.areas).toEqual([]);
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Standard error");

    const mockService = {
      getAreas: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.areas).toEqual([]);
    expect(result.current.error).toBe("Standard error");
  });
});
