import { ApiClient } from "../client/client";

export class EventService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getEvents() {
    const response = await this.axios.get("/events");
    return response.data;
  }
}
