import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import useFetchAuthUser from "../useFetchAuthUser";

// Helpers
function setupHook(service: any) {
  const ref = {
    current: null as any,
  };

  function TestComponent() {
    ref.current = useFetchAuthUser(service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchAuthUser hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch authenticated user successfully", async () => {
    const user = {
      id: "user-1",
      email: "user@test.com",
      username: "testuser",
    };

    const mockService = {
      apiMe: vi.fn().mockResolvedValue(user),
    };

    const result = setupHook(mockService);

    // initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.apiMe).toHaveBeenCalledTimes(1);
    expect(result.current.user).toEqual(user);
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = {
      isAxiosError: true,
      message: "Unauthorized",
    };

    const mockService = {
      apiMe: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe("Unauthorized");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Unexpected error");

    const mockService = {
      apiMe: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe("Unexpected error");
  });
});
