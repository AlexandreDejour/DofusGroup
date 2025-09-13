import { ApiClient } from "../client";

import { PaginatedEvents } from "../../types/event";
import axios from "axios";
import { CreateEventForm } from "../../types/form";

export class EventService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getEvents(
    limit?: number,
    page?: number,
  ): Promise<PaginatedEvents> {
    try {
      const response = await this.axios.get<PaginatedEvents>("/events", {
        params: { limit, page },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error("Aucun évènement à venir.");
        }
      }
      throw error;
    }
  }

  public async create(userId: string, data: CreateEventForm): Promise<Event> {
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
          throw new Error(
            "Les informations transmises sont érronées ou incomplètes.",
          );
        }

        if (error.response?.status === 401) {
          throw new Error("Vous devez être connecter pour créer un évènement.");
        }

        if (error.response?.status === 403) {
          throw new Error(
            "La création de personnage est réservée à votre compte.",
          );
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
          throw new Error("Cette action n'est pas autorisée.");
        } else if (error.response?.status === 404) {
          throw new Error("Cette évènement n'existe plus.");
        }
      }
      throw error;
    }
  }
}
