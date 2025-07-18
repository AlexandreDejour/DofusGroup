import { Op } from "sequelize";

import CharacterEntity from "../../database/models/Character.js";
import EventEntity from "../../database/models/Event.js";
import { Event, EventEnriched, EventBodyData } from "../../types/event.js";
import { EventUtils } from "./utils/eventUtils.js";

export class EventRepository {
  private utils: EventUtils;

  public constructor(utils: EventUtils) {
    this.utils = utils;
  }
  public async getAll(): Promise<Event[]> {
    try {
      const result: EventEntity[] = await EventEntity.findAll();

      const events: Event[] = result.map((event: EventEntity) =>
        event.get({ plain: true }),
      );

      return events;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEnriched(): Promise<EventEnriched[]> {
    try {
      const result: EventEntity[] = await EventEntity.findAll({
        include: [
          "tag",
          "server",
          "characters",
          {
            association: "user",
            attributes: { exclude: ["email", "password"] },
          },
        ],
      });

      const events: EventEnriched[] = result.map((event: EventEntity) =>
        event.get({ plain: true }),
      );

      return events;
    } catch (error) {
      throw error;
    }
  }

  public async getOne(eventId: string): Promise<Event | null> {
    try {
      const result: EventEntity | null = await EventEntity.findByPk(eventId);

      if (!result) {
        return null;
      }

      const event: Event = result.get({ plain: true });

      return event;
    } catch (error) {
      throw error;
    }
  }

  public async getOneEnriched(eventId: string): Promise<EventEnriched | null> {
    try {
      const result: EventEntity | null = await EventEntity.findByPk(eventId, {
        include: ["tag", "user", "server", "characters"],
      });

      if (!result) {
        return null;
      }

      const event: EventEnriched = result.get({ plain: true });

      return event;
    } catch (error) {
      throw error;
    }
  }

  public async post(eventData: EventBodyData): Promise<EventEnriched> {
    try {
      const { characters_id, ...eventFields } = eventData;

      // Stage1 - create event
      const event = await EventEntity.create(eventFields);
      // Stage 2 - Add relations on junction table
      await event.addCharacters(characters_id);
      // Stage 3 - Load new event with all his associations
      const enriched = await EventEntity.findByPk(event.id, {
        include: ["tag", "user", "server", "characters"],
      });

      // Highly improbable but satisfy TypeScript
      if (!enriched) throw new Error("Event just created not found.");

      const newEvent: Event = enriched.get({ plain: true });

      return newEvent;
    } catch (error) {
      throw error;
    }
  }

  public async addCharactersToEvent(
    eventId: string,
    charactersId: string[],
  ): Promise<EventEnriched | null> {
    const validCharactersId = [];
    const invalidCharacters = [];

    try {
      const result: EventEntity | null = await EventEntity.findByPk(eventId);

      if (!result) {
        return null;
      }

      this.utils.checkTeamMaxLength(result, charactersId);

      let characters: CharacterEntity[] = await CharacterEntity.findAll({
        where: {
          id: {
            [Op.in]: charactersId,
          },
        },
      });

      if (!characters.length) {
        throw new Error("Characters not found");
      }

      characters = this.utils.exceptCharactersAlreadyInTeam(result, characters);

      const validCharactersId = this.utils.checkCharactersServer(
        result,
        characters,
      );

      await result.addCharacters(validCharactersId);

      const event: EventEntity | null = await EventEntity.findByPk(result.id, {
        include: ["tag", "user", "server", "characters"],
      });

      if (!event) {
        // highly improbable but Typescript is happy
        throw new Error("Event has been create but is not found");
      }
      const updatedEvent: EventEnriched = event.get({ plain: true });

      return updatedEvent;
    } catch (error) {
      throw error;
    }
  }

  public async removeCharactersFromEvent(
    eventId: string,
    charactersId: string[],
  ): Promise<EventEnriched | null> {
    try {
      const result: EventEntity | null = await EventEntity.findOne({
        where: { id: eventId },
        include: ["characters"],
      });

      if (!result) {
        return null;
      }

      this.utils.checkTeamMinLength(result, charactersId);

      let characters: CharacterEntity[] = await CharacterEntity.findAll({
        where: {
          id: {
            [Op.in]: charactersId,
          },
        },
      });

      if (!characters.length) {
        throw new Error("Characters not found");
      }

      const event: EventEntity | null = await EventEntity.findOne({
        where: { id: result.id },
        include: ["tag", "user", "server", "characters"],
      });

      if (!event) {
        // highly improbable but Typescript is happy
        throw new Error("Event has been create but is not found");
      }

      const updatedEvent: EventEnriched = event.get({ plain: true });

      return updatedEvent;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    eventId: string,
    eventData: Partial<EventBodyData>,
  ): Promise<EventEnriched | null> {
    try {
      const eventToUpdate: EventEntity | null = await EventEntity.findOne({
        where: { id: eventId, user_id: eventData.user_id },
        include: ["tag", "user", "server", "characters"],
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
