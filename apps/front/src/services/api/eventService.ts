import { PaginatedEvents } from "../../types/event";
import { ApiClient } from "../client/client";

export class EventService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getEvents(
    limit?: number,
    page?: number,
  ): Promise<PaginatedEvents> {
    const response = await this.axios.get<PaginatedEvents>("/events", {
      params: { limit, page },
    });
    return response.data;
  }
}
