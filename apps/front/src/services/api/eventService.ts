import qs from "qs";
import { t } from "../../i18n/i18n-helper";
import handleApiError from "../utils/handleApiError";

import { Tag } from "../../types/tag";
import { CreateEventForm } from "../../types/form";
import { Event, EventEnriched, PaginatedEvents } from "../../types/event";

import { ApiClient } from "../client";
import { backApiClient } from "../http/backApiClient";

export class EventService {
  constructor(private apiClient: ApiClient) {}

  public async getEvents(
    limit?: number,
    page?: number,
    filters?: { tag_id?: string; title?: string; server_id?: string },
  ): Promise<PaginatedEvents> {
    try {
      const response = await this.apiClient.get<PaginatedEvents>("/events", {
        params: { limit, page, ...filters },
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async getRegistered(characterIds: string[]): Promise<Event[]> {
    try {
      const response = await this.apiClient.get<Event[]>("/events/registered", {
        params: { characterIds },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async getAllByUserId(userId: string): Promise<Event[]> {
    try {
      const response = await this.apiClient.get<Event[]>(
        `/user/${userId}/events`,
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async getOneEnriched(eventId: string) {
    try {
      const response = await this.apiClient.get<EventEnriched>(
        `/event/${eventId}/enriched`,
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async create(userId: string, data: CreateEventForm): Promise<Event> {
    if (!data.server_id) throw new Error(t("validation.server.required"));

    if (!data.tag_id) throw new Error(t("validation.tag.required"));

    if (!(data.max_players >= 2 && data.max_players <= 8))
      throw new Error(t("validation.playerNumber.range"));

    if (data.max_players < data.characters_id.length)
      throw new Error(t("validation.playerNumber.limit"));

    const tag = await this.apiClient.get<Tag>(`/tag/${data.tag_id}`);
    if (tag.data.name === "Donjon" && !data.donjon_name)
      throw new Error(t("validation.tag.donjonRequired"));

    try {
      const response = await this.apiClient.post<Event>(
        `/user/${userId}/event`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async update(
    userId: string,
    eventId: string,
    data: CreateEventForm,
  ): Promise<EventEnriched> {
    if (!(data.max_players >= 2 && data.max_players <= 8))
      throw new Error(t("validation.playerNumber.range"));

    if (new Date(data.date) <= new Date())
      throw new Error(t("validation.date.future"));

    try {
      const response = await this.apiClient.patch<EventEnriched>(
        `/user/${userId}/event/${eventId}`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async addCharacters(eventId: string, data: CreateEventForm) {
    if (!data.characters_id.length) {
      throw new Error(t("validation.playerNumber.min"));
    }

    try {
      const response = await this.apiClient.post(
        `/event/${eventId}/addCharacters`,
        {
          data,
        },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async removeCharacter(eventId: string, characterId: string) {
    try {
      const response = await this.apiClient.post<EventEnriched>(
        `/event/${eventId}/removeCharacter`,
        { character_id: characterId },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async delete(userId: string, eventId: string) {
    try {
      const response = await this.apiClient.delete(
        `/user/${userId}/event/${eventId}`,
        { withCredentials: true },
      );
      return response;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export const eventService = new EventService(backApiClient);
