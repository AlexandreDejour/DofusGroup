import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { PaginatedEvents } from "../../../types/event";
import { CreateEventForm } from "../../../types/form";

import { ApiClient } from "../../client";
import { EventService } from "../eventService";

vi.mock("axios");

describe("EventService", () => {
  let apiClientMock: any;
  let eventService: EventService;

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
        post: vi.fn(),
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

  describe("create", () => {
    const userId = "user123";
    const eventData: CreateEventForm = {
      title: "Rafle perco",
      date: new Date("2025-12-24T23:59:59.000Z"),
      duration: 180,
      description: "on rase tout",
      max_players: 8,
      status: "public",
      tag_id: "31d0d841-1345-4939-9495-0f802362eb79",
      server_id: "841d2f1e-b95d-4a49-87a4-3d6e6ecf4888",
      characters_id: ["bce0975c-8e0b-446c-a7a4-efbd43ceeb62"],
    };

    it("Calls axios.post with correct params on success", async () => {
      const mockResponse = {
        data: { id: "event456", ...eventData },
      };
      apiClientMock.instance.post.mockResolvedValue(mockResponse);

      const result = await eventService.create(userId, eventData);

      expect(apiClientMock.instance.post).toHaveBeenCalledWith(
        `/user/${userId}/event`,
        eventData,
        { withCredentials: true },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("Throws an error if server_id is missing", async () => {
      const invalidData = { ...eventData, server_id: null };
      await expect(
        eventService.create(userId, invalidData as any),
      ).rejects.toThrow("Vous devez renseigner un serveur.");
    });

    it("Throws an error if tag_id is missing", async () => {
      const invalidData = { ...eventData, tag_id: null };
      await expect(
        eventService.create(userId, invalidData as any),
      ).rejects.toThrow("Vous devez renseigner un tag.");
    });

    it("Throws an error if max_players is less than 2", async () => {
      const invalidData = { ...eventData, max_players: 1 };
      await expect(
        eventService.create(userId, invalidData as CreateEventForm),
      ).rejects.toThrow("Le nombre de joueurs doit être compris entre 2 et 8.");
    });

    it("Throws an error if max_players is more than 8", async () => {
      const invalidData = { ...eventData, max_players: 9 };
      await expect(
        eventService.create(userId, invalidData as CreateEventForm),
      ).rejects.toThrow("Le nombre de joueurs doit être compris entre 2 et 8.");
    });

    it("Throws a specific error for a 400 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 400 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      await expect(eventService.create(userId, eventData)).rejects.toThrow(
        "Les informations transmises sont érronées ou incomplètes.",
      );
    });

    it("Throws a specific error for a 401 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      await expect(eventService.create(userId, eventData)).rejects.toThrow(
        "Vous devez être connecter pour créer un évènement.",
      );
    });

    it("Throws a specific error for a 403 status code", async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403 },
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.post.mockRejectedValue(axiosError);

      await expect(eventService.create(userId, eventData)).rejects.toThrow(
        "La création de personnage est réservée à votre compte.",
      );
    });

    it("Throws a generic error for non-Axios or other errors", async () => {
      const error = new Error("Unknown error");
      (axios.isAxiosError as any).mockReturnValue(false);
      apiClientMock.instance.post.mockRejectedValue(error);

      await expect(eventService.create(userId, eventData)).rejects.toThrow(
        "Unknown error",
      );
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
        "Cette action n'est pas autorisée.",
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
