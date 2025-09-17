import status from "http-status";
import { NextFunction, Request, Response } from "express";

import { Event, EventBodyData, EventEnriched } from "../../types/event.js";
import { EventRepository } from "../../middlewares/repository/eventRepository.js";

export class EventController {
  private repository: EventRepository;

  public constructor(repository: EventRepository) {
    this.repository = repository;
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limitParam = parseInt(req.query.limit as string, 10);
      const pageParam = parseInt(req.query.page as string, 10);

      const limit = !isNaN(limitParam) && limitParam > 0 ? limitParam : 10;
      const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;

      let events: Event[] = await this.repository.getAll();

      if (!events.length) {
        res.status(status.NO_CONTENT).json({ error: "Any event found" });
        return;
      }

      // Filter passed events
      const now = new Date();
      events = events.filter((event) => new Date(event.date) >= now);

      // Filter by ascending date
      events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      const total = events.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;

      const pagedEvents = events.slice(start, end);

      res.json({
        events: pagedEvents,
        page,
        limit,
        total,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAllEnriched(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const events: EventEnriched[] = await this.repository.getAllEnriched();

      if (!events.length) {
        res.status(status.NO_CONTENT).json({ error: "Any event found" });
        return;
      }

      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const eventId: string = req.params.eventId;

    try {
      const event: Event | null = await this.repository.getOne(eventId);

      if (!event) {
        res.status(status.NOT_FOUND).json({ error: "Event not found" });
        return;
      }

      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async getOneEnriched(req: Request, res: Response, next: NextFunction) {
    const eventId: string = req.params.eventId;

    try {
      const event: EventEnriched | null =
        await this.repository.getOneEnriched(eventId);

      if (!event) {
        res.status(status.NOT_FOUND).json({ error: "Event not found" });
        return;
      }

      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        res.status(status.BAD_REQUEST).json({ error: "User ID is required" });
        return;
      }

      const userId: string = req.params.userId;
      const eventData: EventBodyData = { ...req.body, user_id: userId };

      const newEvent: EventEnriched = await this.repository.post(eventData);

      const newEventEnriched = await this.repository.getOneEnriched(
        newEvent.id,
      );

      res.status(status.CREATED).json(newEventEnriched);
    } catch (error) {
      next(error);
    }
  }

  public async addCharactersToEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.params.eventId) {
        res.status(status.BAD_REQUEST).json({ error: "Event ID is required" });
        return;
      }

      const eventId: string = req.params.eventId;
      const charactersIds: string[] = req.body.characters_id;

      let eventUpdated: Event | null =
        await this.repository.addCharactersToEvent(eventId, charactersIds);

      if (!eventUpdated) {
        res.status(status.NOT_FOUND).json({ error: "Event not found" });
        return;
      }

      const eventUpdatedEnriched: EventEnriched | null =
        await this.repository.getOneEnriched(eventUpdated.id);

      if (!eventUpdatedEnriched) {
        res
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to retrieve enriched event" });
        return;
      }

      res.json(eventUpdatedEnriched);
    } catch (error) {
      next(error);
    }
  }

  public async removeCharacterFromEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.params.eventId) {
        res.status(status.BAD_REQUEST).json({ error: "Event ID is required" });
        return;
      }

      const eventId: string = req.params.eventId;
      const characterId: string = req.body.character_id;

      const eventUpdated: Event | null =
        await this.repository.removeCharacterFromEvent(eventId, characterId);

      if (!eventUpdated) {
        res.status(status.NOT_FOUND).json({ error: "Event not found" });
        return;
      }

      const eventUpdatedEnriched: EventEnriched | null =
        await this.repository.getOneEnriched(eventUpdated.id);

      if (!eventUpdatedEnriched) {
        res
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to retrieve enriched event" });
        return;
      }

      res.json(eventUpdatedEnriched);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        res.status(status.BAD_REQUEST).json({ error: "User ID is required" });
        return;
      }

      const eventId: string = req.params.eventId;
      const eventData: Partial<EventBodyData> = req.body;

      const eventUpdated: Event | null = await this.repository.update(
        eventId,
        eventData,
      );

      if (!eventUpdated) {
        res.status(status.NOT_FOUND).json({ error: "Event not found" });
        return;
      }

      const eventUpdatedEnriched = await this.repository.getOneEnriched(
        eventUpdated.id,
      );

      res.json(eventUpdated);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.eventId) {
        res.status(status.BAD_REQUEST).json({ error: "Event ID is required" });
        return;
      }

      const { userId, eventId } = req.params;

      const result: boolean = await this.repository.delete(userId, eventId);

      if (!result) {
        res.status(status.NOT_FOUND).json({ error: "Event not found" });
        return;
      }

      res.status(status.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
}
