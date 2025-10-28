import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import type { Request, Response } from "express";

import {
  Event,
  EventBodyData,
  EventEnriched,
  PaginatedEvents,
} from "../../../types/event.js";
import { EventController } from "../eventController.js";
import { EventRepository } from "../../../middlewares/repository/eventRepository.js";
import { EventUtils } from "../../../middlewares/repository/utils/eventUtils.js";

describe("EventController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/eventRepository.js");
  const mockGetAllPublic = vi.spyOn(EventRepository.prototype, "getAllPublic");
  const mockGetAllRegistered = vi.spyOn(
    EventRepository.prototype,
    "getAllRegistered",
  );
  const mockGetAllByUserId = vi.spyOn(
    EventRepository.prototype,
    "getAllByUserId",
  );
  const mockGetAllEnriched = vi.spyOn(
    EventRepository.prototype,
    "getAllEnriched",
  );
  const mockGetOne = vi.spyOn(EventRepository.prototype, "getOne");
  const mockGetOneEnriched = vi.spyOn(
    EventRepository.prototype,
    "getOneEnriched",
  );
  const mockPost = vi.spyOn(EventRepository.prototype, "post");
  const mockUpdate = vi.spyOn(EventRepository.prototype, "update");
  const mockAddCharacters = vi.spyOn(
    EventRepository.prototype,
    "addCharactersToEvent",
  );
  const mockRemoveCharacter = vi.spyOn(
    EventRepository.prototype,
    "removeCharacterFromEvent",
  );
  const mockDelete = vi.spyOn(EventRepository.prototype, "delete");

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      params: {},
      query: {},
      body: {},
    };
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  const underTest: EventController = new EventController(
    new EventRepository(new EventUtils()),
  );
  // --- GET ALL ---
  describe("getAll", () => {
    const baseEvent: Event = {
      id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      title: "Donjon minotot",
      date: new Date("2026-01-01"),
      duration: 60,
      area: "Amakna",
      sub_area: "Ile des taures",
      donjon_name: "Labyrinthe du minotoror",
      description: "donjon full succès",
      max_players: 8,
      status: "public",
      user_id: "1905dae9-c572-4d9e-9baa-d8d72bc83fc4",
      tag_id: "tag-1",
      server_id: "server-1",
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("Return events if exist without filters", async () => {
      req.query = { limit: "10", page: "1" };
      mockGetAllPublic.mockResolvedValue([baseEvent]);

      const expected: PaginatedEvents = {
        events: [baseEvent],
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1,
      };

      await underTest.getAll(req as Request, res as Response, next);

      expect(mockGetAllPublic).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expected);
    });

    it("Return 204 if no events", async () => {
      mockGetAllPublic.mockResolvedValue([]);
      await underTest.getAll(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NO_CONTENT,
          message: "Any event found",
        }),
      );
    });

    it("Filters by tagId if provided", async () => {
      const otherEvent = { ...baseEvent, tag_id: "tag-2" };
      mockGetAllPublic.mockResolvedValue([baseEvent, otherEvent]);
      req.query = { tag_id: "tag-1", limit: "10", page: "1" };

      await underTest.getAll(req as Request, res as Response, next);

      const expected: PaginatedEvents = {
        events: [baseEvent],
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1,
      };

      expect(res.json).toHaveBeenCalledWith(expected);
    });

    it("Filters by serverId if provided", async () => {
      const otherEvent = { ...baseEvent, server_id: "server-2" };
      mockGetAllPublic.mockResolvedValue([baseEvent, otherEvent]);
      req.query = { server_id: "server-1", limit: "10", page: "1" };

      await underTest.getAll(req as Request, res as Response, next);

      const expected: PaginatedEvents = {
        events: [baseEvent],
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1,
      };

      expect(res.json).toHaveBeenCalledWith(expected);
    });

    it("Filters by title if provided (case insensitive)", async () => {
      const otherEvent = { ...baseEvent, title: "Autre donjon" };
      mockGetAllPublic.mockResolvedValue([baseEvent, otherEvent]);
      req.query = { title: "donjon minotot", limit: "10", page: "1" };

      await underTest.getAll(req as Request, res as Response, next);

      const expected: PaginatedEvents = {
        events: [baseEvent],
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1,
      };

      expect(res.json).toHaveBeenCalledWith(expected);
    });

    it("Call next() in case of error", async () => {
      const error = new Error();
      mockGetAllPublic.mockRejectedValue(error);
      await underTest.getAll(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL REGISTERED ---
  describe("getAllRegistered", () => {
    beforeEach(() => {
      req.query = {};
    });

    it("Return events if exist for registered characters", async () => {
      req.query = { characterIds: ["char-1", "char-2"] };

      const baseEvent: Event = {
        id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "1905dae9-c572-4d9e-9baa-d8d72bc83fc4",
        tag_id: "tag-1",
        server_id: "server-1",
      };

      mockGetAllRegistered.mockResolvedValue([baseEvent]);

      await underTest.getAllRegistered(req as Request, res as Response, next);

      expect(mockGetAllRegistered).toHaveBeenCalledWith(["char-1", "char-2"]);
      expect(res.json).toHaveBeenCalledWith([baseEvent]);
    });

    it("Return 204 if no registered events", async () => {
      req.query = { characterIds: ["char-1"] };
      mockGetAllRegistered.mockResolvedValue([]);
      await underTest.getAllRegistered(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NO_CONTENT,
          message: "Any event found",
        }),
      );
    });

    it("Call next() in case of error", async () => {
      const error = new Error();
      mockGetAllRegistered.mockRejectedValue(error);
      req.query = { characterIds: ["char-1"] };
      await underTest.getAllRegistered(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL BY USER ID ---
  describe("getAllByUserId", () => {
    it("Return events for given userId", async () => {
      const userId = "1905dae9-c572-4d9e-9baa-d8d72bc83fc4";
      req.params = { userId };

      const userEvent: Event = {
        id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "1905dae9-c572-4d9e-9baa-d8d72bc83fc4",
        tag_id: "tag-1",
        server_id: "server-1",
      };

      mockGetAllByUserId.mockResolvedValue([userEvent]);

      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(mockGetAllByUserId).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith([userEvent]);
    });

    it("Return 204 if no event for user", async () => {
      const userId = "user-456";
      req.params = { userId };
      mockGetAllByUserId.mockResolvedValue([]);

      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NO_CONTENT,
          message: "Any event found",
        }),
      );
    });

    it("Call next() in case of error", async () => {
      const error = new Error();
      const userId = "user-789";
      req.params = { userId };
      mockGetAllByUserId.mockRejectedValue(error);

      await underTest.getAllByUserId(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ---
  describe("getOne", () => {
    beforeEach(() => {
      req.params = { eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924" };
    });

    it("Return event if exists", async () => {
      const mockEvent: Event = {
        id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "1905dae9-c572-4d9e-9baa-d8d72bc83fc4",
        tag_id: "b8c145a0-c68a-4adb-a33b-ae6f0ec89ee1",
        server_id: "5f076e0a-60a0-42d5-a18e-853a46ddc335",
      };
      mockGetOne.mockResolvedValue(mockEvent);

      await underTest.getOne(req as Request, res as Response, next);

      expect(mockGetOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockEvent);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if event doesn't exists.", async () => {
      mockGetOne.mockResolvedValue(null);
      await underTest.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Event not found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOne(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL ENRICHED ---
  describe("getAllEnriched", () => {
    it("Return events if exist.", async () => {
      // GIVEN
      const mockEventsEnriched: EventEnriched[] = [
        {
          id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
          title: "Donjon minotot",
          date: new Date("2026-01-01"),
          duration: 60,
          area: "Amakna",
          sub_area: "Ile des taures",
          donjon_name: "Labyrinthe du minotoror",
          description: "donjon full succès",
          max_players: 8,
          status: "public",
          user_id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
          tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
          server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
          tag: {
            id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
            name: "Donjon",
            color: "#DFF0FF",
          },
          server: {
            id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
            name: "Rafal",
            mono_account: false,
          },
          user: {
            id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
            username: "toto",
          },
          characters: [],
        },
      ];

      mockGetAllEnriched.mockResolvedValue(mockEventsEnriched);
      // WHEN
      await underTest.getAllEnriched(req as Request, res as Response, next);
      //THEN
      expect(mockGetAllEnriched).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockEventsEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 204 if any event found.", async () => {
      const mockEventsEnriched: EventEnriched[] = [];

      mockGetAllEnriched.mockResolvedValue(mockEventsEnriched);
      await underTest.getAllEnriched(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NO_CONTENT,
          message: "Any event found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAllEnriched.mockRejectedValue(error);
      await underTest.getAllEnriched(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ENRICHED ---
  describe("getOneByUserIdEnriched", () => {
    beforeEach(() => {
      req.params = { eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924" };
    });

    it("Return event if exists", async () => {
      const mockEventEnriched: EventEnriched = {
        id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
        tag: {
          id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
          name: "Donjon",
          color: "#DFF0FF",
        },
        server: {
          id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
          name: "Rafal",
          mono_account: false,
        },
        user: {
          id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
          username: "toto",
        },
        characters: [],
      };

      mockGetOneEnriched.mockResolvedValue(mockEventEnriched);
      await underTest.getOneEnriched(req as Request, res as Response, next);

      expect(mockGetOneEnriched).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockEventEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Call next() if character doesn't exists.", async () => {
      mockGetOneEnriched.mockResolvedValue(null);
      await underTest.getOneEnriched(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Event not found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOneEnriched.mockRejectedValue(error);
      await underTest.getOneEnriched(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- POST ---
  describe("post", () => {
    it("Return event if create.", async () => {
      // GIVEN
      req.params = { userId: "182a492c-feb7-4af8-910c-e61dc2536754" };
      req.body = {
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
        character_ids: ["06effb95-8fad-442f-97f0-d2c278d4da9c"],
      };
      const mockDatas: EventBodyData = {
        ...req.body,
        user_id: req.params.userId,
      };
      const mockNewEvent: Event = {
        id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
      };
      const mockNewEventEnriched: EventEnriched = {
        id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
        tag: {
          id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
          name: "Donjon",
          color: "#DFF0FF",
        },
        server: {
          id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
          name: "Rafal",
          mono_account: false,
        },
        user: {
          id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
          username: "toto",
        },
        characters: [],
      };

      mockPost.mockResolvedValue(mockNewEvent);
      mockGetOneEnriched.mockResolvedValue(mockNewEvent);
      // WHEN
      await underTest.post(req as Request, res as Response, next);
      //THEN
      expect(mockPost).toHaveBeenCalledWith(mockDatas);
      expect(mockGetOneEnriched).toHaveBeenCalledWith(mockNewEvent.id);
      expect(res.json).toHaveBeenCalledWith(mockNewEvent);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });
  });

  // --- ADD CHARACTERS TO EVENT ---
  describe("addCharactersToEvent", () => {
    it("Add characters if event exists", async () => {
      req.params = { eventId: "182a492c-feb7-4af8-910c-e61dc2536754" };
      req.body = {
        data: {
          characters_id: [
            "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
            "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
          ],
        },
      };

      const mockEvent: Event = {
        id: "182a492c-feb7-4af8-910c-e61dc2536754",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
      };

      const mockEventEnriched: EventEnriched = {
        ...mockEvent,
        tag: {
          id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
          name: "Donjon",
          color: "#DFF0FF",
        },
        server: {
          id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
          name: "Rafal",
          mono_account: false,
        },
        user: {
          id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
          username: "toto",
        },
        characters: [
          {
            id: "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
            name: "Night-Hunter",
            sex: "M",
            level: 190,
            alignment: "Bonta",
            stuff: "https://d-bk.net/fr/d/1EFhw",
          },
          {
            id: "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
            name: "Peloty",
            sex: "F",
            level: 200,
            alignment: "Bonta",
            stuff: "https://d-bk.net/fr/d/3EFhw",
          },
        ],
      };

      mockAddCharacters.mockResolvedValue(mockEvent);
      mockGetOneEnriched.mockResolvedValue(mockEventEnriched);

      await underTest.addCharactersToEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(mockAddCharacters).toHaveBeenCalledWith(
        req.params.eventId,
        req.body.data.characters_id,
      );
      expect(mockGetOneEnriched).toHaveBeenCalledWith(mockEvent.id);
      expect(res.json).toHaveBeenCalledWith(mockEventEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if eventId isn't defined.", async () => {
      req.params = {};

      await underTest.addCharactersToEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.BAD_REQUEST,
          message: "User ID is required",
        }),
      );
    });

    it("Return 404 if event doesn't exist.", async () => {
      req.params = { eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924" };
      req.body = {
        data: {
          characters_id: [
            "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
            "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
          ],
        },
      };

      mockAddCharacters.mockResolvedValue(null);

      await underTest.addCharactersToEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Event not found",
        }),
      );
    });

    it("Return 500 if enriched event cannot be retrieved.", async () => {
      req.params = { eventId: "182a492c-feb7-4af8-910c-e61dc2536754" };
      req.body = {
        data: {
          characters_id: [
            "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
            "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
          ],
        },
      };

      const mockEvent: Event = {
        id: "182a492c-feb7-4af8-910c-e61dc2536754",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "1905dae9-c572-4d9e-9baa-d8d72bc83fc4",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
      };

      mockAddCharacters.mockResolvedValue(mockEvent);
      mockGetOneEnriched.mockResolvedValue(null);

      await underTest.addCharactersToEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.INTERNAL_SERVER_ERROR,
          message: "Failed to retrieve enriched event",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      req.params = { eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924" };
      req.body = {
        data: {
          characters_id: [
            "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
            "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
          ],
        },
      };

      const error = new Error();
      mockAddCharacters.mockRejectedValue(error);

      await underTest.addCharactersToEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- REMOVE CHARACTERS FROM EVENT ---
  describe("removeCharacterFromEvent", () => {
    it("Remove character if event exists", async () => {
      req.params = { eventId: "182a492c-feb7-4af8-910c-e61dc2536754" };
      req.body = {
        character_id: "1b4a318a-d991-4ec9-8178-38e6bbb5c322",
      };

      const mockEvent: Event = {
        id: "182a492c-feb7-4af8-910c-e61dc2536754",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
      };

      const mockEventUpdatedEnriched: EventEnriched = {
        ...mockEvent,
        tag: {
          id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
          name: "Donjon",
          color: "#DFF0FF",
        },
        server: {
          id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
          name: "Rafal",
          mono_account: false,
        },
        user: {
          id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
          username: "toto",
        },
        characters: [],
      };

      mockRemoveCharacter.mockResolvedValue(mockEvent);
      mockGetOneEnriched.mockResolvedValue(mockEventUpdatedEnriched);

      await underTest.removeCharacterFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(mockRemoveCharacter).toHaveBeenCalledWith(
        req.params.eventId,
        req.body.character_id,
      );
      expect(mockGetOneEnriched).toHaveBeenCalledWith(mockEvent.id);
      expect(res.json).toHaveBeenCalledWith(mockEventUpdatedEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if eventId isn't defined.", async () => {
      req.params = {};

      await underTest.removeCharacterFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.BAD_REQUEST,
          message: "User ID is required",
        }),
      );
    });

    it("Return 404 if event doesn't exist.", async () => {
      req.params = {
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        character_id: "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
      };

      mockRemoveCharacter.mockResolvedValue(null);

      await underTest.removeCharacterFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Event not found",
        }),
      );
    });

    it("Return 500 if enriched event cannot be retrieved.", async () => {
      req.params = { eventId: "182a492c-feb7-4af8-910c-e61dc2536754" };
      req.body = { character_id: "1b4a318a-d991-4ec9-8178-38e6bbb5c322" };

      const mockEvent: Event = {
        id: "182a492c-feb7-4af8-910c-e61dc2536754",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "1905dae9-c572-4d9e-9baa-d8d72bc83fc4",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
      };

      mockRemoveCharacter.mockResolvedValue(mockEvent);
      mockGetOneEnriched.mockResolvedValue(null);

      await underTest.removeCharacterFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.INTERNAL_SERVER_ERROR,
          message: "Failed to retrieve enriched event",
        }),
      );
    });

    it("Return 500 if enriched event cannot be retrieved.", async () => {
      req.params = { eventId: "182a492c-feb7-4af8-910c-e61dc2536754" };
      req.body = { character_id: "1b4a318a-d991-4ec9-8178-38e6bbb5c322" };

      const mockEvent: Event = {
        id: "182a492c-feb7-4af8-910c-e61dc2536754",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "1905dae9-c572-4d9e-9baa-d8d72bc83fc4",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
      };

      mockRemoveCharacter.mockResolvedValue(mockEvent);
      mockGetOneEnriched.mockResolvedValue(null);

      await underTest.removeCharacterFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.INTERNAL_SERVER_ERROR,
          message: "Failed to retrieve enriched event",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      req.params = {
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        character_id: "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
      };

      const error = new Error();
      mockRemoveCharacter.mockRejectedValue(error);

      await underTest.removeCharacterFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- PATCH ---
  describe("update", () => {
    it("Return enriched event if updated.", async () => {
      req.params = {
        userId: "182a492c-feb7-4af8-910c-e61dc2536754",
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        title: "Donjon minotoror",
        max_players: 4,
        status: "private",
      };

      // GIVEN
      const mockDatas: EventBodyData = req.body;
      const mockEventToUpdate: Event = {
        id: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
        title: "Donjon minotot",
        date: new Date("2026-01-01"),
        duration: 60,
        area: "Amakna",
        sub_area: "Ile des taures",
        donjon_name: "Labyrinthe du minotoror",
        description: "donjon full succès",
        max_players: 8,
        status: "public",
        user_id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
        tag_id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
        server_id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
      };

      const mockUpdatedEvent = { ...mockEventToUpdate, ...mockDatas };

      const mockUpdatedEventEnriched: EventEnriched = {
        ...mockUpdatedEvent,
        tag: {
          id: "f7a34554-d2d7-48d5-8bc2-1f7e4b06c8f8",
          name: "Donjon",
          color: "#DFF0FF",
        },
        server: {
          id: "6c19c76b-cbc1-4a58-bdeb-b336eaf6f51c",
          name: "Rafal",
          mono_account: false,
        },
        user: { id: "07a3cd78-3a4a-4aae-a681-7634d72197c2", username: "toto" },
        characters: [],
      };

      mockUpdate.mockResolvedValue(mockUpdatedEvent);
      mockGetOneEnriched.mockResolvedValue(mockUpdatedEventEnriched);

      // WHEN
      await underTest.update(req as Request, res as Response, next);

      // THEN
      expect(mockUpdate).toHaveBeenCalledWith(
        req.params.userId,
        req.params.eventId,
        mockDatas,
      );
      expect(mockGetOneEnriched).toHaveBeenCalledWith(mockUpdatedEvent.id);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedEventEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId isn't defined.", async () => {
      req.params = {};

      await underTest.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.BAD_REQUEST,
          message: "User ID is required",
        }),
      );
    });

    it("Return 404 if event doesn't exist.", async () => {
      req.params = {
        userId: "182a492c-feb7-4af8-910c-e61dc2536754",
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        title: "Donjon minotoror",
        max_players: 4,
        status: "private",
      };

      mockUpdate.mockResolvedValue(null);

      await underTest.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Event not found",
        }),
      );
      expect(mockGetOneEnriched).not.toHaveBeenCalled();
    });

    it("Call next() in case of error.", async () => {
      req.params = {
        userId: "182a492c-feb7-4af8-910c-e61dc2536754",
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        title: "Donjon minotoror",
        max_players: 4,
        status: "private",
      };

      const error = new Error();
      mockUpdate.mockRejectedValue(error);

      await underTest.update(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- DELETE ---
  describe("delete", () => {
    beforeEach(() => {
      req.params = {
        userId: "182a492c-feb7-4af8-910c-e61dc2536754",
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
    });

    it("Return 204 if event is delete.", async () => {
      // GIVEN
      mockDelete.mockResolvedValue(true);
      // WHEN
      await underTest.delete(req as Request, res as Response, next);
      //THEN
      expect(mockDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Call next() if event doesn't exists.", async () => {
      mockDelete.mockResolvedValue(false);
      await underTest.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err).toEqual(
        expect.objectContaining({
          status: status.NOT_FOUND,
          message: "Event not found",
        }),
      );
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockDelete.mockRejectedValue(error);
      await underTest.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
