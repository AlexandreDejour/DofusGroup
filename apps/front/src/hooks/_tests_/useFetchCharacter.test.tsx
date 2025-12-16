import { vi, Mock } from "vitest";
import { render, act } from "@testing-library/react";
import { isAxiosError } from "axios";

import useFetchCharacter from "../useFetchCharacter";

// --- Mock axios instance inside ApiClient ---
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
    default: { create: vi.fn(() => axiosInstance) },
    isAxiosError: vi.fn(),
  };
});

// --- Mock Config.getInstance() ---
vi.mock("../../../../config/config", () => ({
  Config: { getInstance: () => ({ backUrl: "http://localhost" }) },
}));

let mockGetOneEnriched: any;

// --- Mock CharacterService ---
vi.mock("../../../../services/api/characterService", () => ({
  CharacterService: vi.fn().mockImplementation(() => ({
    getOneEnriched: (...args: any[]) => mockGetOneEnriched(...args),
  })),
}));

// --- Mock modal context ---
vi.mock("../../../../contexts/modalContext", () => ({
  useModal: () => ({
    updateTarget: null,
  }),
}));

// Helper to render hook inside a dummy component
function setupHook(id: string) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchCharacter(id);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchCharacter hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading true & error null", () => {
    mockGetOneEnriched = vi
      .fn()
      .mockResolvedValue({ id: "char-1", name: "John Doe" });

    const ref = setupHook("char-1");

    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
    expect(ref.current.character).toBeNull();
  });

  it("should fetch character successfully", async () => {
    const mockCharacter = { id: "char-1", name: "John Doe" };
    mockGetOneEnriched = vi.fn().mockResolvedValue(mockCharacter);

    const ref = setupHook("char-1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.character).toEqual(mockCharacter);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("should handle axios error", async () => {
    const errorMessage = "Axios error occurred";
    mockGetOneEnriched = vi.fn().mockRejectedValue(new Error(errorMessage));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook("char-1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.character).toBeNull();
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("should handle non-axios error", async () => {
    const errorMessage = "Unknown error";
    mockGetOneEnriched = vi.fn().mockRejectedValue(new Error(errorMessage));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook("char-1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.character).toBeNull();
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
