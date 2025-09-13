import { ApiClient } from "../client";

import { PaginatedEvents } from "../../types/event";
import axios from "axios";

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
