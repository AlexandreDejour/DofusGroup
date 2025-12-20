import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import { EventEnriched } from "../../types/event";

import useFetchEvent from "../useFetchEvent";

const updateTarget = vi.fn();

vi.mock("../../contexts/modalContext", () => ({
  useModal: () => ({
    updateTarget,
  }),
}));

// Helpers
function setupHook(
  id: string,
  setEvent: React.Dispatch<React.SetStateAction<EventEnriched | null>>,
  service: any,
) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useFetchEvent(id, setEvent, service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useFetchEvent hook", () => {
  let setEvent: React.Dispatch<React.SetStateAction<EventEnriched | null>>;

  beforeEach(() => {
    vi.clearAllMocks();
    setEvent = vi.fn();
  });

  it("should fetch event successfully", async () => {
    const event: EventEnriched = {
      id: "event-1",
      title: "Test Event",
      date: new Date("2025-12-19T12:00:00Z"),
      description: "Description",
      duration: 60,
      max_players: 5,
      status: "public",
      user: { id: "user-1", username: "toto" },
      tag: { id: "tag-1", name: "Raid", color: "#000" },
      server: { id: "server-1", name: "Rafal", mono_account: false },
      characters: [],
      comments: [],
      area: "Area1",
      sub_area: "SubArea1",
      donjon_name: "Dungeon1",
    };

    const mockService = {
      getOneEnriched: vi.fn().mockResolvedValue(event),
    };

    const result = setupHook("event-1", setEvent, mockService);

    // état initial
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(setEvent).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockService.getOneEnriched).toHaveBeenCalledTimes(1);
    expect(mockService.getOneEnriched).toHaveBeenCalledWith("event-1");
    expect(setEvent).toHaveBeenCalledTimes(1);
    expect(setEvent).toHaveBeenCalledWith(event);
    expect(result.current.error).toBeNull();
  });

  it("should set error when axios error occurs", async () => {
    const axiosError = {
      isAxiosError: true,
      message: "Axios error",
    };

    const mockService = {
      getOneEnriched: vi.fn().mockRejectedValue(axiosError),
    };

    const result = setupHook("event-1", setEvent, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(setEvent).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Axios error");
  });

  it("should set error when standard Error occurs", async () => {
    const error = new Error("Standard error");

    const mockService = {
      getOneEnriched: vi.fn().mockRejectedValue(error),
    };

    const result = setupHook("event-1", setEvent, mockService);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(setEvent).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Standard error");
  });
});
