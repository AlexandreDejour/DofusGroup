import handleApiError from "../utils/handleApiError";

import { Server } from "../../types/server";

import { ApiClient } from "../client";
import { backApiClient } from "../http/backApiClient";

export class ServerService {
  constructor(private apiCient: ApiClient) {}

  public async getServers(): Promise<Server[]> {
    try {
      const response = await this.apiCient.get<Server[]>("/servers");

      response.data.sort((a, b) => a.name.localeCompare(b.name));

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export const serverService = new ServerService(backApiClient);
