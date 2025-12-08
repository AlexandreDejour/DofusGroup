import { vi, Mock } from "vitest";
import { render, act } from "@testing-library/react";
import { isAxiosError } from "axios";

import useFetchEvent from "../useFetchEvent";

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

vi.mock("../../../../config/config.ts", () => ({
  Config: { getInstance: () => ({ backUrl: "http://localhost" }) },
}));

let mockGetOneEnriched: any;

vi.mock("../../../../services/api/eventService", () => ({
  EventService: vi.fn().mockImplementation(() => ({
    getOneEnriched: (...args: any[]) => mockGetOneEnriched(...args),
  })),
}));

function setupHook(id: string, updateTarget: any = null) {
  const ref = { current: null as any };
  const setEvent = vi.fn();

  function TestComponent() {
    ref.current = useFetchEvent(id, updateTarget, setEvent);
    ref.current._internal = { setEvent };
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchEvent hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading true & error null", () => {
    mockGetOneEnriched = vi
      .fn()
      .mockResolvedValue({ id: "event-1", title: "Test Event" });

    const ref = setupHook("event-1");

    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
  });

  it("should fetch event successfully", async () => {
    const mockEvent = { id: "event-1", title: "Test Event" };
    mockGetOneEnriched = vi.fn().mockResolvedValue(mockEvent);

    const ref = setupHook("event-1");

    await act(async () => {
      await Promise.resolve(); // allow useEffect to run
    });

    expect(ref.current._internal.setEvent).toHaveBeenCalledWith(mockEvent);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("should handle axios error", async () => {
    const errorMessage = "Axios error thrown";
    mockGetOneEnriched = vi.fn().mockRejectedValue(new Error(errorMessage));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook("event-1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("should handle non-axios error", async () => {
    const errorMessage = "Unknown error";
    mockGetOneEnriched = vi.fn().mockRejectedValue(new Error(errorMessage));
    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook("event-1");

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
