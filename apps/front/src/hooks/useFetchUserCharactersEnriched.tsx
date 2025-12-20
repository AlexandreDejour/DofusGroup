import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { User } from "../types/user";
import { EventEnriched } from "../types/event";
import { CharacterEnriched } from "../types/character";

import {
  characterService,
  CharacterService,
} from "../services/api/characterService";

export default function useFetchUserCharactersEnriched(
  user: User,
  event: EventEnriched,
  service: CharacterService = characterService,
) {
  const [characters, setCharacters] = useState<CharacterEnriched[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getAllEnrichedByUserId(user.id);

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
  }, [user.id, event.server.id, service]);

  return { characters, isLoading, error };
}
