import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Breed } from "../types/breed";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { BreedService } from "../services/api/breedService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const breedService = new BreedService(axios);

export default function useFetchBreeds() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const breedsData = await breedService.getBreeds();

        setBreeds(breedsData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  return { breeds, isLoading, error };
}
