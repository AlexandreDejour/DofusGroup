import EventEntity from "../../database/models/Event.js";
import { Event, EventEnriched, EventBodyData } from "../../types/event.js";

export class EventRepository {
  public async getAllByUserId(userId: string): Promise<Event[]> {
    try {
      const result: EventEntity[] = await EventEntity.findAll({
        where: { user_id: userId },
      });

      const events: Event[] = result.map((event: EventEntity) =>
        event.get({ plain: true }),
      );

      return events;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEnrichedByUserId(
    userId: string,
  ): Promise<EventEnriched[]> {
    try {
      const result: EventEntity[] = await EventEntity.findAll({
        where: { user_id: userId },
        include: ["tag", "user", "server", "characters"],
      });

      const events: EventEnriched[] = result.map((event: EventEntity) =>
        event.get({ plain: true }),
      );

      return events;
    } catch (error) {
      throw error;
    }
  }

  public async getOneByUserId(
    userId: string,
    eventId: string,
  ): Promise<Event | null> {
    try {
      const result: EventEntity | null = await EventEntity.findOne({
        where: { id: eventId, user_id: userId },
      });

      if (!result) {
        return null;
      }

      const event: Event = result.get({ plain: true });

      return event;
    } catch (error) {
      throw error;
    }
  }

  public async getOneEnrichedByUserId(
    userId: string,
    eventId: string,
  ): Promise<Event | null> {
    try {
      const result: EventEntity | null = await EventEntity.findOne({
        where: { id: eventId, user_id: userId },
        include: ["tag", "user, server", "characters"],
      });

      if (!result) {
        return null;
      }

      const event: Event = result.get({ plain: true });

      return event;
    } catch (error) {
      throw error;
    }
  }

  public async post(eventData: EventBodyData): Promise<Event> {
    try {
      const result: EventEntity = await EventEntity.create(eventData);

      const newEvent = result.get({ plain: true });

      return newEvent;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    eventId: string,
    eventData: Partial<EventBodyData>,
  ): Promise<Event | null> {
    try {
      const eventToUpdate: EventEntity | null = await EventEntity.findOne({
        where: { id: eventId, user_id: eventData.user_id },
      });

      if (!eventToUpdate) {
        return null;
      }

      const result: EventEntity = await eventToUpdate.update(eventData);

      const eventUpdated = result.get({ plain: true });

      return eventUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(userId: string, eventId: string): Promise<boolean> {
    try {
      const result: EventEntity | null = await EventEntity.findOne({
        where: { id: eventId, user_id: userId },
      });

      if (!result) {
        return false;
      }

      result.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }
}
