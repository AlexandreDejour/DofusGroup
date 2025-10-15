import qs from "qs";
import axios from "axios";
import { t } from "../../i18n/i18n-helper";

import { ApiClient } from "../client";

import { CreateEventForm } from "../../types/form";
import { Event, EventEnriched, PaginatedEvents } from "../../types/event";

export class EventService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getEvents(
    limit?: number,
    page?: number,
    filters?: { tag_id?: string; title?: string; server_id?: string },
  ): Promise<PaginatedEvents> {
    try {
      const response = await this.axios.get<PaginatedEvents>("/events", {
        params: { limit, page, ...filters },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error(t("event.error.noneUpcoming"));
        }
      }
      throw error;
    }
  }

  public async getRegistered(characterIds: string[]): Promise<Event[]> {
    try {
      const response = await this.axios.get<Event[]>("/events/registered", {
        params: { characterIds },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error(t("event.error.noneUpcoming"));
        }
      }
      throw error;
    }
  }

  public async getAllByUserId(userId: string): Promise<Event[]> {
    try {
      const response = await this.axios.get<Event[]>(`/user/${userId}/events`);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error(t("event.error.none"));
        }
      }
      throw error;
    }
  }

  public async getOneEnriched(eventId: string) {
    try {
      const response = await this.axios.get<EventEnriched>(
        `/event/${eventId}/enriched`,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status) {
          throw new Error(error.message);
        }
      }
      throw error;
    }
  }

  public async create(userId: string, data: CreateEventForm): Promise<Event> {
    if (!data.server_id) throw new Error(t("validation.server.required"));

    if (!data.tag_id) throw new Error(t("validation.tag.required"));

    if (!(data.max_players >= 2 && data.max_players <= 8))
      throw new Error(t("validation.playerNumber.range"));

    if (data.max_players < data.characters_id.length)
      throw new Error(t("validation.playerNumber.limit"));

    try {
      const response = await this.axios.post<Event>(
        `/user/${userId}/event`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error(t("auth.error.data.incomplete"));
        }

        if (error.response?.status === 401) {
          throw new Error(t("event.prompt.loginRequired"));
        }

        if (error.response?.status === 403) {
          throw new Error(t("system.error.forbidden"));
        }
      }
      throw error;
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
      const response = await this.axios.patch<EventEnriched>(
        `/user/${userId}/event/${eventId}`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if ([400, 401, 403].includes(error.response?.status ?? 0)) {
          throw new Error(t("system.error.forbidden"));
        } else if (error.response?.status === 404) {
          throw new Error(t("event.error.noneFound"));
        } else if (error.response?.status === 500) {
          throw new Error(t("system.error.impossible"));
        }
      }
      throw error;
    }
  }

  public async addCharacters(eventId: string, data: CreateEventForm) {
    if (!data.characters_id.length)
      throw new Error(t("validation.playerNumber.min"));

    try {
      const response = await this.axios.post(
        `/event/${eventId}/addCharacters`,
        {
          data,
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(t("event.error.noneFound"));
        } else if (error.response?.status === 500) {
          throw new Error(t("system.error.impossible"));
        }
      }
      throw error;
    }
  }

  public async removeCharacter(eventId: string, characterId: string) {
    try {
      const response = await this.axios.post(
        `/event/${eventId}/removeCharacter`,
        { character_id: characterId },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(t("event.error.noneFound"));
        } else if (error.response?.status === 500) {
          throw new Error(t("system.error.impossible"));
        }
      }
      throw error;
    }
  }

  public async delete(userId: string, eventId: string) {
    try {
      const response = await this.axios.delete(
        `/user/${userId}/event/${eventId}`,
        { withCredentials: true },
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if ([400, 401, 403].includes(error.response?.status ?? 0)) {
          throw new Error(t("system.error.forbidden"));
        } else if (error.response?.status === 404) {
          throw new Error(t("event.error.noneFound"));
        }
      }
      throw error;
    }
  }
}
