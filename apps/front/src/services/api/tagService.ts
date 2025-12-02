import handleApiError from "../utils/handleApiError";

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

      response.data.sort((a, b) => a.name.localeCompare(b.name));

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}
