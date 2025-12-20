import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Character } from "../types/character";

import {
  characterService,
  CharacterService,
} from "../services/api/characterService";

export default function useFetchUserCharacters(
  id: string,
  server: string,
  service: CharacterService = characterService,
) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getAllByUserId(id);

        if (server !== "") {
          const characters = response.filter(
            (character) => character.server_id === server,
          );

          setCharacters(characters);
        } else setCharacters(response);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [server, service]);

  return { characters, isLoading, error };
}
