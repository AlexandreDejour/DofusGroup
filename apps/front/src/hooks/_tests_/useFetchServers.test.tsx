import { vi } from "vitest";
import { AxiosError } from "axios";
import { render, waitFor } from "@testing-library/react";

import { Server } from "../../types/server";

import useFetchServers from "../useFetchServers";

// Helpers
function setupHook(service: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchServers(service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchServers hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch servers successfully", async () => {
    const serversData: Server[] = [
      { id: "server1", name: "Server1", mono_account: true },
      { id: "server2", name: "Server2", mono_account: false },
    ];

    const mockService = {
      getServers: vi.fn().mockResolvedValue(serversData),
    };

    const result = setupHook(mockService);

    // initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.servers).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getServers).toHaveBeenCalledTimes(1);
    expect(result.current.servers).toEqual(serversData);
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = new AxiosError("Axios error");

    const mockService = {
      getServers: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.servers).toEqual([]);
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Standard error");

    const mockService = {
      getServers: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook(mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.servers).toEqual([]);
    expect(result.current.error).toBe("Standard error");
  });
});
