import handleApiError from "../utils/handleApiError";

import { Breed } from "../../types/breed";

import { ApiClient } from "../client";

export class BreedService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getBreeds(): Promise<Breed[]> {
    try {
      const response = await this.axios.get<Breed[]>("/breeds");

      return response.data;
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  }
}
