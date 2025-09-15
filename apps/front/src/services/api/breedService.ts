import axios from "axios";

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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error("Aucune classe disponible.");
        }
      }
      throw error;
    }
  }
}
