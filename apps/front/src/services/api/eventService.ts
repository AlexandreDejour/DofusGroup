import axios from "axios";

import { ApiClient } from "../client";

import { CreateEventForm } from "../../types/form";
import { EventEnriched, PaginatedEvents } from "../../types/event";

export class EventService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getEvents(
    limit?: number,
    page?: number,
  ): Promise<PaginatedEvents> {
    try {
      const response = await this.axios.get<PaginatedEvents>("/events", {
        params: { limit, page },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 204) {
          throw new Error("Aucun évènement à venir.");
        }
      }
      throw error;
    }
  }

  public async getOneEnriched(eventId: string) {
    try {
      const response = await this.axios.get<EventEnriched>(
        `/event/${eventId}/enriched`,
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

  public async create(userId: string, data: CreateEventForm): Promise<Event> {
    if (!data.server_id) throw new Error("Vous devez renseigner un serveur.");

    if (!data.tag_id) throw new Error("Vous devez renseigner un tag.");

    if (!(data.max_players >= 2 && data.max_players <= 8))
      throw new Error("Le nombre de joueurs doit être compris entre 2 et 8.");

    if (data.max_players < data.characters_id.length)
      throw new Error(
        "Le nombre de personnages inscrit dépasse le nombre maximum de joueurs.",
      );

    try {
      const response = await this.axios.post<Event>(
        `/user/${userId}/event`,
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
          throw new Error("Vous devez être connecter pour créer un évènement.");
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

  public async addCharacters(eventId: string, data: CreateEventForm) {
    if (!data.characters_id.length)
      throw new Error("Vous devez sélectionner au moins un personnage");

    try {
      const response = await this.axios.post(
        `/event/${eventId}/addCharacters`,
        {
          data,
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Cette évènement n'existe plus.");
        } else if (error.response?.status === 500) {
          throw new Error("Cette action est impossible.");
        }
      }
      throw error;
    }
  }

  public async removeCharacter(eventId: string, characterId: string) {
    try {
      const response = await this.axios.post(
        `/event/${eventId}/removeCharacter`,
        { character_id: characterId },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Cette évènement n'existe plus.");
        } else if (error.response?.status === 500) {
          throw new Error("Cette action est impossible.");
        }
      }
      throw error;
    }
  }

  public async delete(userId: string, eventId: string) {
    try {
      const response = await this.axios.delete(
        `/user/${userId}/event/${eventId}`,
        { withCredentials: true },
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if ([400, 401, 403].includes(error.response?.status ?? 0)) {
          throw new Error("Cette action n'est pas autorisée.");
        } else if (error.response?.status === 404) {
          throw new Error("Cette évènement n'existe plus.");
        }
      }
      throw error;
    }
  }
}
