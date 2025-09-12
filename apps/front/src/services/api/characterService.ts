import axios from "axios";
import { ApiClient } from "../client";
import { Character } from "../../types/character";
import { CreateCharacterForm } from "../../types/form";

export class CharacterService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async create(
    userId: string,
    data: CreateCharacterForm,
  ): Promise<Character> {
    try {
      const response = await this.axios.post<Character>(
        `/user/${userId}/character`,
        data,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error(
            "Vous devez être connecter pour créer un personnage.",
          );
        }
      }
      throw error;
    }
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
