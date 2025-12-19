import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import { Event } from "../../types/event";

import useFetchEvents from "../useFetchEvents";

const refreshKey = vi.fn();

vi.mock("../../contexts/modalContext", () => ({
  useModal: () => ({
    refreshKey,
  }),
}));

// Helpers
function setupHook(
  events: Event[],
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>,
  currentPage: number,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>,
  service: any,
) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchEvents(
      events,
      setEvents,
      currentPage,
      setTotalPages,
      service,
    );
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchEvents hook", () => {
  let setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  let setTotalPages: React.Dispatch<React.SetStateAction<number>>;

  beforeEach(() => {
    vi.clearAllMocks();
    setEvents = vi.fn();
    setTotalPages = vi.fn();
  });

  it("should fetch events successfully", async () => {
    const eventsData = {
      events: [
        {
          id: "1",
          title: "Event1",
          date: "2025-12-19",
          description: "",
          duration: 60,
          max_players: 5,
          status: "public",
        },
        {
          id: "2",
          title: "Event2",
          date: "2025-12-20",
          description: "",
          duration: 90,
          max_players: 10,
          status: "private",
        },
      ],
      totalPages: 3,
    };

    const mockService = {
      getEvents: vi.fn().mockResolvedValue(eventsData),
    };

    const initialEvents: Event[] = [];
    const result = setupHook(
      initialEvents,
      setEvents,
      1,
      setTotalPages,
      mockService,
    );

    // état initial
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.events).toEqual(initialEvents);
    expect(setEvents).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getEvents).toHaveBeenCalledTimes(1);
    expect(mockService.getEvents).toHaveBeenCalledWith(10, 1);
    expect(setEvents).toHaveBeenCalledWith(eventsData.events);
    expect(setTotalPages).toHaveBeenCalledWith(eventsData.totalPages);
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = { isAxiosError: true, message: "Axios error" };

    const mockService = {
      getEvents: vi.fn().mockRejectedValue(axiosError),
    };

    const initialEvents: Event[] = [];
    const result = setupHook(
      initialEvents,
      setEvents,
      1,
      setTotalPages,
      mockService,
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(setEvents).not.toHaveBeenCalled();
    expect(setTotalPages).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Standard error");

    const mockService = {
      getEvents: vi.fn().mockRejectedValue(error),
    };

    const initialEvents: Event[] = [];
    const result = setupHook(
      initialEvents,
      setEvents,
      1,
      setTotalPages,
      mockService,
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(setEvents).not.toHaveBeenCalled();
    expect(setTotalPages).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Standard error");
  });

  it("should refetch events when currentPage changes", async () => {
    const eventsPage1 = {
      events: [
        {
          id: "1",
          title: "Event1",
          date: "2025-12-19",
          description: "",
          duration: 60,
          max_players: 5,
          status: "public",
        },
      ],
      totalPages: 2,
    };
    const eventsPage2 = {
      events: [
        {
          id: "2",
          title: "Event2",
          date: "2025-12-20",
          description: "",
          duration: 90,
          max_players: 10,
          status: "private",
        },
      ],
      totalPages: 2,
    };

    const mockService = {
      getEvents: vi
        .fn()
        .mockResolvedValueOnce(eventsPage1)
        .mockResolvedValueOnce(eventsPage2),
    };

    const initialEvents: Event[] = [];
    let currentPage = 1;
    const result = setupHook(
      initialEvents,
      setEvents,
      currentPage,
      setTotalPages,
      mockService,
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Changement de page
    currentPage = 2;
    setupHook(
      initialEvents,
      setEvents,
      currentPage,
      setTotalPages,
      mockService,
    );

    await waitFor(() =>
      expect(mockService.getEvents).toHaveBeenCalledWith(10, 2),
    );
  });
});
