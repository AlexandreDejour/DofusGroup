import axios from "axios";
import { t } from "i18next";

import { ApiClient } from "../client";

import { CreateCharacterForm } from "../../types/form";
import { Character, CharacterEnriched } from "../../types/character";

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
          throw new Error(`${t("anyCharacterOnThisAccount")}.`);
        }
      }
      throw error;
    }
  }

  public async getAllEnrichedByUserId(
    userId: string,
  ): Promise<CharacterEnriched[]> {
    try {
      const response = await this.axios.get<CharacterEnriched[]>(
        `/user/${userId}/characters/enriched`,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error(`${t("anyCharacterOnThisAccount")}.`);
        }
      }
      throw error;
    }
  }

  public async getOneEnriched(characterId: string) {
    try {
      const response = await this.axios.get<CharacterEnriched>(
        `/character/${characterId}/enriched`,
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
      throw new Error(`${t("levelRules")}.`);
    }

    if (data.stuff && !this.urlRegex.test(data.stuff)) {
      throw new Error(`${t("urlRules")}.`);
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
          throw new Error(`${t("uncompleteData")}.`);
        }

        if (error.response?.status === 401) {
          throw new Error(`${t("characterCreationNeedLogin")}.`);
        }

        if (error.response?.status === 403) {
          throw new Error(`${t("forbiddenAction")}.`);
        }
      }
      throw error;
    }
  }

  public async update(
    userId: string,
    characterId: string,
    data: CreateCharacterForm,
  ): Promise<CharacterEnriched> {
    if (!(data.level >= 1 && data.level <= 200)) {
      throw new Error(`${t("levelRules")}.`);
    }

    if (data.stuff && !this.urlRegex.test(data.stuff)) {
      throw new Error(`${t("urlRules")}.`);
    }

    try {
      const response = await this.axios.patch<CharacterEnriched>(
        `/user/${userId}/character/${characterId}`,
        data,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error(`${t("uncompleteData")}.`);
        }

        if (error.response?.status === 401) {
          throw new Error(`${t("characterCreationNeedLogin")}.`);
        }

        if (error.response?.status === 403) {
          throw new Error(`${t("forbiddenAction")}.`);
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
          throw new Error(`${t("forbiddenAction")}.`);
        } else if (error.response?.status === 404) {
          throw new Error(`${t("characterNotFound")}.`);
        }
      }
      throw error;
    }
  }
}
