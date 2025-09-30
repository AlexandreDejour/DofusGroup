import axios from "axios";
import { t } from "i18next";

import { ApiClient } from "../client";

import { CreateEventForm } from "../../types/form";
import { EventEnriched, PaginatedEvents } from "../../types/event";

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
          throw new Error(`${t("anyEventComing")}.`);
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
    if (!data.server_id) throw new Error(`${t("serverRequired")}.`);

    if (!data.tag_id) throw new Error(`${t("tagRequired")}.`);

    if (!(data.max_players >= 2 && data.max_players <= 8))
      throw new Error(`${t("payerNumberRequired")}.`);

    if (data.max_players < data.characters_id.length)
      throw new Error(`${t("maxPayersLimit")}.`);

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
          throw new Error(`${t("uncompleteData")}.`);
        }

        if (error.response?.status === 401) {
          throw new Error(`${t("eventNeedLogin")}.`);
        }

        if (error.response?.status === 403) {
          throw new Error(`${t("forbiddenAction")}.`);
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
      throw new Error(`${t("playerNumberRequired")}.`);

    if (new Date(data.date) <= new Date())
      throw new Error(`${t("dateSupNow")}.`);

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
          throw new Error(`${t("forbiddenAction")}.`);
        } else if (error.response?.status === 404) {
          throw new Error(`${t("eventNotFound")}.`);
        } else if (error.response?.status === 500) {
          throw new Error(`${t("impossibleAction")}.`);
        }
      }
      throw error;
    }
  }

  public async addCharacters(eventId: string, data: CreateEventForm) {
    if (!data.characters_id.length)
      throw new Error(`${t("minPlayerSelected")}.`);

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
          throw new Error(`${t("eventNotFound")}.`);
        } else if (error.response?.status === 500) {
          throw new Error(`${t("impossibleAction")}.`);
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
          throw new Error(`${t("eventNotFound")}.`);
        } else if (error.response?.status === 500) {
          throw new Error(`${t("impossibleAction")}.`);
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
          throw new Error(`${t("forbiddenAction")}.`);
        } else if (error.response?.status === 404) {
          throw new Error(`${t("eventNotFound")}.`);
        }
      }
      throw error;
    }
  }
}
