import { Mock, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";

import useSearchHandler from "../useSearchHandler";
import formDataToObject from "../../contexts/utils/formDataToObject";

vi.mock("../../contexts/utils/formDataToObject", () => ({
  default: vi.fn(),
}));

// Helpers
function setupHook(
  currentPage: number,
  setEvents: any,
  setTotalPages: any,
  service: any,
) {
  let handler: any;

  function TestComponent() {
    handler = useSearchHandler(currentPage, setEvents, setTotalPages, service);
    return (
      <form onSubmit={handler} data-testid="form">
        <input name="title" defaultValue="test" />
        <input name="tag_id" defaultValue="tag-1" />
        <input name="server_id" defaultValue="server-1" />
        <button type="submit">submit</button>
      </form>
    );
  }

  const utils = render(<TestComponent />);
  return { handler, ...utils };
}

describe("useSearchHandler hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch filtered events successfully", async () => {
    const events = [{ id: "1", title: "Event 1" }];
    const response = {
      events,
      totalPages: 3,
    };

    const setEvents = vi.fn();
    const setTotalPages = vi.fn();

    const mockService = {
      getEvents: vi.fn().mockResolvedValue(response),
    };

    (formDataToObject as unknown as Mock).mockReturnValue({
      title: "test",
      tag_id: "tag-1",
      server_id: "server-1",
    });

    const { getByTestId } = setupHook(2, setEvents, setTotalPages, mockService);

    fireEvent.submit(getByTestId("form"));

    await Promise.resolve();

    expect(mockService.getEvents).toHaveBeenCalledTimes(1);
    expect(mockService.getEvents).toHaveBeenCalledWith(10, 2, {
      title: "test",
      tag_id: "tag-1",
      server_id: "server-1",
    });

    expect(setEvents).toHaveBeenCalledWith(events);
    expect(setTotalPages).toHaveBeenCalledWith(3);
  });

  it("should handle error when service throws", async () => {
    const setEvents = vi.fn();
    const setTotalPages = vi.fn();

    const error = new Error("Search error");

    const mockService = {
      getEvents: vi.fn().mockRejectedValue(error),
    };

    (formDataToObject as unknown as Mock).mockReturnValue({
      title: "test",
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { getByTestId } = setupHook(1, setEvents, setTotalPages, mockService);

    fireEvent.submit(getByTestId("form"));

    await Promise.resolve();

    expect(mockService.getEvents).toHaveBeenCalledTimes(1);
    expect(setEvents).not.toHaveBeenCalled();
    expect(setTotalPages).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });
});
