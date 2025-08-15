import { EventService } from "../eventService";
import { ApiClient } from "../../client";
import { PaginatedEvents } from "../../../types/event";

describe("EventService", () => {
  let apiClientMock: any;
  let eventService: EventService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
      },
    };
    eventService = new EventService(apiClientMock as ApiClient);
  });

  it("Call axios.get with parameters", async () => {
    const mockData: PaginatedEvents = {
      events: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    };
    apiClientMock.instance.get.mockResolvedValue({ data: mockData });

    const result = await eventService.getEvents(10, 1);

    expect(apiClientMock.instance.get).toHaveBeenCalledWith("/events", {
      params: { limit: 10, page: 1 },
    });
    expect(result).toEqual(mockData);
  });

  it("Call axios.get without parameters if not provided", async () => {
    const mockData: PaginatedEvents = {
      events: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    };
    apiClientMock.instance.get.mockResolvedValue({ data: mockData });

    await eventService.getEvents();

    expect(apiClientMock.instance.get).toHaveBeenCalledWith("/events", {
      params: { limit: undefined, page: undefined },
    });
  });
});
