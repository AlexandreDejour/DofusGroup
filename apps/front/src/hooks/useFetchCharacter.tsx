import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { CharacterEnriched } from "../types/character";

import { useModal } from "../contexts/modalContext";

import {
  characterService,
  CharacterService,
} from "../services/api/characterService";

export default function useFetchCharacter(
  id: string,
  service: CharacterService = characterService,
) {
  const { updateTarget } = useModal();

  const [character, setCharacter] = useState<CharacterEnriched | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getOneEnriched(id);

        setCharacter(response);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [id, updateTarget, service]);

  return { character, isLoading, error };
}
