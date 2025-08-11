import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import type { NextFunction, Request, Response } from "express";

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
  let next: NextFunction;

  vi.mock("../../../middlewares/repository/eventRepository.js");
  const mockGetAll = vi.spyOn(EventRepository.prototype, "getAll");
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
  const mockRemoveCharacters = vi.spyOn(
    EventRepository.prototype,
    "removeCharactersFromEvent",
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
    it("Return events if exist", async () => {
      // GIVEN
      req.query = {
        limit: "10",
        page: "1",
      };

      const mockEvents: Event[] = [
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
        },
      ];

      const mockPaginatedEvents: PaginatedEvents = {
        events: [
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
          },
        ],
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1,
      };

      mockGetAll.mockResolvedValue(mockEvents);
      // WHEN
      await underTest.getAll(req as Request, res as Response, next);
      // THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPaginatedEvents);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if any event found.", async () => {
      const mockEvents: Event[] = [];

      mockGetAll.mockResolvedValue(mockEvents);
      await underTest.getAll(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any event found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAll.mockRejectedValue(error);
      await underTest.getAll(req as Request, res as Response, next);

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
      };
      mockGetOne.mockResolvedValue(mockEvent);

      await underTest.getOne(req as Request, res as Response, next);

      expect(mockGetOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockEvent);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Call next() if event doesn't exists.", async () => {
      mockGetOne.mockResolvedValue(null);
      await underTest.getOne(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
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

    it("Return 404 if any event found.", async () => {
      const mockEventsEnriched: EventEnriched[] = [];

      mockGetAllEnriched.mockResolvedValue(mockEventsEnriched);
      await underTest.getAllEnriched(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any event found" });
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

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
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
        characterIds: [
          "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
          "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
        ],
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
      };
      const mockEventEnriched: EventEnriched = {
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
            default_character: true,
          },
          {
            id: "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
            name: "Peloty",
            sex: "F",
            level: 200,
            alignment: "Bonta",
            stuff: "https://d-bk.net/fr/d/3EFhw",
            default_character: false,
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

      expect(mockAddCharacters).toHaveBeenCalled();
      expect(mockGetOneEnriched).toHaveBeenCalledWith(mockEvent.id);
      expect(res.json).toHaveBeenCalledWith(mockEventEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId isn't define.", async () => {
      req.params = {};

      await underTest.addCharactersToEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: "Event ID is required",
      });
    });

    it("Call next() if event doesn't exists.", async () => {
      req.params = {
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        characterIds: [
          "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
          "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
        ],
      };

      mockAddCharacters.mockResolvedValue(null);

      await underTest.addCharactersToEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });

    it("Call next() in case of error.", async () => {
      req.params = {
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        characterIds: [
          "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
          "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
        ],
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
  describe("removeCharactersFromEvent", () => {
    it("Remove characters if event exists", async () => {
      req.params = { eventId: "182a492c-feb7-4af8-910c-e61dc2536754" };
      req.body = {
        characterIds: ["1b4a318a-d991-4ec9-8178-38e6bbb5c322"],
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
      };
      const mockEventUpdatedEnriched: EventEnriched = {
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
            id: "1b4a318a-d991-4ec9-8178-38e6bbb5c322",
            name: "Chronos-Trigger",
            sex: "M",
            level: 180,
            alignment: "Bonta",
            stuff: "https://d-bk.net/fr/d/3EJhw",
            default_character: true,
          },
        ],
      };

      mockRemoveCharacters.mockResolvedValue(mockEvent);
      mockGetOneEnriched.mockResolvedValue(mockEventUpdatedEnriched);

      await underTest.removeCharactersFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(mockRemoveCharacters).toHaveBeenCalled();
      expect(mockGetOneEnriched).toHaveBeenCalledWith(
        mockEventUpdatedEnriched.id,
      );
      expect(res.json).toHaveBeenCalledWith(mockEventUpdatedEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId isn't define.", async () => {
      req.params = {};

      await underTest.removeCharactersFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: "Event ID is required",
      });
    });

    it("Call next() if event doesn't exists.", async () => {
      req.params = {
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        characterIds: [
          "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
          "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
        ],
      };

      mockRemoveCharacters.mockResolvedValue(null);

      await underTest.removeCharactersFromEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });

    it("Call next() in case of error.", async () => {
      req.params = {
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        characterIds: [
          "1db5cd8a-cd22-48e8-9a4e-90ee032c9f15",
          "44fec4c8-19a6-4aaa-8f6a-16afe92af491",
        ],
      };
      const error = new Error();

      mockRemoveCharacters.mockRejectedValue(error);
      await underTest.addCharactersToEvent(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- PATCH ---
  describe("update", () => {
    it("Return event if updated.", async () => {
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
      const mockEventToUpdate: EventEnriched = {
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
      const mockUpdatedEvent = { ...mockEventToUpdate, ...mockDatas };

      mockUpdate.mockResolvedValue(mockUpdatedEvent);
      // WHEN
      await underTest.update(req as Request, res as Response, next);
      //THEN
      expect(mockUpdatedEvent.title).toBe("Donjon minotoror");
      expect(mockUpdatedEvent.max_players).toBe(4);
      expect(mockUpdatedEvent.status).toBe("private");
      expect(mockUpdate).toHaveBeenCalledWith(req.params.eventId, mockDatas);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedEvent);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 400 if userId isn't define.", async () => {
      req.params = {};

      await underTest.update(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: "User ID is required" });
    });

    it("Call next() if event doesn't exists.", async () => {
      req.params = {
        userId: "182a492c-feb7-4af8-910c-e61dc2536754",
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        title: "Donjon minotoror",
        max_player: "4",
        status: "private",
      };

      mockUpdate.mockResolvedValue(null);
      await underTest.update(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });

    it("Call next() in case of error.", async () => {
      req.params = {
        userId: "182a492c-feb7-4af8-910c-e61dc2536754",
        eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
      };
      req.body = {
        title: "Donjon minotoror",
        max_player: "4",
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

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockDelete.mockRejectedValue(error);
      await underTest.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
