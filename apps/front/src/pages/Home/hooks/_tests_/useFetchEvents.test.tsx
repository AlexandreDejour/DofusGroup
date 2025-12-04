import React from "react";
import { Mock, vi } from "vitest";
import { isAxiosError } from "axios";
import { render, act } from "@testing-library/react";

import useFetchEvents from "../useFetchEvents";

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
    default: {
      create: vi.fn(() => axiosInstance),
    },
    isAxiosError: vi.fn(),
  };
});

vi.mock("../../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      backUrl: "http://localhost",
    }),
  },
}));

let mockGetEvents: any;

vi.mock("../../../../services/api/eventService", () => {
  return {
    EventService: vi.fn().mockImplementation(() => ({
      getEvents: (...args: any[]) => mockGetEvents(...args),
    })),
  };
});

function setupHook(initialPage = 1) {
  const ref = { current: null as any };

  // local react states passed to our hook
  function TestComponent() {
    const [events, setEvents] = React.useState<any[]>([]);
    const [totalPages, setTotalPages] = React.useState(0);

    ref.current = useFetchEvents(events, setEvents, initialPage, setTotalPages);

    // expose internal states for assertions
    ref.current._internal = { events, totalPages };

    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchEvents hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must initialize with loading true & empty state", () => {
    mockGetEvents = vi.fn().mockResolvedValue({
      events: [],
      totalPages: 1,
    });

    const ref = setupHook();

    expect(ref.current.isLoading).toBe(true);
    expect(ref.current.error).toBeNull();
    expect(ref.current._internal.events).toEqual([]);
    expect(ref.current._internal.totalPages).toBe(0);
  });

  it("Must successfully fetch events", async () => {
    const mockResponse = {
      events: [
        { id: 1, title: "Event1" },
        { id: 2, title: "Event2" },
      ],
      totalPages: 5,
    };

    mockGetEvents = vi.fn().mockResolvedValue(mockResponse);

    const ref = setupHook(2); // test page 2

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current._internal.events).toEqual(mockResponse.events);
    expect(ref.current._internal.totalPages).toBe(5);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBeNull();
  });

  it("Must handle axios error", async () => {
    const errorMessage = "Axios error thrown";
    mockGetEvents = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(true);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current._internal.events).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });

  it("Must handle non-axios error", async () => {
    const errorMessage = "Unknown error";
    mockGetEvents = vi.fn().mockRejectedValue(new Error(errorMessage));

    (isAxiosError as unknown as Mock).mockReturnValueOnce(false);

    const ref = setupHook();

    await act(async () => {
      await Promise.resolve();
    });

    expect(ref.current._internal.events).toEqual([]);
    expect(ref.current.isLoading).toBe(false);
    expect(ref.current.error).toBe(errorMessage);
  });
});
