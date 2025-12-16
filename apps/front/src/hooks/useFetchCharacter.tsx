import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { CharacterEnriched } from "../types/character";

import { useModal } from "../contexts/modalContext";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { CharacterService } from "../services/api/characterService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const characterService = new CharacterService(axios);

export default function useFetchCharacter(id: string) {
  const { updateTarget } = useModal();

  const [character, setCharacter] = useState<CharacterEnriched | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await characterService.getOneEnriched(id);

        setCharacter(response);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [id, updateTarget]);

  return { character, isLoading, error };
}
