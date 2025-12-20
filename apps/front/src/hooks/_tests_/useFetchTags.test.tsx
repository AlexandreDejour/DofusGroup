import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";

import { Tag } from "../../types/tag";
import useFetchTags from "../useFetchTags";

// Helpers
function setupHook(service: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchTags(service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchTags hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch tags successfully", async () => {
    const tags: Tag[] = [
      { id: "1", name: "Donjon", color: "#f00" },
      { id: "2", name: "Raid", color: "#0f0" },
    ];

    const mockService = {
      getTags: vi.fn().mockResolvedValue(tags),
    };

    const result = setupHook(mockService);

    // état initial
    expect(result.current.isLoading).toBe(true);
    expect(result.current.tags).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getTags).toHaveBeenCalledTimes(1);
    expect(result.current.tags).toEqual(tags);
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = new AxiosError("Axios error");

    const mockService = {
      getTags: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tags).toEqual([]);
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Standard error");

    const mockService = {
      getTags: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tags).toEqual([]);
    expect(result.current.error).toBe("Standard error");
  });
});
