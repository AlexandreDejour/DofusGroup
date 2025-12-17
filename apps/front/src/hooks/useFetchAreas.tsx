import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Area } from "../types/dofusDB";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { DofusDBService } from "../services/api/dofusDBService";

const config = Config.getInstance();
const axios = new ApiClient(config.dofusdbUrl);
const dofusDBService = new DofusDBService(axios);

export default function useFetchAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const areasData = await dofusDBService.getAreas();

        setAreas(areasData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, []);

  return { areas, isLoading, error };
}
