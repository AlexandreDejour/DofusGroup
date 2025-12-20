import handleApiError from "../utils/handleApiError";

import { Tag } from "../../types/tag";

import { ApiClient } from "../client";
import { backApiClient } from "../http/backApiClient";

export class TagService {
  constructor(private apiClient: ApiClient) {}

  public async getTags(): Promise<Tag[]> {
    try {
      const response = await this.apiClient.get<Tag[]>("/tags");

      response.data.sort((a, b) => a.name.localeCompare(b.name));

      response.data.sort((a, b) => a.name.localeCompare(b.name));

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export const tagService = new TagService(backApiClient);
