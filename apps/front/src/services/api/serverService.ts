import handleApiError from "../utils/handleApiError";

import { Server } from "../../types/server";

import { ApiClient } from "../client";

export class ServerService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getServers(): Promise<Server[]> {
    try {
      const response = await this.axios.get<Server[]>("/servers");

      response.data.sort((a, b) => a.name.localeCompare(b.name));

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
