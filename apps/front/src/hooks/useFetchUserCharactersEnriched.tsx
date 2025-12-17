import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { User } from "../types/user";
import { EventEnriched } from "../types/event";
import { CharacterEnriched } from "../types/character";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { CharacterService } from "../services/api/characterService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const characterService = new CharacterService(axios);

export default function useFetchUserCharactersEnriched(
  user: User,
  event: EventEnriched,
) {
  const [characters, setCharacters] = useState<CharacterEnriched[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await characterService.getAllEnrichedByUserId(user.id);

        const characters = response.filter(
          (character) => character.server_id === event.server.id,
        );

        setCharacters(characters);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [user.id, event.server.id]);

  return { characters, isLoading, error };
}
