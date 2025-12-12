import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Character } from "../types/character";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { CharacterService } from "../services/api/characterService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const characterService = new CharacterService(axios);

export default function useFetchUserCharacters(id: string) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const charactersData = await characterService.getAllByUserId(id);

        setCharacters(charactersData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return { characters, isLoading, error };
}
