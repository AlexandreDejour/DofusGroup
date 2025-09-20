import { describe, it, beforeEach, expect, vi } from "vitest";

import axios from "axios";

import { CreateEventForm } from "../../../types/form";
import { EventEnriched, PaginatedEvents } from "../../../types/event";

import { ApiClient } from "../../client";
import { EventService } from "../eventService";

vi.mock("axios");

describe("EventService", () => {
  let apiClientMock: any;
  let eventService: EventService;

  const userId: string = "3d2ebbe3-8193-448c-bec8-8993e7055240";
  const eventId: string = "05d29664-ca0e-4500-bf06-352384986d95";
  const characterId: string = "613c8816-49dc-493b-a48f-198c55a852d6";

  const mockEventEnriched: EventEnriched = {
    id: "05d29664-ca0e-4500-bf06-352384986d95",
    title: "Passage korriandre",
    date: new Date("2025-09-20T09:50:00.000Z"),
    duration: 40,
    area: "Île de Frigost",
    sub_area: "Antre du Korriandre",
    donjon_name: "Antre du Korriandre",
    description: "Tu payes, je te fais passer en fast",
    max_players: 8,
    status: "public",
    tag: {
      id: "6f2cf523-18be-470e-99e1-3fea1d91ab4c",
      name: "Donjon",
      color: "#c0392b",
    },
    server: {
      id: "3e354b84-1516-4160-b750-cbe798d7b11e",
      name: "Salar",
      mono_account: false,
    },
    comments: [],
    characters: [
      {
        id: "a5c8f77a-2b7d-4a45-87e2-fae117936829",
        name: "gniouf",
        sex: "M",
        level: 2,
        alignment: "Neutre",
        stuff: null,
        default_character: false,
        user: {
          id: "3d2ebbe3-8193-448c-bec8-8993e7055240",
          username: "totolebeau",
        },
        breed: {
          id: "bd0783a6-8012-4724-8319-42e2349b88a4",
          name: "Ecaflip",
        },
        server: {
          id: "73b70f36-b546-4ee4-95ce-9bbc4adb67df",
          name: "Brial",
          mono_account: false,
        },
      },
    ],
    user: {
      id: "3d2ebbe3-8193-448c-bec8-8993e7055240",
      username: "totolebeau",
    },
  };

  beforeEach(() => {
    apiClientMock = {
      instance: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
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

  describe("getOneEnriched", () => {
    it("calls axios.get and returns event", async () => {
      apiClientMock.instance.get.mockResolvedValue({ data: mockEventEnriched });

      const result = await eventService.getOneEnriched(
        "05d29664-ca0e-4500-bf06-352384986d95",
      );

      expect(apiClientMock.instance.get).toHaveBeenCalledWith(
        `/event/${eventId}/enriched`,
      );
      expect(result).toEqual(mockEventEnriched);
    });

    it("throws axios error message if axios error", async () => {
      const error = {
        isAxiosError: true,
        response: { status: 500, data: {} },
        message: "fail",
      };
      (axios.isAxiosError as any).mockReturnValue(true);
      apiClientMock.instance.get.mockRejectedValue(error);

      await expect(eventService.getOneEnriched(eventId)).rejects.toThrow(
        "fail",
      );
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
        data: { id: "033973c3-0f31-4f06-9cd7-ec2718b6e9fd", ...eventData },
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

  describe("update", () => {
    const validData: CreateEventForm = {
      title: "Test Update",
      date: new Date(Date.now() + 10000),
      duration: 120,
      max_players: 5,
      status: "public",
      tag_id: "tag1",
      server_id: "server1",
      characters_id: [],
    };

    it("calls axios.patch with correct params and returns data", async () => {
      const mockResponse: EventEnriched = {
        id: eventId,
        title: "Test Update",
        max_players: 5,
        date: validData.date,
        duration: 120,
        status: "public",
        sub_area: "",
        donjon_name: "",
        description: "",
        tag: {
          id: "6f2cf523-18be-470e-99e1-3fea1d91ab4c",
          name: "Donjon",
          color: "#c0392b",
        },
        server: {
          id: "3e354b84-1516-4160-b750-cbe798d7b11e",
          name: "Salar",
          mono_account: false,
        },
        comments: [],
        characters: [
          {
            id: "a5c8f77a-2b7d-4a45-87e2-fae117936829",
            name: "gniouf",
            sex: "M",
            level: 2,
            alignment: "Neutre",
            stuff: null,
            default_character: false,
            user: {
              id: "3d2ebbe3-8193-448c-bec8-8993e7055240",
              username: "totolebeau",
            },
            breed: {
              id: "bd0783a6-8012-4724-8319-42e2349b88a4",
              name: "Ecaflip",
            },
            server: {
              id: "73b70f36-b546-4ee4-95ce-9bbc4adb67df",
              name: "Brial",
              mono_account: false,
            },
          },
        ],
        user: {
          id: "3d2ebbe3-8193-448c-bec8-8993e7055240",
          username: "totolebeau",
        },
      };
      apiClientMock.instance.patch.mockResolvedValue({ data: mockResponse });

      const result = await eventService.update(userId, eventId, validData);

      expect(apiClientMock.instance.patch).toHaveBeenCalledWith(
        `/user/${userId}/event/${eventId}`,
        validData,
        { withCredentials: true },
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws error if max_players invalid", async () => {
      const invalidData = { ...validData, max_players: 1 };
      await expect(
        eventService.update(userId, eventId, invalidData),
      ).rejects.toThrow("Le nombre de joueurs doit être compris entre 2 et 8.");
    });

    it("throws error if date is in the past", async () => {
      const pastData = { ...validData, date: new Date(Date.now() - 10000) };
      await expect(
        eventService.update(userId, eventId, pastData),
      ).rejects.toThrow("La date doit être supérieur à maintenant");
    });
  });

  describe("addCharacters", () => {
    it("calls axios.post with correct params and returns data", async () => {
      const data: CreateEventForm = {
        characters_id: ["25c62647-3e9f-40f9-8e19-2d0ae6666d33"],
        title: "test",
        date: new Date(),
        duration: 60,
        max_players: 5,
        status: "public",
        tag_id: "5019e28b-2056-46d3-a068-686337a72897",
        server_id: "d717c30e-c704-48f8-959b-5937e6373da1",
      };
      const mockResponse = { success: true };
      apiClientMock.instance.post.mockResolvedValue({ data: mockResponse });

      const result = await eventService.addCharacters(eventId, data);

      expect(apiClientMock.instance.post).toHaveBeenCalledWith(
        `/event/${eventId}/addCharacters`,
        { data },
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws error if characters_id is empty", async () => {
      const data: CreateEventForm = {
        characters_id: [],
        title: "test",
        date: new Date(),
        duration: 60,
        max_players: 5,
        status: "public",
        tag_id: "5019e28b-2056-46d3-a068-686337a72897",
        server_id: "d717c30e-c704-48f8-959b-5937e6373da1",
      };
      await expect(eventService.addCharacters(eventId, data)).rejects.toThrow(
        "Vous devez sélectionner au moins un personnage",
      );
    });
  });

  describe("removeCharacter", () => {
    it("calls axios.post with correct params and returns data", async () => {
      const mockResponse = { success: true };
      apiClientMock.instance.post.mockResolvedValue({ data: mockResponse });

      const result = await eventService.removeCharacter(eventId, characterId);

      expect(apiClientMock.instance.post).toHaveBeenCalledWith(
        `/event/${eventId}/removeCharacter`,
        { character_id: characterId },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("Call axios.delete with correct params", async () => {
      const mockResponse = { status: 200 };
      apiClientMock.instance.delete.mockResolvedValue(mockResponse);

      const result = await eventService.delete(userId, eventId);

      expect(apiClientMock.instance.delete).toHaveBeenCalledWith(
        `/user/${userId}/event/${eventId}`,
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

      await expect(eventService.delete(userId, eventId)).rejects.toThrow(
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

      await expect(eventService.delete(userId, eventId)).rejects.toThrow(
        "Cette évènement n'existe plus.",
      );
    });

    it("Throw error if isn't axios error", async () => {
      const error = new Error("Unknown error");
      (axios.isAxiosError as any).mockReturnValue(false);
      apiClientMock.instance.delete.mockRejectedValue(error);

      await expect(eventService.delete(userId, eventId)).rejects.toThrow(
        "Unknown error",
      );
    });
  });
});
