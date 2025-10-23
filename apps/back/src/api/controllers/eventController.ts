import status from "http-status";
import createHttpError from "http-errors";
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
      const tagId = req.query.tag_id as string | undefined;
      const title = req.query.title as string | undefined;
      const serverId = req.query.server_id as string | undefined;
      const pageParam = parseInt(req.query.page as string, 10);
      const limitParam = parseInt(req.query.limit as string, 10);

      const limit = !isNaN(limitParam) && limitParam > 0 ? limitParam : 10;
      const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;

      let events: Event[] = await this.repository.getAllPublic();

      if (!events.length) {
        const error = createHttpError(status.NO_CONTENT, "Any event found");
        return next(error);
      }

      // Filter passed events
      const now = new Date();
      events = events.filter((event) => new Date(event.date) >= now);

      // optionnal filters
      if (tagId) {
        events = events.filter((event) => event.tag_id === tagId);
      }

      if (serverId) {
        events = events.filter((event) => event.server_id === serverId);
      }

      if (title) {
        const lowered = title.toLowerCase();
        events = events.filter((event) =>
          event.title.toLowerCase().includes(lowered),
        );
      }

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

  public async getAllRegistered(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { characterIds } = req.query;
    const ids: string[] = Array.isArray(characterIds)
      ? characterIds.map((c) => String(c))
      : characterIds
        ? [String(characterIds)]
        : [];

    try {
      const events: Event[] = await this.repository.getAllRegistered(ids);

      if (!events.length) {
        const error = createHttpError(status.NO_CONTENT, "Any event found");
        return next(error);
      }

      events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  public async getAllByUserId(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    try {
      const events: Event[] = await this.repository.getAllByUserId(userId);

      if (!events.length) {
        const error = createHttpError(status.NO_CONTENT, "Any event found");
        return next(error);
      }

      res.json(events);
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
        const error = createHttpError(status.NO_CONTENT, "Any event found");
        return next(error);
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
        const error = createHttpError(status.NOT_FOUND, "Event not found");
        return next(error);
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
        const error = createHttpError(status.NOT_FOUND, "Event not found");
        return next(error);
      }

      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "user ID is required",
        );
        return next(error);
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
        const error = createHttpError(
          status.BAD_REQUEST,
          "User ID is required",
        );
        return next(error);
      }

      const eventId: string = req.params.eventId;
      const charactersIds: string[] = req.body.data.characters_id;

      const eventUpdated: Event | null =
        await this.repository.addCharactersToEvent(eventId, charactersIds);

      if (!eventUpdated) {
        const error = createHttpError(status.NOT_FOUND, "Event not found");
        return next(error);
      }

      const eventUpdatedEnriched: EventEnriched | null =
        await this.repository.getOneEnriched(eventUpdated.id);

      if (!eventUpdatedEnriched) {
        const error = createHttpError(
          status.INTERNAL_SERVER_ERROR,
          "Failed to retrieve enriched event",
        );
        return next(error);
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
        const error = createHttpError(
          status.BAD_REQUEST,
          "User ID is required",
        );
        return next(error);
      }

      const eventId: string = req.params.eventId;
      const characterId: string = req.body.character_id;

      const eventUpdated: Event | null =
        await this.repository.removeCharacterFromEvent(eventId, characterId);

      if (!eventUpdated) {
        const error = createHttpError(status.NOT_FOUND, "Event not found");
        return next(error);
      }

      const eventUpdatedEnriched: EventEnriched | null =
        await this.repository.getOneEnriched(eventUpdated.id);

      if (!eventUpdatedEnriched) {
        const error = createHttpError(
          status.INTERNAL_SERVER_ERROR,
          "Failed to retrieve enriched event",
        );
        return next(error);
      }

      res.json(eventUpdatedEnriched);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.params.userId;
    const eventId: string = req.params.eventId;

    if (!userId) {
      const error = createHttpError(status.BAD_REQUEST, "User ID is required");
      return next(error);
    }

    try {
      const eventData: Partial<EventBodyData> = req.body;

      const eventUpdated: Event | null = await this.repository.update(
        userId,
        eventId,
        eventData,
      );

      if (!eventUpdated) {
        const error = createHttpError(status.NOT_FOUND, "Event not found");
        return next(error);
      }

      const eventUpdatedEnriched = await this.repository.getOneEnriched(
        eventUpdated.id,
      );

      res.json(eventUpdatedEnriched);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.eventId) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "user ID is required",
        );
        return next(error);
      }

      const { userId, eventId } = req.params;

      const result: boolean = await this.repository.delete(userId, eventId);

      if (!result) {
        const error = createHttpError(status.NOT_FOUND, "Event not found");
        return next(error);
      }

      res.status(status.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
}
