import { vi } from "vitest";
import { render } from "@testing-library/react";
import useSearchHandler from "../useSearchHandler";

const mockFormDataToObject = vi.fn();
vi.mock("../../../../contexts/utils/formDataToObject", () => ({
  default: (...args: any[]) => mockFormDataToObject(...args),
}));

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

vi.mock("../../../../services/api/eventService", () => ({
  EventService: vi.fn().mockImplementation(() => ({
    getEvents: (...args: any[]) => mockGetEvents(...args),
  })),
}));

function setupHook(currentPage = 1) {
  const ref = { current: null as any };

  function TestComponent() {
    const setEvents = vi.fn();
    const setTotalPages = vi.fn();

    ref.current = {
      handler: useSearchHandler(currentPage, setEvents, setTotalPages),
      setEvents,
      setTotalPages,
    };

    return null;
  }

  render(<TestComponent />);
  return ref;
}
describe("useSearchHandler hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Must call eventService.getEvents with correct params and update state", async () => {
    const currentPage = 3;

    const mockResponse = {
      events: [{ id: 1, title: "Event X" }],
      totalPages: 7,
    };

    mockGetEvents = vi.fn().mockResolvedValue(mockResponse);

    mockFormDataToObject.mockReturnValue({
      title: "test-title",
      tag_id: "2",
      server_id: "5",
    });

    const ref = setupHook(currentPage);

    const preventDefault = vi.fn();

    // Mock event
    const fakeEvent: any = {
      preventDefault,
      currentTarget: {},
    };

    // Mock FormData to return predictable key/value
    global.FormData = vi.fn().mockImplementation(() => ({
      get: (key: string) => {
        const map: any = {
          title: "test-title",
          tag_id: "2",
          server_id: "5",
        };
        return map[key];
      },
    })) as any;

    // Execute handler
    await ref.current.handler(fakeEvent);

    // Assertions
    expect(preventDefault).toHaveBeenCalled();

    expect(mockFormDataToObject).toHaveBeenCalled();

    expect(mockGetEvents).toHaveBeenCalledWith(10, currentPage, {
      title: "test-title",
      tag_id: "2",
      server_id: "5",
    });

    expect(ref.current.setEvents).toHaveBeenCalledWith(mockResponse.events);
    expect(ref.current.setTotalPages).toHaveBeenCalledWith(7);
  });

  it("Must catch errors without throwing", async () => {
    mockGetEvents = vi.fn().mockRejectedValue(new Error("Oops"));
    mockFormDataToObject.mockReturnValue({});

    const ref = setupHook();

    const fakeEvent: any = {
      preventDefault: vi.fn(),
      currentTarget: {},
    };

    await expect(ref.current.handler(fakeEvent)).resolves.not.toThrow();

    expect(ref.current.setEvents).not.toHaveBeenCalled();
    expect(ref.current.setTotalPages).not.toHaveBeenCalled();
  });
});
