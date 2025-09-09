import axios, { Axios } from "axios";

import { ApiClient } from "../client";
import { UserEnriched } from "../../types/user";

export class UserService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getOneEnriched(id: string): Promise<UserEnriched> {
    try {
      const response = await this.axios.get<UserEnriched>(
        `/user/${id}/enriched`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Utilisateur introuvable.");
        }
      }
      throw error;
    }
  }
}
