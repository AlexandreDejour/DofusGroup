import { describe, it, expect, vi, beforeEach } from "vitest";

import { Event } from "../../models/Event.js";
import { eventController } from "../../controllers/eventController.js";

vi.mock("../../models/Event.js", () => ({
  Event: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  }
}));

describe("eventController", () => {
  let res;
  let next;
  let req;

  beforeEach(() => {
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
      params: {},
    };
    req = {
      params: {},
      body: {},
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should respond with all events with their tag, server and characters", async () => {
      const mockEvents = [
        { id: 1, title: "farm grobe", tag: [], server: [], characters: [] },
        { id: 2, title: "pl nidas", tag: [], server: [], characters: [] }
      ];
      Event.findAll.mockResolvedValue(mockEvents);

      await eventController.getAll({}, res, next);

      expect(Event.findAll).toHaveBeenCalled(2, {
        include: [
          { association: "tag"},
          { association: "server"},
          { association: "characters"}
        ]
      });
      expect(res.json).toHaveBeenCalledWith(mockEvents);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if no events are found", async () => {
      Event.findAll.mockResolvedValue(null);

      await eventController.getAll({}, res, next);

      expect(Event.findAll).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("getOne", () => {
    it("should respond with one event if found", async () => {
      const mockEvent = { id: 2, title: "pl nidas" };
      const req = { params: { id: 2 } };
      Event.findByPk.mockResolvedValue(mockEvent);

      await eventController.getOne(req, res, next);

      expect(Event.findByPk).toHaveBeenCalledWith(2);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it("should call next() if event not found", async () => {
      const req = { params: { id: 404 } };
      Event.findByPk.mockResolvedValue(null);

      await eventController.getOne(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("post", () => {
    it("should create and return a new event", async () => {
        const inputData = {
            title: "donjon bwork",
            date: new Date("2025-10-12"),
            max_players: 8,
        };

        const mockCreatedEvent = {
            id: 3,
            ...inputData
        };

        req.body = inputData;
        Event.create.mockResolvedValue(mockCreatedEvent);

        await eventController.post(req, res);

        expect(Event.create).toHaveBeenCalledWith(inputData);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockCreatedEvent);
        });
    });

  describe("update", () => {
    it("should update and return the updated event", async () => {
      req.params.id = 5;
      req.body = {
        title: "donjon kimbo",
        date: new Date("2025-12-10"),
        max_players: 6
      };

      const mockEvent = {
        id: 5,
        title: "donjon kimbo",
        date: new Date("2025-12-10"),
        max_players: 6,
        update: vi.fn().mockResolvedValue({
          id: 5,
          title: "donjon kimbo",
          date: new Date("2025-12-10"),
          max_players: 6
        })
      };

      Event.findByPk.mockResolvedValue(mockEvent);

      await eventController.update(req, res, next);

      expect(Event.findByPk).toHaveBeenCalledWith(5);
      expect(mockEvent.update).toHaveBeenCalledWith({
        title: "donjon kimbo",
        date: new Date("2025-12-10"),
        max_players: 6
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 5,
        title: "donjon kimbo",
        date: new Date("2025-12-10"),
        max_players: 6
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if event not found", async () => {
      req.params.id = 12;
      Event.findByPk.mockResolvedValue(null);

      await eventController.update(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete event if found", async () => {
      req.params.id = 7;
      const mockEvent = { id: 7 };
      Event.findByPk.mockResolvedValue(mockEvent);

      await eventController.delete(req, res, next);

      expect(Event.destroy).toHaveBeenCalledWith({ where: { id: 7 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it("should call next() if event not found", async () => {
      req.params.id = 88;
      Event.findByPk.mockResolvedValue(null);

      await eventController.delete(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
