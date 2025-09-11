import axios from "axios";
import { ApiClient } from "../client";

export class CharacterService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async delete(userId: string, characterId: string) {
    try {
      const response = await this.axios.delete(
        `/user/${userId}/character/${characterId}`,
        { withCredentials: true },
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error("Cette action est impossible.");
        } else if (error.response?.status === 404) {
          throw new Error("Ce personnage n'existe plus.");
        }
      }
      throw error;
    }
  }
}
