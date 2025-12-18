import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Breed } from "../types/breed";

import { breedService, BreedService } from "../services/api/breedService";

export default function useFetchBreeds(service: BreedService = breedService) {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const breedsData = await service.getBreeds();

        setBreeds(breedsData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreeds();
  }, [service]);

  return { breeds, isLoading, error };
}
