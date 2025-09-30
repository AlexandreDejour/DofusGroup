import axios from "axios";
import { t } from "i18next";

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

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error(`${t("anyServer")}.`);
        }
      }
      throw error;
    }
  }
}
