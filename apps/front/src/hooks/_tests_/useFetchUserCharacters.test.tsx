import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";

import { Character } from "../../types/character";
import useFetchUserCharacters from "../useFetchUserCharacters";

// Helpers
function setupHook(id: string, server: string, service: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchUserCharacters(id, server, service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchUserCharacters hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all characters successfully", async () => {
    const characters: Character[] = [
      {
        id: "char1",
        name: "char1",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv1",
      },
      {
        id: "char2",
        name: "char2",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv2",
      },
    ];

    const mockService = {
      getAllByUserId: vi.fn().mockResolvedValue(characters),
    };

    const result = setupHook("user1", "", mockService);

    // état initial
    expect(result.current.isLoading).toBe(true);
    expect(result.current.characters).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getAllByUserId).toHaveBeenCalledTimes(1);
    expect(mockService.getAllByUserId).toHaveBeenCalledWith("user1");
    expect(result.current.characters).toEqual(characters);
    expect(result.current.error).toBeNull();
  });

  it("should fetch only characters from the specified server", async () => {
    const characters: Character[] = [
      {
        id: "char1",
        name: "char1",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv1",
      },
      {
        id: "char2",
        name: "char2",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv2",
      },
    ];

    const mockService = {
      getAllByUserId: vi.fn().mockResolvedValue(characters),
    };

    const result = setupHook("user1", "srv1", mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.characters).toEqual([
      {
        id: "char1",
        name: "char1",
        sex: "M",
        level: 50,
        alignment: "Bonta",
        stuff: "https://d-bk.net/fr/d/1QVjw",
        server_id: "srv1",
      },
    ]);
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = new AxiosError("Axios error");

    const mockService = {
      getAllByUserId: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook("user1", "", mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.characters).toEqual([]);
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Standard error");

    const mockService = {
      getAllByUserId: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook("user1", "", mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.characters).toEqual([]);
    expect(result.current.error).toBe("Standard error");
  });
});
