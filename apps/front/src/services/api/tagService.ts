import axios from "axios";
import { t } from "i18next";

import { Tag } from "../../types/tag";

import { ApiClient } from "../client";

export class TagService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getTags(): Promise<Tag[]> {
    try {
      const response = await this.axios.get<Tag[]>("/tags");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error(`${t("anyTag")}.`);
        }
      }
      throw error;
    }
  }
}
