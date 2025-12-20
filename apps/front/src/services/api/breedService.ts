import handleApiError from "../utils/handleApiError";

import { Breed } from "../../types/breed";

import { ApiClient } from "../client";
import { backApiClient } from "../http/backApiClient";

export class BreedService {
  constructor(private apiClient: ApiClient) {}

  public async getBreeds(): Promise<Breed[]> {
    try {
      const response = await this.apiClient.get<Breed[]>("/breeds");

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export const breedService = new BreedService(backApiClient);
