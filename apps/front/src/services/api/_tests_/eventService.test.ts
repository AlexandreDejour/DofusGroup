import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { ApiClient } from "../../client";
import { EventService } from "../eventService";
import { PaginatedEvents } from "../../../types/event";

vi.mock("axios");

describe("EventService", () => {
  let apiClientMock: any;
  let eventService: EventService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
        delete: vi.fn(),
      },
    };
    eventService = new EventService(apiClientMock as ApiClient);
  });

  describe("getEvents", () => {
    it("Call axios.get with correct params", async () => {
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

    it("Call axios.get without params if nothing provided", async () => {
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

    it("Throw specific error if response if 204", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 204 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(axiosError);

      await expect(eventService.getEvents()).rejects.toThrow(
        "Aucun évènement à venir.",
      );
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      (axios.isAxiosError as any).mockReturnValue(false);
      apiClientMock.instance.get.mockRejectedValue(error);

      await expect(eventService.getEvents()).rejects.toThrow("Unknown error");
    });
  });

  describe("delete", () => {
    it("Call axios.delete with correct params", async () => {
      const mockResponse = { status: 200 };
      apiClientMock.instance.delete.mockResolvedValue(mockResponse);

      const result = await eventService.delete("user123", "event456");

      expect(apiClientMock.instance.delete).toHaveBeenCalledWith(
        "/user/user123/event/event456",
        { withCredentials: true },
      );
      expect(result).toBe(mockResponse);
    });

    it("Throw specific error if response if 400", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 400 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.delete.mockRejectedValue(axiosError);

      await expect(eventService.delete("user123", "event456")).rejects.toThrow(
        "Cette action est impossible.",
      );
    });

    it("Throw specific error if response if 404", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.delete.mockRejectedValue(axiosError);

      await expect(eventService.delete("user123", "event456")).rejects.toThrow(
        "Cette évènement n'existe plus.",
      );
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      (axios.isAxiosError as any).mockReturnValue(false);
      apiClientMock.instance.delete.mockRejectedValue(error);

      await expect(eventService.delete("user123", "event456")).rejects.toThrow(
        "Unknown error",
      );
    });
  });
});
