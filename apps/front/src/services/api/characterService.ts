import axios from "axios";
import { ApiClient } from "../client";
import { Character, CharacterEnriched } from "../../types/character";
import { CreateCharacterForm } from "../../types/form";

export class CharacterService {
  private axios;
  private urlRegex;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
    this.urlRegex = new RegExp("^https://d-bk.net/[^/]+/d/[A-Za-z0-9]{5}$");
  }

  public async getAllByUserId(userId: string): Promise<Character[]> {
    try {
      const response = await this.axios.get<Character[]>(
        `/user/${userId}/characters`,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error(
            "Vous n'avez créé aucun personnage sur votre compte.",
          );
        }
      }
      throw error;
    }
  }

  public async getOneEnriched(characterId: string) {
    try {
      const response = await this.axios.get<CharacterEnriched>(
        `/character/enriched/${characterId}`,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status) {
          throw new Error(error.message);
        }
      }
      throw error;
    }
  }

  public async create(
    userId: string,
    data: CreateCharacterForm,
  ): Promise<Character> {
    if (!(data.level >= 1 && data.level <= 200)) {
      throw new Error(
        "Le niveau de votre personnage doit être compris entre 1 et 200.",
      );
    }

    if (data.stuff && !this.urlRegex.test(data.stuff)) {
      throw new Error("Seules les URL provenant de DofusBook sont acceptées.");
    }

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
            "Les informations transmises sont érronées ou incomplètes.",
          );
        }

        if (error.response?.status === 401) {
          throw new Error(
            "Vous devez être connecter pour créer un personnage.",
          );
        }

        if (error.response?.status === 403) {
          throw new Error(
            "La création de personnage est réservée à votre compte.",
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
        if ([400, 401, 403].includes(error.response?.status ?? 0)) {
          throw new Error("Cette action n'est pas autorisée.");
        } else if (error.response?.status === 404) {
          throw new Error("Ce personnage n'existe plus.");
        }
      }
      throw error;
    }
  }
}
