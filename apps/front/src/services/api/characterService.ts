import { t } from "../../i18n/i18n-helper";
import handleApiError from "../utils/handleApiError";

import { CreateCharacterForm } from "../../types/form";
import { Character, CharacterEnriched } from "../../types/character";

import { ApiClient } from "../client";
import { backApiClient } from "../http/backApiClient";

export class CharacterService {
  private urlRegex;

  constructor(private apiClient: ApiClient) {
    this.urlRegex = new RegExp("^https://d-bk.net/[^/]+/d/[A-Za-z0-9]{5}$");
  }

  public async getAllByUserId(userId: string): Promise<Character[]> {
    try {
      const response = await this.apiClient.get<Character[]>(
        `/user/${userId}/characters`,
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async getAllEnrichedByUserId(
    userId: string,
  ): Promise<CharacterEnriched[]> {
    try {
      const response = await this.apiClient.get<CharacterEnriched[]>(
        `/user/${userId}/characters/enriched`,
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async getOneEnriched(characterId: string) {
    try {
      const response = await this.apiClient.get<CharacterEnriched>(
        `/character/${characterId}/enriched`,
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async create(
    userId: string,
    data: CreateCharacterForm,
  ): Promise<Character> {
    if (!(data.level >= 1 && data.level <= 200)) {
      throw new Error(t("validation.level.rules"));
    }

    if (data.stuff && !this.urlRegex.test(data.stuff)) {
      throw new Error(t("validation.url.rules"));
    }

    try {
      const response = await this.apiClient.post<Character>(
        `/user/${userId}/character`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async update(
    userId: string,
    characterId: string,
    data: CreateCharacterForm,
  ): Promise<CharacterEnriched> {
    if (!(data.level >= 1 && data.level <= 200)) {
      throw new Error(t("validation.level.rules"));
    }

    if (data.stuff && !this.urlRegex.test(data.stuff)) {
      throw new Error(t("validation.url.rules"));
    }

    try {
      const response = await this.apiClient.patch<CharacterEnriched>(
        `/user/${userId}/character/${characterId}`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async delete(userId: string, characterId: string) {
    try {
      const response = await this.apiClient.delete(
        `/user/${userId}/character/${characterId}`,
        { withCredentials: true },
      );

      return response;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export const characterService = new CharacterService(backApiClient);
