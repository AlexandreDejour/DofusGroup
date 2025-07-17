import { describe, it, expect, vi, beforeEach } from "vitest";

import status from "http-status";
import type { Request, Response } from "express";

import { Event, EventBodyData, EventEnriched } from "../../../types/event.js";
import { EventController } from "../eventController.js";
import { EventRepository } from "../../../middlewares/repository/eventRepository.js";

describe("EventController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next = vi.fn();

  vi.mock("../../../middlewares/repository/eventRepository.js");
  const mockGetAll = vi.spyOn(EventRepository.prototype, "getAllByUserId");
  const mockGetOne = vi.spyOn(EventRepository.prototype, "getOneByUserId");
  const mockGetAllEnriched = vi.spyOn(
    EventRepository.prototype,
    "getAllEnrichedByUserId",
  );
  const mockGetOneEnriched = vi.spyOn(
    EventRepository.prototype,
    "getOneEnrichedByUserId",
  );
  const mockPost = vi.spyOn(EventRepository.prototype, "post");
  const mockUpdate = vi.spyOn(EventRepository.prototype, "update");
  const mockDelete = vi.spyOn(EventRepository.prototype, "delete");

  req = {};
  res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const underTest: EventController = new EventController(new EventRepository());

  // --- GET ALL ---
  describe("getAllByUserId", () => {
    req.params = { userId: "182a492c-feb7-4af8-910c-e61dc2536754" };

    it("Return events if exist.", async () => {
      // GIVEN
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

      mockGetAll.mockResolvedValue(mockEvents);
      // WHEN
      await underTest.getAllByUserId(req as Request, res as Response, next);
      //THEN
      expect(mockGetAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockEvents);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if any event found.", async () => {
      const mockEvents: Event[] = [];

      mockGetAll.mockResolvedValue(mockEvents);
      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any event found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAll.mockRejectedValue(error);
      await underTest.getAllByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ---
  describe("getOneByUserId", () => {
    req.params = {
      userId: "182a492c-feb7-4af8-910c-e61dc2536754",
      eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
    };

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
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it("Call next() if event doesn't exists.", async () => {
      mockGetOne.mockResolvedValue(null);
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOne.mockRejectedValue(error);
      await underTest.getOneByUserId(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ALL ENRICHED ---
  describe("getAllByUserIdEnriched", () => {
    req.params = { userId: "182a492c-feb7-4af8-910c-e61dc2536754" };

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
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );
      //THEN
      expect(mockGetAllEnriched).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockEventsEnriched);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it("Return 404 if any event found.", async () => {
      const mockEventsEnriched: EventEnriched[] = [];

      mockGetAllEnriched.mockResolvedValue(mockEventsEnriched);
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith({ error: "Any event found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetAllEnriched.mockRejectedValue(error);
      await underTest.getAllEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- GET ONE ENRICHED ---
  describe("getOneByUserIdEnriched", () => {
    req.params = {
      userId: "182a492c-feb7-4af8-910c-e61dc2536754",
      eventId: "923a9fe0-1395-4f4e-8d18-4a9ac183b924",
    };

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
      await underTest.getOneEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.json).toHaveBeenCalledWith(mockEventEnriched);
    });

    it("Call next() if character doesn't exists.", async () => {
      mockGetOneEnriched.mockResolvedValue(null);
      await underTest.getOneEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(status.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });

    it("Call next() in case of error.", async () => {
      const error = new Error();

      mockGetOneEnriched.mockRejectedValue(error);
      await underTest.getOneEnrichedByUserId(
        req as Request,
        res as Response,
        next,
      );

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
        user_id: "07a3cd78-3a4a-4aae-a681-7634d72197c2",
      };
      const mockDatas: EventBodyData = {
        ...req.body,
        user_id: req.params.userId,
      };
      const mockNewEvent: EventEnriched = {
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
      // WHEN
      await underTest.post(req as Request, res as Response, next);
      //THEN
      expect(mockPost).toHaveBeenCalledWith(mockDatas);
      expect(res.json).toHaveBeenCalledWith(mockNewEvent);
      expect(res.status).not.toHaveBeenCalledWith(status.NOT_FOUND);
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

      it("Call next() if character doesn't exists.", async () => {
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
      req.params = { userId: "182a492c-feb7-4af8-910c-e61dc2536754" };

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

      it("Call next() if character doesn't exists.", async () => {
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
});
