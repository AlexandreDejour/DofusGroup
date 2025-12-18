import { describe, it, beforeEach, expect, vi, type Mock } from "vitest";
import qs from "qs";

import { t } from "../../../i18n/i18n-helper";

import type { ApiClient } from "../../client";
import type {
  Event,
  EventEnriched,
  PaginatedEvents,
} from "../../../types/event";
import type { CreateEventForm } from "../../../types/form";

import { EventService } from "../eventService";
import handleApiError from "../../utils/handleApiError";

vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn(),
}));

describe("EventService", () => {
  let apiClientMock: {
    get: Mock;
    post: Mock;
    patch: Mock;
    delete: Mock;
  };

  let eventService: EventService;

  const userId = "user-id";
  const eventId = "event-id";
  const characterId = "character-id";

  beforeEach(() => {
    vi.clearAllMocks();

    apiClientMock = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    eventService = new EventService(apiClientMock as unknown as ApiClient);
  });

  describe("getEvents", () => {
    it("calls apiClient.get with params and returns data", async () => {
      const mockData: PaginatedEvents = {
        events: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      };

      apiClientMock.get.mockResolvedValue({ data: mockData });

      const result = await eventService.getEvents(10, 1);

      expect(apiClientMock.get).toHaveBeenCalledWith("/events", {
        params: { limit: 10, page: 1 },
      });
      expect(result).toEqual(mockData);
    });

    it("calls handleApiError and returns undefined on error", async () => {
      const error = new Error("API error");
      apiClientMock.get.mockRejectedValue(error);

      const result = await eventService.getEvents();

      expect(handleApiError).toHaveBeenCalledWith(error);
      expect(result).toBeUndefined();
    });
  });

  describe("getRegistered", () => {
    it("calls apiClient.get with repeat params serializer", async () => {
      const mockEvents: Event[] = [
        {
          id: "evt-1",
          title: "Test",
          date: new Date(),
          duration: 60,
          max_players: 4,
          status: "public",
          sub_area: "",
          donjon_name: "",
          description: "",
          tag: { id: "t1", name: "tag", color: "#000" },
          server: { id: "s1", name: "Srv", mono_account: false },
          characters: [],
        },
      ];

      apiClientMock.get.mockResolvedValue({ data: mockEvents });

      const result = await eventService.getRegistered(["c1", "c2"]);

      const [, options] = apiClientMock.get.mock.calls[0];

      expect(options.params).toEqual({ characterIds: ["c1", "c2"] });
      expect(typeof options.paramsSerializer).toBe("function");

      expect(options.paramsSerializer({ characterIds: ["a", "b"] })).toBe(
        qs.stringify({ characterIds: ["a", "b"] }, { arrayFormat: "repeat" }),
      );

      expect(result).toEqual(mockEvents);
    });
  });

  describe("getAllByUserId", () => {
    it("returns user events", async () => {
      const mockEvents: Event[] = [] as any;
      apiClientMock.get.mockResolvedValue({ data: mockEvents });

      const result = await eventService.getAllByUserId(userId);

      expect(apiClientMock.get).toHaveBeenCalledWith(`/user/${userId}/events`);
      expect(result).toEqual(mockEvents);
    });
  });

  describe("getOneEnriched", () => {
    it("returns enriched event", async () => {
      const mockEvent = { id: eventId } as EventEnriched;
      apiClientMock.get.mockResolvedValue({ data: mockEvent });

      const result = await eventService.getOneEnriched(eventId);

      expect(apiClientMock.get).toHaveBeenCalledWith(
        `/event/${eventId}/enriched`,
      );
      expect(result).toEqual(mockEvent);
    });
  });

  describe("create", () => {
    const validData: CreateEventForm = {
      title: "Event",
      date: new Date(),
      duration: 60,
      max_players: 4,
      status: "public",
      tag_id: "tag",
      server_id: "server",
      characters_id: [],
    };

    it("creates event successfully", async () => {
      const mockEvent = { id: eventId } as Event;
      apiClientMock.post.mockResolvedValue({ data: mockEvent });

      const result = await eventService.create(userId, validData);

      expect(apiClientMock.post).toHaveBeenCalledWith(
        `/user/${userId}/event`,
        validData,
        { withCredentials: true },
      );
      expect(result).toEqual(mockEvent);
    });

    it("throws validation error if server_id missing", async () => {
      await expect(
        eventService.create(userId, {
          ...validData,
          server_id: undefined as any,
        }),
      ).rejects.toThrow(t("validation.server.required"));
    });

    it("throws validation error if max_players invalid", async () => {
      await expect(
        eventService.create(userId, {
          ...validData,
          max_players: 1,
        }),
      ).rejects.toThrow(t("validation.playerNumber.range"));
    });
  });

  describe("update", () => {
    const validData: CreateEventForm = {
      title: "Update",
      date: new Date(Date.now() + 10000),
      duration: 60,
      max_players: 4,
      status: "public",
      tag_id: "tag",
      server_id: "server",
      characters_id: [],
    };

    it("updates event", async () => {
      const mockEvent = { id: eventId } as EventEnriched;
      apiClientMock.patch.mockResolvedValue({ data: mockEvent });

      const result = await eventService.update(userId, eventId, validData);

      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/user/${userId}/event/${eventId}`,
        validData,
        { withCredentials: true },
      );
      expect(result).toEqual(mockEvent);
    });

    it("throws error if date is in the past", async () => {
      await expect(
        eventService.update(userId, eventId, {
          ...validData,
          date: new Date(Date.now() - 1000),
        }),
      ).rejects.toThrow(t("validation.date.future"));
    });
  });

  describe("addCharacters", () => {
    it("adds characters to event", async () => {
      apiClientMock.post.mockResolvedValue({ data: { success: true } });

      const result = await eventService.addCharacters(eventId, {
        characters_id: ["c1"],
      } as any);

      expect(apiClientMock.post).toHaveBeenCalledWith(
        `/event/${eventId}/addCharacters`,
        { data: { characters_id: ["c1"] } },
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe("removeCharacter", () => {
    it("removes character from event", async () => {
      apiClientMock.post.mockResolvedValue({ data: { success: true } });

      const result = await eventService.removeCharacter(eventId, characterId);

      expect(apiClientMock.post).toHaveBeenCalledWith(
        `/event/${eventId}/removeCharacter`,
        { character_id: characterId },
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe("delete", () => {
    it("deletes event", async () => {
      const response = { status: 200 };
      apiClientMock.delete.mockResolvedValue(response);

      const result = await eventService.delete(userId, eventId);

      expect(apiClientMock.delete).toHaveBeenCalledWith(
        `/user/${userId}/event/${eventId}`,
        { withCredentials: true },
      );
      expect(result).toBe(response);
    });
  });
});
